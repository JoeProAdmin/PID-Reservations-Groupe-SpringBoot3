package be.icc.pid.reservations.service.impl;

import be.icc.pid.reservations.dto.UserCreateDTO;
import be.icc.pid.reservations.dto.UserResponseDTO;
import be.icc.pid.reservations.entity.User;
import be.icc.pid.reservations.repository.UserRepository;
import be.icc.pid.reservations.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // =========================
    // CREATE
    // =========================
    @Override
    public UserResponseDTO saveUser(UserCreateDTO dto) {

        String email = dto.getEmail().trim().toLowerCase();

        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email déjà utilisé");
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setNom(dto.getLastname());
        user.setPrenom(dto.getFirstname());
        user.setRole("USER");

        user = userRepository.save(user);

        return mapToDTO(user);
    }

    // =========================
    // READ ALL
    // =========================
    @Override
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // =========================
    // READ BY ID
    // =========================
    @Override
    public Optional<UserResponseDTO> getUserById(Long id) {
        return userRepository.findById(id)
                .map(this::mapToDTO);
    }

    // =========================
    // DELETE
    // =========================
    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    // =========================
    // CHECK EMAIL
    // =========================
    @Override
    public boolean emailExists(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    // =========================
    // ENTITY -> DTO
    // =========================
    private UserResponseDTO mapToDTO(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setPrenom(user.getPrenom());
        dto.setNom(user.getNom());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        return dto;
    }
}