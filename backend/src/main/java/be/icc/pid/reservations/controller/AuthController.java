package be.icc.pid.reservations.controller;

import be.icc.pid.reservations.dto.AuthRequest;
import be.icc.pid.reservations.dto.AuthResponse;
import be.icc.pid.reservations.entity.User;
import be.icc.pid.reservations.repository.UserRepository;
import be.icc.pid.reservations.security.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
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
    public ResponseEntity<?> register(@RequestBody AuthRequest request) {

        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body("Email déjà utilisé");
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setNom(request.getNom());
        user.setPrenom(request.getPrenom());
        user.setRole("USER");

        userRepository.save(user);

        return ResponseEntity.ok("Utilisateur créé");
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {

        String email = request.getEmail().trim().toLowerCase();

        System.out.println("EMAIL NORMALISE = [" + email + "]");

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Mot de passe incorrect");
        }

        String token = jwtService.generateToken(user.getEmail());

        return new AuthResponse(token);
    }
}