package domain

import "testing"

func TestGraph_HoldsWeightedEdgesBetweenDistricts(t *testing.T) {
	graph := Graph{
		"Miraflores": {"San Isidro": 7, "Barranco": 3},
	}

	if graph["Miraflores"]["San Isidro"] != 7 {
		t.Fatalf("expected distance 7, got %d", graph["Miraflores"]["San Isidro"])
	}
}
