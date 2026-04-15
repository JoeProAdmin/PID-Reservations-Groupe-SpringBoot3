package be.icc.pid.reservations.dto;

public class AuthResponse {

    private String token;
    private String role;
    private String prenom;
    private String nom;
    private Long id;

    public AuthResponse(String token, String role, String prenom, String nom, Long id) {
        this.token = token;
        this.role = role;
        this.prenom = prenom;
        this.nom = nom;
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public String getRole() {
        return role;
    }

    public String getPrenom() {
        return prenom;
    }

    public String getNom() {
        return nom;
    }

    public Long getId() {
        return id;
    }
}