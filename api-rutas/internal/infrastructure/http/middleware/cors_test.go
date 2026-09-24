package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestCORS_Preflight_ReturnsAllowHeadersAndNoContent(t *testing.T) {
	next := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { w.WriteHeader(http.StatusOK) })
	handler := CORS("http://localhost:5273")(next)

	req := httptest.NewRequest(http.MethodOptions, "/v1/routes/optimal", nil)
	recorder := httptest.NewRecorder()

	handler.ServeHTTP(recorder, req)

	if recorder.Code != http.StatusNoContent {
		t.Fatalf("expected 204, got %d", recorder.Code)
	}
	if got := recorder.Header().Get("Access-Control-Allow-Origin"); got != "http://localhost:5273" {
		t.Fatalf("expected Access-Control-Allow-Origin http://localhost:5273, got %q", got)
	}
}

func TestCORS_NonPreflightRequest_CallsNextHandler(t *testing.T) {
	called := false
	next := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		called = true
		w.WriteHeader(http.StatusOK)
	})
	handler := CORS("http://localhost:5273")(next)

	req := httptest.NewRequest(http.MethodPost, "/v1/routes/optimal", nil)
	recorder := httptest.NewRecorder()

	handler.ServeHTTP(recorder, req)

	if !called {
		t.Fatal("expected next handler to be called for a non-preflight request")
	}
	if got := recorder.Header().Get("Access-Control-Allow-Origin"); got != "http://localhost:5273" {
		t.Fatalf("expected Access-Control-Allow-Origin http://localhost:5273, got %q", got)
	}
}
