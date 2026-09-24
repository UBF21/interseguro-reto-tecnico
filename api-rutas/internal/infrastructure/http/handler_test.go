package http

import (
	"bytes"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"api-rutas/internal/dto"
)

func doRequest(t *testing.T, body string) *httptest.ResponseRecorder {
	t.Helper()
	handler := NewOptimalRouteHandler(nil)
	req := httptest.NewRequest(http.MethodPost, "/v1/routes/optimal", bytes.NewBufferString(body))
	recorder := httptest.NewRecorder()
	handler.Handle(recorder, req)
	return recorder
}

func TestHandle_PdfExample_Returns200WithExpectedRoute(t *testing.T) {
	body := `{
		"accidentLocation": "San Isidro",
		"depots": ["Miraflores", "Ate"],
		"graph": {
			"Miraflores": { "San Isidro": 7, "Barranco": 3 },
			"San Isidro": { "Miraflores": 7, "Lince": 4 },
			"Barranco": { "Miraflores": 3, "Surco": 5 },
			"Lince": { "San Isidro": 4, "Surco": 6 },
			"Surco": { "Barranco": 5, "Lince": 6, "Ate": 10 },
			"Ate": { "Surco": 10 }
		}
	}`

	recorder := doRequest(t, body)

	if recorder.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d: %s", recorder.Code, recorder.Body.String())
	}

	var response dto.ApiResponse[dto.OptimalRouteResponse]
	if err := json.Unmarshal(recorder.Body.Bytes(), &response); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if response.Data.FromDepot != "Miraflores" || response.Data.Distance != 7 {
		t.Fatalf("unexpected data: %+v", response.Data)
	}
}

func TestHandle_InvalidJson_Returns400(t *testing.T) {
	recorder := doRequest(t, `{not-json`)

	if recorder.Code != http.StatusBadRequest {
		t.Fatalf("expected 400, got %d", recorder.Code)
	}
}

func TestHandle_MissingRequiredField_Returns400(t *testing.T) {
	recorder := doRequest(t, `{"depots": ["Miraflores"], "graph": {"a": {}}}`)

	if recorder.Code != http.StatusBadRequest {
		t.Fatalf("expected 400, got %d", recorder.Code)
	}
}

func TestHandle_UnreachableAccident_Returns422(t *testing.T) {
	body := `{"accidentLocation": "Isla", "depots": ["A"], "graph": {"A": {"B": 1}, "B": {"A": 1}, "Isla": {}}}`

	recorder := doRequest(t, body)

	if recorder.Code != http.StatusUnprocessableEntity {
		t.Fatalf("expected 422, got %d: %s", recorder.Code, recorder.Body.String())
	}
}

func TestHandle_OversizedPayload_Returns400(t *testing.T) {
	huge := strings.Repeat("a", 2<<20) // 2 MiB > el límite de 1 MiB
	body := `{"accidentLocation": "` + huge + `", "depots": ["A"], "graph": {"A": {}}}`

	recorder := doRequest(t, body)

	if recorder.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 for oversized payload, got %d", recorder.Code)
	}
}

func TestWriteError_UnexpectedError_LogsBeforeReturning500(t *testing.T) {
	var buf bytes.Buffer
	handler := NewOptimalRouteHandler(log.New(&buf, "", 0))
	recorder := httptest.NewRecorder()

	handler.writeError(recorder, errors.New("fallo inesperado de infraestructura"))

	if recorder.Code != http.StatusInternalServerError {
		t.Fatalf("expected 500, got %d", recorder.Code)
	}
	if !strings.Contains(buf.String(), "fallo inesperado de infraestructura") {
		t.Fatalf("expected the error to be logged, got log: %q", buf.String())
	}
	if strings.Contains(recorder.Body.String(), "fallo inesperado de infraestructura") {
		t.Fatalf("internal error detail leaked into the HTTP response: %s", recorder.Body.String())
	}
}
