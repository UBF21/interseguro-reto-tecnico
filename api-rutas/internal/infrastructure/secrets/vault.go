package secrets

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

type AppSecrets struct {
	JWTSecret   string
	JWTIssuer   string
	JWTAudience string
}

type vaultKvV2Response struct {
	Data struct {
		Data map[string]string `json:"data"`
	} `json:"data"`
}

// LoadSecrets -- Vault (docker-compose) es la fuente de verdad; no-op (usa fallback de env vars)
// si VAULT_ADDR/VAULT_TOKEN no están seteados. Si SÍ están seteados pero la llamada falla, nunca
// cae en silencio al secreto placeholder -- devuelve error para que main() aborte el arranque.
// Un fallback silencioso acá deja el JWT_SECRET desincronizado entre servicios sin ningún log.
func LoadSecrets(fallback AppSecrets) (AppSecrets, error) {
	vaultAddr := os.Getenv("VAULT_ADDR")
	vaultToken := os.Getenv("VAULT_TOKEN")
	if vaultAddr == "" || vaultToken == "" {
		return fallback, nil
	}

	req, err := http.NewRequest(http.MethodGet, vaultAddr+"/v1/secret/data/api-rutas", nil)
	if err != nil {
		return AppSecrets{}, fmt.Errorf("construyendo request a Vault: %w", err)
	}
	req.Header.Set("X-Vault-Token", vaultToken)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return AppSecrets{}, fmt.Errorf("Vault no respondió: %w", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return AppSecrets{}, fmt.Errorf("Vault respondió %d al leer secret/data/api-rutas", resp.StatusCode)
	}

	var body vaultKvV2Response
	if err := json.NewDecoder(resp.Body).Decode(&body); err != nil {
		return AppSecrets{}, fmt.Errorf("decodificando respuesta de Vault: %w", err)
	}

	return MapVaultData(body.Data.Data, fallback), nil
}

// MapVaultData -- lógica pura, separada de la llamada HTTP -- testeable sin un servidor real.
func MapVaultData(data map[string]string, fallback AppSecrets) AppSecrets {
	result := fallback
	if v, ok := data["jwt_secret"]; ok {
		result.JWTSecret = v
	}
	if v, ok := data["jwt_issuer"]; ok {
		result.JWTIssuer = v
	}
	if v, ok := data["jwt_audience"]; ok {
		result.JWTAudience = v
	}
	return result
}
