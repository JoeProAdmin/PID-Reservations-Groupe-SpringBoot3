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

    // GET ALL
    @GetMapping
    public List<Spectacle> getAll() {
        return spectacleRepository.findAll();
    }

    // POST
    @PostMapping
    public Spectacle create(@RequestBody Spectacle spectacle) {
        return spectacleRepository.save(spectacle);
    }

    // PUT (UPDATE)
    @PutMapping("/{id}")
    public Spectacle update(@PathVariable Long id, @RequestBody Spectacle updatedSpectacle) {

        Spectacle spectacle = spectacleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Spectacle introuvable"));

        spectacle.setTitle(updatedSpectacle.getTitle());
        spectacle.setDescription(updatedSpectacle.getDescription());
        spectacle.setDate(updatedSpectacle.getDate());
        spectacle.setLocation(updatedSpectacle.getLocation());
        spectacle.setPrice(updatedSpectacle.getPrice());

        return spectacleRepository.save(spectacle);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        spectacleRepository.deleteById(id);
    }
}