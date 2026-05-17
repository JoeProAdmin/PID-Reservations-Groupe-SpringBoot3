package be.icc.pid.reservations.controller;

import be.icc.pid.reservations.entity.Spectacle;
import be.icc.pid.reservations.service.SpectacleService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SpectacleControllerTest {

    @Mock
    private SpectacleService spectacleService;

    @InjectMocks
    private SpectacleController spectacleController;

    @Test
    void getAllRetourneLaListeDesSpectacles() {
        Spectacle spectacle = new Spectacle();
        List<Spectacle> spectacles = List.of(spectacle);

        when(spectacleService.getAllSpectacles()).thenReturn(spectacles);

        ResponseEntity<List<Spectacle>> response = spectacleController.getAll();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(spectacles, response.getBody());
        verify(spectacleService).getAllSpectacles();
    }

    @Test
    void getByIdRetourneLeSpectacleQuandIlExiste() {
        Spectacle spectacle = new Spectacle();

        when(spectacleService.getSpectacleById(2L)).thenReturn(Optional.of(spectacle));

        ResponseEntity<Spectacle> response = spectacleController.getById(2L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertSame(spectacle, response.getBody());
        verify(spectacleService).getSpectacleById(2L);
    }

    @Test
    void getByIdRetourneNotFoundQuandLeSpectacleEstAbsent() {
        when(spectacleService.getSpectacleById(8L)).thenReturn(Optional.empty());

        ResponseEntity<Spectacle> response = spectacleController.getById(8L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(spectacleService).getSpectacleById(8L);
    }

    @Test
    void createRetourneLeSpectacleCree() {
        Spectacle spectacle = new Spectacle();

        when(spectacleService.createSpectacle(spectacle)).thenReturn(spectacle);

        ResponseEntity<Spectacle> response = spectacleController.create(spectacle);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertSame(spectacle, response.getBody());
        verify(spectacleService).createSpectacle(spectacle);
    }

    @Test
    void updateRetourneLeSpectacleMisAJour() {
        Spectacle spectacle = new Spectacle();

        when(spectacleService.updateSpectacle(4L, spectacle)).thenReturn(spectacle);

        ResponseEntity<Spectacle> response = spectacleController.update(4L, spectacle);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertSame(spectacle, response.getBody());
        verify(spectacleService).updateSpectacle(4L, spectacle);
    }

    @Test
    void deleteRetourneNoContent() {
        ResponseEntity<Void> response = spectacleController.delete(12L);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(spectacleService).deleteSpectacle(12L);
    }
}
