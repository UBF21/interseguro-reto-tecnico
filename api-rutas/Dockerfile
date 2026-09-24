FROM golang:1.23-alpine AS build
WORKDIR /app
COPY go.mod go.sum* ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o /out/api-rutas ./cmd/api

FROM alpine:3.20
WORKDIR /app
COPY --from=build /out/api-rutas .
EXPOSE 8080
CMD ["./api-rutas"]
