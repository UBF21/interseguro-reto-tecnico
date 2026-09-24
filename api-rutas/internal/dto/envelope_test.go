package dto

import "testing"

func TestOk_SetsSuccessTrue_AndData(t *testing.T) {
	response := Ok("payload")

	if !response.Success {
		t.Fatal("expected Success true")
	}
	if response.Data == nil || *response.Data != "payload" {
		t.Fatalf("unexpected data: %+v", response.Data)
	}
	if response.Code != nil {
		t.Fatalf("expected nil code on success, got %v", *response.Code)
	}
}

func TestFail_SetsSuccessFalse_AndPropagatesCode(t *testing.T) {
	response := Fail[any]("no alcanzable", "UNREACHABLE")

	if response.Success {
		t.Fatal("expected Success false")
	}
	if response.Code == nil || *response.Code != "UNREACHABLE" {
		t.Fatalf("unexpected code: %v", response.Code)
	}
}
