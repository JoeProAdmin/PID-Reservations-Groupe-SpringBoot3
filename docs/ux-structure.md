# Structure UX - PID Reservations

## Objectif
Ce document pose la structure generale des ecrans du projet afin d'aider l'integration frontend et la coherence de navigation.

## Ecrans publics
- Accueil
- Catalogue des spectacles
- Fiche spectacle
- Connexion
- Inscription

## Ecrans membre
- Tableau de bord membre
- Mes reservations
- Mon profil

## Ecrans administration
- Tableau de bord admin
- Gestion des spectacles
- Gestion des utilisateurs

## Ecrans metier a prevoir
- Espace producteur
- Espace critique / presse
- Espace affiliation / API

## Navigation attendue
- l'accueil renvoie vers le catalogue
- le catalogue renvoie vers chaque fiche spectacle
- la fiche spectacle renvoie vers la reservation ou la connexion
- les espaces securises doivent afficher une navigation adaptee au role

## Principes UX
- navigation simple et constante
- separation claire entre public, membre et admin
- actions principales visibles des le premier ecran
- coherence entre les noms des pages, les roles et les endpoints existants
