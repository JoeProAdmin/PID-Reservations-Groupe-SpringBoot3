package be.icc.pid.reservations.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class ResetPasswordRequest {

    @NotBlank
    private String token;

    // Min 6 caracteres, au moins une majuscule, au moins un caractere special
    // (memes regles qu'a l'inscription)
    @NotBlank
    @Size(min = 6, message = "Le mot de passe doit contenir au moins 6 caractères")
    @Pattern(
            regexp = "^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\\-={}\\[\\]:;\"'<>,.?/\\\\|`~]).{6,}$",
            message = "Le mot de passe doit contenir au moins une majuscule et un caractère spécial"
    )
    private String newPassword;

    public ResetPasswordRequest() {
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
}
