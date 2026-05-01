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
    '$2a$10$7QJ8K8x1vX0cF8r8Jc9y6eJxW3G5k8L9mN2pQ3rS4tU5vW6xY7z8a',
    'Admin',
    'Test',
    'ADMIN',
    NOW()
);

-- ========== UTILISATEUR DEMO ==========
INSERT IGNORE INTO users (email, password, nom, prenom, role, created_at)
VALUES (
    'user@test.com',
    '$2a$10$7QJ8K8x1vX0cF8r8Jc9y6eJxW3G5k8L9mN2pQ3rS4tU5vW6xY7z8a',
    'Dupont',
    'Jean',
    'USER',
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

-- ========== SPECTACLES ==========
INSERT IGNORE INTO spectacles (title, description, date, location, price, created_at, updated_at)
VALUES
    ('Multitude Tour', 'La tournee evenement de Stromae - un spectacle visuel et musical exceptionnel avec ses plus grands hits.', '2026-06-15 20:00:00', 'Forest National, Bruxelles', 75.00, NOW(), NOW()),
    ('Nonante-Cinq Tour', 'Le concert d Angele dans une atmosphere intimiste et festive avec ses meilleurs titres.', '2026-06-22 20:30:00', 'Ancienne Belgique, Bruxelles', 55.00, NOW(), NOW()),
    ('Hommage a Brel', 'Soiree hommage au grand Jacques Brel avec orchestre symphonique et artistes invites.', '2026-07-05 19:30:00', 'Palais des Beaux-Arts, Bruxelles', 45.00, NOW(), NOW()),
    ('Jazz Manouche Night', 'Soiree speciale jazz manouche en hommage a Django Reinhardt avec les meilleurs musiciens actuels.', '2026-07-12 21:00:00', 'Jazz Station, Saint-Josse', 30.00, NOW(), NOW()),
    ('Festival Rock Belge', 'Une soiree rock et punk avec les classiques du rock belge, ambiance garage et energie pure.', '2026-08-01 18:00:00', 'Botanique, Bruxelles', 25.00, NOW(), NOW());