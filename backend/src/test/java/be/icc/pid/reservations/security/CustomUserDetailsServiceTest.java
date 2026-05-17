package be.icc.pid.reservations.security;

import be.icc.pid.reservations.entity.User;
import be.icc.pid.reservations.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CustomUserDetailsServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CustomUserDetailsService customUserDetailsService;

    @Test
    void loadUserByUsernameRetourneUnUtilisateurAvecLAutoriteAdmin() {
        User user = new User();
        user.setEmail("admin@test.be");
        user.setPassword("secret");
        user.setRole("ROLE_ADMIN");

        when(userRepository.findByEmail("admin@test.be")).thenReturn(Optional.of(user));

        UserDetails userDetails = customUserDetailsService.loadUserByUsername("admin@test.be");

        assertEquals("admin@test.be", userDetails.getUsername());
        assertEquals("secret", userDetails.getPassword());
        assertEquals("ROLE_ADMIN", userDetails.getAuthorities().iterator().next().getAuthority());
        verify(userRepository).findByEmail("admin@test.be");
    }

    @Test
    void loadUserByUsernameLanceUneExceptionQuandLUtilisateurEstIntrouvable() {
        when(userRepository.findByEmail("absent@test.be")).thenReturn(Optional.empty());

        UsernameNotFoundException exception = assertThrows(
                UsernameNotFoundException.class,
                () -> customUserDetailsService.loadUserByUsername("absent@test.be")
        );

        assertEquals("Utilisateur introuvable", exception.getMessage());
        verify(userRepository).findByEmail("absent@test.be");
    }
}
