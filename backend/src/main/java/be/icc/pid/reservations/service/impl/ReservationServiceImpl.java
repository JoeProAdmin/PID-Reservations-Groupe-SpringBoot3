package be.icc.pid.reservations.service.impl;

import be.icc.pid.reservations.entity.Reservation;
import be.icc.pid.reservations.entity.ReservationStatus;
import be.icc.pid.reservations.exception.ResourceNotFoundException;
import be.icc.pid.reservations.repository.ReservationRepository;
import be.icc.pid.reservations.service.PaiementService;
import be.icc.pid.reservations.service.ReservationService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;
    private final PaiementService paiementService;

    public ReservationServiceImpl(ReservationRepository reservationRepository,
                                  PaiementService paiementService) {
        this.reservationRepository = reservationRepository;
        this.paiementService = paiementService;
    }

    @Override
    public List<Reservation> getAll() {
        return reservationRepository.findAll();
    }

    @Override
    public Reservation getById(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Réservation introuvable avec l'id : " + id
                ));
    }

    @Override
    public Reservation create(Reservation reservation) {
        return reservationRepository.save(reservation);
    }

    @Override
    public Reservation update(Long id, Reservation reservation) {

        Reservation existingReservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Réservation introuvable avec l'id : " + id
                ));

        existingReservation.setReservationDate(reservation.getReservationDate());
        existingReservation.setNumberOfSeats(reservation.getNumberOfSeats());
        existingReservation.setStatus(reservation.getStatus());
        existingReservation.setUser(reservation.getUser());
        existingReservation.setRepresentation(reservation.getRepresentation());
        existingReservation.setUpdatedAt(LocalDateTime.now());

        Reservation updatedReservation = reservationRepository.save(existingReservation);

        // 🔥 LOGIQUE MÉTIER IMPORTANTE (NE PAS TOUCHER)
        if (updatedReservation.getStatus() == ReservationStatus.TERMINEE) {
            paiementService.creerPaiementPourReservation(updatedReservation);
        }

        return updatedReservation;
    }

    @Override
    public void delete(Long id) {
        Reservation existingReservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Réservation introuvable avec l'id : " + id
                ));

        reservationRepository.delete(existingReservation);
    }

    @Override
    public List<Reservation> getAllReservations() {
        return getAll();
    }

    @Override
    public Reservation getReservationById(Long id) {
        return getById(id);
    }

    @Override
    public Reservation createReservation(Reservation reservation) {
        return create(reservation);
    }

    @Override
    public Reservation updateReservation(Long id, Reservation reservation) {
        return update(id, reservation);
    }

    @Override
    public void deleteReservation(Long id) {
        delete(id);
    }
}