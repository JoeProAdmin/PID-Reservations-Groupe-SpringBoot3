package be.icc.pid.reservations.controller;

import be.icc.pid.reservations.entity.Reservation;
import be.icc.pid.reservations.service.ReservationService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReservationControllerTest {

    @Mock
    private ReservationService reservationService;

    @InjectMocks
    private ReservationController reservationController;

    @Test
    void createRetourneLaReservationCreee() {
        Reservation reservation = new Reservation();

        when(reservationService.createReservation(reservation)).thenReturn(reservation);

        Reservation actual = reservationController.create(reservation);

        assertSame(reservation, actual);
        verify(reservationService).createReservation(reservation);
    }

    @Test
    void getAllRetourneToutesLesReservations() {
        Reservation reservation = new Reservation();
        List<Reservation> expected = List.of(reservation);

        when(reservationService.getAll()).thenReturn(expected);

        List<Reservation> actual = reservationController.getAll();

        assertEquals(expected, actual);
        verify(reservationService).getAll();
    }

    @Test
    void getByIdRetourneLaReservationDemandee() {
        Reservation reservation = new Reservation();

        when(reservationService.getById(4L)).thenReturn(reservation);

        Reservation actual = reservationController.getById(4L);

        assertSame(reservation, actual);
        verify(reservationService).getById(4L);
    }

    @Test
    void getByUserIdRetourneLesReservationsDeLUtilisateur() {
        Reservation reservation = new Reservation();
        List<Reservation> expected = List.of(reservation);

        when(reservationService.getByUserId(8L)).thenReturn(expected);

        List<Reservation> actual = reservationController.getByUserId(8L);

        assertEquals(expected, actual);
        verify(reservationService).getByUserId(8L);
    }

    @Test
    void deleteDelegueLaSuppressionAuService() {
        reservationController.delete(12L);

        verify(reservationService).delete(12L);
    }
}
