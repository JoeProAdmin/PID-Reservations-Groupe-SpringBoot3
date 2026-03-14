package be.icc.pid.reservations.dto;

public class UserCreateDTO {

    private String nom;
    private String prenom;
    private String email;
    private String password;
    private String role;

    public UserCreateDTO() {
    }

    public String getNom() {
        return nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getRole() {
        return role;
    }
}
