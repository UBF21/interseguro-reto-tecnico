package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

type contextKey string

const ClaimsContextKey contextKey = "claims"

// api-auth firma el claim de rol con System.Security.Claims.ClaimTypes.Role -- ese enum se
// serializa como esta URI larga en el JWT, no como "role"/"roles". Mismo contrato en api-endosos.
const roleClaim = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
const requiredRole = "operator"

// JWTAuth verifica los mismos JWT que emite api-auth (HS256, secreto compartido vía Vault/env) y
// exige el rol "operator" -- autenticación (¿token válido?) + autorización (¿puede usar esto?).
func JWTAuth(secret, issuer, audience string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			claims, ok := verifyToken(r, secret, issuer, audience)
			if !ok {
				writeUnauthorized(w)
				return
			}
			next.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), ClaimsContextKey, claims)))
		})
	}
}

func verifyToken(r *http.Request, secret, issuer, audience string) (jwt.MapClaims, bool) {
	authHeader := r.Header.Get("Authorization")
	if !strings.HasPrefix(authHeader, "Bearer ") {
		return nil, false
	}
	tokenString := strings.TrimPrefix(authHeader, "Bearer ")

	claims := jwt.MapClaims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(*jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	}, jwt.WithIssuer(issuer), jwt.WithAudience(audience), jwt.WithValidMethods([]string{"HS256"}))

	if err != nil || !token.Valid {
		return nil, false
	}

	role, _ := claims[roleClaim].(string)
	if role != requiredRole {
		return nil, false
	}
	return claims, true
}

func writeUnauthorized(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusUnauthorized)
	_, _ = w.Write([]byte(`{"success":false,"message":"No autorizado","code":"UNAUTHORIZED","data":null}`))
}
