package be.icc.pid.reservations.controller;

import be.icc.pid.reservations.dto.CommentaireRequest;
import be.icc.pid.reservations.dto.CommentaireResponse;
import be.icc.pid.reservations.entity.CommentaireStatut;
import be.icc.pid.reservations.service.CommentaireService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class CommentaireController {

    private final CommentaireService commentaireService;

    public CommentaireController(CommentaireService commentaireService) {
        this.commentaireService = commentaireService;
    }

    // =========================
    // PUBLIC : commentaires publiés d'un spectacle
    // =========================
    @GetMapping("/api/spectacles/{spectacleId}/commentaires")
    public ResponseEntity<List<CommentaireResponse>> getForSpectacle(@PathVariable Long spectacleId) {
        return ResponseEntity.ok(commentaireService.getPublishedForSpectacle(spectacleId));
    }

    // =========================
    // USER : créer un commentaire
    // =========================
    @PostMapping("/api/spectacles/{spectacleId}/commentaires")
    public ResponseEntity<CommentaireResponse> create(@PathVariable Long spectacleId,
                                                      @Valid @RequestBody CommentaireRequest request,
                                                      Authentication authentication) {
        requireAuth(authentication);
        return ResponseEntity.ok(
                commentaireService.create(spectacleId, authentication.getName(), request)
        );
    }

    // =========================
    // USER : modifier son propre commentaire
    // =========================
    @PutMapping("/api/commentaires/{id}")
    public ResponseEntity<CommentaireResponse> update(@PathVariable Long id,
                                                     @Valid @RequestBody CommentaireRequest request,
                                                     Authentication authentication) {
        requireAuth(authentication);
        return ResponseEntity.ok(
                commentaireService.update(id, authentication.getName(), request)
        );
    }

    // =========================
    // USER ou ADMIN : supprimer
    // =========================
    @DeleteMapping("/api/commentaires/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
        requireAuth(authentication);
        commentaireService.delete(id, authentication.getName(), isAdmin(authentication));
        return ResponseEntity.noContent().build();
    }

    // =========================
    // ADMIN : voir tous les commentaires (modération)
    // =========================
    @GetMapping("/api/commentaires")
    public ResponseEntity<List<CommentaireResponse>> getAll(Authentication authentication) {
        requireAdmin(authentication);
        return ResponseEntity.ok(commentaireService.getAll());
    }

    // =========================
    // ADMIN : changer le statut (PUBLIE / REJETE)
    // =========================
    @PutMapping("/api/commentaires/{id}/statut")
    public ResponseEntity<CommentaireResponse> changeStatut(@PathVariable Long id,
                                                            @RequestBody Map<String, String> body,
                                                            Authentication authentication) {
        requireAdmin(authentication);
        String statutStr = body.get("statut");
        if (statutStr == null) {
            return ResponseEntity.badRequest().build();
        }
        CommentaireStatut statut = CommentaireStatut.valueOf(statutStr.toUpperCase());
        return ResponseEntity.ok(commentaireService.changeStatut(id, statut));
    }

    private void requireAuth(Authentication auth) {
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new AccessDeniedException("Authentification requise");
        }
    }

    private void requireAdmin(Authentication auth) {
        requireAuth(auth);
        if (!isAdmin(auth)) {
            throw new AccessDeniedException("Droits administrateur requis");
        }
    }

    private boolean isAdmin(Authentication auth) {
        if (auth == null) return false;
        return auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch("ROLE_ADMIN"::equals);
    }
}
