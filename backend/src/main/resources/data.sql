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
SELECT 'Stromae', 'Pop/Hip-hop', 'Belgique',
       'Artiste belge internationalement reconnu pour ses textes poetiques et ses performances sceniques uniques.',
       NOW(), NOW()
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM artists WHERE name = 'Stromae');

INSERT INTO artists (name, genre, country, description, created_at, updated_at)
SELECT 'Angele', 'Pop', 'Belgique',
       'Chanteuse et musicienne belge, connue pour ses tubes comme Balance ton quoi et Tout oublier.',
       NOW(), NOW()
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM artists WHERE name = 'Angele');

INSERT INTO artists (name, genre, country, description, created_at, updated_at)
SELECT 'Jacques Brel', 'Chanson francaise', 'Belgique',
       'Legendaire auteur-compositeur-interprete belge, figure majeure de la chanson francaise.',
       NOW(), NOW()
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM artists WHERE name = 'Jacques Brel');

INSERT INTO artists (name, genre, country, description, created_at, updated_at)
SELECT 'Django Reinhardt', 'Jazz', 'Belgique',
       'Guitariste de jazz manouche, considere comme l un des plus grands musiciens du XXe siecle.',
       NOW(), NOW()
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM artists WHERE name = 'Django Reinhardt');

INSERT INTO artists (name, genre, country, description, created_at, updated_at)
SELECT 'Plastic Bertrand', 'Punk/Pop', 'Belgique',
       'Celebre pour le tube Ca plane pour moi, icone du punk belge des annees 70.',
       NOW(), NOW()
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM artists WHERE name = 'Plastic Bertrand');

-- ========== SPECTACLES (cle naturelle : title) ==========
INSERT INTO spectacles (title, description, date, location, price, artist_id, created_at, updated_at)
SELECT 'Multitude Tour',
       'La tournee evenement de Stromae - un spectacle visuel et musical exceptionnel avec ses plus grands hits.',
       '2026-06-15 20:00:00', 'Forest National, Bruxelles', 75.00,
       (SELECT id FROM artists WHERE name = 'Stromae' LIMIT 1),
       NOW(), NOW()
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM spectacles WHERE title = 'Multitude Tour');

INSERT INTO spectacles (title, description, date, location, price, artist_id, created_at, updated_at)
SELECT 'Nonante-Cinq Tour',
       'Le concert d Angele dans une atmosphere intimiste et festive avec ses meilleurs titres.',
       '2026-06-22 20:30:00', 'Ancienne Belgique, Bruxelles', 55.00,
       (SELECT id FROM artists WHERE name = 'Angele' LIMIT 1),
       NOW(), NOW()
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM spectacles WHERE title = 'Nonante-Cinq Tour');

INSERT INTO spectacles (title, description, date, location, price, artist_id, created_at, updated_at)
SELECT 'Hommage a Brel',
       'Soiree hommage au grand Jacques Brel avec orchestre symphonique et artistes invites.',
       '2026-07-05 19:30:00', 'Palais des Beaux-Arts, Bruxelles', 45.00,
       (SELECT id FROM artists WHERE name = 'Jacques Brel' LIMIT 1),
       NOW(), NOW()
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM spectacles WHERE title = 'Hommage a Brel');

INSERT INTO spectacles (title, description, date, location, price, artist_id, created_at, updated_at)
SELECT 'Jazz Manouche Night',
       'Soiree speciale jazz manouche en hommage a Django Reinhardt avec les meilleurs musiciens actuels.',
       '2026-07-12 21:00:00', 'Jazz Station, Saint-Josse', 30.00,
       (SELECT id FROM artists WHERE name = 'Django Reinhardt' LIMIT 1),
       NOW(), NOW()
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM spectacles WHERE title = 'Jazz Manouche Night');

INSERT INTO spectacles (title, description, date, location, price, artist_id, created_at, updated_at)
SELECT 'Festival Rock Belge',
       'Une soiree rock et punk avec les classiques du rock belge, ambiance garage et energie pure.',
       '2026-08-01 18:00:00', 'Botanique, Bruxelles', 25.00,
       (SELECT id FROM artists WHERE name = 'Plastic Bertrand' LIMIT 1),
       NOW(), NOW()
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM spectacles WHERE title = 'Festival Rock Belge');

