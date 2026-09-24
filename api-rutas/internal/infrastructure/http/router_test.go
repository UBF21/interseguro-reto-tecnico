package http

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func noopAuth(next http.Handler) http.Handler { return next }

func denyAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { w.WriteHeader(http.StatusUnauthorized) })
}

func TestNewRouter_HealthIsPublic(t *testing.T) {
	router := NewRouter(NewOptimalRouteHandler(nil), denyAuth, false)

	req := httptest.NewRequest(http.MethodGet, "/health", nil)
	recorder := httptest.NewRecorder()
	router.ServeHTTP(recorder, req)

	if recorder.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", recorder.Code)
	}
}

func TestNewRouter_OptimalRouteRequiresAuthMiddleware(t *testing.T) {
	router := NewRouter(NewOptimalRouteHandler(nil), denyAuth, false)

	req := httptest.NewRequest(http.MethodPost, "/v1/routes/optimal", nil)
	recorder := httptest.NewRecorder()
	router.ServeHTTP(recorder, req)

	if recorder.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401 from the auth middleware, got %d", recorder.Code)
	}
}

func TestNewRouter_OptimalRoute_RejectsNonPostMethods(t *testing.T) {
	router := NewRouter(NewOptimalRouteHandler(nil), noopAuth, false)

	req := httptest.NewRequest(http.MethodGet, "/v1/routes/optimal", nil)
	recorder := httptest.NewRecorder()
	router.ServeHTTP(recorder, req)

	if recorder.Code != http.StatusMethodNotAllowed {
		t.Fatalf("expected 405, got %d", recorder.Code)
	}
}

func TestNewRouter_DevMode_RootRedirectsToDocs(t *testing.T) {
	router := NewRouter(NewOptimalRouteHandler(nil), noopAuth, true)

	req := httptest.NewRequest(http.MethodGet, "/", nil)
	recorder := httptest.NewRecorder()
	router.ServeHTTP(recorder, req)

	if recorder.Code != http.StatusFound {
		t.Fatalf("expected 302, got %d", recorder.Code)
	}
	if recorder.Header().Get("Location") != "/docs" {
		t.Fatalf("expected redirect to /docs, got %q", recorder.Header().Get("Location"))
	}
}

func TestNewRouter_ProductionMode_RootIsNotFound(t *testing.T) {
	router := NewRouter(NewOptimalRouteHandler(nil), noopAuth, false)

	req := httptest.NewRequest(http.MethodGet, "/", nil)
	recorder := httptest.NewRecorder()
	router.ServeHTTP(recorder, req)

	if recorder.Code != http.StatusNotFound {
		t.Fatalf("expected 404 in prod (no Swagger routes registered), got %d", recorder.Code)
	}
}

func TestNewRouter_DevMode_ServesOpenAPISpecAndDocs(t *testing.T) {
	router := NewRouter(NewOptimalRouteHandler(nil), noopAuth, true)

	for _, path := range []string{"/openapi.json", "/docs"} {
		req := httptest.NewRequest(http.MethodGet, path, nil)
		recorder := httptest.NewRecorder()
		router.ServeHTTP(recorder, req)

		if recorder.Code != http.StatusOK {
			t.Fatalf("expected 200 for %s, got %d", path, recorder.Code)
		}
	}
}
