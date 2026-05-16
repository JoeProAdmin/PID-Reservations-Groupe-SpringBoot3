package be.icc.pid.reservations.controller;

import be.icc.pid.reservations.dto.UserResponseDTO;
import be.icc.pid.reservations.entity.User;
import be.icc.pid.reservations.repository.UserRepository;
import be.icc.pid.reservations.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/producteurs")
public class AdminProducteurController {

    private final UserRepository userRepository;
    private final EmailService emailService;

    public AdminProducteurController(UserRepository userRepository,
                                     EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    @GetMapping("/pending")
    public ResponseEntity<List<UserResponseDTO>> getPending(Authentication auth) {
        requireAdmin(auth);
        List<UserResponseDTO> pending = userRepository.findAll().stream()
                .filter(u -> "ROLE_PRODUCTEUR_PENDING".equals(u.getRole()))
                .map(this::toDto)
                .toList();
        return ResponseEntity.ok(pending);
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getApproved(Authentication auth) {
        requireAdmin(auth);
        List<UserResponseDTO> approved = userRepository.findAll().stream()
                .filter(u -> "ROLE_PRODUCTEUR".equals(u.getRole()))
                .map(this::toDto)
                .toList();
        return ResponseEntity.ok(approved);
    }

    @PutMapping("/{userId}/approve")
    public ResponseEntity<?> approve(@PathVariable Long userId, Authentication auth) {
        requireAdmin(auth);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        if (!"ROLE_PRODUCTEUR_PENDING".equals(user.getRole())) {
            return ResponseEntity.badRequest().body(Map.of("error", "L'utilisateur n'est pas en attente de validation producteur."));
        }
        user.setRole("ROLE_PRODUCTEUR");
        userRepository.save(user);

        // Notification email au producteur
        emailService.sendProducerApprovalEmail(user);

        return ResponseEntity.ok(Map.of("message", "Producteur approuvé. Email de notification envoyé."));
    }

    @PutMapping("/{userId}/reject")
    public ResponseEntity<?> reject(@PathVariable Long userId, Authentication auth) {
        requireAdmin(auth);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        if (!"ROLE_PRODUCTEUR_PENDING".equals(user.getRole())) {
            return ResponseEntity.badRequest().body(Map.of("error", "L'utilisateur n'est pas en attente de validation."));
        }
        user.setRole("ROLE_USER");
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Demande rejetée. L'utilisateur garde un compte standard."));
    }

    private UserResponseDTO toDto(User u) {
        return new UserResponseDTO(u.getId(), u.getPrenom(), u.getNom(), u.getEmail(), u.getRole());
    }

    private void requireAdmin(Authentication auth) {
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new AccessDeniedException("Authentification requise");
        }
        boolean isAdmin = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch("ROLE_ADMIN"::equals);
        if (!isAdmin) {
            throw new AccessDeniedException("Droits administrateur requis");
        }
    }
}
