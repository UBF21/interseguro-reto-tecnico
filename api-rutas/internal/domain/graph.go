package domain

// Graph representa distritos de Lima como nodos y distancias como pesos --
// entra como parámetro en FindShortestPath, nunca hardcodeado, así la fuente
// (body del request, config, futura BD) puede cambiar sin tocar el algoritmo.
type Graph map[string]map[string]int
