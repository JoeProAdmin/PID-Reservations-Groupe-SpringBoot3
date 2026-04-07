package be.icc.pid.reservations.admin.service;

import be.icc.pid.reservations.admin.dto.AdminSpectacleDTO;

import java.util.List;

public interface AdminSpectacleService {

    List<AdminSpectacleDTO> getAll();

    AdminSpectacleDTO create(AdminSpectacleDTO dto);

    void delete(Long id);

    AdminSpectacleDTO getById(Long id);

    AdminSpectacleDTO update(Long id, AdminSpectacleDTO dto);
}