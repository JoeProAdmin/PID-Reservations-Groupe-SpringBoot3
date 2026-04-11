# 🚀 Guide de Déploiement - PID Réservations

> **Auteur** : Abdulrahman SABBAGH (Production & Infrastructure)  
> **Projet** : PID Réservations Groupe SpringBoot 3 — ICC 2025-2026  
> **Dernière mise à jour** : Avril 2026

---

## 📋 Table des matières

1. [Prérequis](#prérequis)
2. [Architecture technique](#architecture-technique)
3. [Installation locale (développement)](#installation-locale)
4. [Déploiement Docker (production)](#déploiement-docker)
5. [CI/CD - GitHub Actions](#cicd---github-actions)
6. [Variables d'environnement](#variables-denvironnement)
7. [Commandes utiles](#commandes-utiles)
8. [Dépannage](#dépannage)

---

## 🔧 Prérequis

### Pour le développement local
| Outil | Version minimale | Lien |
|-------|-----------------|------|
| Java JDK | 17+ | [Adoptium](https://adoptium.net/) |
| Maven | 3.9+ | [Apache Maven](https://maven.apache.org/) |
| Node.js | 20+ | [Node.js](https://nodejs.org/) |
| MySQL | 8.0+ | [MySQL](https://dev.mysql.com/) ou XAMPP |
| Git | 2.40+ | [Git](https://git-scm.com/) |

### Pour Docker (production)
| Outil | Version minimale |
|-------|-----------------|
| Docker | 24+ |
| Docker Compose | 2.20+ |

---

## 🏗️ Architecture technique

```
┌─────────────────────────────────────────────────────┐
│                    UTILISATEUR                       │
│                   (Navigateur)                       │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP :3000
                       ▼
┌─────────────────────────────────────────────────────┐
│              FRONTEND (React + Nginx)                │
│                Container: pid-frontend               │
│                Port exposé: 3000 → 80                │
│                                                      │
│  - Interface utilisateur React                       │
│  - Nginx comme serveur web                           │
│  - Proxy inverse vers le backend (/api/)             │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP :8080 (réseau Docker)
                       ▼
┌─────────────────────────────────────────────────────┐
│              BACKEND (Spring Boot 3)                 │
│                Container: pid-backend                │
│                Port exposé: 8080                     │
│                                                      │
│  - API REST sécurisée (JWT)                          │
│  - Rôles : ADMIN / USER                              │
│  - Spring Security + Spring Data JPA                 │
└──────────────────────┬──────────────────────────────┘
                       │ TCP :3306 (réseau Docker)
                       ▼
┌─────────────────────────────────────────────────────┐
│              BASE DE DONNÉES (MySQL 8.0)             │
│                Container: pid-mysql                  │
│                Port exposé: 3307 → 3306              │
│                                                      │
│  - Base : pid_reservations_group                     │
│  - Tables : users, artists, spectacles, reservations │
│  - Volume persistant : mysql_data                    │
└─────────────────────────────────────────────────────┘
```

---

## 💻 Installation locale

### 1. Cloner le projet
```bash
git clone https://github.com/JoeProAdmin/PID-Reservations-Groupe-SpringBoot3.git
cd PID-Reservations-Groupe-SpringBoot3
```

### 2. Configurer la base de données
```bash
# Démarrer MySQL via XAMPP ou service local
# Créer la base de données
mysql -u root -e "CREATE DATABASE IF NOT EXISTS pid_reservations_group;"
```

### 3. Lancer le Backend
```bash
cd backend

# Copier le fichier d'environnement
cp .env.example .env

# Lancer avec le profil dev
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```
Le backend sera accessible sur **http://localhost:8080**

### 4. Lancer le Frontend
```bash
cd frontend

# Installer les dépendances
npm install

# Lancer en mode développement
npm start
```
Le frontend sera accessible sur **http://localhost:3000**

---

## 🐳 Déploiement Docker

### Méthode rapide (1 commande)
```bash
# Copier la configuration
cp .env.docker .env

# Lancer TOUT le projet
docker-compose up -d
```

### Accès après déploiement
| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080 |
| MySQL | localhost:3307 (via client SQL) |

### Compte Admin par défaut
| Champ | Valeur |
|-------|--------|
| Email | admin@test.com |
| Mot de passe | (voir data.sql) |
| Rôle | ADMIN |

### Arrêter les services
```bash
docker-compose down          # Arrêter (garder les données)
docker-compose down -v       # Arrêter + supprimer les données
```

### Rebuild après modification du code
```bash
docker-compose build --no-cache
docker-compose up -d
```

---

## ⚙️ CI/CD - GitHub Actions

Le pipeline CI/CD s'exécute automatiquement à chaque :
- **Push** sur les branches : `main`, `sabbagh-production`, `youssef-admin-backend-v2`, `redouane-frontend`, `hatim-docs`
- **Pull Request** vers `main`

### Jobs du pipeline

| Job | Description | Durée estimée |
|-----|-------------|---------------|
| 🔧 Backend | Compile + tests unitaires avec MySQL | ~3 min |
| 🎨 Frontend | Install npm + build production | ~2 min |
| 🐳 Docker | Build des images Docker | ~5 min |

### Vérifier le statut
1. Aller sur GitHub → Onglet **Actions**
2. Voir le dernier run du workflow "🚀 CI - PID Réservations"
3. Vérifier que tous les jobs sont ✅

---

## 🔐 Variables d'environnement

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `MYSQL_ROOT_PASSWORD` | Mot de passe root MySQL | `root` |
| `MYSQL_DATABASE` | Nom de la base de données | `pid_reservations_group` |
| `MYSQL_USER` | Utilisateur MySQL | `pid_user` |
| `MYSQL_PASSWORD` | Mot de passe MySQL | `pid_password` |
| `MYSQL_PORT` | Port MySQL exposé | `3307` |
| `BACKEND_PORT` | Port backend exposé | `8080` |
| `FRONTEND_PORT` | Port frontend exposé | `3000` |
| `SPRING_PROFILES_ACTIVE` | Profil Spring (dev/prod) | `prod` |
| `JWT_SECRET` | Clé secrète JWT | (voir .env.docker) |
| `REACT_APP_API_URL` | URL de l'API pour React | `http://localhost:8080` |

---

## 📝 Commandes utiles

### Docker
```bash
# Voir les logs d'un service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql

# Accéder au shell d'un container
docker exec -it pid-backend sh
docker exec -it pid-mysql mysql -u root -proot

# Voir l'état des containers
docker-compose ps

# Voir l'utilisation des ressources
docker stats
```

### Backend (Maven)
```bash
# Build sans tests
mvn clean package -DskipTests

# Lancer les tests
mvn test

# Lancer avec profil dev
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Frontend (npm)
```bash
# Install des dépendances
npm ci

# Build de production
npm run build

# Lancer en dev
npm start
```

---

## 🔥 Dépannage

### Le backend ne démarre pas ?
```bash
# Vérifier que MySQL est prêt
docker-compose logs mysql

# Vérifier les logs backend
docker-compose logs backend

# Vérifier que le port 8080 n'est pas déjà utilisé
netstat -an | findstr 8080
```

### Erreur de connexion à la base de données ?
```bash
# Vérifier que MySQL est accessible
docker exec -it pid-mysql mysql -u root -proot -e "SHOW DATABASES;"

# Vérifier les variables d'environnement
docker-compose config
```

### Le frontend ne se connecte pas au backend ?
- Vérifier que `REACT_APP_API_URL` est correctement configuré
- Vérifier que Nginx proxy correctement via les logs : `docker-compose logs frontend`
- Vérifier CORS dans le backend

### Rebuild complet
```bash
docker-compose down -v
docker system prune -f
docker-compose build --no-cache
docker-compose up -d
```

---

## 📊 Profils Spring Boot

| Profil | Fichier | Usage |
|--------|---------|-------|
| `dev` | `application-dev.properties` | Développement local (XAMPP, logs détaillés) |
| `prod` | `application-prod.properties` | Production Docker (logs réduits, pool optimisé) |

Pour changer de profil :
```bash
# En local
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# En Docker (via .env)
SPRING_PROFILES_ACTIVE=prod
```

---

> 📌 **Note** : Ce guide est maintenu par Abdulrahman SABBAGH. Pour toute question sur le déploiement ou l'infrastructure, contactez-le.
