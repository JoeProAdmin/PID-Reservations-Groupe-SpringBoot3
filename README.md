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
- Endpoints sécurisés (admin)

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

Backend fonctionnel et stable.

---

## Backend

- Spring Boot opérationnel
- JWT fonctionnel
- Login OK (Postman)
- Rôles ADMIN / USER
- Endpoints sécurisés

---

## Base de données

- MySQL (XAMPP)
- Base : pid_reservations_group
- Tables : users, artists, spectacles, reservations

Configuration :

spring.jpa.hibernate.ddl-auto=update

---

## data.sql

Insertion sécurisée :

INSERT IGNORE INTO users (...)

Compte ADMIN déjà existant

---

## Structure

- backend/
- docs/
- README.md

---

## Organisation Git

Branches :

- main
- youssef-admin-backend-v2
- redouane-frontend
- sabbagh-production
- hatim-docs

---

## Règles

- 1 branche par personne
- Pas de travail sur main
- Pull Request obligatoire

---

## Progression

- Backend terminé
- JWT OK
- BDD OK
- ADMIN OK
- Login OK

---

## Objectif

- Frontend
- Intégration
- Déploiement

---

## Statut

Backend stable  
BDD opérationnelle  
Projet prêt pour suite
