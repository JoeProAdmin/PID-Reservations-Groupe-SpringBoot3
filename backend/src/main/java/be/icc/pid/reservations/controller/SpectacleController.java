package be.icc.pid.reservations.controller;

import be.icc.pid.reservations.entity.Spectacle;
import be.icc.pid.reservations.repository.SpectacleRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/spectacles")
public class SpectacleController {

    private final SpectacleRepository spectacleRepository;

    public SpectacleController(SpectacleRepository spectacleRepository) {
        this.spectacleRepository = spectacleRepository;
    }

    @GetMapping
    public ResponseEntity<List<Spectacle>> getAllSpectacles() {
        return ResponseEntity.ok(spectacleRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Spectacle> getSpectacleById(@PathVariable Long id) {
        return spectacleRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createSpectacle(@RequestBody Spectacle spectacle) {
        if (spectacle.getTitle() == null || spectacle.getTitle().isBlank()) {
            return ResponseEntity.badRequest().body("Titre obligatoire");
        }
        if (spectacle.getDate() == null) {
            return ResponseEntity.badRequest().body("Date obligatoire");
        }
        if (spectacle.getPrice() == null || spectacle.getPrice() < 0) {
            return ResponseEntity.badRequest().body("Prix invalide");
        }

        LocalDateTime now = LocalDateTime.now();
        spectacle.setCreatedAt(now);
        spectacle.setUpdatedAt(now);

        return ResponseEntity.status(HttpStatus.CREATED).body(spectacleRepository.save(spectacle));
    }
}
