#!/bin/sh
# ============================================
# Script d'entrée Docker - Backend
# Attend que MySQL soit prêt avant de lancer l'app
# Auteur : Abdulrahman SABBAGH (Production)
# ============================================

echo "================================================"
echo "  PID Réservations - Backend Spring Boot 3"
echo "  Démarrage en cours..."
echo "================================================"

# Lancer l'application Spring Boot
exec java \
    -Djava.security.egd=file:/dev/./urandom \
    -Dspring.profiles.active=${SPRING_PROFILES_ACTIVE:-prod} \
    -jar /app/app.jar
