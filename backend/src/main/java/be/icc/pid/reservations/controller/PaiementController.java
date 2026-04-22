package be.icc.pid.reservations.controller;

import be.icc.pid.reservations.entity.Paiement;
import be.icc.pid.reservations.entity.Reservation;
import be.icc.pid.reservations.repository.ReservationRepository;
import be.icc.pid.reservations.service.PaiementService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/paiements")
@CrossOrigin(origins = "*")
public class PaiementController {

    private final PaiementService paiementService;
    private final ReservationRepository reservationRepository;

    public PaiementController(PaiementService paiementService,
                              ReservationRepository reservationRepository) {
        this.paiementService = paiementService;
        this.reservationRepository = reservationRepository;
    }

    @PostMapping("/payer")
    public Paiement payer(@RequestParam Long reservationId) {

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new EntityNotFoundException("Réservation introuvable"));

        return paiementService.creerPaiementPourReservation(reservation);
    }
}