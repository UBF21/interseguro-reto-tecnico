package dto

type OptimalRouteRequest struct {
	AccidentLocation string                    `json:"accidentLocation"`
	Depots           []string                  `json:"depots"`
	Graph            map[string]map[string]int `json:"graph"`
}

type OptimalRouteResponse struct {
	FromDepot string   `json:"fromDepot"`
	To        string   `json:"to"`
	Path      []string `json:"path"`
	Distance  int      `json:"distance"`
}
