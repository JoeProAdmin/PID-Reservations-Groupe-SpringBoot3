package be.icc.pid.reservations.controller;

import be.icc.pid.reservations.entity.Representation;
import be.icc.pid.reservations.service.RepresentationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/representations")
public class RepresentationController {

    private final RepresentationService representationService;

    public RepresentationController(RepresentationService representationService) {
        this.representationService = representationService;
    }

    // CREATE
    @PostMapping
    public Representation create(@RequestBody Representation representation) {
        return representationService.create(representation);
    }

    // READ ALL
    @GetMapping
    public List<Representation> getAll() {
        return representationService.getAll();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public Representation getById(@PathVariable Long id) {
        return representationService.getById(id)
                .orElseThrow(() -> new RuntimeException("Representation introuvable"));
    }

    // UPDATE
    @PutMapping("/{id}")
    public Representation update(@PathVariable Long id,
                                 @RequestBody Representation representation) {
        return representationService.update(id, representation);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        representationService.delete(id);
    }
}