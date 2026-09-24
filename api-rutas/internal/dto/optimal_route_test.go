package dto

import (
	"encoding/json"
	"testing"
)

func TestOptimalRouteRequest_UnmarshalsPdfExampleJson(t *testing.T) {
	raw := `{
		"accidentLocation": "San Isidro",
		"depots": ["Miraflores", "Ate"],
		"graph": { "Miraflores": { "San Isidro": 7, "Barranco": 3 } }
	}`

	var req OptimalRouteRequest
	if err := json.Unmarshal([]byte(raw), &req); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if req.AccidentLocation != "San Isidro" || req.Graph["Miraflores"]["San Isidro"] != 7 {
		t.Fatalf("unexpected request: %+v", req)
	}
}
