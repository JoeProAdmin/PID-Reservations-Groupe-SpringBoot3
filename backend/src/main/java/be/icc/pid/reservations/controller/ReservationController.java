package be.icc.pid.reservations.controller;

import be.icc.pid.reservations.entity.Reservation;
import be.icc.pid.reservations.entity.ReservationStatus;
import be.icc.pid.reservations.entity.Spectacle;
import be.icc.pid.reservations.repository.ReservationRepository;
import be.icc.pid.reservations.repository.SpectacleRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationRepository reservationRepository;
    private final SpectacleRepository spectacleRepository;

    public ReservationController(ReservationRepository reservationRepository,
                                 SpectacleRepository spectacleRepository) {
        this.reservationRepository = reservationRepository;
        this.spectacleRepository = spectacleRepository;
    }

    @GetMapping
    public ResponseEntity<List<Reservation>> getAllReservations() {
        return ResponseEntity.ok(reservationRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getReservationById(@PathVariable Long id) {
        return reservationRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createReservation(@RequestBody Reservation reservation) {
        if (reservation.getNumberOfSeats() <= 0) {
            return ResponseEntity.badRequest().body("Nombre de places invalide");
        }
        if (reservation.getSpectacle() == null || reservation.getSpectacle().getId() == null) {
            return ResponseEntity.badRequest().body("Spectacle obligatoire");
        }

        Long spectacleId = reservation.getSpectacle().getId();

        Spectacle spectacle = spectacleRepository.findById(spectacleId)
                .orElse(null);
        if (spectacle == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Spectacle introuvable");
        }

        reservation.setSpectacle(spectacle);
        reservation.setReservationDate(LocalDateTime.now());
        reservation.setStatus(ReservationStatus.CREATED);
        reservation.setCreatedAt(LocalDateTime.now());
        reservation.setUpdatedAt(LocalDateTime.now());

        return ResponseEntity.status(HttpStatus.CREATED).body(reservationRepository.save(reservation));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable Long id) {
        if (!reservationRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        reservationRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
