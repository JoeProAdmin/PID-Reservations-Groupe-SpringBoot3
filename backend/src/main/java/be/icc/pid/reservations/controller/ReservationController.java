package be.icc.pid.reservations.controller;

import be.icc.pid.reservations.entity.Reservation;
import be.icc.pid.reservations.entity.ReservationStatus;
import be.icc.pid.reservations.entity.Spectacle;
import be.icc.pid.reservations.repository.ReservationRepository;
import be.icc.pid.reservations.repository.SpectacleRepository;
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

    // =========================
    // GET ALL RESERVATIONS
    // =========================
    @GetMapping
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    // =========================
    // GET RESERVATION BY ID
    // =========================
    @GetMapping("/{id}")
    public Reservation getReservationById(@PathVariable Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
    }

    // =========================
    // CREATE RESERVATION
    // =========================
    @PostMapping
    public Reservation createReservation(@RequestBody Reservation reservation) {

        Long spectacleId = reservation.getSpectacle().getId();

        Spectacle spectacle = spectacleRepository.findById(spectacleId)
                .orElseThrow(() -> new RuntimeException("Spectacle not found"));

        reservation.setSpectacle(spectacle);
        reservation.setReservationDate(LocalDateTime.now());
        reservation.setStatus(ReservationStatus.CREATED);
        reservation.setCreatedAt(LocalDateTime.now());

        return reservationRepository.save(reservation);
    }

    // =========================
    // DELETE RESERVATION
    // =========================
    @DeleteMapping("/{id}")
    public void deleteReservation(@PathVariable Long id) {

        if (!reservationRepository.existsById(id)) {
            throw new RuntimeException("Reservation not found");
        }

        reservationRepository.deleteById(id);
    }
}
