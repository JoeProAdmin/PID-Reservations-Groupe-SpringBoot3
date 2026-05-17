package be.icc.pid.reservations.service.impl;

import be.icc.pid.reservations.entity.Reservation;
import be.icc.pid.reservations.entity.ReservationStatus;
import be.icc.pid.reservations.entity.Representation;
import be.icc.pid.reservations.entity.User;
import be.icc.pid.reservations.repository.RepresentationRepository;
import be.icc.pid.reservations.repository.ReservationRepository;
import be.icc.pid.reservations.service.PaiementService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReservationServiceImplTest {

    @Mock
    private ReservationRepository reservationRepository;

    @Mock
    private RepresentationRepository representationRepository;

    @Mock
    private PaiementService paiementService;

    @InjectMocks
    private ReservationServiceImpl reservationService;

    @Test
    void createDiminueLesPlacesEtSauvegardeLaReservation() {
        Representation representation = new Representation();
        representation.setPlacesDisponibles(10);

        Reservation reservation = new Reservation();
        reservation.setRepresentation(representationAvecId(3L));
        reservation.setNumberOfSeats(4);
        reservation.setUser(new User());

        when(representationRepository.findById(3L)).thenReturn(Optional.of(representation));
        when(reservationRepository.save(reservation)).thenReturn(reservation);

        Reservation actual = reservationService.create(reservation);

        assertSame(reservation, actual);
        assertEquals(6, representation.getPlacesDisponibles());
        verify(representationRepository).save(representation);
        verify(reservationRepository).save(reservation);
    }

    @Test
    void createLanceUneExceptionQuandIlNYAPasAssezDePlaces() {
        Representation representation = new Representation();
        representation.setPlacesDisponibles(2);

        Reservation reservation = new Reservation();
        reservation.setRepresentation(representationAvecId(4L));
        reservation.setNumberOfSeats(3);

        when(representationRepository.findById(4L)).thenReturn(Optional.of(representation));

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> reservationService.create(reservation)
        );

        assertEquals("Pas assez de places disponibles", exception.getMessage());
        verify(representationRepository, never()).save(representation);
        verify(reservationRepository, never()).save(reservation);
    }

    @Test
    void deleteRemetLesPlacesEtSupprimeLaReservation() {
        Representation representation = new Representation();
        representation.setPlacesDisponibles(5);

        Reservation reservation = new Reservation();
        reservation.setRepresentation(representation);
        reservation.setNumberOfSeats(2);
        reservation.setStatus(ReservationStatus.CREATED);

        when(reservationRepository.findById(9L)).thenReturn(Optional.of(reservation));

        reservationService.delete(9L);

        assertEquals(7, representation.getPlacesDisponibles());
        verify(paiementService).deleteByReservationId(9L);
        verify(representationRepository).save(representation);
        verify(reservationRepository).delete(reservation);
    }

    private Representation representationAvecId(Long id) {
        Representation representation = new Representation();
        try {
            var field = Representation.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(representation, id);
        } catch (ReflectiveOperationException e) {
            throw new RuntimeException(e);
        }
        return representation;
    }
}
