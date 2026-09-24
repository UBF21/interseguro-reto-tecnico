package http

import (
	"encoding/json"
	"net/http/httptest"
	"testing"
)

func TestWriteJSON_SetsStatusAndEncodesBody(t *testing.T) {
	recorder := httptest.NewRecorder()

	writeJSON(recorder, 201, map[string]string{"hello": "world"})

	if recorder.Code != 201 {
		t.Fatalf("expected status 201, got %d", recorder.Code)
	}
	if recorder.Header().Get("Content-Type") != "application/json" {
		t.Fatalf("expected JSON content type, got %q", recorder.Header().Get("Content-Type"))
	}

	var decoded map[string]string
	if err := json.Unmarshal(recorder.Body.Bytes(), &decoded); err != nil {
		t.Fatalf("unexpected error decoding body: %v", err)
	}
	if decoded["hello"] != "world" {
		t.Fatalf("unexpected body: %v", decoded)
	}
}
