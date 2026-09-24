package http

import (
	"errors"

	"api-rutas/internal/dto"
)

func validateRequest(req dto.OptimalRouteRequest) error {
	if req.AccidentLocation == "" {
		return errors.New("accidentLocation es requerido")
	}
	if len(req.Depots) == 0 {
		return errors.New("depots no puede estar vacío")
	}
	if len(req.Graph) == 0 {
		return errors.New("graph no puede estar vacío")
	}
	if err := validateNoNegativeWeights(req.Graph); err != nil {
		return err
	}
	return nil
}

// Dijkstra es incorrecto (no solo lento) con pesos negativos -- se rechaza en el borde, no en el algoritmo.
func validateNoNegativeWeights(graph map[string]map[string]int) error {
	for _, edges := range graph {
		for _, weight := range edges {
			if weight < 0 {
				return errors.New("graph no puede tener pesos negativos")
			}
		}
	}
	return nil
}
