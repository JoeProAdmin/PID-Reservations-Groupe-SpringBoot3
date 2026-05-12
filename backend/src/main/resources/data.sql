-- ============================================
-- Donnees de demonstration - PID Reservations
-- ICC 2025-2026
-- ============================================
-- Idempotent : chaque INSERT est protege par WHERE NOT EXISTS
-- (cle naturelle), donc rejouer ce script ne cree pas de doublons.

-- ========== UTILISATEURS ==========
-- email est deja UNIQUE en base, INSERT IGNORE suffit
INSERT IGNORE INTO users (email, password, nom, prenom, role)
VALUES (
    'admin@test.com',
    '$2a$10$FYxtkUoIUsgq1mt0tGJDK.VKD/3QB1TtKKZ4zxRo3UPGTEY3ce1Dq',
    'Admin', 'Test', 'ROLE_ADMIN'
);

INSERT IGNORE INTO users (email, password, nom, prenom, role)
VALUES (
    'user@test.com',
    '$2a$10$FYxtkUoIUsgq1mt0tGJDK.VKD/3QB1TtKKZ4zxRo3UPGTEY3ce1Dq',
    'Dupont', 'Jean', 'ROLE_USER'
);

-- ========== ARTISTES (cle naturelle : name) ==========
INSERT INTO artists (name, genre, country, description, created_at, updated_at)
SELECT * FROM (SELECT 'Stromae' AS name, 'Pop/Hip-hop' AS genre, 'Belgique' AS country,
       'Artiste belge internationalement reconnu pour ses textes poetiques et ses performances sceniques uniques.' AS description,
       NOW() AS created_at, NOW() AS updated_at) AS t
WHERE NOT EXISTS (SELECT 1 FROM artists WHERE name = 'Stromae');

INSERT INTO artists (name, genre, country, description, created_at, updated_at)
SELECT * FROM (SELECT 'Angele', 'Pop', 'Belgique',
       'Chanteuse et musicienne belge, connue pour ses tubes comme Balance ton quoi et Tout oublier.',
       NOW(), NOW()) AS t
WHERE NOT EXISTS (SELECT 1 FROM artists WHERE name = 'Angele');

INSERT INTO artists (name, genre, country, description, created_at, updated_at)
SELECT * FROM (SELECT 'Jacques Brel', 'Chanson francaise', 'Belgique',
       'Legendaire auteur-compositeur-interprete belge, figure majeure de la chanson francaise.',
       NOW(), NOW()) AS t
WHERE NOT EXISTS (SELECT 1 FROM artists WHERE name = 'Jacques Brel');

INSERT INTO artists (name, genre, country, description, created_at, updated_at)
SELECT * FROM (SELECT 'Django Reinhardt', 'Jazz', 'Belgique',
       'Guitariste de jazz manouche, considere comme l un des plus grands musiciens du XXe siecle.',
       NOW(), NOW()) AS t
WHERE NOT EXISTS (SELECT 1 FROM artists WHERE name = 'Django Reinhardt');

INSERT INTO artists (name, genre, country, description, created_at, updated_at)
SELECT * FROM (SELECT 'Plastic Bertrand', 'Punk/Pop', 'Belgique',
       'Celebre pour le tube Ca plane pour moi, icone du punk belge des annees 70.',
       NOW(), NOW()) AS t
WHERE NOT EXISTS (SELECT 1 FROM artists WHERE name = 'Plastic Bertrand');

-- ========== SPECTACLES (cle naturelle : title) ==========
INSERT INTO spectacles (title, description, date, location, price, artist_id, created_at, updated_at)
SELECT * FROM (SELECT 'Multitude Tour' AS title,
       'La tournee evenement de Stromae - un spectacle visuel et musical exceptionnel avec ses plus grands hits.' AS description,
       '2026-06-15 20:00:00' AS date, 'Forest National, Bruxelles' AS location, 75.00 AS price,
       (SELECT id FROM artists WHERE name = 'Stromae' LIMIT 1) AS artist_id,
       NOW() AS created_at, NOW() AS updated_at) AS t
