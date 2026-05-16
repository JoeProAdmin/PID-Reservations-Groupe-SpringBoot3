package be.icc.pid.reservations.controller;

import be.icc.pid.reservations.entity.Spectacle;
import be.icc.pid.reservations.entity.User;
import be.icc.pid.reservations.exception.BadRequestException;
import be.icc.pid.reservations.repository.UserRepository;
import be.icc.pid.reservations.service.SpectacleService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/spectacles")
public class SpectacleController {

    private final SpectacleService spectacleService;
    private final UserRepository userRepository;

    public SpectacleController(SpectacleService spectacleService,
                               UserRepository userRepository) {
        this.spectacleService = spectacleService;
        this.userRepository = userRepository;
    }

    // =========================
    // GET ALL (paginé + filtres)
    // GET /api/spectacles?page=0&size=10&sort=title,asc&search=stromae&location=Forest
    // =========================
    @GetMapping
    public ResponseEntity<Page<Spectacle>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String location,
            @PageableDefault(size = 9, sort = "date", direction = Sort.Direction.ASC) Pageable pageable
    ) {
        return ResponseEntity.ok(spectacleService.getSpectaclesPaged(search, location, pageable));
    }

    // =========================
    // GET DISTINCT LOCATIONS
    // (alimente le filtre "Lieu" du frontend)
    // =========================
    @GetMapping("/locations")
    public ResponseEntity<List<String>> getLocations() {
        return ResponseEntity.ok(spectacleService.getDistinctLocations());
    }

    // =========================
    // GET BY ID
    // =========================
    @GetMapping("/{id}")
    public ResponseEntity<Spectacle> getById(@PathVariable Long id) {
        return spectacleService.getSpectacleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // =========================
    // CREATE
    // =========================
    @PostMapping
    public ResponseEntity<Spectacle> create(@RequestBody Spectacle spectacle, Authentication auth) {
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new org.springframework.security.access.AccessDeniedException("Authentification requise");
        }

        boolean isAdmin = hasRole(auth, "ROLE_ADMIN");
        boolean isProducteur = hasRole(auth, "ROLE_PRODUCTEUR");
        boolean isPending = hasRole(auth, "ROLE_PRODUCTEUR_PENDING");

        if (!isAdmin && !isProducteur) {
            if (isPending) {
                throw new BadRequestException("Votre compte producteur est en attente de validation par un administrateur.");
            }
            throw new org.springframework.security.access.AccessDeniedException("Seuls un administrateur ou un producteur peuvent créer un spectacle");
        }

        // Auto-assignment : un producteur devient automatiquement le producer du spectacle
        if (isProducteur) {
            User currentUser = userRepository.findByEmail(auth.getName())
                    .orElseThrow(() -> new RuntimeException("Utilisateur connecté introuvable"));
            spectacle.setProducer(currentUser);
        }

        Spectacle createdSpectacle = spectacleService.createSpectacle(spectacle);
        return ResponseEntity.ok(createdSpectacle);
    }

    private boolean hasRole(Authentication auth, String role) {
        return auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(role::equals);
    }

    // =========================
    // UPDATE
    // =========================
    @PutMapping("/{id}")
    public ResponseEntity<Spectacle> update(@PathVariable Long id,
                                            @RequestBody Spectacle updatedSpectacle) {
        Spectacle spectacle = spectacleService.updateSpectacle(id, updatedSpectacle);
        return ResponseEntity.ok(spectacle);
    }

    // =========================
    // DELETE
    // =========================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        spectacleService.deleteSpectacle(id);
        return ResponseEntity.noContent().build();
    }
}
