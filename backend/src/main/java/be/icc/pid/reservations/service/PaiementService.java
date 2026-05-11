package be.icc.pid.reservations.service;

import be.icc.pid.reservations.entity.Paiement;
import be.icc.pid.reservations.entity.Reservation;

public interface PaiementService {

    Paiement creerPaiementPourReservation(Reservation reservation);


}