WHERE NOT EXISTS (SELECT 1 FROM spectacles WHERE title = 'Multitude Tour');

INSERT INTO spectacles (title, description, date, location, price, artist_id, created_at, updated_at)
SELECT * FROM (SELECT 'Nonante-Cinq Tour',
       'Le concert d Angele dans une atmosphere intimiste et festive avec ses meilleurs titres.',
       '2026-06-22 20:30:00', 'Ancienne Belgique, Bruxelles', 55.00,
       (SELECT id FROM artists WHERE name = 'Angele' LIMIT 1), NOW(), NOW()) AS t
WHERE NOT EXISTS (SELECT 1 FROM spectacles WHERE title = 'Nonante-Cinq Tour');

INSERT INTO spectacles (title, description, date, location, price, artist_id, created_at, updated_at)
SELECT * FROM (SELECT 'Hommage a Brel',
       'Soiree hommage au grand Jacques Brel avec orchestre symphonique et artistes invites.',
       '2026-07-05 19:30:00', 'Palais des Beaux-Arts, Bruxelles', 45.00,
       (SELECT id FROM artists WHERE name = 'Jacques Brel' LIMIT 1), NOW(), NOW()) AS t
WHERE NOT EXISTS (SELECT 1 FROM spectacles WHERE title = 'Hommage a Brel');

INSERT INTO spectacles (title, description, date, location, price, artist_id, created_at, updated_at)
SELECT * FROM (SELECT 'Jazz Manouche Night',
       'Soiree speciale jazz manouche en hommage a Django Reinhardt avec les meilleurs musiciens actuels.',
       '2026-07-12 21:00:00', 'Jazz Station, Saint-Josse', 30.00,
       (SELECT id FROM artists WHERE name = 'Django Reinhardt' LIMIT 1), NOW(), NOW()) AS t
WHERE NOT EXISTS (SELECT 1 FROM spectacles WHERE title = 'Jazz Manouche Night');

INSERT INTO spectacles (title, description, date, location, price, artist_id, created_at, updated_at)
SELECT * FROM (SELECT 'Festival Rock Belge',
       'Une soiree rock et punk avec les classiques du rock belge, ambiance garage et energie pure.',
       '2026-08-01 18:00:00', 'Botanique, Bruxelles', 25.00,
       (SELECT id FROM artists WHERE name = 'Plastic Bertrand' LIMIT 1), NOW(), NOW()) AS t
WHERE NOT EXISTS (SELECT 1 FROM spectacles WHERE title = 'Festival Rock Belge');

-- ========== REPRESENTATIONS (cle naturelle : spectacle_id + date_heure) ==========
INSERT INTO representations (date_heure, places_disponibles, spectacle_id)
SELECT * FROM (SELECT '2026-06-15 20:00:00' AS date_heure, 200 AS places_disponibles,
       (SELECT id FROM spectacles WHERE title = 'Multitude Tour' LIMIT 1) AS spectacle_id) AS t
WHERE NOT EXISTS (SELECT 1 FROM representations r WHERE r.spectacle_id = t.spectacle_id AND r.date_heure = t.date_heure);

INSERT INTO representations (date_heure, places_disponibles, spectacle_id)
SELECT * FROM (SELECT '2026-06-16 20:00:00', 150,
       (SELECT id FROM spectacles WHERE title = 'Multitude Tour' LIMIT 1)) AS t
WHERE NOT EXISTS (SELECT 1 FROM representations r WHERE r.spectacle_id = t.spectacle_id AND r.date_heure = t.date_heure);

INSERT INTO representations (date_heure, places_disponibles, spectacle_id)
SELECT * FROM (SELECT '2026-06-22 20:30:00', 120,
       (SELECT id FROM spectacles WHERE title = 'Nonante-Cinq Tour' LIMIT 1)) AS t
WHERE NOT EXISTS (SELECT 1 FROM representations r WHERE r.spectacle_id = t.spectacle_id AND r.date_heure = t.date_heure);

