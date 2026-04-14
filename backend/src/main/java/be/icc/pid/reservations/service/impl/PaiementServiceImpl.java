package be.icc.pid.reservations.service.impl;

import be.icc.pid.reservations.entity.Paiement;
import be.icc.pid.reservations.entity.PaiementStatut;
import be.icc.pid.reservations.entity.Reservation;
import be.icc.pid.reservations.repository.PaiementRepository;
import be.icc.pid.reservations.service.PaiementService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PaiementServiceImpl implements PaiementService {

    private final PaiementRepository paiementRepository;

    public PaiementServiceImpl(PaiementRepository paiementRepository) {
        this.paiementRepository = paiementRepository;
    }

    @Override
    public void creerPaiementPourReservation(Reservation reservation) {

        if (reservation == null || reservation.getId() == null) {
            throw new IllegalArgumentException("La réservation est invalide");
        }

        if (paiementRepository.existsByReservationId(reservation.getId())) {
            return;
        }

        Paiement paiement = new Paiement();
        paiement.setReservation(reservation);
        paiement.setMontant(50.0);
        paiement.setDatePaiement(LocalDateTime.now());
        paiement.setStatut(PaiementStatut.EN_ATTENTE);

        paiementRepository.save(paiement);
    }
}