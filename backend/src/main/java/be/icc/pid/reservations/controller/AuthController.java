package be.icc.pid.reservations.controller;

import be.icc.pid.reservations.dto.AuthRequest;
import be.icc.pid.reservations.dto.UserCreateDTO;
import be.icc.pid.reservations.entity.User;
import be.icc.pid.reservations.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
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
            throw new RuntimeException("Mot de passe incorrect");
        }

        return ResponseEntity.ok("Login OK");
    }
}