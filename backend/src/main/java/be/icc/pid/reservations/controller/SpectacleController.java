package be.icc.pid.reservations.controller;

import be.icc.pid.reservations.entity.Spectacle;
import be.icc.pid.reservations.repository.SpectacleRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/spectacles")
public class SpectacleController {

    private final SpectacleRepository spectacleRepository;

    public SpectacleController(SpectacleRepository spectacleRepository) {
        this.spectacleRepository = spectacleRepository;
    }

    // GET ALL SPECTACLES
    @GetMapping
    public List<Spectacle> getAllSpectacles() {
        return spectacleRepository.findAll();
    }

    // CREATE SPECTACLE
    @PostMapping
    public Spectacle createSpectacle(@RequestBody Spectacle spectacle) {
        return spectacleRepository.save(spectacle);
    }
}
