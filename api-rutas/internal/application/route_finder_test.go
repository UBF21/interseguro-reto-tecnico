package application

import (
	"errors"
	"testing"

	"api-rutas/internal/domain"
)

func pdfExampleGraph() domain.Graph {
	return domain.Graph{
		"Miraflores": {"San Isidro": 7, "Barranco": 3},
		"San Isidro": {"Miraflores": 7, "Lince": 4},
		"Barranco":   {"Miraflores": 3, "Surco": 5},
		"Lince":      {"San Isidro": 4, "Surco": 6},
		"Surco":      {"Barranco": 5, "Lince": 6, "Ate": 10},
		"Ate":        {"Surco": 10},
	}
}

func TestFindOptimalRoute_MatchesPdfExample(t *testing.T) {
	result, err := FindOptimalRoute(pdfExampleGraph(), "San Isidro", []string{"Miraflores", "Ate"})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if result.FromDepot != "Miraflores" || result.Distance != 7 {
		t.Fatalf("unexpected result: %+v", result)
	}
}

func TestFindOptimalRoute_PicksNearestOfMultipleDepots(t *testing.T) {
	// Desde Ate (via Surco+Lince = 16) vs desde Miraflores (7) -- Miraflores gana.
	result, err := FindOptimalRoute(pdfExampleGraph(), "San Isidro", []string{"Ate", "Miraflores"})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if result.FromDepot != "Miraflores" {
		t.Fatalf("expected Miraflores as nearest depot, got %s", result.FromDepot)
	}
}

func TestFindOptimalRoute_NoDepotsReachable_ReturnsErrUnreachable(t *testing.T) {
	graph := domain.Graph{"A": {"B": 1}, "B": {"A": 1}, "Isla": {}}

	_, err := FindOptimalRoute(graph, "Isla", []string{"A", "B"})

	if !errors.Is(err, domain.ErrUnreachable) {
		t.Fatalf("expected ErrUnreachable, got %v", err)
	}
}
