package be.icc.pid.reservations.service.impl;

import be.icc.pid.reservations.entity.Representation;
import be.icc.pid.reservations.repository.RepresentationRepository;
import be.icc.pid.reservations.service.RepresentationService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RepresentationServiceImpl implements RepresentationService {

    private final RepresentationRepository representationRepository;

    public RepresentationServiceImpl(RepresentationRepository representationRepository) {
        this.representationRepository = representationRepository;
    }

    @Override
    public Representation create(Representation representation) {
        return representationRepository.save(representation);
    }

    @Override
    public List<Representation> getAll() {
        return representationRepository.findAll();
    }

    @Override
    public Optional<Representation> getById(Long id) {
        return representationRepository.findById(id);
    }

    @Override
    public Representation update(Long id, Representation updated) {

        Representation existing = representationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Representation introuvable"));

        existing.setDateHeure(updated.getDateHeure());
        existing.setPlacesDisponibles(updated.getPlacesDisponibles());
        existing.setSpectacle(updated.getSpectacle());

        return representationRepository.save(existing);
    }

    @Override
    public void delete(Long id) {
        representationRepository.deleteById(id);
    }
}