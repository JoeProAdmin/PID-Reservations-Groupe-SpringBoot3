# Parcours utilisateurs - PID Reservations

## Objectif
Ce document decrit les parcours principaux des utilisateurs afin d'aligner le backend, le frontend et l'organisation du projet.

## Etat actuel du projet
- le frontend React est utilise pour l'affichage utilisateur
- la partie artistes est deja commencee cote React
- les pages connexion et inscription sont commencees cote React
- le backend expose les donnees via API REST
- la partie admin spectacle est geree cote backend avec une interface dediee
- l'API reste ouverte temporairement pour permettre l'integration frontend

## Parcours artiste deja commence
- l'utilisateur arrive sur la liste des artistes
- il consulte les artistes disponibles
- il ouvre la fiche detaillee d'un artiste
- il peut acceder a l'ajout d'un artiste
- il peut acceder a la modification d'un artiste
- il peut supprimer un artiste si l'action est disponible dans l'interface

## Parcours connexion et inscription deja commence
- l'utilisateur accede a la page de connexion
- il saisit ses identifiants
- le frontend envoie la demande au backend
- l'utilisateur peut acceder a la page d'inscription
- il saisit les informations necessaires a la creation du compte
- les validations doivent rester coherentes entre le backend et l'interface

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
- garder la partie artistes coherente avec le frontend React actuel
- garder la connexion et l'inscription coherentes avec les endpoints backend
- preparer le catalogue spectacles public
- preparer le parcours reservation apres la fiche spectacle
- distinguer clairement les espaces public, membre et admin
- documenter les modules non valides avant de les developper

## Points a valider avec le groupe
- confirmer les pages a livrer en priorite apres artistes
- confirmer si le module commentaires fait partie de la prochaine etape
- confirmer les roles actifs dans la premiere version livrable
- confirmer les endpoints disponibles avant d'ajouter de nouvelles pages frontend
- suivre les points d'integration dans docs/integration-frontend-backend.md
