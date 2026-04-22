# PID-Reservations-Groupe-SpringBoot3

Projet PID Réservations - Travail de groupe  
ICC 2025 - 2026

## Groupe SpringBoot 3

### Membres du groupe
- 6400 - QARNOUF Youssef
- 6368 - BENKADDOUR Redouane
- 6451 - Abdulrahman SABBAGH
- 6613 - ASSAL Hatim

## Répartition des tâches

### QARNOUF Youssef
- Développement backend Spring Boot 3
- Gestion de la base de données MySQL
- Authentification JWT
- Gestion des rôles
- Stabilisation de l’architecture backend
- Gestion des réservations
- Intégration du flux paiement

### BENKADDOUR Redouane
- Développement frontend React
- Intégration API
- Interface utilisateur

### Abdulrahman SABBAGH
- Production
- Déploiement
- Infrastructure

### ASSAL Hatim
- Documentation
- UX
- Organisation

## État actuel du projet

Le backend est stable et structuré. Les principales fonctionnalités métier sont opérationnelles.

### Backend
- Spring Boot opérationnel
- Authentification JWT fonctionnelle
- Login / Register opérationnels
- Gestion des rôles
- Endpoints sécurisés
- CORS configuré pour le frontend
- Architecture controller / service / repository respectée

### Base de données
- MySQL / XAMPP
- Base : `pid_reservations_group`

### Tables principales
- `users`
- `artists`
- `spectacles`
- `representations`
- `reservations`
- `paiements`

## Fonctionnalités validées
- Authentification utilisateur
- Création et connexion utilisateur
- CRUD backend principal
- Liaison Spectacle / Representation / Reservation
- Endpoint représentations par spectacle
- Endpoint POST `/api/representations`
- Endpoint DELETE `/api/representations`
- Paiement déclenché avec réservation
- Correction des enums et stabilisation JPA
- Protection des données sensibles côté API
- Correction login BCrypt
- Backend stabilisé pour l’intégration frontend

## Organisation Git

### Branches actuelles
- `main`
- `FrontEnd`
- `hatim-assal`
- `sabbagh`

### Règles
- 1 branche par membre pour chaque nouvelle évolution
- Travail isolé par fonctionnalité
- Intégration via Pull Request
- `main` contient l’état consolidé du projet

## Avancement technique

### Avancement backend consolidé
- Auth JWT validée
- Réservations stabilisées
- Paiement backend validé
- SecurityConfig stabilisé
- User flow corrigé
- README et structure projet mis à jour
- Backend merge sur `main`

## Objectif final

Finaliser l’intégration complète :
- frontend
- paiements
- documentation
- déploiement
- livrables TFE

## Statut

Projet backend largement avancé et stable.  
Le travail de groupe peut continuer sur une base propre et exploitable.

## Mise à jour backend
- Ajout création de représentations
- Sécurisation JWT active
- Correction login BCrypt
- Backend stabilisé