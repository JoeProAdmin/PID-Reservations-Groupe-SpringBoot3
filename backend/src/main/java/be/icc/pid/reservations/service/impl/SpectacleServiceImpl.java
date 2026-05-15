package be.icc.pid.reservations.service.impl;

import be.icc.pid.reservations.entity.Spectacle;
import be.icc.pid.reservations.exception.ResourceNotFoundException;
import be.icc.pid.reservations.repository.SpectacleRepository;
import be.icc.pid.reservations.service.SpectacleService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SpectacleServiceImpl implements SpectacleService {

    private final SpectacleRepository spectacleRepository;

    public SpectacleServiceImpl(SpectacleRepository spectacleRepository) {
        this.spectacleRepository = spectacleRepository;
    }

    @Override
    public List<Spectacle> getAllSpectacles() {
        return spectacleRepository.findAll();
    }

    @Override
    public Page<Spectacle> getSpectaclesPaged(String search, String location, Pageable pageable) {
        String s = (search != null && !search.isBlank()) ? search.trim() : null;
        String loc = (location != null && !location.isBlank()) ? location.trim() : null;
        return spectacleRepository.findFiltered(s, loc, pageable);
    }

    @Override
    public List<String> getDistinctLocations() {
        return spectacleRepository.findDistinctLocations();
    }

    @Override
    public Optional<Spectacle> getSpectacleById(Long id) {
        return spectacleRepository.findById(id);
    }

    @Override
    public Spectacle createSpectacle(Spectacle spectacle) {
        spectacle.setCreatedAt(LocalDateTime.now());
        spectacle.setUpdatedAt(null);
        return spectacleRepository.save(spectacle);
    }

    @Override
    public Spectacle updateSpectacle(Long id, Spectacle updatedSpectacle) {

        Spectacle existingSpectacle = spectacleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Spectacle introuvable avec l'id : " + id
                ));

        existingSpectacle.setTitle(updatedSpectacle.getTitle());
        existingSpectacle.setDescription(updatedSpectacle.getDescription());
        existingSpectacle.setDate(updatedSpectacle.getDate());
        existingSpectacle.setLocation(updatedSpectacle.getLocation());
        existingSpectacle.setPrice(updatedSpectacle.getPrice());
        existingSpectacle.setUpdatedAt(LocalDateTime.now());

        return spectacleRepository.save(existingSpectacle);
    }

    @Override
    public void deleteSpectacle(Long id) {
        Spectacle existingSpectacle = spectacleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Spectacle introuvable avec l'id : " + id
                ));

        spectacleRepository.delete(existingSpectacle);
    }
}