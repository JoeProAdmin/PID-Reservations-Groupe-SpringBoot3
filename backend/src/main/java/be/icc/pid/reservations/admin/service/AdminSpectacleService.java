package be.icc.pid.reservations.admin.service;

import be.icc.pid.reservations.admin.dto.AdminSpectacleDTO;

import java.util.List;

public interface AdminSpectacleService {

    List<AdminSpectacleDTO> getAllSpectacles();

    AdminSpectacleDTO createSpectacle(AdminSpectacleDTO dto);

    AdminSpectacleDTO updateSpectacle(Long id, AdminSpectacleDTO dto);

    void deleteSpectacle(Long id);
}