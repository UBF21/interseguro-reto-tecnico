package http

import "net/http"

// Spec escrito a mano -- net/http estándar no tiene reflection de rutas como un framework, y para
// 2 endpoints no amerita sumar una dependencia de codegen (swaggo/swag) solo para esto.
const openAPISpec = `{
  "openapi": "3.0.3",
  "info": { "title": "api-rutas", "version": "1.0.0", "description": "Cálculo de rutas óptimas (Reto 2)" },
  "components": {
    "securitySchemes": {
      "Bearer": { "type": "http", "scheme": "bearer", "bearerFormat": "JWT" }
    },
    "schemas": {
      "OptimalRouteRequest": {
        "type": "object",
        "required": ["accidentLocation", "depots", "graph"],
        "properties": {
          "accidentLocation": { "type": "string", "example": "Ate" },
          "depots": { "type": "array", "items": { "type": "string" }, "example": ["Miraflores", "San Isidro"] },
          "graph": {
            "type": "object",
            "description": "Grafo de distritos: distrito -> { distrito vecino -> distancia }",
            "additionalProperties": { "type": "object", "additionalProperties": { "type": "integer" } }
          }
        }
      },
      "OptimalRouteResponse": {
        "type": "object",
        "properties": {
          "fromDepot": { "type": "string" },
          "to": { "type": "string" },
          "path": { "type": "array", "items": { "type": "string" } },
          "distance": { "type": "integer" }
        }
      },
      "ApiResponse": {
        "type": "object",
        "properties": {
          "success": { "type": "boolean" },
          "message": { "type": "string", "nullable": true },
          "code": { "type": "string", "nullable": true },
          "data": { "nullable": true }
        }
      }
    }
  },
  "paths": {
    "/health": {
      "get": {
        "summary": "Health check",
        "responses": { "200": { "description": "OK" } }
      }
    },
    "/v1/routes/optimal": {
      "post": {
        "summary": "Calcula la ruta óptima desde la base de grúa más cercana",
        "security": [{ "Bearer": [] }],
        "requestBody": {
          "required": true,
          "content": { "application/json": { "schema": { "$ref": "#/components/schemas/OptimalRouteRequest" } } }
        },
        "responses": {
          "200": {
            "description": "Ruta calculada",
            "content": { "application/json": { "schema": { "$ref": "#/components/schemas/ApiResponse" } } }
          },
          "400": { "description": "Payload inválido o error de validación" },
          "401": { "description": "Token ausente, inválido o sin el rol requerido" },
          "422": { "description": "El accidente no es alcanzable desde ninguna base" }
        }
      }
    }
  }
}`

const swaggerUIPage = `<!DOCTYPE html>
<html>
<head>
  <title>api-rutas -- Swagger UI</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css">
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    window.ui = SwaggerUIBundle({
      url: '/openapi.json',
      dom_id: '#swagger-ui',
      persistAuthorization: true,
    });
  </script>
</body>
</html>`

// registerSwagger -- solo se llama en dev (ver main.go); nunca se expone en un despliegue real.
func registerSwagger(mux *http.ServeMux) {
	mux.HandleFunc("/openapi.json", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(openAPISpec))
	})
	mux.HandleFunc("/docs", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html")
		_, _ = w.Write([]byte(swaggerUIPage))
	})
	// Al levantar el servicio, la home ya es la documentación interactiva.
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			w.WriteHeader(http.StatusNotFound)
			return
		}
		http.Redirect(w, r, "/docs", http.StatusFound)
	})
}
