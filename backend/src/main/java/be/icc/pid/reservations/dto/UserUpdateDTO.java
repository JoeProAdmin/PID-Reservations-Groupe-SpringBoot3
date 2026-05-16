package be.icc.pid.reservations.dto;

import be.icc.pid.reservations.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class UserUpdateDTO {

    @NotBlank(message = "Le prénom est obligatoire")
    private String firstName;

    @NotBlank(message = "Le nom est obligatoire")
    private String lastName;

    @Email(message = "Email invalide")
    @NotBlank(message = "L'email est obligatoire")
    private String email;

    // Optionnel : si vide, on garde l'ancien mot de passe
    @Size(min = 6, message = "Le mot de passe doit contenir au moins 6 caractères")
    @Pattern(
            regexp = "^$|^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\\-={}\\[\\]:;\"'<>,.?/\\\\|`~]).{6,}$",
            message = "Le mot de passe doit contenir au moins une majuscule et un caractère spécial"
    )
    private String password;

    // Plus obligatoire : si null, on garde le role existant
    private Role role;

    @Size(max = 50, message = "Le login est trop long (max 50 caractères)")
    private String login;

    @Size(max = 5, message = "Code langue invalide")
    private String language;

    public UserUpdateDTO() {
    }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getLogin() { return login; }
    public void setLogin(String login) { this.login = login; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
}
