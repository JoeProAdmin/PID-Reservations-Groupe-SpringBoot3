package be.icc.pid.reservations.service.impl;

import be.icc.pid.reservations.entity.Representation;
import be.icc.pid.reservations.entity.Reservation;
import be.icc.pid.reservations.entity.ReservationStatus;
import be.icc.pid.reservations.repository.RepresentationRepository;
import be.icc.pid.reservations.repository.ReservationRepository;
import be.icc.pid.reservations.service.ReservationService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;
    private final RepresentationRepository representationRepository;

    public ReservationServiceImpl(ReservationRepository reservationRepository,
                                  RepresentationRepository representationRepository) {
        this.reservationRepository = reservationRepository;
        this.representationRepository = representationRepository;
    }

    @Override
    public Reservation createReservation(Reservation reservation) {

        Representation representation = representationRepository.findById(
                reservation.getRepresentation().getId()
        ).orElseThrow(() -> new RuntimeException("Representation introuvable"));

        // 🔥 LOGIQUE MÉTIER
        if (representation.getPlacesDisponibles() < reservation.getNumberOfSeats()) {
            throw new RuntimeException("Pas assez de places disponibles");
        }

        // 🔥 décrémentation
        representation.setPlacesDisponibles(
                representation.getPlacesDisponibles() - reservation.getNumberOfSeats()
        );

        reservation.setRepresentation(representation);
        reservation.setReservationDate(LocalDateTime.now());
        reservation.setStatus(ReservationStatus.CONFIRMED);

        return reservationRepository.save(reservation);
    }

    @Override
    public List<Reservation> getAll() {
        return reservationRepository.findAll();
    }

    @Override
    public Reservation getById(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation introuvable"));
    }

    @Override
    public void delete(Long id) {
        reservationRepository.deleteById(id);
    }
}