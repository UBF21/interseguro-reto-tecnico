#!/bin/sh
# Siembra los secretos compartidos (JWT + connection strings) en Vault KV v2, uno por servicio.
# Corre una sola vez al levantar docker-compose, contra el Vault en modo dev del mismo stack.
set -e

vault kv put secret/api-auth \
  jwt_secret="$JWT_SECRET" \
  jwt_issuer="api-auth" \
  jwt_audience="interseguro-reto" \
  postgres_connection_string="Host=postgres;Port=5432;Database=interseguro_auth;Username=postgres;Password=postgres"

vault kv put secret/api-endosos \
  jwt_secret="$JWT_SECRET" \
  jwt_issuer="api-auth" \
  jwt_audience="interseguro-reto" \
  postgres_connection_string="postgres://postgres:postgres@postgres:5432/interseguro_endosos"

vault kv put secret/api-rutas \
  jwt_secret="$JWT_SECRET" \
  jwt_issuer="api-auth" \
  jwt_audience="interseguro-reto"

echo "Vault: secretos sembrados para api-auth, api-endosos, api-rutas."
