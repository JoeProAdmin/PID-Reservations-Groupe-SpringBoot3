package be.icc.pid.reservations.service;

import be.icc.pid.reservations.dto.UserCreateDTO;
import be.icc.pid.reservations.dto.UserResponseDTO;

import java.util.List;
import java.util.Optional;

public interface UserService {

    UserResponseDTO saveUser(UserCreateDTO dto);

    List<UserResponseDTO> getAllUsers();

    Optional<UserResponseDTO> getUserById(Long id);

    void deleteUser(Long id);

    boolean emailExists(String email);
}