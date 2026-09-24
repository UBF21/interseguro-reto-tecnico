package main

import (
	"os"
	"testing"
)

func TestEnvOrDefault_ReturnsEnvValue_WhenSet(t *testing.T) {
	os.Setenv("TEST_ENV_OR_DEFAULT", "valor-real")
	defer os.Unsetenv("TEST_ENV_OR_DEFAULT")

	if got := envOrDefault("TEST_ENV_OR_DEFAULT", "fallback"); got != "valor-real" {
		t.Fatalf("expected env value, got %q", got)
	}
}

func TestEnvOrDefault_ReturnsFallback_WhenUnset(t *testing.T) {
	os.Unsetenv("TEST_ENV_OR_DEFAULT_UNSET")

	if got := envOrDefault("TEST_ENV_OR_DEFAULT_UNSET", "fallback"); got != "fallback" {
		t.Fatalf("expected fallback, got %q", got)
	}
}
