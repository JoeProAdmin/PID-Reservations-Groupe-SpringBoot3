package be.icc.pid.reservations.controller;

import be.icc.pid.reservations.entity.Representation;
import be.icc.pid.reservations.entity.Spectacle;
import be.icc.pid.reservations.repository.SpectacleRepository;
import be.icc.pid.reservations.service.RepresentationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/representations")
@CrossOrigin(origins = "http://localhost:3000")
public class RepresentationController {

    private final RepresentationService representationService;
    private final SpectacleRepository spectacleRepository;

    public RepresentationController(RepresentationService representationService,
                                    SpectacleRepository spectacleRepository) {
        this.representationService = representationService;
        this.spectacleRepository = spectacleRepository;
    }

    // =========================
    // GET PAR SPECTACLE
    // =========================
    @GetMapping("/spectacle/{spectacleId}")
    public List<Representation> getBySpectacle(@PathVariable Long spectacleId) {
        return representationService.getBySpectacleId(spectacleId);
    }

    // =========================
    // POST (ADMIN)
    // =========================
    @PostMapping
    public Representation create(@RequestBody Representation representation) {

        if (representation.getSpectacle() == null ||
                representation.getSpectacle().getId() == null) {
            throw new RuntimeException("spectacleId requis");
        }

        Spectacle spectacle = spectacleRepository.findById(
                representation.getSpectacle().getId()
        ).orElseThrow(() -> new RuntimeException("Spectacle non trouvé"));

        representation.setSpectacle(spectacle);

        return representationService.save(representation);
    }

    // =========================
    // DELETE (ADMIN)
    // =========================
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        representationService.delete(id);
    }
}