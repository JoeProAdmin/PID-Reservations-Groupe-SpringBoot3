package be.icc.pid.reservations.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class UserCreateDTO {

    @NotBlank(message = "Email obligatoire")
    @Email(message = "Email invalide")
    private String email;

    // Min 6 caracteres, au moins une majuscule, au moins un caractere special
    @NotBlank(message = "Mot de passe obligatoire")
    @Size(min = 6, message = "Le mot de passe doit contenir au moins 6 caractères")
    @Pattern(
            regexp = "^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\\-={}\\[\\]:;\"'<>,.?/\\\\|`~]).{6,}$",
            message = "Le mot de passe doit contenir au moins une majuscule et un caractère spécial"
    )
    private String password;

    @NotBlank(message = "Prénom obligatoire")
    private String firstName;

    @NotBlank(message = "Nom obligatoire")
    private String lastName;

    @Size(max = 50, message = "Le login est trop long (max 50 caractères)")
    private String login;

    @Size(max = 5, message = "Code langue invalide")
    private String language;

    public UserCreateDTO() {}

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getLogin() { return login; }
    public void setLogin(String login) { this.login = login; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
}
