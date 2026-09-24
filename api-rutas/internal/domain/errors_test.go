package domain

import "testing"

func TestErrUnreachable_HasAReadableMessage(t *testing.T) {
	if ErrUnreachable.Error() == "" {
		t.Fatal("expected ErrUnreachable to have a non-empty message")
	}
}
