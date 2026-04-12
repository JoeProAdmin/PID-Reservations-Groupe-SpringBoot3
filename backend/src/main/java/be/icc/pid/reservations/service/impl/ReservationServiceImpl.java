package be.icc.pid.reservations.service.impl;

import be.icc.pid.reservations.entity.*;
import be.icc.pid.reservations.repository.ReservationRepository;
import be.icc.pid.reservations.repository.RepresentationRepository;
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

        // 1. Vérifier que la représentation existe
        Long representationId = reservation.getRepresentation().getId();

        Representation representation = representationRepository.findById(representationId)
                .orElseThrow(() -> new RuntimeException("Representation introuvable"));

        // 2. Vérifier places disponibles
        if (representation.getPlacesDisponibles() < reservation.getNumberOfSeats()) {
            throw new RuntimeException("Pas assez de places disponibles");
        }

        // 3. Décrémenter les places
        representation.setPlacesDisponibles(
                representation.getPlacesDisponibles() - reservation.getNumberOfSeats()
        );

        representationRepository.save(representation);

        // 4. Construire la réservation
        reservation.setRepresentation(representation);
        reservation.setReservationDate(LocalDateTime.now());
        reservation.setStatus(ReservationStatus.CONFIRMED);
        reservation.setCreatedAt(LocalDateTime.now());
        reservation.setUpdatedAt(LocalDateTime.now());

        // 5. Sauvegarde
        return reservationRepository.save(reservation);
    }

    @Override
    public List<Reservation> getAll() {
        return reservationRepository.findAll();
    }

    @Override
    public Reservation getById(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation non trouvée"));
    }

    @Override
    public void delete(Long id) {
        reservationRepository.deleteById(id);
    }
}