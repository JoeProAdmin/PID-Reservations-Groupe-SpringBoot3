#  Guide d'Infrastructure - PID Réservations

> **Auteur** : Abdulrahman SABBAGH (Production & Infrastructure)  
> **Projet** : PID Réservations Groupe SpringBoot 3 — ICC 2025-2026

---

## ️ Structure des fichiers Infrastructure

```
PID-Reservations-Groupe-SpringBoot3/
│
├── docker-compose.yml              ← Orchestration de tous les services
├── .env.docker                     ← Template des variables d'environnement
├── .github/
│   └── workflows/
│       └── ci.yml                  ← Pipeline CI/CD GitHub Actions
│
├── backend/
│   ├── Dockerfile                  ← Image Docker backend
│   ├── docker-entrypoint.sh        ← Script de démarrage
│   ├── .dockerignore               ← Exclusions Docker
│   └── src/main/resources/
│       ├── application.properties      ← Config principale
│       ├── application-dev.properties  ← Profil développement
│       └── application-prod.properties ← Profil production
│
├── frontend/
│   ├── Dockerfile                  ← Image Docker frontend
│   ├── nginx.conf                  ← Configuration Nginx
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
-  Build automatique à chaque push
-  Tests avec service MySQL dans le pipeline
-  Build Docker vérifié automatiquement
-  Cache Maven et npm dans GitHub Actions

---

##  Améliorations futures possibles

- [ ] Déploiement sur un serveur cloud (AWS, DigitalOcean, Railway)
- [ ] Certificat SSL / HTTPS avec Let's Encrypt
- [ ] Monitoring avec Prometheus + Grafana
- [ ] Backup automatique de la base de données
- [ ] Registry Docker privé pour les images

---

> Ce document décrit l'infrastructure mise en place pour le projet PID Réservations.
