package be.icc.pid.reservations.admin.service.impl;

import be.icc.pid.reservations.admin.dto.AdminSpectacleDTO;
import be.icc.pid.reservations.admin.service.AdminSpectacleService;
import be.icc.pid.reservations.entity.Spectacle;
import be.icc.pid.reservations.repository.SpectacleRepository;
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
    public List<AdminSpectacleDTO> getAllSpectacles() {
        return spectacleRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AdminSpectacleDTO createSpectacle(AdminSpectacleDTO dto) {
        Spectacle spectacle = mapToEntity(dto);
        Spectacle saved = spectacleRepository.save(spectacle);
        return mapToDTO(saved);
    }

    @Override
    public AdminSpectacleDTO updateSpectacle(Long id, AdminSpectacleDTO dto) {
        Spectacle spectacle = spectacleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Spectacle non trouvé"));

        spectacle.setTitle(dto.getTitle());
        spectacle.setDescription(dto.getDescription());
        spectacle.setPrice(dto.getPrice());

        Spectacle updated = spectacleRepository.save(spectacle);
        return mapToDTO(updated);
    }

    @Override
    public void deleteSpectacle(Long id) {
        spectacleRepository.deleteById(id);
    }

    //  Mapping Entity → DTO
    private AdminSpectacleDTO mapToDTO(Spectacle spectacle) {
        AdminSpectacleDTO dto = new AdminSpectacleDTO();
        dto.setId(spectacle.getId());
        dto.setTitle(spectacle.getTitle());
        dto.setDescription(spectacle.getDescription());
        dto.setPrice(spectacle.getPrice());
        dto.setBookable(true); // temporaire (pas dans entity)
        return dto;
    }

    //  Mapping DTO → Entity
    private Spectacle mapToEntity(AdminSpectacleDTO dto) {
        Spectacle spectacle = new Spectacle();
        spectacle.setTitle(dto.getTitle());
        spectacle.setDescription(dto.getDescription());
        spectacle.setPrice(dto.getPrice());
        return spectacle;
    }
}