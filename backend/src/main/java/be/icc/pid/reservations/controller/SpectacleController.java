package be.icc.pid.reservations.controller;

import be.icc.pid.reservations.entity.Spectacle;
import be.icc.pid.reservations.service.SpectacleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/spectacles")
public class SpectacleController {

    private final SpectacleService spectacleService;

    public SpectacleController(SpectacleService spectacleService) {
        this.spectacleService = spectacleService;
    }

    // =========================
    // GET ALL
    // =========================
    @GetMapping
    public ResponseEntity<List<Spectacle>> getAll() {
        return ResponseEntity.ok(spectacleService.getAllSpectacles());
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
    public ResponseEntity<Spectacle> create(@RequestBody Spectacle spectacle) {
        Spectacle createdSpectacle = spectacleService.createSpectacle(spectacle);
        return ResponseEntity.ok(createdSpectacle);
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