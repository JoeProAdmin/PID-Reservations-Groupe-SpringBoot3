package be.icc.pid.reservations.admin.controller;

import be.icc.pid.reservations.admin.dto.AdminSpectacleDTO;
import be.icc.pid.reservations.admin.service.AdminSpectacleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/spectacles")
public class AdminSpectacleRestController {

    private final AdminSpectacleService service;

    public AdminSpectacleRestController(AdminSpectacleService service) {
        this.service = service;
    }

    // ========================
    // GET ALL
    // ========================
    @GetMapping
    public ResponseEntity<List<AdminSpectacleDTO>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    // ========================
    // GET BY ID
    // ========================
    @GetMapping("/{id}")
    public ResponseEntity<AdminSpectacleDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    // ========================
    // CREATE
    // ========================
    @PostMapping
    public ResponseEntity<AdminSpectacleDTO> create(@RequestBody AdminSpectacleDTO dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    // ========================
    // UPDATE
    // ========================
    @PutMapping("/{id}")
    public ResponseEntity<AdminSpectacleDTO> update(@PathVariable Long id,
                                                    @RequestBody AdminSpectacleDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    // ========================
    // DELETE (CORRIGÉ PROPRE)
    // ========================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}