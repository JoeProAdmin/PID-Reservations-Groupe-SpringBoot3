package be.icc.pid.reservations.controller;

import be.icc.pid.reservations.dto.UserCreateDTO;
import be.icc.pid.reservations.dto.UserResponseDTO;
import be.icc.pid.reservations.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // =========================
    // CREATE
    // =========================
    @PostMapping
    public UserResponseDTO createUser(@Valid @RequestBody UserCreateDTO dto) {
        return userService.saveUser(dto);
    }

    // =========================
    // READ ALL
    // =========================
    @GetMapping
    public List<UserResponseDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    // =========================
    // READ BY ID
    // =========================
    @GetMapping("/{id}")
    public Optional<UserResponseDTO> getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    // =========================
    // DELETE
    // =========================
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}