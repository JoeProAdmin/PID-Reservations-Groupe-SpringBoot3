# ============================================
# Dockerfile - Backend Spring Boot 3
# PID Réservations Groupe - ICC 2025-2026
# Auteur : Abdulrahman SABBAGH (Production)
# ============================================

# --- Étape 1 : Build avec Maven ---
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

# Copier le fichier pom.xml d'abord pour cache des dépendances
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copier le code source
COPY src ./src

# Build du projet (skip tests pour accélérer le build)
RUN mvn clean package -DskipTests -B

# --- Étape 2 : Image de production légère ---
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copier le JAR depuis l'étape build
COPY --from=build /app/target/*.jar app.jar

# Copier le script d'attente pour MySQL
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN sed -i 's/\r$//' /docker-entrypoint.sh && chmod +x /docker-entrypoint.sh

# Changer vers l'utilisateur non-root
USER appuser

# Exposer le port Spring Boot
EXPOSE 8080

# Health check pour Docker
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Point d'entrée
ENTRYPOINT ["/docker-entrypoint.sh"]
