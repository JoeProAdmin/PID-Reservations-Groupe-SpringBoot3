package be.icc.pid.reservations.repository;

import be.icc.pid.reservations.entity.Representation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RepresentationRepository extends JpaRepository<Representation, Long> {

    List<Representation> findBySpectacleId(Long spectacleId);
}