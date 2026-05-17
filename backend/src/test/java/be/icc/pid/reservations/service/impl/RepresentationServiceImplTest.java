package be.icc.pid.reservations.service.impl;

import be.icc.pid.reservations.entity.Representation;
import be.icc.pid.reservations.exception.ResourceNotFoundException;
import be.icc.pid.reservations.repository.RepresentationRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RepresentationServiceImplTest {

    @Mock
    private RepresentationRepository representationRepository;

    @InjectMocks
    private RepresentationServiceImpl representationService;

    @Test
    void getBySpectacleIdRetourneLesRepresentationsDuRepository() {
        Long spectacleId = 4L;
        Representation representation = new Representation();
        List<Representation> expected = List.of(representation);

        when(representationRepository.findBySpectacleId(spectacleId)).thenReturn(expected);

        List<Representation> actual = representationService.getBySpectacleId(spectacleId);

        assertEquals(expected, actual);
        verify(representationRepository).findBySpectacleId(spectacleId);
    }

    @Test
    void saveRetourneLaRepresentationSauvegardee() {
        Representation representation = new Representation();

        when(representationRepository.save(representation)).thenReturn(representation);

        Representation actual = representationService.save(representation);

        assertSame(representation, actual);
        verify(representationRepository).save(representation);
    }

    @Test
    void deleteSupprimeLaRepresentationQuandElleExiste() {
        Long representationId = 7L;
        Representation representation = new Representation();

        when(representationRepository.findById(representationId)).thenReturn(Optional.of(representation));

        representationService.delete(representationId);

        verify(representationRepository).findById(representationId);
        verify(representationRepository).delete(representation);
    }

    @Test
    void deleteLanceUneExceptionQuandLaRepresentationNExistePas() {
        Long representationId = 8L;

        when(representationRepository.findById(representationId)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> representationService.delete(representationId)
        );

        assertEquals("Représentation introuvable avec l'id : 8", exception.getMessage());
        verify(representationRepository).findById(representationId);
    }
}
