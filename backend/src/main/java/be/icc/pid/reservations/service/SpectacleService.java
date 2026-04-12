package be.icc.pid.reservations.service;

import be.icc.pid.reservations.entity.Spectacle;

import java.util.List;
import java.util.Optional;

public interface SpectacleService {

    List<Spectacle> getAllSpectacles();

    Optional<Spectacle> getSpectacleById(Long id);

    Spectacle createSpectacle(Spectacle spectacle);

    Spectacle updateSpectacle(Long id, Spectacle updatedSpectacle);

    void deleteSpectacle(Long id);
}