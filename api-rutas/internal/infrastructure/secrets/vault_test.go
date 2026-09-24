package secrets

import (
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
)

func fallbackSecrets() AppSecrets {
	return AppSecrets{JWTSecret: "fallback", JWTIssuer: "api-auth", JWTAudience: "interseguro-reto"}
}

func TestMapVaultData_OverridesOnlyPresentKeys(t *testing.T) {
	result := MapVaultData(map[string]string{"jwt_secret": "from-vault"}, fallbackSecrets())

	if result.JWTSecret != "from-vault" {
		t.Fatalf("expected jwt_secret overridden, got %q", result.JWTSecret)
	}
	if result.JWTIssuer != "api-auth" {
		t.Fatalf("expected jwt_issuer to keep fallback, got %q", result.JWTIssuer)
	}
}

func TestLoadSecrets_WithoutVaultEnvVars_ReturnsFallback(t *testing.T) {
	os.Unsetenv("VAULT_ADDR")
	os.Unsetenv("VAULT_TOKEN")

	result, err := LoadSecrets(fallbackSecrets())

	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if result != fallbackSecrets() {
		t.Fatalf("expected fallback returned as-is, got %+v", result)
	}
}

func TestLoadSecrets_FetchesFromVaultKvV2(t *testing.T) {
	// Servidor Vault fake real (httptest), no un mock de la función -- ejercita LoadSecrets end-to-end.
	fakeVault := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Header.Get("X-Vault-Token") != "root" {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"data":{"data":{"jwt_secret":"from-vault-server"}}}`))
	}))
	defer fakeVault.Close()

	os.Setenv("VAULT_ADDR", fakeVault.URL)
	os.Setenv("VAULT_TOKEN", "root")
	defer os.Unsetenv("VAULT_ADDR")
	defer os.Unsetenv("VAULT_TOKEN")

	result, err := LoadSecrets(fallbackSecrets())

	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if result.JWTSecret != "from-vault-server" {
		t.Fatalf("expected secret from vault, got %q", result.JWTSecret)
	}
}

func TestLoadSecrets_VaultConfiguredButFails_ReturnsErrorInsteadOfFallback(t *testing.T) {
	// Vault configurado pero devuelve un error real (ej. token sin permisos) -- nunca debe caer
	// en silencio al secreto placeholder del fallback.
	fakeVault := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusForbidden)
	}))
	defer fakeVault.Close()

	os.Setenv("VAULT_ADDR", fakeVault.URL)
	os.Setenv("VAULT_TOKEN", "root")
	defer os.Unsetenv("VAULT_ADDR")
	defer os.Unsetenv("VAULT_TOKEN")

	result, err := LoadSecrets(fallbackSecrets())

	if err == nil {
		t.Fatal("expected an error, got nil")
	}
	if result != (AppSecrets{}) {
		t.Fatalf("expected zero-value AppSecrets on error, got %+v", result)
	}
}
