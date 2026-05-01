#  Guide d'Infrastructure - PID Réservations

> **Auteur** : Abdulrahman SABBAGH (Production & Infrastructure)  
> **Projet** : PID Réservations Groupe SpringBoot 3 — ICC 2025-2026

---

## ️ Structure des fichiers Infrastructure

```
PID-Reservations-Groupe-SpringBoot3/
|
├── docker-compose.yml              ← Orchestration de tous les services
├── .env.docker                     ← Variables Docker préconfigurées
├── .env.example                    ← Template des variables d'environnement
├── .gitattributes                  ← Gestion des fins de ligne (CRLF/LF)
├── start.ps1                       ← Script de démarrage rapide (Windows)
├── .github/
│   └── workflows/
│       └── ci.yml                  ← Pipeline CI/CD GitHub Actions
│
├── backend/
│   ├── Dockerfile                  ← Image Docker backend (multi-stage)
│   ├── docker-entrypoint.sh        ← Script de démarrage
│   ├── .dockerignore               ← Exclusions Docker
│   └── src/main/resources/
│       ├── application.properties      ← Config principale
│       ├── application-dev.properties  ← Profil développement
│       └── application-prod.properties ← Profil production
│
├── frontend/
│   ├── Dockerfile                  ← Image Docker frontend (Nginx)
│   ├── nginx.conf                  ← Configuration Nginx + proxy API
│   └── .dockerignore               ← Exclusions Docker
│
└── docs/
    ├── deploiement.md              ← Guide de déploiement complet
    └── infrastructure.md           ← Ce fichier
```

---

##  Bonnes pratiques appliquées

### Sécurité
-  Utilisateur non-root dans les containers Docker
-  Variables d'environnement pour les secrets (pas de hardcode)
-  `.dockerignore` pour exclure les fichiers sensibles
-  Nginx bloque l'accès aux fichiers cachés (`.env`, `.git`)

### Performance
-  Multi-stage builds (images légères)
-  Cache des dépendances Maven/npm dans le Dockerfile
-  Gzip compression activée dans Nginx
-  Cache navigateur pour les assets statiques (1 an)
-  Pool de connexions Hikari optimisé par profil

### Fiabilité
-  Health checks sur tous les services
-  `depends_on` avec `condition: service_healthy`
-  `restart: unless-stopped` pour auto-redémarrage
-  Volume persistant pour les données MySQL

### CI/CD
-  Build automatique a chaque push
-  Tests avec service MySQL dans le pipeline
-  Build Docker verifie automatiquement
-  Cache Maven et npm dans GitHub Actions

### Qualite du code
-  Gestion globale des exceptions (GlobalExceptionHandler)
-  Validation dans les services (Spectacle, Reservation, Representation)
-  Separation des DTOs (Create, Update, Response)

---

##  Améliorations futures possibles

- [ ] Déploiement sur un serveur cloud (AWS, DigitalOcean, Railway)
- [ ] Certificat SSL / HTTPS avec Let's Encrypt
- [ ] Monitoring avec Prometheus + Grafana
- [ ] Backup automatique de la base de données
- [ ] Registry Docker privé pour les images

---

> Ce document décrit l'infrastructure mise en place pour le projet PID Réservations.
