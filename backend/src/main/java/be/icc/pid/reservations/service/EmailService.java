package be.icc.pid.reservations.service;

import be.icc.pid.reservations.entity.Paiement;
import be.icc.pid.reservations.entity.Reservation;
import be.icc.pid.reservations.entity.User;

public interface EmailService {

    void sendPasswordResetEmail(User user, String resetLink);

    void sendReservationConfirmationEmail(User user, Reservation reservation);

    void sendPaymentConfirmationEmail(User user, Reservation reservation, Paiement paiement);

    void sendProducerApprovalEmail(User user);
}
