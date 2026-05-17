package be.icc.pid.reservations.controller;

import be.icc.pid.reservations.dto.AuthRequest;
import be.icc.pid.reservations.dto.AuthResponse;
import be.icc.pid.reservations.dto.UserCreateDTO;
import be.icc.pid.reservations.entity.User;
import be.icc.pid.reservations.repository.UserRepository;
import be.icc.pid.reservations.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class AuthControllerTest {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private JwtService jwtService;
    private AuthController authController;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        passwordEncoder = mock(PasswordEncoder.class);
        jwtService = mock(JwtService.class);
        authController = new AuthController(userRepository, passwordEncoder, jwtService);
    }

    @Test
    void shouldRefuseRegisterWhenEmailAlreadyExists() {
        UserCreateDTO dto = new UserCreateDTO();
        dto.setEmail("test@example.com");
        dto.setPassword("secret123");
        dto.setFirstName("Jean");
        dto.setLastName("Dupont");

        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        ResponseEntity<?> response = authController.register(dto);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Email déjà utilisé", response.getBody());
    }

    @Test
    void shouldRegisterUserWithRoleUser() {
        UserCreateDTO dto = new UserCreateDTO();
        dto.setEmail(" TEST@EXAMPLE.COM ");
        dto.setPassword("secret123");
        dto.setFirstName("Jean");
        dto.setLastName("Dupont");

        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("secret123")).thenReturn("encoded-password");

        ResponseEntity<?> response = authController.register(dto);

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());

        User savedUser = userCaptor.getValue();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Utilisateur créé", response.getBody());
        assertEquals("test@example.com", savedUser.getEmail());
        assertEquals("encoded-password", savedUser.getPassword());
        assertEquals("Jean", savedUser.getPrenom());
        assertEquals("Dupont", savedUser.getNom());
        assertEquals("ROLE_USER", savedUser.getRole());
    }

    @Test
    void shouldReturnUnauthorizedWhenPasswordIsInvalid() {
        AuthRequest request = new AuthRequest();
        request.setEmail("test@example.com");
        request.setPassword("wrong-password");

        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword("encoded-password");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong-password", "encoded-password")).thenReturn(false);

        ResponseEntity<?> response = authController.login(request);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Mot de passe incorrect", response.getBody());
    }

    @Test
    void shouldReturnAuthResponseWhenLoginSucceeds() {
        AuthRequest request = new AuthRequest();
        request.setEmail(" TEST@EXAMPLE.COM ");
        request.setPassword("secret123");

        User user = new User();
        user.setId(5L);
        user.setEmail("test@example.com");
        user.setPassword("encoded-password");
        user.setRole("ROLE_ADMIN");
        user.setPrenom("Jean");
        user.setNom("Dupont");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("secret123", "encoded-password")).thenReturn(true);
        when(jwtService.generateToken(user)).thenReturn("jwt-token");

        ResponseEntity<?> response = authController.login(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertInstanceOf(AuthResponse.class, response.getBody());

        AuthResponse authResponse = (AuthResponse) response.getBody();
        assertNotNull(authResponse);
        assertEquals("jwt-token", authResponse.getToken());
        assertEquals("ROLE_ADMIN", authResponse.getRole());
        assertEquals("Jean", authResponse.getPrenom());
        assertEquals("Dupont", authResponse.getNom());
        assertEquals(5L, authResponse.getId());

        verify(jwtService).generateToken(any(User.class));
    }
}
