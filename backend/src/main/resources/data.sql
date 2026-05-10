-- ============================================
-- Donnees de demonstration - PID Reservations
-- ICC 2025-2026
-- Auteur : Abdulrahman SABBAGH (Production)
-- ============================================
-- Ce script insere des donnees de demo pour la soutenance
-- Utilise INSERT IGNORE pour eviter les doublons

-- ========== ADMIN ==========
INSERT IGNORE INTO users (email, password, nom, prenom, role, created_at)
VALUES (
    'admin@test.com',
    '$2a$10$FYxtkUoIUsgq1mt0tGJDK.VKD/3QB1TtKKZ4zxRo3UPGTEY3ce1Dq',
    'Admin',
    'Test',
    'ROLE_ADMIN',
    NOW()
);

-- ========== UTILISATEUR DEMO ==========
INSERT IGNORE INTO users (email, password, nom, prenom, role, created_at)
VALUES (
    'user@test.com',
    '$2a$10$FYxtkUoIUsgq1mt0tGJDK.VKD/3QB1TtKKZ4zxRo3UPGTEY3ce1Dq',
    'Dupont',
    'Jean',
    'ROLE_USER',
    NOW()
);

-- ========== ARTISTES ==========
INSERT IGNORE INTO artists (name, genre, country, description, created_at, updated_at)
VALUES
    ('Stromae', 'Pop/Hip-hop', 'Belgique', 'Artiste belge internationalement reconnu pour ses textes poetiques et ses performances sceniques uniques.', NOW(), NOW()),
    ('Angele', 'Pop', 'Belgique', 'Chanteuse et musicienne belge, connue pour ses tubes comme Balance ton quoi et Tout oublier.', NOW(), NOW()),
    ('Jacques Brel', 'Chanson francaise', 'Belgique', 'Legendaire auteur-compositeur-interprete belge, figure majeure de la chanson francaise.', NOW(), NOW()),
    ('Django Reinhardt', 'Jazz', 'Belgique', 'Guitariste de jazz manouche, considere comme l un des plus grands musiciens du XXe siecle.', NOW(), NOW()),
    ('Plastic Bertrand', 'Punk/Pop', 'Belgique', 'Celebre pour le tube Ca plane pour moi, icone du punk belge des annees 70.', NOW(), NOW());

-- ========== SPECTACLES (lies aux artistes) ==========
-- On utilise des sous-requetes pour lier chaque spectacle a son artiste
INSERT IGNORE INTO spectacles (title, description, date, location, price, artist_id, created_at, updated_at)
VALUES
    ('Multitude Tour', 'La tournee evenement de Stromae - un spectacle visuel et musical exceptionnel avec ses plus grands hits.', '2026-06-15 20:00:00', 'Forest National, Bruxelles', 75.00, (SELECT id FROM artists WHERE name = 'Stromae' LIMIT 1), NOW(), NOW()),
    ('Nonante-Cinq Tour', 'Le concert d Angele dans une atmosphere intimiste et festive avec ses meilleurs titres.', '2026-06-22 20:30:00', 'Ancienne Belgique, Bruxelles', 55.00, (SELECT id FROM artists WHERE name = 'Angele' LIMIT 1), NOW(), NOW()),
    ('Hommage a Brel', 'Soiree hommage au grand Jacques Brel avec orchestre symphonique et artistes invites.', '2026-07-05 19:30:00', 'Palais des Beaux-Arts, Bruxelles', 45.00, (SELECT id FROM artists WHERE name = 'Jacques Brel' LIMIT 1), NOW(), NOW()),
    ('Jazz Manouche Night', 'Soiree speciale jazz manouche en hommage a Django Reinhardt avec les meilleurs musiciens actuels.', '2026-07-12 21:00:00', 'Jazz Station, Saint-Josse', 30.00, (SELECT id FROM artists WHERE name = 'Django Reinhardt' LIMIT 1), NOW(), NOW()),
    ('Festival Rock Belge', 'Une soiree rock et punk avec les classiques du rock belge, ambiance garage et energie pure.', '2026-08-01 18:00:00', 'Botanique, Bruxelles', 25.00, (SELECT id FROM artists WHERE name = 'Plastic Bertrand' LIMIT 1), NOW(), NOW());

