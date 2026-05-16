package be.icc.pid.reservations.controller;

import be.icc.pid.reservations.dto.CommentaireResponse;
import be.icc.pid.reservations.dto.ProducteurStatsResponse;
import be.icc.pid.reservations.entity.CommentaireStatut;
import be.icc.pid.reservations.entity.Spectacle;
import be.icc.pid.reservations.repository.SpectacleRepository;
import be.icc.pid.reservations.repository.UserRepository;
import be.icc.pid.reservations.service.ProducteurService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/producteur")
public class ProducteurController {

    private final ProducteurService producteurService;
    private final SpectacleRepository spectacleRepository;
    private final UserRepository userRepository;

    public ProducteurController(ProducteurService producteurService,
                                SpectacleRepository spectacleRepository,
                                UserRepository userRepository) {
        this.producteurService = producteurService;
        this.spectacleRepository = spectacleRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/spectacles")
    public ResponseEntity<List<Spectacle>> getMySpectacles(Authentication auth) {
        requireProducteur(auth);
        Long userId = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"))
                .getId();
        return ResponseEntity.ok(spectacleRepository.findByProducerIdOrderByDateDesc(userId));
    }

    @GetMapping("/stats")
    public ResponseEntity<ProducteurStatsResponse> getStats(Authentication auth) {
        requireProducteur(auth);
        return ResponseEntity.ok(producteurService.getStats(auth.getName()));
    }

    @GetMapping("/commentaires")
    public ResponseEntity<List<CommentaireResponse>> getCommentaires(Authentication auth) {
        requireProducteur(auth);
        return ResponseEntity.ok(producteurService.getCommentairesForProducer(auth.getName()));
    }

    @PutMapping("/commentaires/{id}/statut")
    public ResponseEntity<CommentaireResponse> moderate(@PathVariable Long id,
                                                        @RequestBody Map<String, String> body,
                                                        Authentication auth) {
        requireProducteur(auth);
        String statutStr = body.get("statut");
        if (statutStr == null) {
            return ResponseEntity.badRequest().build();
        }
        CommentaireStatut statut = CommentaireStatut.valueOf(statutStr.toUpperCase());
        return ResponseEntity.ok(
                producteurService.moderateCommentaire(auth.getName(), id, statut)
        );
    }

    @DeleteMapping("/commentaires/{id}")
    public ResponseEntity<Void> deleteCommentaire(@PathVariable Long id, Authentication auth) {
        requireProducteur(auth);
        producteurService.deleteCommentaire(auth.getName(), id);
        return ResponseEntity.noContent().build();
    }

    private void requireProducteur(Authentication auth) {
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new AccessDeniedException("Authentification requise");
        }
        boolean ok = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(r -> "ROLE_PRODUCTEUR".equals(r) || "ROLE_ADMIN".equals(r));
        if (!ok) {
            boolean isPending = auth.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .anyMatch("ROLE_PRODUCTEUR_PENDING"::equals);
            if (isPending) {
                throw new AccessDeniedException("Votre compte producteur est en attente de validation");
            }
            throw new AccessDeniedException("Accès réservé aux producteurs");
        }
    }
}
