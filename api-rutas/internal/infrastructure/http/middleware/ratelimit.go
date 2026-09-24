package middleware

import (
	"encoding/json"
	"net"
	"net/http"
	"sync"
	"time"
)

type bucket struct {
	count   int
	resetAt time.Time
}

// RateLimit -- ventana fija en memoria, por IP. ponytail: por-proceso, no distribuido; si hay
// múltiples réplicas cada una cuenta por separado. Subir a Redis si eso importa algún día.
func RateLimit(maxPerWindow int, window time.Duration) func(http.Handler) http.Handler {
	return rateLimitWithClock(maxPerWindow, window, time.Now)
}

func rateLimitWithClock(maxPerWindow int, window time.Duration, now func() time.Time) func(http.Handler) http.Handler {
	var mu sync.Mutex
	buckets := map[string]*bucket{}

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			key := clientKey(r)
			t := now()

			mu.Lock()
			b, ok := buckets[key]
			if !ok || t.After(b.resetAt) {
				b = &bucket{count: 0, resetAt: t.Add(window)}
				buckets[key] = b
			}
			b.count++
			exceeded := b.count > maxPerWindow
			mu.Unlock()

			if exceeded {
				writeRateLimited(w)
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}

func clientKey(r *http.Request) string {
	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr
	}
	return host
}

func writeRateLimited(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusTooManyRequests)
	_ = json.NewEncoder(w).Encode(map[string]any{
		"success": false,
		"message": "Demasiadas solicitudes.",
		"code":    "RATE_LIMITED",
		"data":    nil,
	})
}
