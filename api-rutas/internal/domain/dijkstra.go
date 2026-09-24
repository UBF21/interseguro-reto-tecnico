package domain

import "container/heap"

type PathResult struct {
	Path     []string
	Distance int
}

// FindShortestPath calcula el camino más corto entre from y to con Dijkstra.
// Devuelve ErrUnreachable si to no es alcanzable desde from.
func FindShortestPath(graph Graph, from, to string) (PathResult, error) {
	if from == to {
		return PathResult{Path: []string{from}, Distance: 0}, nil
	}

	dist := map[string]int{from: 0}
	prev := map[string]string{}
	visited := map[string]bool{}

	pq := &priorityQueue{{node: from, dist: 0}}
	heap.Init(pq)

	for pq.Len() > 0 {
		current := heap.Pop(pq).(pqItem)
		if visited[current.node] {
			continue
		}
		visited[current.node] = true

		if current.node == to {
			return PathResult{Path: buildPath(prev, from, to), Distance: dist[to]}, nil
		}

		relaxNeighbors(graph, current, dist, prev, pq)
	}

	return PathResult{}, ErrUnreachable
}

func relaxNeighbors(graph Graph, current pqItem, dist map[string]int, prev map[string]string, pq *priorityQueue) {
	for neighbor, weight := range graph[current.node] {
		newDist := dist[current.node] + weight
		if existing, ok := dist[neighbor]; !ok || newDist < existing {
			dist[neighbor] = newDist
			prev[neighbor] = current.node
			heap.Push(pq, pqItem{node: neighbor, dist: newDist})
		}
	}
}

func buildPath(prev map[string]string, from, to string) []string {
	path := []string{to}
	for path[len(path)-1] != from {
		path = append(path, prev[path[len(path)-1]])
	}
	reverse(path)
	return path
}

func reverse(s []string) {
	for i, j := 0, len(s)-1; i < j; i, j = i+1, j-1 {
		s[i], s[j] = s[j], s[i]
	}
}
