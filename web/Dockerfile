FROM node:24-alpine AS build
WORKDIR /app

ARG VITE_AUTH_API_URL
ARG VITE_ENDOSOS_API_URL
ARG VITE_RUTAS_API_URL
ENV VITE_AUTH_API_URL=$VITE_AUTH_API_URL
ENV VITE_ENDOSOS_API_URL=$VITE_ENDOSOS_API_URL
ENV VITE_RUTAS_API_URL=$VITE_RUTAS_API_URL

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
