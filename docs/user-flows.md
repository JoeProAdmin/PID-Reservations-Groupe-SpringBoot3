# Parcours utilisateurs - PID Reservations

## Objectif
Ce document decrit les parcours principaux des utilisateurs afin d'aligner le backend, le frontend et l'organisation du projet.

## Internaute
- arrive sur la page d'accueil
- consulte le catalogue des spectacles
- filtre, trie ou recherche un spectacle
- consulte la fiche d'un spectacle
- consulte les prochaines representations
- est invite a se connecter pour reserver

## Membre
- se connecte
- consulte le catalogue
- ouvre la fiche d'un spectacle
- choisit une representation
- reserve une ou plusieurs places
- consulte la liste de ses reservations
- consulte et met a jour son profil

## Administrateur
- se connecte via un acces securise
- consulte les listes de gestion
- ajoute, modifie ou supprime un spectacle
- consulte et gere les utilisateurs
- controle les donnees principales du catalogue

## Producteur
- se connecte
- consulte les spectacles qu'il produit
- suit les informations utiles a la production
- accede aux statistiques disponibles quand elles seront implementees

## Critique / Presse
- se connecte
- consulte les spectacles
- accede a l'espace de redaction ou de soumission des critiques

## Affilie
- s'authentifie sur l'API
- consomme les donnees autorisees selon son niveau d'acces

## Priorites UX
- rendre l'acces au catalogue immediat
- garder la reservation lisible et courte
- distinguer clairement les espaces public, membre et admin
- preparer des parcours specifiques pour producer, press et affiliate
