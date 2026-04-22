package be.icc.pid.reservations.controller;

import be.icc.pid.reservations.entity.Representation;
import be.icc.pid.reservations.service.RepresentationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/representations")
@CrossOrigin(origins = "http://localhost:3000")
public class RepresentationController {

    private final RepresentationService representationService;

    public RepresentationController(RepresentationService representationService) {
        this.representationService = representationService;
    }

    //  NOUVEL ENDPOINT POUR REDOUANE
    @GetMapping("/spectacle/{spectacleId}")
    public List<Representation> getBySpectacle(@PathVariable Long spectacleId) {
        return representationService.getBySpectacleId(spectacleId);
    }
}