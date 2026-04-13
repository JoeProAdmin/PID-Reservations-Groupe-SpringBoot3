package be.icc.pid.reservations.service;

import be.icc.pid.reservations.dto.UserCreateDTO;
import be.icc.pid.reservations.dto.UserResponseDTO;
import be.icc.pid.reservations.dto.UserUpdateDTO;

import java.util.List;

public interface UserService {

    List<UserResponseDTO> getAllUsers();

    UserResponseDTO getUserById(Long id);

    UserResponseDTO createUser(UserCreateDTO dto);

    UserResponseDTO updateUser(Long id, UserUpdateDTO dto);

    void deleteUser(Long id);
}