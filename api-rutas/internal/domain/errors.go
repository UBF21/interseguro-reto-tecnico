package domain

import "errors"

// ErrUnreachable -- el destino no es alcanzable desde ninguna base (grafo desconectado o nodo inexistente).
var ErrUnreachable = errors.New("el destino no es alcanzable desde ninguna base")
