package be.icc.pid.reservations.service.impl;

import be.icc.pid.reservations.entity.Paiement;
import be.icc.pid.reservations.entity.Reservation;
import be.icc.pid.reservations.entity.ReservationStatus;
import be.icc.pid.reservations.repository.PaiementRepository;
import be.icc.pid.reservations.service.PaiementService;
import org.springframework.stereotype.Service;

@Service
public class PaiementServiceImpl implements PaiementService {

    private final PaiementRepository paiementRepository;

    public PaiementServiceImpl(PaiementRepository paiementRepository) {
        this.paiementRepository = paiementRepository;
    }

    @Override
    public Paiement creerPaiementPourReservation(Reservation reservation) {

        Paiement paiement = new Paiement();
        paiement.setMontant(50.0);
        paiement.setMethode("CARD");
        paiement.setStatut("PAYE");
        paiement.setReservation(reservation);

        reservation.setStatus(ReservationStatus.CONFIRMED);

        return paiementRepository.save(paiement);

    }

    
}
