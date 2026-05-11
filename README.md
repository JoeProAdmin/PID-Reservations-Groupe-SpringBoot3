# PID-Reservations-Groupe-SpringBoot3

Projet PID Réservations - Travail de groupe  
ICC 2025 - 2026

---

# Présentation du projet

Application web de réservation de spectacles développée dans le cadre du cours Projet d’Intégration Développement (PID).

Le projet permet :

- la gestion des spectacles
- la gestion des artistes
- la réservation de places
- l’authentification sécurisée JWT
- un dashboard administrateur
- un système de paiement Stripe (mode test)

---

# Technologies utilisées

## Backend

- Java 17
- Spring Boot 3
- Spring Security
- JWT Authentication
- Hibernate / JPA
- MySQL

## Frontend

- React
- React Router
- Bootstrap

## Outils

- GitHub
- IntelliJ IDEA
- Postman
- XAMPP
- Docker

---

# Membres du groupe

- 6400 - QARNOUF Youssef
- 6613 - ASSAL Hatim
- 6368 - BENKADDOUR Redouane
- 6451 - Abdulrahman SABBAGH

---

# Répartition des tâches

## QARNOUF Youssef — Backend & Base de données

- Architecture backend Spring Boot
- Sécurité JWT
- Authentification / autorisation
- Gestion des rôles
- Services métier
- Structure DTO / Repository / Service
- Base de données MySQL

## BENKADDOUR Redouane — Frontend

- Interface utilisateur React
- Intégration API
- Navigation frontend
- Pages de réservation

## Abdulrahman SABBAGH — Production

- Déploiement
- Configuration infrastructure
- Environnement Docker

## ASSAL Hatim — Documentation & UX

- Documentation
- UX
- Organisation du projet

---

# Fonctionnalités

## Utilisateur

- Inscription
- Connexion sécurisée JWT
- Consultation des spectacles
- Réservation
- Paiement Stripe
- Consultation des réservations

## Administrateur

- Gestion des spectacles
- Gestion des artistes
- Dashboard administrateur
- Gestion des réservations

---

# Architecture du projet

backend/
└── src/main/java/be/icc/pid/reservations/
├── controller/
├── dto/
├── entity/
├── repository/
├── security/
├── service/
└── service/impl/

frontend/
└── src/
├── components/
├── pages/
├── context/
└── services/

---

# Base de données

## Système

MySQL (XAMPP)

## Base utilisée

pid_reservations_group

## Tables principales

- users
- artists
- spectacles
- reservations
- paiements

---

# Comptes de démonstration

## ADMIN

Email :  
admin@test.com

Mot de passe :  
password

## USER

Email :  
user@test.com

Mot de passe :  
password

---

# Carte Stripe de test

Numéro :  
4242 4242 4242 4242

Date :  
12/34

CVC :  
123

---

# Lancement du projet

## Backend

```bash
cd backend
mvnw spring-boot:run
```

## Frontend

```bash
cd frontend
npm install
npm start
```

---

# Organisation Git

## Branches

- main
- youssef-admin-backend-v2
- FrontEnd
- sabbagh
- hatim-assal

## Workflow

- 1 branche par membre
- Pull Request obligatoire
- Validation collaborative

---

# État final du projet

- Backend stable
- Frontend intégré
- JWT opérationnel
- Réservations opérationnelles
- Paiement Stripe intégré
- Base de données fonctionnelle
- Projet prêt pour démonstration

---

# Projet réalisé dans le cadre du cours PID

ICC 2025 - 2026
