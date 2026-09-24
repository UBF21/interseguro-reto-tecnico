package domain

import (
	"errors"
	"reflect"
	"testing"
)

func pdfExampleGraph() Graph {
	return Graph{
		"Miraflores": {"San Isidro": 7, "Barranco": 3},
		"San Isidro": {"Miraflores": 7, "Lince": 4},
		"Barranco":   {"Miraflores": 3, "Surco": 5},
		"Lince":      {"San Isidro": 4, "Surco": 6},
		"Surco":      {"Barranco": 5, "Lince": 6, "Ate": 10},
		"Ate":        {"Surco": 10},
	}
}

func TestFindShortestPath_MatchesPdfExample(t *testing.T) {
	result, err := FindShortestPath(pdfExampleGraph(), "Miraflores", "San Isidro")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if result.Distance != 7 {
		t.Fatalf("expected distance 7, got %d", result.Distance)
	}
	if !reflect.DeepEqual(result.Path, []string{"Miraflores", "San Isidro"}) {
		t.Fatalf("unexpected path: %v", result.Path)
	}
}

func TestFindShortestPath_PicksIndirectRouteWhenCheaper(t *testing.T) {
	// Ate -> Surco -> Barranco (10+5=15) es más corto que cualquier otra combinación disponible.
	result, err := FindShortestPath(pdfExampleGraph(), "Ate", "Barranco")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if result.Distance != 15 {
		t.Fatalf("expected distance 15, got %d", result.Distance)
	}
	if !reflect.DeepEqual(result.Path, []string{"Ate", "Surco", "Barranco"}) {
		t.Fatalf("unexpected path: %v", result.Path)
	}
}

func TestFindShortestPath_SameOriginAndDestination_ReturnsZeroDistance(t *testing.T) {
	result, err := FindShortestPath(pdfExampleGraph(), "Surco", "Surco")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if result.Distance != 0 || !reflect.DeepEqual(result.Path, []string{"Surco"}) {
		t.Fatalf("unexpected result: %+v", result)
	}
}

func TestFindShortestPath_UnreachableDestination_ReturnsErrUnreachable(t *testing.T) {
	graph := Graph{
		"A": {"B": 1},
		"B": {"A": 1},
		"Isla": {},
	}

	_, err := FindShortestPath(graph, "A", "Isla")

	if !errors.Is(err, ErrUnreachable) {
		t.Fatalf("expected ErrUnreachable, got %v", err)
	}
}

func TestFindShortestPath_NonexistentOrigin_ReturnsErrUnreachable(t *testing.T) {
	_, err := FindShortestPath(pdfExampleGraph(), "DistritoInexistente", "Surco")

	if !errors.Is(err, ErrUnreachable) {
		t.Fatalf("expected ErrUnreachable, got %v", err)
	}
}
