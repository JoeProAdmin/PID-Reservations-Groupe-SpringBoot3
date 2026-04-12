package be.icc.pid.reservations.controller;

import be.icc.pid.reservations.dto.AuthRequest;
import be.icc.pid.reservations.dto.AuthResponse;
import be.icc.pid.reservations.dto.UserCreateDTO;
import be.icc.pid.reservations.entity.User;
import be.icc.pid.reservations.repository.UserRepository;
import be.icc.pid.reservations.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    public AuthController(UserRepository userRepository,
                          JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    // ========================
    // REGISTER
    // ========================
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UserCreateDTO dto) {

        String email = dto.getEmail().trim().toLowerCase();

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body("Email déjà utilisé");
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(dto.getPassword()); // TEMPORAIRE
        user.setNom(dto.getLastname());
        user.setPrenom(dto.getFirstname());
        user.setRole("USER");

        userRepository.save(user);

        return ResponseEntity.ok("Utilisateur créé");
    }

    // ========================
    // LOGIN PROPRE
    // ========================
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) {

        String email = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return ResponseEntity.status(401).body("Email ou mot de passe incorrect");
        }

        // TEMPORAIRE : password ignoré pour le moment
        String token = jwtService.generateToken(user.getEmail());

        return ResponseEntity.ok(new AuthResponse(token, user.getRole()));
    }
}