-- ============================================
-- Donnees de demonstration - PID Reservations
-- ICC 2025-2026
-- ============================================
-- Idempotent : chaque INSERT est protege par WHERE NOT EXISTS
-- (cle naturelle), donc rejouer ce script ne cree pas de doublons.
-- Mot de passe pour TOUS les comptes seedes : "password" (BCrypt)

-- ========== UTILISATEURS ==========
-- email est deja UNIQUE en base, INSERT IGNORE suffit
INSERT IGNORE INTO users (email, password, nom, prenom, role, login, language)
VALUES (
    'admin@test.com',
    '$2a$10$FYxtkUoIUsgq1mt0tGJDK.VKD/3QB1TtKKZ4zxRo3UPGTEY3ce1Dq',
    'Admin', 'Test', 'ROLE_ADMIN', 'admin', 'fr'
);

INSERT IGNORE INTO users (email, password, nom, prenom, role, login, language)
VALUES (
    'user@test.com',
    '$2a$10$FYxtkUoIUsgq1mt0tGJDK.VKD/3QB1TtKKZ4zxRo3UPGTEY3ce1Dq',
    'Dupont', 'Jean', 'ROLE_USER', 'jean.dupont', 'fr'
);

INSERT IGNORE INTO users (email, password, nom, prenom, role, login, language)
VALUES (
    'sophie@test.com',
    '$2a$10$FYxtkUoIUsgq1mt0tGJDK.VKD/3QB1TtKKZ4zxRo3UPGTEY3ce1Dq',
    'Martin', 'Sophie', 'ROLE_USER', 'sophie.martin', 'fr'
);

-- Producteur valide (peut creer des spectacles)
INSERT IGNORE INTO users (email, password, nom, prenom, role, login, language)
VALUES (
    'producteur@test.com',
    '$2a$10$FYxtkUoIUsgq1mt0tGJDK.VKD/3QB1TtKKZ4zxRo3UPGTEY3ce1Dq',
    'Producer', 'Pierre', 'ROLE_PRODUCTEUR', 'pierre.prod', 'fr'
);

-- Producteur en attente de validation admin (visible dans le dashboard admin)
INSERT IGNORE INTO users (email, password, nom, prenom, role, login, language)
VALUES (
    'pending@test.com',
    '$2a$10$FYxtkUoIUsgq1mt0tGJDK.VKD/3QB1TtKKZ4zxRo3UPGTEY3ce1Dq',
    'Attente', 'Marie', 'ROLE_PRODUCTEUR_PENDING', 'marie.attente', 'fr'
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

-- Spectacle cree par le producteur Pierre (avec producer_id)
INSERT INTO spectacles (title, description, date, location, price, artist_id, producer_id, created_at, updated_at)
SELECT 'Concert acoustique prive',
       'Soiree intimiste organisee par Pierre Producteur, programme exclusif autour de la chanson belge.',
       '2026-09-15 20:00:00', 'Theatre Marni, Bruxelles', 35.00,
       (SELECT id FROM artists WHERE name = 'Angele' LIMIT 1),
       (SELECT id FROM users WHERE email = 'producteur@test.com' LIMIT 1),
       NOW(), NOW()
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM spectacles WHERE title = 'Concert acoustique prive');

-- ========== ASSIGNATION PRODUCTEUR aux spectacles existants ==========
-- Pierre devient aussi producteur de "Multitude Tour" et "Nonante-Cinq Tour"
-- (idempotent : ne change que si producer_id est encore NULL)
UPDATE spectacles
SET producer_id = (SELECT id FROM users WHERE email = 'producteur@test.com' LIMIT 1)
WHERE title IN ('Multitude Tour', 'Nonante-Cinq Tour')
  AND producer_id IS NULL;

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

INSERT INTO representations (date_heure, places_disponibles, spectacle_id)
SELECT '2026-09-15 20:00:00', 90, (SELECT id FROM spectacles WHERE title = 'Concert acoustique prive' LIMIT 1)
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM representations
    WHERE spectacle_id = (SELECT id FROM spectacles WHERE title = 'Concert acoustique prive' LIMIT 1)
      AND date_heure = '2026-09-15 20:00:00');