INSERT INTO representations (date_heure, places_disponibles, spectacle_id)
SELECT * FROM (SELECT '2026-06-23 20:30:00', 100,
       (SELECT id FROM spectacles WHERE title = 'Nonante-Cinq Tour' LIMIT 1)) AS t
WHERE NOT EXISTS (SELECT 1 FROM representations r WHERE r.spectacle_id = t.spectacle_id AND r.date_heure = t.date_heure);

INSERT INTO representations (date_heure, places_disponibles, spectacle_id)
SELECT * FROM (SELECT '2026-07-05 19:30:00', 300,
       (SELECT id FROM spectacles WHERE title = 'Hommage a Brel' LIMIT 1)) AS t
WHERE NOT EXISTS (SELECT 1 FROM representations r WHERE r.spectacle_id = t.spectacle_id AND r.date_heure = t.date_heure);

INSERT INTO representations (date_heure, places_disponibles, spectacle_id)
SELECT * FROM (SELECT '2026-07-06 19:30:00', 250,
       (SELECT id FROM spectacles WHERE title = 'Hommage a Brel' LIMIT 1)) AS t
WHERE NOT EXISTS (SELECT 1 FROM representations r WHERE r.spectacle_id = t.spectacle_id AND r.date_heure = t.date_heure);

INSERT INTO representations (date_heure, places_disponibles, spectacle_id)
SELECT * FROM (SELECT '2026-07-12 21:00:00', 80,
       (SELECT id FROM spectacles WHERE title = 'Jazz Manouche Night' LIMIT 1)) AS t
WHERE NOT EXISTS (SELECT 1 FROM representations r WHERE r.spectacle_id = t.spectacle_id AND r.date_heure = t.date_heure);

INSERT INTO representations (date_heure, places_disponibles, spectacle_id)
SELECT * FROM (SELECT '2026-07-13 21:00:00', 60,
       (SELECT id FROM spectacles WHERE title = 'Jazz Manouche Night' LIMIT 1)) AS t
WHERE NOT EXISTS (SELECT 1 FROM representations r WHERE r.spectacle_id = t.spectacle_id AND r.date_heure = t.date_heure);

INSERT INTO representations (date_heure, places_disponibles, spectacle_id)
SELECT * FROM (SELECT '2026-08-01 18:00:00', 500,
       (SELECT id FROM spectacles WHERE title = 'Festival Rock Belge' LIMIT 1)) AS t
WHERE NOT EXISTS (SELECT 1 FROM representations r WHERE r.spectacle_id = t.spectacle_id AND r.date_heure = t.date_heure);

INSERT INTO representations (date_heure, places_disponibles, spectacle_id)
SELECT * FROM (SELECT '2026-08-02 18:00:00', 400,
       (SELECT id FROM spectacles WHERE title = 'Festival Rock Belge' LIMIT 1)) AS t
WHERE NOT EXISTS (SELECT 1 FROM representations r WHERE r.spectacle_id = t.spectacle_id AND r.date_heure = t.date_heure);

-- ========== PAIEMENTS DE DEMO (cle naturelle : stripe_payment_intent_id) ==========
INSERT IGNORE INTO paiements (montant, methode, statut, stripe_payment_intent_id, reservation_id, date_paiement)
SELECT 150.00, 'CARD', 'PAYE', 'pi_demo_stromae_001',
     (SELECT r.id FROM reservations r
        JOIN representations rep ON r.representation_id = rep.id
        JOIN spectacles s ON rep.spectacle_id = s.id
        WHERE s.title = 'Multitude Tour' LIMIT 1),
     NOW()
WHERE EXISTS (SELECT 1 FROM reservations r
        JOIN representations rep ON r.representation_id = rep.id
        JOIN spectacles s ON rep.spectacle_id = s.id
        WHERE s.title = 'Multitude Tour' LIMIT 1)
  AND NOT EXISTS (SELECT 1 FROM paiements WHERE stripe_payment_intent_id = 'pi_demo_stromae_001');
