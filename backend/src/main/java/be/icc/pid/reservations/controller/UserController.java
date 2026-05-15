package be.icc.pid.reservations.controller;

import be.icc.pid.reservations.dto.UserCreateDTO;
import be.icc.pid.reservations.dto.UserResponseDTO;
import be.icc.pid.reservations.dto.UserUpdateDTO;
import be.icc.pid.reservations.entity.User;
import be.icc.pid.reservations.exception.BadRequestException;
import be.icc.pid.reservations.exception.ResourceNotFoundException;
import be.icc.pid.reservations.repository.UserRepository;
import be.icc.pid.reservations.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private static final Set<String> ALLOWED_ROLES = Set.of(
            "ROLE_USER",
            "ROLE_PRODUCTEUR",
            "ROLE_PRODUCTEUR_PENDING",
            "ROLE_ADMIN"
    );

    private final UserService userService;
    private final UserRepository userRepository;

    public UserController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PostMapping
    public ResponseEntity<UserResponseDTO> createUser(@Valid @RequestBody UserCreateDTO dto) {
        UserResponseDTO createdUser = userService.createUser(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(@PathVariable Long id,
                                                      @Valid @RequestBody UserUpdateDTO dto) {
        return ResponseEntity.ok(userService.updateUser(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // ================================================
    // ADMIN : changer le role d'un utilisateur
    // PUT /api/users/{id}/role  body: { "role": "ROLE_PRODUCTEUR" }
    // ================================================
    @PutMapping("/{id}/role")
    public ResponseEntity<UserResponseDTO> changeRole(@PathVariable Long id,
                                                      @RequestBody Map<String, String> body,
                                                      Authentication auth) {
        requireAdmin(auth);

        String newRole = body.get("role");
        if (newRole == null || !ALLOWED_ROLES.contains(newRole)) {
            throw new BadRequestException("Rôle invalide. Valeurs autorisées : " + ALLOWED_ROLES);
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable : " + id));

        // Empeche un admin de se retrograder lui-meme (eviterait de perdre tout acces admin)
        if (auth != null && auth.getName() != null
                && auth.getName().equalsIgnoreCase(user.getEmail())
                && !"ROLE_ADMIN".equals(newRole)) {
            throw new BadRequestException("Vous ne pouvez pas modifier votre propre rôle administrateur");
        }

        user.setRole(newRole);
        userRepository.save(user);

        return ResponseEntity.ok(new UserResponseDTO(
                user.getId(), user.getPrenom(), user.getNom(), user.getEmail(), user.getRole()
        ));
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