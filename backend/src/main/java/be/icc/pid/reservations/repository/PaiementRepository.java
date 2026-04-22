package be.icc.pid.reservations.repository;

import be.icc.pid.reservations.entity.Paiement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaiementRepository extends JpaRepository<Paiement, Long> {
}