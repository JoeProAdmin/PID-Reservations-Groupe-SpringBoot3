package be.icc.pid.reservations.repository;

import be.icc.pid.reservations.entity.Commentaire;
import be.icc.pid.reservations.entity.CommentaireStatut;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentaireRepository extends JpaRepository<Commentaire, Long> {

    List<Commentaire> findBySpectacleIdAndStatutOrderByCreatedAtDesc(Long spectacleId, CommentaireStatut statut);

    List<Commentaire> findAllByOrderByCreatedAtDesc();

    List<Commentaire> findBySpectacleProducerIdOrderByCreatedAtDesc(Long producerId);

    List<Commentaire> findBySpectacleId(Long spectacleId);

    Optional<Commentaire> findByUserIdAndSpectacleId(Long userId, Long spectacleId);

    boolean existsByUserIdAndSpectacleId(Long userId, Long spectacleId);
}
