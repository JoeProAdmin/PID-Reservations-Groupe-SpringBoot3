package be.icc.pid.reservations;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordGenerator {

    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String rawPassword = "admin123";
        String encodedPassword = encoder.encode(rawPassword);

        System.out.println("Mot de passe en clair : " + rawPassword);
        System.out.println("Hash BCrypt : " + encodedPassword);
    }
}