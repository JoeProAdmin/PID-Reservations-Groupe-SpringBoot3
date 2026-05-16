package be.icc.pid.reservations.dto;

public class UserResponseDTO {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private String login;
    private String language;

    public UserResponseDTO() {
    }

    public UserResponseDTO(Long id, String firstName, String lastName, String email, String role) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
    }

    public UserResponseDTO(Long id, String firstName, String lastName, String email, String role,
                           String login, String language) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
        this.login = login;
        this.language = language;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getLogin() { return login; }
    public void setLogin(String login) { this.login = login; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
}
