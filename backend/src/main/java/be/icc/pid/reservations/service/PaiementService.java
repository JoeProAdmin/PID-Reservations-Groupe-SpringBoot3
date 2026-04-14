package be.icc.pid.reservations.service;

import be.icc.pid.reservations.entity.Reservation;

public interface PaiementService {

    void creerPaiementPourReservation(Reservation reservation);
}