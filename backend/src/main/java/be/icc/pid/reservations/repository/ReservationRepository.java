package be.icc.pid.reservations.repository;

import be.icc.pid.reservations.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByUserId(Long userId);

    List<Reservation> findByRepresentationSpectacleProducerId(Long producerId);
}
