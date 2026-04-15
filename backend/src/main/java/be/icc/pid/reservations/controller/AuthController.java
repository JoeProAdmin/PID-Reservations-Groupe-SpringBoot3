package be.icc.pid.reservations.controller;

import be.icc.pid.reservations.dto.AuthRequest;
import be.icc.pid.reservations.dto.AuthResponse;
import be.icc.pid.reservations.dto.UserCreateDTO;
import be.icc.pid.reservations.entity.User;
import be.icc.pid.reservations.repository.UserRepository;
import be.icc.pid.reservations.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UserCreateDTO dto) {

        String email = dto.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body("Email déjà utilisé");
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setNom(dto.getLastName());
        user.setPrenom(dto.getFirstName());

        // IMPORTANT : ROLE FIXE
        user.setRole("ROLE_USER");

        userRepository.save(user);

        return ResponseEntity.ok("Utilisateur créé");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) {

        String email = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body("Mot de passe incorrect");
        }

        String token = jwtService.generateToken(user);

        return ResponseEntity.ok(
                new AuthResponse(
                        token,
                        user.getRole(),
                        user.getPrenom(),
                        user.getNom(),
                        user.getId()
                )
        );
    }
}