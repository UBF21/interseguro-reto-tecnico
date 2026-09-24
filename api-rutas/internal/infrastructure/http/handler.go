package http

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"

	"api-rutas/internal/application"
	"api-rutas/internal/domain"
	"api-rutas/internal/dto"
)

const maxRequestBodyBytes = 1 << 20 // 1 MiB -- evita decodificar un grafo gigante en memoria.

type OptimalRouteHandler struct {
	logger *log.Logger
}

func NewOptimalRouteHandler(logger *log.Logger) *OptimalRouteHandler {
	if logger == nil {
		logger = log.Default()
	}
	return &OptimalRouteHandler{logger: logger}
}

func (h *OptimalRouteHandler) Handle(w http.ResponseWriter, r *http.Request) {
	r.Body = http.MaxBytesReader(w, r.Body, maxRequestBodyBytes)

	var req dto.OptimalRouteRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, dto.Fail[any]("JSON de entrada inválido.", "INVALID_PAYLOAD"))
		return
	}

	if err := validateRequest(req); err != nil {
		writeJSON(w, http.StatusBadRequest, dto.Fail[any](err.Error(), "VALIDATION_ERROR"))
		return
	}

	result, err := application.FindOptimalRoute(domain.Graph(req.Graph), req.AccidentLocation, req.Depots)
	if err != nil {
		h.writeError(w, err)
		return
	}

	writeJSON(w, http.StatusOK, dto.Ok(dto.OptimalRouteResponse{
		FromDepot: result.FromDepot,
		To:        result.To,
		Path:      result.Path,
		Distance:  result.Distance,
	}))
}

func (h *OptimalRouteHandler) writeError(w http.ResponseWriter, err error) {
	if errors.Is(err, domain.ErrUnreachable) {
		writeJSON(w, http.StatusUnprocessableEntity, dto.Fail[any]("El accidente no es alcanzable desde ninguna base.", "UNREACHABLE"))
		return
	}
	h.logger.Printf("error interno en /v1/routes/optimal: %v", err)
	writeJSON(w, http.StatusInternalServerError, dto.Fail[any]("Ocurrió un error interno.", "INTERNAL_ERROR"))
}
