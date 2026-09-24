package middleware

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"
)

func okHandler() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { w.WriteHeader(http.StatusOK) })
}

func TestRateLimit_AllowsRequestsUnderLimit(t *testing.T) {
	now := time.Now()
	handler := rateLimitWithClock(2, time.Minute, func() time.Time { return now })(okHandler())

	for i := 0; i < 2; i++ {
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		req.RemoteAddr = "1.2.3.4:5555"
		recorder := httptest.NewRecorder()
		handler.ServeHTTP(recorder, req)
		if recorder.Code != http.StatusOK {
			t.Fatalf("request %d: expected 200, got %d", i, recorder.Code)
		}
	}
}

func TestRateLimit_RejectsRequestOverLimit(t *testing.T) {
	now := time.Now()
	handler := rateLimitWithClock(2, time.Minute, func() time.Time { return now })(okHandler())

	for i := 0; i < 2; i++ {
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		req.RemoteAddr = "1.2.3.4:5555"
		handler.ServeHTTP(httptest.NewRecorder(), req)
	}

	req := httptest.NewRequest(http.MethodGet, "/", nil)
	req.RemoteAddr = "1.2.3.4:5555"
	recorder := httptest.NewRecorder()
	handler.ServeHTTP(recorder, req)

	if recorder.Code != http.StatusTooManyRequests {
		t.Fatalf("expected 429, got %d", recorder.Code)
	}
	if body := recorder.Body.String(); !strings.Contains(body, "RATE_LIMITED") {
		t.Fatalf("expected RATE_LIMITED code in body, got %s", body)
	}
}

func TestRateLimit_ResetsCounterAfterWindowExpires(t *testing.T) {
	current := time.Now()
	clock := func() time.Time { return current }
	handler := rateLimitWithClock(1, time.Minute, clock)(okHandler())

	req := httptest.NewRequest(http.MethodGet, "/", nil)
	req.RemoteAddr = "1.2.3.4:5555"
	handler.ServeHTTP(httptest.NewRecorder(), req)

	current = current.Add(2 * time.Minute)

	recorder := httptest.NewRecorder()
	handler.ServeHTTP(recorder, req)

	if recorder.Code != http.StatusOK {
		t.Fatalf("expected 200 after window reset, got %d", recorder.Code)
	}
}

func TestRateLimit_TracksClientsIndependently(t *testing.T) {
	now := time.Now()
	handler := rateLimitWithClock(1, time.Minute, func() time.Time { return now })(okHandler())

	reqA := httptest.NewRequest(http.MethodGet, "/", nil)
	reqA.RemoteAddr = "1.1.1.1:1111"
	handler.ServeHTTP(httptest.NewRecorder(), reqA)

	reqB := httptest.NewRequest(http.MethodGet, "/", nil)
	reqB.RemoteAddr = "2.2.2.2:2222"
	recorder := httptest.NewRecorder()
	handler.ServeHTTP(recorder, reqB)

	if recorder.Code != http.StatusOK {
		t.Fatalf("expected different client to be unaffected, got %d", recorder.Code)
	}
}
