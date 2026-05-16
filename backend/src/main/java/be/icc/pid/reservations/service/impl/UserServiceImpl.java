package be.icc.pid.reservations.service.impl;

import be.icc.pid.reservations.dto.UserCreateDTO;
import be.icc.pid.reservations.dto.UserResponseDTO;
import be.icc.pid.reservations.dto.UserUpdateDTO;
import be.icc.pid.reservations.entity.User;
import be.icc.pid.reservations.repository.UserRepository;
import be.icc.pid.reservations.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    @Override
    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("Utilisateur introuvable avec l'id : " + id)
                );

        return mapToResponseDTO(user);
    }

    @Override
    public UserResponseDTO createUser(UserCreateDTO dto) {

        String normalizedEmail = dto.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new IllegalArgumentException("Un utilisateur avec cet email existe déjà");
        }

        User user = new User();
        user.setPrenom(dto.getFirstName());
        user.setNom(dto.getLastName());
        user.setEmail(normalizedEmail);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        // rôle fixé côté backend
        user.setRole("ROLE_USER");

        User savedUser = userRepository.save(user);

        return mapToResponseDTO(savedUser);
    }

    @Override
    public UserResponseDTO updateUser(Long id, UserUpdateDTO dto) {

        User existingUser = userRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("Utilisateur introuvable avec l'id : " + id)
                );

        String normalizedEmail = dto.getEmail().trim().toLowerCase();

        if (!existingUser.getEmail().equalsIgnoreCase(normalizedEmail)
                && userRepository.existsByEmail(normalizedEmail)) {
            throw new IllegalArgumentException("Un utilisateur avec cet email existe déjà");
        }

        // Verification unicite du login (si change)
        String newLogin = dto.getLogin() != null ? dto.getLogin().trim() : null;
        if (newLogin != null && !newLogin.isEmpty()
                && !newLogin.equalsIgnoreCase(existingUser.getLogin())
                && userRepository.existsByLogin(newLogin)) {
            throw new IllegalArgumentException("Ce login est déjà utilisé");
        }

        existingUser.setPrenom(dto.getFirstName());
        existingUser.setNom(dto.getLastName());
        existingUser.setEmail(normalizedEmail);

        if (newLogin != null && !newLogin.isEmpty()) {
            existingUser.setLogin(newLogin);
        }
        if (dto.getLanguage() != null && !dto.getLanguage().isBlank()) {
            existingUser.setLanguage(dto.getLanguage());
        }

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            existingUser.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        // ON NE TOUCHE PAS AU ROLE depuis ce endpoint
        // (les changements de role passent par PUT /api/users/{id}/role, reserve aux admins)

        User updatedUser = userRepository.save(existingUser);

        return mapToResponseDTO(updatedUser);
    }

    @Override
    public void deleteUser(Long id) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("Utilisateur introuvable avec l'id : " + id)
                );

        userRepository.delete(existingUser);
    }

    private UserResponseDTO mapToResponseDTO(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setFirstName(user.getPrenom());
        dto.setLastName(user.getNom());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setLogin(user.getLogin());
        dto.setLanguage(user.getLanguage());
        return dto;
    }
}