-- ========== REPRESENTATIONS ==========
-- Chaque spectacle a 2 representations (dates differentes, places disponibles)
INSERT IGNORE INTO representations (date_heure, places_disponibles, spectacle_id)
VALUES
    ('2026-06-15 20:00:00', 200, (SELECT id FROM spectacles WHERE title = 'Multitude Tour' LIMIT 1)),
    ('2026-06-16 20:00:00', 150, (SELECT id FROM spectacles WHERE title = 'Multitude Tour' LIMIT 1)),
    ('2026-06-22 20:30:00', 120, (SELECT id FROM spectacles WHERE title = 'Nonante-Cinq Tour' LIMIT 1)),
    ('2026-06-23 20:30:00', 100, (SELECT id FROM spectacles WHERE title = 'Nonante-Cinq Tour' LIMIT 1)),
    ('2026-07-05 19:30:00', 300, (SELECT id FROM spectacles WHERE title = 'Hommage a Brel' LIMIT 1)),
    ('2026-07-06 19:30:00', 250, (SELECT id FROM spectacles WHERE title = 'Hommage a Brel' LIMIT 1)),
    ('2026-07-12 21:00:00', 80, (SELECT id FROM spectacles WHERE title = 'Jazz Manouche Night' LIMIT 1)),
    ('2026-07-13 21:00:00', 60, (SELECT id FROM spectacles WHERE title = 'Jazz Manouche Night' LIMIT 1)),
    ('2026-08-01 18:00:00', 500, (SELECT id FROM spectacles WHERE title = 'Festival Rock Belge' LIMIT 1)),
    ('2026-08-02 18:00:00', 400, (SELECT id FROM spectacles WHERE title = 'Festival Rock Belge' LIMIT 1));

-- ========== RESERVATIONS DE DEMO ==========
-- 3 reservations pour l utilisateur demo (user@test.com)
INSERT IGNORE INTO reservations (reservation_date, number_of_seats, status, representation_id, user_id, created_at, updated_at)
VALUES
    (NOW(), 2, 'CONFIRMED',
     (SELECT id FROM representations WHERE spectacle_id = (SELECT id FROM spectacles WHERE title = 'Multitude Tour' LIMIT 1) LIMIT 1),
     (SELECT id FROM users WHERE email = 'user@test.com' LIMIT 1),
     NOW(), NOW()),
    (NOW(), 4, 'CONFIRMED',
     (SELECT id FROM representations WHERE spectacle_id = (SELECT id FROM spectacles WHERE title = 'Hommage a Brel' LIMIT 1) LIMIT 1),
     (SELECT id FROM users WHERE email = 'user@test.com' LIMIT 1),
     NOW(), NOW()),
    (NOW(), 1, 'CREATED',
     (SELECT id FROM representations WHERE spectacle_id = (SELECT id FROM spectacles WHERE title = 'Jazz Manouche Night' LIMIT 1) LIMIT 1),
     (SELECT id FROM users WHERE email = 'user@test.com' LIMIT 1),
     NOW(), NOW());

-- ========== PAIEMENTS DE DEMO ==========
-- 2 paiements : 1 paye (Stromae) + 1 en attente (Brel)
INSERT IGNORE INTO paiements (montant, methode, statut, stripe_payment_intent_id, reservation_id, date_paiement)
VALUES
    (150.00, 'CARD', 'PAYE', 'pi_demo_stromae_001',
     (SELECT r.id FROM reservations r JOIN representations rep ON r.representation_id = rep.id JOIN spectacles s ON rep.spectacle_id = s.id WHERE s.title = 'Multitude Tour' LIMIT 1),
     NOW()),
    (180.00, 'CARD', 'PAYE', 'pi_demo_brel_001',
     (SELECT r.id FROM reservations r JOIN representations rep ON r.representation_id = rep.id JOIN spectacles s ON rep.spectacle_id = s.id WHERE s.title = 'Hommage a Brel' LIMIT 1),
     NOW());