# Tests API - Projet Groupe PID Reservations

## Base de données
Base utilisée : pid_reservations_group

---

## 1. Test GET Spectacles

GET http://localhost:8080/api/spectacles

Résultat :
- API fonctionnelle
- Liste retournée (vide au début)

---

## 2. Test POST Spectacle

POST http://localhost:8080/api/spectacles

Body JSON :

{
"title": "Concert Drake",
"description": "Live show",
"date": "2026-04-01T20:00:00",
"location": "Bruxelles",
"price": 50
}

Résultat :
- Spectacle créé avec succès
- ID généré automatiquement

---

## 3. Vérification GET Spectacles

Résultat :
- Spectacle visible en base

---

## 4. Test POST Reservation

POST http://localhost:8080/api/reservations

Body JSON :

{
"numberOfTickets": 2,
"spectacle": {
"id": 1
}
}

Résultat :
- Reservation créée
- Statut : CREATED
- Relation avec Spectacle OK

---

## 5. Vérification base de données

Tables :
- spectacles
- reservations

Résultat :
- Données insérées correctement
- Relations respectées

---

## Conclusion

Le backend du projet groupe est :
- opérationnel
- connecté à MySQL
- capable de gérer des relations entre entités
- testé avec succès via Postman