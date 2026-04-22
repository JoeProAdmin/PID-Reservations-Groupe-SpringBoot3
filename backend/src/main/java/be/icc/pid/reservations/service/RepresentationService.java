package be.icc.pid.reservations.service;

import be.icc.pid.reservations.entity.Representation;

import java.util.List;

public interface RepresentationService {

    List<Representation> getBySpectacleId(Long spectacleId);

    Representation save(Representation representation);

    void delete(Long id);
}