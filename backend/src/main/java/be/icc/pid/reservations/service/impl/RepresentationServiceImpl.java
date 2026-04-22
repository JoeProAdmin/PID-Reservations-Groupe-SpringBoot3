package be.icc.pid.reservations.service.impl;

import be.icc.pid.reservations.entity.Representation;
import be.icc.pid.reservations.repository.RepresentationRepository;
import be.icc.pid.reservations.service.RepresentationService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RepresentationServiceImpl implements RepresentationService {

    private final RepresentationRepository representationRepository;

    public RepresentationServiceImpl(RepresentationRepository representationRepository) {
        this.representationRepository = representationRepository;
    }

    @Override
    public List<Representation> getBySpectacleId(Long spectacleId) {
        return representationRepository.findBySpectacleId(spectacleId);
    }
}