package be.icc.pid.reservations.controller;

import be.icc.pid.reservations.entity.Representation;
import be.icc.pid.reservations.entity.Spectacle;
import be.icc.pid.reservations.repository.SpectacleRepository;
import be.icc.pid.reservations.service.RepresentationService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RepresentationControllerTest {

    @Mock
    private RepresentationService representationService;

    @Mock
    private SpectacleRepository spectacleRepository;

    @InjectMocks
    private RepresentationController representationController;

    @Test
    void getBySpectacleRetourneLesRepresentationsAssociees() {
        Representation representation = new Representation();
        List<Representation> expected = List.of(representation);

        when(representationService.getBySpectacleId(5L)).thenReturn(expected);

        List<Representation> actual = representationController.getBySpectacle(5L);

        assertEquals(expected, actual);
        verify(representationService).getBySpectacleId(5L);
    }

    @Test
    void createLanceUneExceptionQuandLeSpectacleEstAbsent() {
        Representation representation = new Representation();
        representation.setDateHeure(LocalDateTime.of(2026, 5, 22, 19, 0));
        representation.setPlacesDisponibles(40);

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> representationController.create(representation)
        );

        assertEquals("spectacleId requis", exception.getMessage());
    }

    @Test
    void createAssocieLeSpectacleEtSauvegardeLaRepresentation() {
        Spectacle spectacle = new Spectacle();
        spectacle.setId(3L);

        Representation representation = new Representation();
        representation.setDateHeure(LocalDateTime.of(2026, 5, 22, 19, 0));
        representation.setPlacesDisponibles(40);
        representation.setSpectacle(spectacle);

        when(spectacleRepository.findById(3L)).thenReturn(Optional.of(spectacle));
        when(representationService.save(any(Representation.class))).thenReturn(representation);

        Representation actual = representationController.create(representation);

        assertSame(representation, actual);
        assertSame(spectacle, representation.getSpectacle());
        verify(spectacleRepository).findById(3L);
        verify(representationService).save(representation);
    }
}
