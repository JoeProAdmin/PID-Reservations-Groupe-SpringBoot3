package be.icc.pid.reservations.service.impl;

import be.icc.pid.reservations.entity.Paiement;
import be.icc.pid.reservations.entity.Reservation;
import be.icc.pid.reservations.entity.ReservationStatus;
import be.icc.pid.reservations.repository.PaiementRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PaiementServiceImplTest {

    @Mock
    private PaiementRepository paiementRepository;

    @InjectMocks
    private PaiementServiceImpl paiementService;

    @Test
    void creerPaiementPourReservationRetourneLePaiementSauvegardeEtConfirmeLaReservation() {
        Reservation reservation = new Reservation();
        reservation.setStatus(ReservationStatus.CREATED);

        when(paiementRepository.save(org.mockito.ArgumentMatchers.any(Paiement.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Paiement actual = paiementService.creerPaiementPourReservation(reservation);

        assertEquals(50.0, actual.getMontant());
        assertEquals("CARD", actual.getMethode());
        assertEquals("PAYE", actual.getStatut());
        assertSame(reservation, actual.getReservation());
        assertEquals(ReservationStatus.CONFIRMED, reservation.getStatus());
        verify(paiementRepository).save(org.mockito.ArgumentMatchers.any(Paiement.class));
    }

    @Test
    void deleteByReservationIdSupprimeLePaiementAssocie() {
        Long reservationId = 14L;

        paiementService.deleteByReservationId(reservationId);

        verify(paiementRepository).deleteByReservationId(reservationId);
    }
}
