package http

import "net/http"

// NewRouter -- net/http estándar alcanza para 2 endpoints, sin necesidad de un framework externo.
// jwtAuth recibe el tipo de retorno real de middleware.JWTAuth (func(http.Handler) http.Handler) --
// sin un named type propio acá, ya que solo hay una implementación real y vive en middleware/jwt.go.
// devMode habilita Swagger UI en "/" -- nunca en un despliegue real (ver main.go).
func NewRouter(handler *OptimalRouteHandler, jwtAuth func(http.Handler) http.Handler, devMode bool) http.Handler {
	mux := http.NewServeMux()

	if devMode {
		registerSwagger(mux)
	}

	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
	})

	mux.Handle("/v1/routes/optimal", jwtAuth(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		handler.Handle(w, r)
	})))

	return mux
}
