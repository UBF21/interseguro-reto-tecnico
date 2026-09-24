package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

const testSecret = "a-very-long-test-secret-at-least-32-bytes"

func signToken(t *testing.T, issuer, audience, role string, expiresAt time.Time) string {
	t.Helper()
	claims := jwt.MapClaims{
		"iss": issuer,
		"aud": audience,
		"sub": "user-1",
		"exp": expiresAt.Unix(),
	}
	if role != "" {
		claims[roleClaim] = role
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := token.SignedString([]byte(testSecret))
	if err != nil {
		t.Fatalf("unexpected error signing token: %v", err)
	}
	return signed
}

func protectedServer() http.Handler {
	next := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { w.WriteHeader(http.StatusOK) })
	return JWTAuth(testSecret, "api-auth", "interseguro-reto")(next)
}

func TestJWTAuth_NoHeader_Returns401(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/", nil)
	recorder := httptest.NewRecorder()

	protectedServer().ServeHTTP(recorder, req)

	if recorder.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401, got %d", recorder.Code)
	}
}

func TestJWTAuth_ValidTokenWithRequiredRole_CallsNextHandler(t *testing.T) {
	token := signToken(t, "api-auth", "interseguro-reto", requiredRole, time.Now().Add(time.Hour))
	req := httptest.NewRequest(http.MethodGet, "/", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	recorder := httptest.NewRecorder()

	protectedServer().ServeHTTP(recorder, req)

	if recorder.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", recorder.Code)
	}
}

func TestJWTAuth_ExpiredToken_Returns401(t *testing.T) {
	token := signToken(t, "api-auth", "interseguro-reto", requiredRole, time.Now().Add(-time.Hour))
	req := httptest.NewRequest(http.MethodGet, "/", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	recorder := httptest.NewRecorder()

	protectedServer().ServeHTTP(recorder, req)

	if recorder.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401, got %d", recorder.Code)
	}
}

func TestJWTAuth_WrongIssuer_Returns401(t *testing.T) {
	token := signToken(t, "otro-issuer", "interseguro-reto", requiredRole, time.Now().Add(time.Hour))
	req := httptest.NewRequest(http.MethodGet, "/", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	recorder := httptest.NewRecorder()

	protectedServer().ServeHTTP(recorder, req)

	if recorder.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401, got %d", recorder.Code)
	}
}

func TestJWTAuth_WrongRole_Returns401(t *testing.T) {
	token := signToken(t, "api-auth", "interseguro-reto", "otro-rol", time.Now().Add(time.Hour))
	req := httptest.NewRequest(http.MethodGet, "/", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	recorder := httptest.NewRecorder()

	protectedServer().ServeHTTP(recorder, req)

	if recorder.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401, got %d", recorder.Code)
	}
}

func TestJWTAuth_NoRoleClaim_Returns401(t *testing.T) {
	token := signToken(t, "api-auth", "interseguro-reto", "", time.Now().Add(time.Hour))
	req := httptest.NewRequest(http.MethodGet, "/", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	recorder := httptest.NewRecorder()

	protectedServer().ServeHTTP(recorder, req)

	if recorder.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401, got %d", recorder.Code)
	}
}
