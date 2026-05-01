# ============================================
# Checklist de presentation - PID Reservations
# ICC 2025-2026
# Auteur : Abdulrahman SABBAGH (Production)
# ============================================

## Avant la soutenance

### Preparation (la veille)
- [ ] Verifier que Docker Desktop est installe et demarre
- [ ] Cloner le repo : `git clone https://github.com/JoeProAdmin/PID-Reservations-Groupe-SpringBoot3.git`
- [ ] Copier le fichier .env : `cp .env.example .env`
- [ ] Builder les images : `docker-compose build`
- [ ] Tester le lancement : `docker-compose up -d`
- [ ] Verifier les 3 services : `docker-compose ps`

### Comptes de demonstration
| Role | Email | Mot de passe |
|------|-------|-------------|
| Admin | admin@test.com | admin123 |
| Utilisateur | user@test.com | admin123 |

### Flux a presenter
1. **Page d'accueil** : liste des spectacles avec donnees de demo
2. **Inscription** : creer un nouveau compte utilisateur
3. **Connexion** : se connecter avec le compte cree
4. **Spectacles** : parcourir les spectacles, voir les details
5. **Artistes** : parcourir les artistes
6. **Profil** : voir et modifier son profil
7. **Admin** : se connecter en admin, montrer le dashboard

### Commandes utiles pendant la demo
```bash
# Lancer tout
docker-compose up -d

# Voir les logs en temps reel (si probleme)
docker-compose logs -f

# Redemarrer un service
docker-compose restart backend

# Arreter tout
docker-compose down
```

### Points techniques a presenter
- Architecture 3 tiers (Frontend / Backend / BDD)
- Securite JWT (token, roles ADMIN/USER)
- Docker : conteneurisation complete
- CI/CD : pipeline GitHub Actions automatique
- Profils Spring Boot (dev vs prod)
- Gestion des exceptions (GlobalExceptionHandler)

## En cas de probleme
- Backend ne demarre pas : `docker-compose logs backend` pour voir l'erreur
- Frontend page blanche : verifier que le backend est bien demarre
- MySQL refuse la connexion : attendre 30 secondes (health check)
- Rebuild complet : `docker-compose down -v` puis `docker-compose up -d --build`
