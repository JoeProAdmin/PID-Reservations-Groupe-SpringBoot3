# ============================================
# Dockerfile - Frontend React
# PID Réservations Groupe - ICC 2025-2026
# Auteur : Abdulrahman SABBAGH (Production)
# ============================================

# --- Étape 1 : Build React ---
FROM node:20-alpine AS build

WORKDIR /app

# Copier package.json d'abord pour cache des dépendances
COPY package.json package-lock.json ./
RUN npm ci --silent

# Copier le code source
COPY . .

# Variable d'environnement pour l'URL de l'API backend
ARG REACT_APP_API_URL=http://localhost:8080
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Build de production
RUN npm run build

# --- Étape 2 : Servir avec Nginx ---
FROM nginx:1.25-alpine

# Copier la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier le build React
COPY --from=build /app/build /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Lancer Nginx
CMD ["nginx", "-g", "daemon off;"]
