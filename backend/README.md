# PID-Reservations-Groupe-SpringBoot3

Projet PID Réservations - Travail de groupe (Spring Boot 3)  
ICC 2025 - 2026

---

## Groupe SpringBoot 3

### Membres du groupe

- 6400 - QARNOUF Youssef
- 6613 - ASSAL Hatim
- 6368 - BENKADDOUR Redouane
- 6451 - Abdulrahman SABBAGH

---

## Répartition des tâches

### QARNOUF Youssef (Responsable Backend & BDD)

- Développement Backend (Spring Boot 3)
- Gestion de la base de données MySQL
- Sécurité JWT (authentification)
- Gestion des rôles ADMIN / USER
- Endpoints sécurisés
- Implémentation UserDetailsService

### BENKADDOUR Redouane (Frontend)

- Développement interface utilisateur
- Bootstrap
- Connexion API

### Abdulrahman SABBAGH (Production)

- Déploiement
- Infrastructure

### ASSAL Hatim (Documentation & UX)

- Documentation
- UX
- Organisation

---

## État actuel du projet

Backend fonctionnel, sécurisé et stabilisé.

---

## Backend

- Spring Boot 3 opérationnel
- Architecture propre :
  - Controller
  - Service
  - DTO
  - Repository
- Sécurité complète :
  - JWT (Json Web Token)
  - UserDetailsService
  - AuthenticationProvider
- Authentification :
  - Register fonctionnel
  - Login fonctionnel (tests Postman validés)
- Gestion des utilisateurs :
  - DTO (Create / Update / Response)
  - Service métier structuré
- Rôles :
  - ROLE_ADMIN
  - ROLE_USER
- Endpoints sécurisés

---

## Base de données

- Système : MySQL (XAMPP)
- Base : `pid_reservations_group`

### Tables principales

- `users`
- `artists`
- `spectacles`
- `reservations`

### Configuration

`spring.jpa.hibernate.ddl-auto=update`

### data.sql

`INSERT IGNORE INTO users (...)`

- Insertion sécurisée
- Compte ADMIN disponible

---

## Architecture du projet

    backend/
    └── src/main/java/be/icc/pid/reservations/
        ├── controller/
        ├── dto/
        ├── entity/
        ├── repository/
        ├── security/
        ├── service/
        └── service/impl/

    resources/
    └── application.properties

---

## Organisation Git

### Branches

- `main`
- `youssef-admin-backend-v2`
- `redouane-frontend`
- `sabbagh-production`
- `hatim-docs`

### Règles

- 1 branche par personne
- Pas de travail direct sur `main`
- Pull Request obligatoire

---

## Progression

- Backend terminé
- Sécurité JWT opérationnelle
- Authentification complète
- Gestion des utilisateurs stabilisée
- Base de données opérationnelle

---

## Objectifs à venir

- Intégration Frontend
- Module Paiement
- Déploiement de l’application

---

## Statut du projet

- Backend stable
- Sécurité opérationnelle
- Architecture conforme
- Projet prêt pour intégration frontend et extension fonctionnelle