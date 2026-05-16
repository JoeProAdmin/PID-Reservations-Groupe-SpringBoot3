package be.icc.pid.reservations.repository;

import be.icc.pid.reservations.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<User> findByLogin(String login);

    boolean existsByLogin(String login);
}