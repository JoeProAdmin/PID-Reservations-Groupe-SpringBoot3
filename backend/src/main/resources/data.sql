INSERT IGNORE INTO users (email, password, nom, prenom, role, created_at)
VALUES (
    'admin@test.com',
    '$2a$10$7QJ8K8x1vX0cF8r8Jc9y6eJxW3G5k8L9mN2pQ3rS4tU5vW6xY7z8a',
    'Admin',
    'Test',
    'ADMIN',
    NOW()
);