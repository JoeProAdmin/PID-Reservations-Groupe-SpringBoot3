package be.icc.pid.reservations.controller;

import be.icc.pid.reservations.dto.AuthRequest;
import be.icc.pid.reservations.dto.AuthResponse;
import be.icc.pid.reservations.dto.ForgotPasswordRequest;
import be.icc.pid.reservations.dto.ResetPasswordRequest;
import be.icc.pid.reservations.dto.UserCreateDTO;
import be.icc.pid.reservations.entity.PasswordResetToken;
import be.icc.pid.reservations.entity.User;
import be.icc.pid.reservations.repository.PasswordResetTokenRepository;
import be.icc.pid.reservations.repository.UserRepository;
import be.icc.pid.reservations.security.JwtService;
import be.icc.pid.reservations.service.EmailService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private static final long RESET_TOKEN_VALIDITY_HOURS = 1;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;
    private final String frontendUrl;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService,
                          PasswordResetTokenRepository tokenRepository,
                          EmailService emailService,
                          @Value("${app.frontend.url}") String frontendUrl) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.tokenRepository = tokenRepository;
        this.emailService = emailService;
        this.frontendUrl = frontendUrl;
    }

    // ================================================
    // Verifications asynchrones depuis le formulaire d'inscription
    // ================================================
    @GetMapping("/check-login")
    public ResponseEntity<Map<String, Object>> checkLogin(@RequestParam String login) {
        boolean available = login != null
                && !login.trim().isEmpty()
                && !userRepository.existsByLogin(login.trim());
        return ResponseEntity.ok(Map.of("available", available));
    }

    @GetMapping("/check-email")
    public ResponseEntity<Map<String, Object>> checkEmail(@RequestParam String email) {
        boolean available = email != null
                && !email.trim().isEmpty()
                && !userRepository.existsByEmail(email.trim().toLowerCase());
        return ResponseEntity.ok(Map.of("available", available));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UserCreateDTO dto) {

        String email = dto.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email déjà utilisé"));
        }

        String login = dto.getLogin() != null ? dto.getLogin().trim() : null;
        if (login != null && !login.isEmpty() && userRepository.existsByLogin(login)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Login déjà utilisé"));
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setNom(dto.getLastName());
        user.setPrenom(dto.getFirstName());
        user.setLogin(login != null && !login.isEmpty() ? login : null);
        user.setLanguage(dto.getLanguage() != null && !dto.getLanguage().isBlank() ? dto.getLanguage() : "fr");
        user.setRole("ROLE_USER");

        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Utilisateur créé"));
    }

    @PostMapping("/register-producteur")
    public ResponseEntity<?> registerProducteur(@Valid @RequestBody UserCreateDTO dto) {

        String email = dto.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email déjà utilisé"));
        }

        String login = dto.getLogin() != null ? dto.getLogin().trim() : null;
        if (login != null && !login.isEmpty() && userRepository.existsByLogin(login)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Login déjà utilisé"));
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setNom(dto.getLastName());
        user.setPrenom(dto.getFirstName());
        user.setLogin(login != null && !login.isEmpty() ? login : null);
        user.setLanguage(dto.getLanguage() != null && !dto.getLanguage().isBlank() ? dto.getLanguage() : "fr");
        user.setRole("ROLE_PRODUCTEUR_PENDING");

        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "message", "Demande envoyée. Vous pouvez vous connecter, mais vos fonctionnalités producteur seront activées après validation par un administrateur."
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) {

        String email = request.getEmail().trim().toLowerCase();

        Optional<User> userOpt = userRepository.findByEmail(email);

        // Message unique pour user-not-found et mauvais mot de passe (anti-énumération)
        if (userOpt.isEmpty()
                || !passwordEncoder.matches(request.getPassword(), userOpt.get().getPassword())) {
            return ResponseEntity.status(401).body(Map.of(
                    "error", "Email ou mot de passe incorrect"
            ));
        }

        User user = userOpt.get();
        String token = jwtService.generateToken(user);

        return ResponseEntity.ok(
                new AuthResponse(
                        token,
                        user.getRole(),
                        user.getPrenom(),
                        user.getNom(),
                        user.getId(),
                        user.getLanguage()
                )
        );
    }

    @PostMapping("/forgot-password")
    @Transactional
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {

        String email = request.getEmail().trim().toLowerCase();
        Optional<User> userOpt = userRepository.findByEmail(email);

        // Réponse identique qu'on trouve l'user ou non (anti-énumération)
        if (userOpt.isPresent()) {
            User user = userOpt.get();

            tokenRepository.invalidateAllForUser(user);

            String token = UUID.randomUUID().toString();
            PasswordResetToken resetToken = new PasswordResetToken(
                    token,
                    user,
                    LocalDateTime.now().plusHours(RESET_TOKEN_VALIDITY_HOURS)
            );
            tokenRepository.save(resetToken);

            String resetLink = frontendUrl + "/reset-password?token=" + token;
            emailService.sendPasswordResetEmail(user, resetLink);
        }

        return ResponseEntity.ok(Map.of(
                "message", "Si cette adresse est connue, un email de réinitialisation a été envoyé."
        ));
    }

    @PostMapping("/reset-password")
    @Transactional
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {

        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(request.getToken());

        if (tokenOpt.isEmpty() || !tokenOpt.get().isValid()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Token invalide ou expiré."
            ));
        }

        PasswordResetToken resetToken = tokenOpt.get();
        User user = resetToken.getUser();

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        resetToken.setUsed(true);
        tokenRepository.save(resetToken);

        return ResponseEntity.ok(Map.of(
                "message", "Mot de passe réinitialisé avec succès."
        ));
    }
}
