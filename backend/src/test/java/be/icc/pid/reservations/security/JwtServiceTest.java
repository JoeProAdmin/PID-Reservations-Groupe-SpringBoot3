package be.icc.pid.reservations.security;

import be.icc.pid.reservations.entity.User;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JwtServiceTest {

    private final JwtService jwtService = new JwtService();

    @Test
    void shouldGenerateTokenAndExtractUsername() {
        User user = new User();
        user.setEmail("test@example.com");
        user.setRole("ROLE_USER");

        String token = jwtService.generateToken(user);

        assertEquals("test@example.com", jwtService.extractUsername(token));
        assertTrue(jwtService.isTokenValid(token, "test@example.com"));
    }

    @Test
    void shouldRejectTokenForDifferentUsername() {
        User user = new User();
        user.setEmail("test@example.com");
        user.setRole("ROLE_ADMIN");

        String token = jwtService.generateToken(user);

        assertTrue(!jwtService.isTokenValid(token, "other@example.com"));
    }
}