-- ========== COMMENTAIRES (cle naturelle : user_id + spectacle_id, contrainte UNIQUE en base) ==========
-- Permet de demontrer la modulation de la note moyenne et la moderation
INSERT INTO commentaires (contenu, note, statut, user_id, spectacle_id, created_at)
SELECT 'Quel concert incroyable ! Stromae a vraiment livre une performance exceptionnelle. La mise en scene etait magnifique.',
       5, 'PUBLIE',
       (SELECT id FROM users WHERE email = 'user@test.com' LIMIT 1),
       (SELECT id FROM spectacles WHERE title = 'Multitude Tour' LIMIT 1),
       NOW()
FROM DUAL WHERE NOT EXISTS (
    SELECT 1 FROM commentaires
    WHERE user_id = (SELECT id FROM users WHERE email = 'user@test.com' LIMIT 1)
      AND spectacle_id = (SELECT id FROM spectacles WHERE title = 'Multitude Tour' LIMIT 1)
);

INSERT INTO commentaires (contenu, note, statut, user_id, spectacle_id, created_at)
SELECT 'Tres belle ambiance, salle pleine et public en feu. Je recommande sans hesiter.',
       4, 'PUBLIE',
       (SELECT id FROM users WHERE email = 'sophie@test.com' LIMIT 1),
       (SELECT id FROM spectacles WHERE title = 'Multitude Tour' LIMIT 1),
       NOW()
FROM DUAL WHERE NOT EXISTS (
    SELECT 1 FROM commentaires
    WHERE user_id = (SELECT id FROM users WHERE email = 'sophie@test.com' LIMIT 1)
      AND spectacle_id = (SELECT id FROM spectacles WHERE title = 'Multitude Tour' LIMIT 1)
);

INSERT INTO commentaires (contenu, note, statut, user_id, spectacle_id, created_at)
SELECT 'Un hommage poignant et emouvant. L orchestre symphonique etait parfait.',
       5, 'PUBLIE',
       (SELECT id FROM users WHERE email = 'user@test.com' LIMIT 1),
       (SELECT id FROM spectacles WHERE title = 'Hommage a Brel' LIMIT 1),
       NOW()
FROM DUAL WHERE NOT EXISTS (
    SELECT 1 FROM commentaires
    WHERE user_id = (SELECT id FROM users WHERE email = 'user@test.com' LIMIT 1)
      AND spectacle_id = (SELECT id FROM spectacles WHERE title = 'Hommage a Brel' LIMIT 1)
);

INSERT INTO commentaires (contenu, note, statut, user_id, spectacle_id, created_at)
SELECT 'Bonne soiree mais le son etait un peu trop fort par moments.',
       3, 'PUBLIE',
       (SELECT id FROM users WHERE email = 'sophie@test.com' LIMIT 1),
       (SELECT id FROM spectacles WHERE title = 'Jazz Manouche Night' LIMIT 1),
       NOW()
FROM DUAL WHERE NOT EXISTS (
    SELECT 1 FROM commentaires
    WHERE user_id = (SELECT id FROM users WHERE email = 'sophie@test.com' LIMIT 1)
      AND spectacle_id = (SELECT id FROM spectacles WHERE title = 'Jazz Manouche Night' LIMIT 1)
);

-- Commentaire deja rejete par moderation (pour demontrer le statut REJETE dans le dashboard admin)
INSERT INTO commentaires (contenu, note, statut, user_id, spectacle_id, created_at)
SELECT 'Spam : achetez moins cher sur autresite.com',
       1, 'REJETE',
       (SELECT id FROM users WHERE email = 'sophie@test.com' LIMIT 1),
       (SELECT id FROM spectacles WHERE title = 'Festival Rock Belge' LIMIT 1),
       NOW()
FROM DUAL WHERE NOT EXISTS (
    SELECT 1 FROM commentaires
    WHERE user_id = (SELECT id FROM users WHERE email = 'sophie@test.com' LIMIT 1)
      AND spectacle_id = (SELECT id FROM spectacles WHERE title = 'Festival Rock Belge' LIMIT 1)
);
