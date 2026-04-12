package be.icc.pid.reservations.admin.service.impl;

import be.icc.pid.reservations.admin.dto.AdminSpectacleDTO;
import be.icc.pid.reservations.admin.service.AdminSpectacleService;
import be.icc.pid.reservations.entity.Spectacle;
import be.icc.pid.reservations.repository.SpectacleRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminSpectacleServiceImpl implements AdminSpectacleService {

    private final SpectacleRepository spectacleRepository;

    public AdminSpectacleServiceImpl(SpectacleRepository spectacleRepository) {
        this.spectacleRepository = spectacleRepository;
    }

    @Override
    public List<AdminSpectacleDTO> getAll() {
        return spectacleRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AdminSpectacleDTO create(AdminSpectacleDTO dto) {

        Spectacle spectacle = new Spectacle();

        spectacle.setTitle(dto.getTitle());
        spectacle.setDescription(dto.getDescription());
        spectacle.setDate(dto.getDate());
        spectacle.setPrice(dto.getPrice());

        Spectacle saved = spectacleRepository.save(spectacle);

        return mapToDTO(saved);
    }

    @Override
    public void delete(Long id) {

        Spectacle spectacle = spectacleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Spectacle introuvable avec id : " + id));

        try {
            spectacleRepository.delete(spectacle);
        } catch (DataIntegrityViolationException ex) {
            throw new RuntimeException("Suppression impossible : ce spectacle est lié à des réservations.");
        }
    }

    @Override
    public AdminSpectacleDTO getById(Long id) {
        Spectacle s = spectacleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Spectacle introuvable avec id : " + id));

        return mapToDTO(s);
    }

    @Override
    public AdminSpectacleDTO update(Long id, AdminSpectacleDTO dto) {

        Spectacle existing = spectacleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Spectacle introuvable avec id : " + id));

        existing.setTitle(dto.getTitle());
        existing.setDescription(dto.getDescription());
        existing.setDate(dto.getDate());
        existing.setPrice(dto.getPrice());

        Spectacle updated = spectacleRepository.save(existing);

        return mapToDTO(updated);
    }

    private AdminSpectacleDTO mapToDTO(Spectacle s) {
        AdminSpectacleDTO dto = new AdminSpectacleDTO();
        dto.setId(s.getId());
        dto.setTitle(s.getTitle());
        dto.setDescription(s.getDescription());
        dto.setDate(s.getDate());
        dto.setPrice(s.getPrice());
        return dto;
    }
}