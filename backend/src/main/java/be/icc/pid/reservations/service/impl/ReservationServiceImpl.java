package be.icc.pid.reservations.service.impl;

import be.icc.pid.reservations.entity.Reservation;
import be.icc.pid.reservations.entity.ReservationStatus;
import be.icc.pid.reservations.entity.Representation;
import be.icc.pid.reservations.entity.User;
import be.icc.pid.reservations.repository.ReservationRepository;
import be.icc.pid.reservations.repository.RepresentationRepository;
import be.icc.pid.reservations.repository.UserRepository;
import be.icc.pid.reservations.service.ReservationService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;
    private final RepresentationRepository representationRepository;
    private final UserRepository userRepository;

    public ReservationServiceImpl(ReservationRepository reservationRepository,
                                  RepresentationRepository representationRepository,
                                  UserRepository userRepository) {
        this.reservationRepository = reservationRepository;
        this.representationRepository = representationRepository;
        this.userRepository = userRepository;
    }

    // ========================
    // CREATE RESERVATION
    // ========================
    @Override
    public Reservation createReservation(Reservation reservation) {

        // ========================
        // VALIDATION INPUT
        // ========================
        if (reservation.getNumberOfSeats() <= 0) {
            throw new RuntimeException("Nombre de places invalide");
        }

        if (reservation.getRepresentation() == null || reservation.getRepresentation().getId() == null) {
            throw new RuntimeException("Representation obligatoire");
        }

        if (reservation.getUser() == null || reservation.getUser().getId() == null) {
            throw new RuntimeException("User obligatoire");
        }

        // ========================
        // RECUP REPRESENTATION
        // ========================
        Long representationId = reservation.getRepresentation().getId();

        Representation representation = representationRepository.findById(representationId)
                .orElseThrow(() -> new RuntimeException("Representation introuvable"));

        // ========================
        // RECUP USER
        // ========================
        Long userId = reservation.getUser().getId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User introuvable"));

        // ========================
        // VERIFICATION PLACES
        // ========================
        if (representation.getPlacesDisponibles() < reservation.getNumberOfSeats()) {
            throw new RuntimeException("Pas assez de places disponibles");
        }

        // ========================
        // DECREMENTATION PLACES
        // ========================
        representation.setPlacesDisponibles(
                representation.getPlacesDisponibles() - reservation.getNumberOfSeats()
        );

        representationRepository.save(representation);

        // ========================
        // SET DATA RESERVATION
        // ========================
        reservation.setRepresentation(representation);
        reservation.setUser(user);
        reservation.setReservationDate(LocalDateTime.now());
        reservation.setStatus(ReservationStatus.CONFIRMED);
        reservation.setCreatedAt(LocalDateTime.now());
        reservation.setUpdatedAt(LocalDateTime.now());

        // ========================
        // SAVE
        // ========================
        return reservationRepository.save(reservation);
    }

    // ========================
    // GET ALL
    // ========================
    @Override
    public List<Reservation> getAll() {
        return reservationRepository.findAll();
    }

    // ========================
    // GET BY ID
    // ========================
    @Override
    public Reservation getById(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation introuvable"));
    }

    // ========================
    // DELETE
    // ========================
    @Override
    public void delete(Long id) {
        if (!reservationRepository.existsById(id)) {
            throw new RuntimeException("Reservation introuvable");
        }
        reservationRepository.deleteById(id);
    }
}