-- ========== REPRESENTATIONS (cle naturelle : spectacle_id + date_heure) ==========
INSERT INTO representations (date_heure, places_disponibles, spectacle_id)
SELECT '2026-06-15 20:00:00', 200, (SELECT id FROM spectacles WHERE title = 'Multitude Tour' LIMIT 1)
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM representations
    WHERE spectacle_id = (SELECT id FROM spectacles WHERE title = 'Multitude Tour' LIMIT 1)
      AND date_heure = '2026-06-15 20:00:00');

INSERT INTO representations (date_heure, places_disponibles, spectacle_id)
SELECT '2026-06-16 20:00:00', 150, (SELECT id FROM spectacles WHERE title = 'Multitude Tour' LIMIT 1)
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM representations
    WHERE spectacle_id = (SELECT id FROM spectacles WHERE title = 'Multitude Tour' LIMIT 1)
      AND date_heure = '2026-06-16 20:00:00');

INSERT INTO representations (date_heure, places_disponibles, spectacle_id)
SELECT '2026-06-22 20:30:00', 120, (SELECT id FROM spectacles WHERE title = 'Nonante-Cinq Tour' LIMIT 1)
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM representations
    WHERE spectacle_id = (SELECT id FROM spectacles WHERE title = 'Nonante-Cinq Tour' LIMIT 1)
      AND date_heure = '2026-06-22 20:30:00');

INSERT INTO representations (date_heure, places_disponibles, spectacle_id)
SELECT '2026-06-23 20:30:00', 100, (SELECT id FROM spectacles WHERE title = 'Nonante-Cinq Tour' LIMIT 1)
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM representations
    WHERE spectacle_id = (SELECT id FROM spectacles WHERE title = 'Nonante-Cinq Tour' LIMIT 1)
      AND date_heure = '2026-06-23 20:30:00');

INSERT INTO representations (date_heure, places_disponibles, spectacle_id)
SELECT '2026-07-05 19:30:00', 300, (SELECT id FROM spectacles WHERE title = 'Hommage a Brel' LIMIT 1)
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM representations
    WHERE spectacle_id = (SELECT id FROM spectacles WHERE title = 'Hommage a Brel' LIMIT 1)
      AND date_heure = '2026-07-05 19:30:00');

INSERT INTO representations (date_heure, places_disponibles, spectacle_id)
SELECT '2026-07-06 19:30:00', 250, (SELECT id FROM spectacles WHERE title = 'Hommage a Brel' LIMIT 1)
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM representations
    WHERE spectacle_id = (SELECT id FROM spectacles WHERE title = 'Hommage a Brel' LIMIT 1)
      AND date_heure = '2026-07-06 19:30:00');

INSERT INTO representations (date_heure, places_disponibles, spectacle_id)
SELECT '2026-07-12 21:00:00', 80, (SELECT id FROM spectacles WHERE title = 'Jazz Manouche Night' LIMIT 1)
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM representations
    WHERE spectacle_id = (SELECT id FROM spectacles WHERE title = 'Jazz Manouche Night' LIMIT 1)
      AND date_heure = '2026-07-12 21:00:00');

INSERT INTO representations (date_heure, places_disponibles, spectacle_id)
SELECT '2026-07-13 21:00:00', 60, (SELECT id FROM spectacles WHERE title = 'Jazz Manouche Night' LIMIT 1)
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM representations
    WHERE spectacle_id = (SELECT id FROM spectacles WHERE title = 'Jazz Manouche Night' LIMIT 1)
      AND date_heure = '2026-07-13 21:00:00');

INSERT INTO representations (date_heure, places_disponibles, spectacle_id)
SELECT '2026-08-01 18:00:00', 500, (SELECT id FROM spectacles WHERE title = 'Festival Rock Belge' LIMIT 1)
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM representations
    WHERE spectacle_id = (SELECT id FROM spectacles WHERE title = 'Festival Rock Belge' LIMIT 1)
      AND date_heure = '2026-08-01 18:00:00');

INSERT INTO representations (date_heure, places_disponibles, spectacle_id)
SELECT '2026-08-02 18:00:00', 400, (SELECT id FROM spectacles WHERE title = 'Festival Rock Belge' LIMIT 1)
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM representations
    WHERE spectacle_id = (SELECT id FROM spectacles WHERE title = 'Festival Rock Belge' LIMIT 1)
      AND date_heure = '2026-08-02 18:00:00');
