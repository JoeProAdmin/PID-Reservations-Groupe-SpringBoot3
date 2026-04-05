package be.icc.pid.reservations.admin.controller;

import be.icc.pid.reservations.admin.dto.AdminSpectacleDTO;
import be.icc.pid.reservations.admin.service.AdminSpectacleService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/spectacles")
public class AdminSpectacleController {

    private final AdminSpectacleService adminSpectacleService;

    public AdminSpectacleController(AdminSpectacleService adminSpectacleService) {
        this.adminSpectacleService = adminSpectacleService;
    }

    @GetMapping
    public List<AdminSpectacleDTO> getAllSpectacles() {
        return adminSpectacleService.getAllSpectacles();
    }

    @PostMapping
    public AdminSpectacleDTO createSpectacle(@RequestBody AdminSpectacleDTO dto) {
        return adminSpectacleService.createSpectacle(dto);
    }

    @PutMapping("/{id}")
    public AdminSpectacleDTO updateSpectacle(@PathVariable Long id,
                                             @RequestBody AdminSpectacleDTO dto) {
        return adminSpectacleService.updateSpectacle(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deleteSpectacle(@PathVariable Long id) {
        adminSpectacleService.deleteSpectacle(id);
    }
}