package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	apphttp "api-rutas/internal/infrastructure/http"
	"api-rutas/internal/infrastructure/http/middleware"
	"api-rutas/internal/infrastructure/secrets"
)

func envOrDefault(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func main() {
	appSecrets, err := secrets.LoadSecrets(secrets.AppSecrets{
		JWTSecret:   envOrDefault("JWT_SECRET", "REEMPLAZAR-EN-ENV-super-secret-key-min-32-bytes"),
		JWTIssuer:   envOrDefault("JWT_ISSUER", "api-auth"),
		JWTAudience: envOrDefault("JWT_AUDIENCE", "interseguro-reto"),
	})
	if err != nil {
		log.Fatalf("fallo al cargar secretos de Vault: %v", err)
	}

	authMiddleware := middleware.JWTAuth(appSecrets.JWTSecret, appSecrets.JWTIssuer, appSecrets.JWTAudience)
	rateLimit := middleware.RateLimit(60, time.Minute)
	cors := middleware.CORS(envOrDefault("WEB_ORIGIN", "http://localhost:5273"))
	// Swagger UI solo en desarrollo -- nunca expuesto en un despliegue real.
	devMode := envOrDefault("APP_ENV", "development") != "production"
	router := cors(rateLimit(apphttp.NewRouter(apphttp.NewOptimalRouteHandler(log.Default()), authMiddleware, devMode)))

	port := envOrDefault("PORT", "8080")
	srv := &http.Server{
		Addr:         ":" + port,
		Handler:      router,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	go func() {
		log.Printf("api-rutas escuchando en :%s", port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("fallo al iniciar api-rutas: %v", err)
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)
	<-stop

	log.Println("api-rutas: apagando...")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Printf("api-rutas: shutdown forzado: %v", err)
	}
}
