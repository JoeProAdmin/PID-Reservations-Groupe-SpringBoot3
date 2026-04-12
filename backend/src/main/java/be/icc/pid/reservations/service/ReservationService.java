package be.icc.pid.reservations.service;

import be.icc.pid.reservations.entity.Reservation;

import java.util.List;

public interface ReservationService {

    Reservation createReservation(Reservation reservation);

    List<Reservation> getAll();

    Reservation getById(Long id);

    void delete(Long id);
}