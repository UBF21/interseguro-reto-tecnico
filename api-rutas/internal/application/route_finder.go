package application

import "api-rutas/internal/domain"

type OptimalRouteResult struct {
	FromDepot string
	To        string
	Path      []string
	Distance  int
}

// FindOptimalRoute corre Dijkstra desde cada depot y devuelve el más cercano al accidente.
func FindOptimalRoute(graph domain.Graph, accidentLocation string, depots []string) (OptimalRouteResult, error) {
	var best *OptimalRouteResult

	for _, depot := range depots {
		result, err := domain.FindShortestPath(graph, depot, accidentLocation)
		if err != nil {
			continue
		}
		if best == nil || result.Distance < best.Distance {
			best = &OptimalRouteResult{FromDepot: depot, To: accidentLocation, Path: result.Path, Distance: result.Distance}
		}
	}

	if best == nil {
		return OptimalRouteResult{}, domain.ErrUnreachable
	}
	return *best, nil
}
