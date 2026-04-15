# Integration frontend backend

## But
Lister les points a verifier entre React et Spring Boot avant de continuer les ecrans.

## Etat vu dans le projet
- React appelle le backend pour charger les donnees
- le backend utilise JWT
- les artistes, spectacles, representations et reservations sont deja presents cote backend
- les routes admin restent protegees
- les routes de lecture utiles au catalogue doivent rester utilisables par le frontend

## Login
Pour le frontend, le login doit renvoyer des donnees utilisables.

Reponse utile :
- token JWT
- role de l'utilisateur

Cote React, ces donnees servent a :
- garder le token pour les appels proteges
- afficher ou cacher les liens admin
- savoir si l'utilisateur est connecte

A verifier :
- le login ne doit pas renvoyer seulement un texte du type Login OK
- l'inscription et la connexion ne doivent pas utiliser exactement les memes champs

## Routes publiques
Les pages publiques doivent pouvoir lire les donnees de base.

Routes a verifier :
- liste des spectacles
- detail d'un spectacle
- liste des representations visibles
- donnees necessaires pour lancer une reservation

Les actions de creation, modification et suppression restent reservees aux roles autorises.

## Reservation
Le parcours reservation passe maintenant par les representations.

Parcours attendu :
- voir un spectacle
- choisir une representation
- se connecter si besoin
- confirmer la reservation
- mettre a jour les places disponibles
- retrouver la reservation dans l'espace membre

A verifier :
- format attendu par l'endpoint reservation
- message si les places sont insuffisantes
- comportement si l'utilisateur n'est pas connecte

## CORS et environnement
React doit pouvoir appeler le backend en local et avec Docker.

A garder coherent :
- URL API utilisee par React
- origine autorisee en local
- URL backend utilisee dans Docker
- profils de configuration Spring

## Suite courte
- stabiliser le retour du login
- verifier les routes publiques du catalogue
- relier fiche spectacle et representations
- preparer la page mes reservations
- ne pas lancer le module commentaires sans validation du groupe
