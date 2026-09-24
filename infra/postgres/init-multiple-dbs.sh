#!/bin/bash
# La imagen oficial de postgres solo crea la BD de POSTGRES_DB -- este script (montado en
# /docker-entrypoint-initdb.d/) crea la segunda BD que necesita api-endosos, en el mismo servidor.
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE interseguro_endosos;
EOSQL
