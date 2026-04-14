package be.icc.pid.reservations.service;

import be.icc.pid.reservations.entity.Reservation;

import java.util.List;

public interface ReservationService {

    List<Reservation> getAll();

    Reservation getById(Long id);

    Reservation create(Reservation reservation);

    Reservation update(Long id, Reservation reservation);

    void delete(Long id);

    List<Reservation> getAllReservations();

    Reservation getReservationById(Long id);

    Reservation createReservation(Reservation reservation);

    Reservation updateReservation(Long id, Reservation reservation);

    void deleteReservation(Long id);
}