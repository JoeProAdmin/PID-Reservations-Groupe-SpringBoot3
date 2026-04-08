# Structure UX - PID Reservations

## Objectif
Ce document pose la structure generale des ecrans du projet afin d'aider l'integration frontend et la coherence de navigation.

## Structure technique actuelle
- React est utilise pour le frontend utilisateur
- Spring Boot expose les donnees via API REST
- le backend contient aussi une interface admin spectacle dediee
- l'API est ouverte temporairement pour debloquer l'integration frontend
- les ecrans doivent rester alignes avec les endpoints existants

## Ecrans React deja presents
- liste des artistes
- fiche detaillee artiste
- creation artiste
- modification artiste
- connexion
- inscription

## Ecrans admin deja presents
- liste admin des spectacles
- creation admin d'un spectacle
- modification admin d'un spectacle
- suppression admin d'un spectacle

## Ecrans publics a prevoir
- Accueil
- Catalogue des spectacles
- Fiche spectacle
- Connexion
- Inscription

## Ecrans membre a prevoir
- Tableau de bord membre
- Mes reservations
- Mon profil

## Ecrans administration a prevoir
- Tableau de bord admin
- Gestion des spectacles
- Gestion des utilisateurs
- Gestion des artistes

## Ecrans metier a prevoir
- Espace producteur
- Espace critique / presse
- Espace affiliation / API

## Navigation attendue
- l'accueil renvoie vers le catalogue
- le catalogue renvoie vers chaque fiche spectacle
- la fiche spectacle renvoie vers la reservation ou la connexion
- les pages artistes gardent une navigation simple entre liste, detail, creation et edition
- les pages connexion et inscription restent accessibles depuis la navigation principale
- les espaces securises doivent afficher une navigation adaptee au role

## Priorites d'integration
- stabiliser la navigation React existante
- ajouter le catalogue spectacles dans le meme niveau de coherence que les artistes
- ajouter le parcours reservation apres validation des donnees backend
- ajouter les pages membre quand l'authentification frontend est stabilisee
- cadrer le module commentaires avant de l'integrer si le groupe le valide

## Principes UX
- navigation simple et constante
- separation claire entre public, membre et admin
- actions principales visibles des le premier ecran
- coherence entre les noms des pages, les roles et les endpoints existants
- pas de duplication inutile entre pages React et pages backend
