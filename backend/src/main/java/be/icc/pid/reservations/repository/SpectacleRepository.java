package be.icc.pid.reservations.repository;

import be.icc.pid.reservations.entity.Spectacle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpectacleRepository extends JpaRepository<Spectacle, Long> {

    @Query("""
            SELECT s FROM Spectacle s
            WHERE (:search IS NULL OR LOWER(s.title) LIKE LOWER(CONCAT('%', :search, '%'))
                                  OR LOWER(s.description) LIKE LOWER(CONCAT('%', :search, '%')))
              AND (:location IS NULL OR LOWER(s.location) = LOWER(:location))
            """)
    Page<Spectacle> findFiltered(@Param("search") String search,
                                 @Param("location") String location,
                                 Pageable pageable);

    @Query("SELECT DISTINCT s.location FROM Spectacle s WHERE s.location IS NOT NULL AND s.location <> '' ORDER BY s.location")
    List<String> findDistinctLocations();

    List<Spectacle> findByProducerIdOrderByDateDesc(Long producerId);
}
