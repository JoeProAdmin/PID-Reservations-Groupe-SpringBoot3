package be.icc.pid.reservations.service.impl;

import be.icc.pid.reservations.entity.Spectacle;
import be.icc.pid.reservations.exception.ResourceNotFoundException;
import be.icc.pid.reservations.repository.SpectacleRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SpectacleServiceImplTest {

    @Mock
    private SpectacleRepository spectacleRepository;

    @InjectMocks
    private SpectacleServiceImpl spectacleService;

    @Test
    void getAllSpectaclesRetourneLesElementsDuRepository() {
        Spectacle spectacle = new Spectacle();
        List<Spectacle> expected = List.of(spectacle);

        when(spectacleRepository.findAll()).thenReturn(expected);

        List<Spectacle> actual = spectacleService.getAllSpectacles();

        assertEquals(expected, actual);
        verify(spectacleRepository).findAll();
    }

    @Test
    void createSpectacleInitialiseLesDatesPuisSauvegarde() {
        Spectacle spectacle = spectacleAvecValeurs("Titre initial");

        when(spectacleRepository.save(spectacle)).thenReturn(spectacle);

        Spectacle actual = spectacleService.createSpectacle(spectacle);

        assertSame(spectacle, actual);
        assertNotNull(spectacle.getCreatedAt());
        assertNull(spectacle.getUpdatedAt());
        verify(spectacleRepository).save(spectacle);
    }

    @Test
    void updateSpectacleMetAJourLesChampsEtSauvegarde() {
        Long spectacleId = 6L;
        Spectacle existing = spectacleAvecValeurs("Ancien titre");
        Spectacle updated = spectacleAvecValeurs("Nouveau titre");
        updated.setDescription("Nouvelle description");
        updated.setLocation("Nouveau lieu");
        updated.setPrice(42.0);

        when(spectacleRepository.findById(spectacleId)).thenReturn(Optional.of(existing));
        when(spectacleRepository.save(existing)).thenReturn(existing);

        Spectacle actual = spectacleService.updateSpectacle(spectacleId, updated);

        assertSame(existing, actual);
        assertEquals("Nouveau titre", existing.getTitle());
        assertEquals("Nouvelle description", existing.getDescription());
        assertEquals("Nouveau lieu", existing.getLocation());
        assertEquals(42.0, existing.getPrice());
        assertNotNull(existing.getUpdatedAt());
        verify(spectacleRepository).findById(spectacleId);
        verify(spectacleRepository).save(existing);
    }

    @Test
    void deleteSpectacleSupprimeLeSpectacleQuandIlExiste() {
        Long spectacleId = 3L;
        Spectacle existing = new Spectacle();

        when(spectacleRepository.findById(spectacleId)).thenReturn(Optional.of(existing));

        spectacleService.deleteSpectacle(spectacleId);

        verify(spectacleRepository).findById(spectacleId);
        verify(spectacleRepository).delete(existing);
    }

    @Test
    void deleteSpectacleLanceUneExceptionQuandIlEstIntrouvable() {
        Long spectacleId = 11L;

        when(spectacleRepository.findById(spectacleId)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> spectacleService.deleteSpectacle(spectacleId)
        );

        assertEquals("Spectacle introuvable avec l'id : 11", exception.getMessage());
        verify(spectacleRepository).findById(spectacleId);
    }

    private Spectacle spectacleAvecValeurs(String title) {
        Spectacle spectacle = new Spectacle();
        spectacle.setTitle(title);
        spectacle.setDescription("Description");
        spectacle.setDate(LocalDateTime.of(2026, 5, 17, 20, 0));
        spectacle.setLocation("Bruxelles");
        spectacle.setPrice(25.0);
        return spectacle;
    }
}
