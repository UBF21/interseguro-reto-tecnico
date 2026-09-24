package middleware

import "net/http"

// CORS -- permite que el frontend (origen distinto, ej. localhost:5273) llame a esta API desde
// el navegador. Sin esto, el preflight OPTIONS del navegador recibe 405 y todo fetch() falla con
// "Failed to fetch"/CORS error, aunque curl/Postman funcionen (no hacen preflight).
func CORS(allowedOrigin string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			if r.Method == http.MethodOptions {
				w.WriteHeader(http.StatusNoContent)
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}
