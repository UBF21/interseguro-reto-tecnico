package http

import (
	"testing"

	"api-rutas/internal/dto"
)

func TestValidateRequest_ValidRequest_ReturnsNil(t *testing.T) {
	req := dto.OptimalRouteRequest{
		AccidentLocation: "San Isidro",
		Depots:           []string{"Miraflores"},
		Graph:            map[string]map[string]int{"Miraflores": {"San Isidro": 7}},
	}

	if err := validateRequest(req); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
}

func TestValidateRequest_MissingAccidentLocation_ReturnsError(t *testing.T) {
	req := dto.OptimalRouteRequest{Depots: []string{"Miraflores"}, Graph: map[string]map[string]int{"a": {}}}

	if err := validateRequest(req); err == nil {
		t.Fatal("expected an error")
	}
}

func TestValidateRequest_EmptyDepots_ReturnsError(t *testing.T) {
	req := dto.OptimalRouteRequest{AccidentLocation: "San Isidro", Graph: map[string]map[string]int{"a": {}}}

	if err := validateRequest(req); err == nil {
		t.Fatal("expected an error")
	}
}

func TestValidateRequest_EmptyGraph_ReturnsError(t *testing.T) {
	req := dto.OptimalRouteRequest{AccidentLocation: "San Isidro", Depots: []string{"Miraflores"}}

	if err := validateRequest(req); err == nil {
		t.Fatal("expected an error")
	}
}

func TestValidateRequest_NegativeWeight_ReturnsError(t *testing.T) {
	req := dto.OptimalRouteRequest{
		AccidentLocation: "San Isidro",
		Depots:           []string{"Miraflores"},
		Graph:            map[string]map[string]int{"Miraflores": {"San Isidro": -3}},
	}

	if err := validateRequest(req); err == nil {
		t.Fatal("expected an error for negative weight")
	}
}
