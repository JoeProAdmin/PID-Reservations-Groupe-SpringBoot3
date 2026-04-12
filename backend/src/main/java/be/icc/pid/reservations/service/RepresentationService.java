package be.icc.pid.reservations.service;

import be.icc.pid.reservations.entity.Representation;

import java.util.List;
import java.util.Optional;

public interface RepresentationService {

    Representation create(Representation representation);

    List<Representation> getAll();

    Optional<Representation> getById(Long id);

    Representation update(Long id, Representation representation);

    void delete(Long id);
}