package domain

import (
	"container/heap"
	"testing"
)

func TestPriorityQueue_PopsInDistanceOrder(t *testing.T) {
	pq := &priorityQueue{{node: "b", dist: 5}, {node: "a", dist: 1}, {node: "c", dist: 10}}
	heap.Init(pq)

	first := heap.Pop(pq).(pqItem)
	if first.node != "a" {
		t.Fatalf("expected 'a' (dist 1) first, got %q", first.node)
	}

	second := heap.Pop(pq).(pqItem)
	if second.node != "b" {
		t.Fatalf("expected 'b' (dist 5) second, got %q", second.node)
	}
}
