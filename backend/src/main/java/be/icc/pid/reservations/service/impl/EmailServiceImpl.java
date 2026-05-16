package be.icc.pid.reservations.service.impl;

import be.icc.pid.reservations.entity.Paiement;
import be.icc.pid.reservations.entity.Representation;
import be.icc.pid.reservations.entity.Reservation;
import be.icc.pid.reservations.entity.Spectacle;
import be.icc.pid.reservations.entity.User;
import be.icc.pid.reservations.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailServiceImpl.class);

    private static final DateTimeFormatter DATE_FORMAT =
            DateTimeFormatter.ofPattern("EEEE d MMMM yyyy 'à' HH'h'mm", Locale.FRENCH);

    private final JavaMailSender mailSender;
    private final String fromAddress;
    private final String frontendUrl;

    public EmailServiceImpl(JavaMailSender mailSender,
                            @Value("${app.mail.from}") String fromAddress,
                            @Value("${app.frontend.url}") String frontendUrl) {
        this.mailSender = mailSender;
        this.fromAddress = fromAddress;
        this.frontendUrl = frontendUrl;
    }

    @Override
    public void sendPasswordResetEmail(User user, String resetLink) {
        String subject = "Réinitialisation de votre mot de passe - PID Réservations";
        String body = """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="background-color: #1a1a1a; padding: 20px; text-align: center;">
                    <h1 style="color: #fec810; margin: 0;">PID Réservations</h1>
                  </div>
                  <div style="padding: 30px; background-color: #f8f9fa;">
                    <h2 style="color: #1a1a1a;">Bonjour %s,</h2>
                    <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
                    <p>Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe :</p>
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="%s"
                         style="background-color: #fec810; color: #1a1a1a; padding: 12px 30px;
                                text-decoration: none; font-weight: bold; border-radius: 4px;
                                display: inline-block;">
                        Réinitialiser mon mot de passe
                      </a>
                    </div>
                    <p style="font-size: 0.9em; color: #6c757d;">
                      Ce lien est valable pendant 1 heure. Si vous n'êtes pas à l'origine de cette demande,
                      ignorez cet email.
                    </p>
                    <p style="font-size: 0.85em; color: #6c757d; word-break: break-all;">
                      Lien direct : %s
                    </p>
                  </div>
                  <div style="text-align: center; padding: 15px; color: #6c757d; font-size: 0.8em;">
                    © PID Réservations - Tous droits réservés
                  </div>
                </div>
                """.formatted(user.getPrenom(), resetLink, resetLink);

        sendHtmlEmail(user.getEmail(), subject, body);
    }

    @Override
    public void sendReservationConfirmationEmail(User user, Reservation reservation) {
        Representation representation = reservation.getRepresentation();
        Spectacle spectacle = representation != null ? representation.getSpectacle() : null;

        String spectacleTitle = spectacle != null ? spectacle.getTitle() : "Spectacle";
        String location = spectacle != null && spectacle.getLocation() != null
                ? spectacle.getLocation() : "Lieu à confirmer";
        String dateStr = representation != null && representation.getDateHeure() != null
                ? representation.getDateHeure().format(DATE_FORMAT) : "Date à confirmer";
        Double price = spectacle != null ? spectacle.getPrice() : 0.0;
        double total = (price != null ? price : 0.0) * reservation.getNumberOfSeats();

        String subject = "Confirmation de votre réservation - " + spectacleTitle;
        String body = """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="background-color: #1a1a1a; padding: 20px; text-align: center;">
                    <h1 style="color: #fec810; margin: 0;">PID Réservations</h1>
                  </div>
                  <div style="padding: 30px; background-color: #f8f9fa;">
                    <h2 style="color: #1a1a1a;">Merci %s !</h2>
                    <p>Votre réservation a bien été enregistrée. Voici le récapitulatif :</p>
                    <table style="width: 100%%; border-collapse: collapse; margin: 20px 0;">
                      <tr style="border-bottom: 1px solid #dee2e6;">
                        <td style="padding: 10px; font-weight: bold;">Spectacle</td>
                        <td style="padding: 10px;">%s</td>
                      </tr>
                      <tr style="border-bottom: 1px solid #dee2e6;">
                        <td style="padding: 10px; font-weight: bold;">Date</td>
                        <td style="padding: 10px;">%s</td>
                      </tr>
                      <tr style="border-bottom: 1px solid #dee2e6;">
                        <td style="padding: 10px; font-weight: bold;">Lieu</td>
                        <td style="padding: 10px;">%s</td>
                      </tr>
                      <tr style="border-bottom: 1px solid #dee2e6;">
                        <td style="padding: 10px; font-weight: bold;">Nombre de places</td>
                        <td style="padding: 10px;">%d</td>
                      </tr>
                      <tr style="border-bottom: 1px solid #dee2e6;">
                        <td style="padding: 10px; font-weight: bold;">Total</td>
                        <td style="padding: 10px; color: #fec810; font-weight: bold;">%.2f €</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px; font-weight: bold;">Réservation n°</td>
                        <td style="padding: 10px;">#%d</td>
                      </tr>
                    </table>
                    <p style="font-size: 0.9em; color: #6c757d;">
                      Retrouvez vos réservations dans votre espace personnel.
                    </p>
                  </div>
                  <div style="text-align: center; padding: 15px; color: #6c757d; font-size: 0.8em;">
                    © PID Réservations - Tous droits réservés
                  </div>
                </div>
                """.formatted(
                        user.getPrenom(),
                        spectacleTitle,
                        dateStr,
                        location,
                        reservation.getNumberOfSeats(),
                        total,
                        reservation.getId()
                );

        sendHtmlEmail(user.getEmail(), subject, body);
    }

    @Override
    public void sendPaymentConfirmationEmail(User user, Reservation reservation, Paiement paiement) {
        Representation representation = reservation.getRepresentation();
        Spectacle spectacle = representation != null ? representation.getSpectacle() : null;

        String spectacleTitle = spectacle != null ? spectacle.getTitle() : "Spectacle";
        String dateStr = representation != null && representation.getDateHeure() != null
                ? representation.getDateHeure().format(DATE_FORMAT) : "Date à confirmer";
        String methode = paiement.getMethode() != null ? paiement.getMethode().toUpperCase() : "CARTE";
        String datePaiementStr = paiement.getDatePaiement() != null
                ? paiement.getDatePaiement().format(DATE_FORMAT) : "à l'instant";

        String subject = "Paiement confirmé - " + spectacleTitle;
        String body = """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="background-color: #1a1a1a; padding: 20px; text-align: center;">
                    <h1 style="color: #fec810; margin: 0;">PID Réservations</h1>
                  </div>
                  <div style="padding: 30px; background-color: #f8f9fa;">
                    <div style="text-align: center; margin-bottom: 20px;">
                      <div style="display: inline-block; width: 60px; height: 60px; line-height: 60px; border-radius: 50%%; background-color: #198754; color: white; font-size: 30px; font-weight: bold;">
                        ✓
                      </div>
                    </div>
                    <h2 style="color: #1a1a1a; text-align: center;">Paiement reçu</h2>
                    <p>Bonjour %s,</p>
                    <p>Nous avons bien reçu votre paiement. Voici votre reçu :</p>
                    <table style="width: 100%%; border-collapse: collapse; margin: 20px 0;">
                      <tr style="border-bottom: 1px solid #dee2e6;">
                        <td style="padding: 10px; font-weight: bold;">Spectacle</td>
                        <td style="padding: 10px;">%s</td>
                      </tr>
                      <tr style="border-bottom: 1px solid #dee2e6;">
                        <td style="padding: 10px; font-weight: bold;">Date du spectacle</td>
                        <td style="padding: 10px;">%s</td>
                      </tr>
                      <tr style="border-bottom: 1px solid #dee2e6;">
                        <td style="padding: 10px; font-weight: bold;">Nombre de places</td>
                        <td style="padding: 10px;">%d</td>
                      </tr>
                      <tr style="border-bottom: 1px solid #dee2e6;">
                        <td style="padding: 10px; font-weight: bold;">Méthode de paiement</td>
                        <td style="padding: 10px;">%s</td>
                      </tr>
                      <tr style="border-bottom: 1px solid #dee2e6;">
                        <td style="padding: 10px; font-weight: bold;">Date du paiement</td>
                        <td style="padding: 10px;">%s</td>
                      </tr>
                      <tr style="border-bottom: 1px solid #dee2e6; background-color: #fff3cd;">
                        <td style="padding: 12px; font-weight: bold; font-size: 1.1em;">Montant total</td>
                        <td style="padding: 12px; color: #198754; font-weight: bold; font-size: 1.2em;">%.2f €</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px; font-weight: bold;">Référence paiement</td>
                        <td style="padding: 10px; font-family: monospace;">#%d</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px; font-weight: bold;">Référence réservation</td>
                        <td style="padding: 10px; font-family: monospace;">#%d</td>
                      </tr>
                    </table>
                    <p style="font-size: 0.9em; color: #6c757d; text-align: center; margin-top: 20px;">
                      Conservez cet email comme preuve de paiement.<br>
                      Présentez votre confirmation de réservation à l'entrée du spectacle.
                    </p>
                  </div>
                  <div style="text-align: center; padding: 15px; color: #6c757d; font-size: 0.8em;">
                    © PID Réservations - Paiement sécurisé par Stripe
                  </div>
                </div>
                """.formatted(
                        user.getPrenom(),
                        spectacleTitle,
                        dateStr,
                        reservation.getNumberOfSeats(),
                        methode,
                        datePaiementStr,
                        paiement.getMontant() != null ? paiement.getMontant() : 0.0,
                        paiement.getId(),
                        reservation.getId()
                );

        sendHtmlEmail(user.getEmail(), subject, body);
    }

    @Override
    public void sendProducerApprovalEmail(User user) {
        String subject = "Votre compte producteur a été validé - PID Réservations";
        String dashboardLink = frontendUrl + "/producteur/dashboard";

        String body = """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="background-color: #1a1a1a; padding: 20px; text-align: center;">
                    <h1 style="color: #fec810; margin: 0;">PID Réservations</h1>
                  </div>
                  <div style="padding: 30px; background-color: #f8f9fa;">
                    <div style="text-align: center; margin-bottom: 20px;">
                      <div style="display: inline-block; width: 60px; height: 60px; line-height: 60px; border-radius: 50%%; background-color: #198754; color: white; font-size: 30px; font-weight: bold;">
                        ✓
                      </div>
                    </div>
                    <h2 style="color: #1a1a1a; text-align: center;">Compte producteur validé !</h2>
                    <p>Bonjour %s,</p>
                    <p>Excellente nouvelle : votre demande de compte producteur a été <strong>approuvée</strong> par notre équipe d'administration.</p>
                    <p>Vous avez maintenant accès à votre espace producteur, où vous pouvez :</p>
                    <ul style="line-height: 1.8;">
                      <li>Créer et gérer vos propres spectacles</li>
                      <li>Suivre les statistiques (réservations, revenus, taux de remplissage)</li>
                      <li>Modérer les commentaires de vos spectacles</li>
                      <li>Consulter la note moyenne attribuée par les spectateurs</li>
                    </ul>
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="%s"
                         style="background-color: #fec810; color: #1a1a1a; padding: 14px 32px;
                                text-decoration: none; font-weight: bold; border-radius: 4px;
                                display: inline-block; text-transform: uppercase;">
                        Accéder à mon espace producteur
                      </a>
                    </div>
                    <p style="font-size: 0.9em; color: #6c757d; text-align: center; margin-top: 20px;">
                      Bienvenue dans la communauté des producteurs PID Réservations !
                    </p>
                  </div>
                  <div style="text-align: center; padding: 15px; color: #6c757d; font-size: 0.8em;">
                    © PID Réservations - Tous droits réservés
                  </div>
                </div>
                """.formatted(user.getPrenom(), dashboardLink);

        sendHtmlEmail(user.getEmail(), subject, body);
    }

    private void sendHtmlEmail(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromAddress);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
            log.info("Email envoyé à {} (sujet: {})", to, subject);
        } catch (MessagingException e) {
            log.error("Erreur lors de l'envoi de l'email à {} : {}", to, e.getMessage(), e);
        } catch (Exception e) {
            log.error("Erreur inattendue lors de l'envoi de l'email à {} : {}", to, e.getMessage(), e);
        }
    }
}
