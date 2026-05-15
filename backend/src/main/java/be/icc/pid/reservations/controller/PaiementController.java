package be.icc.pid.reservations.controller;

import be.icc.pid.reservations.entity.Paiement;
import be.icc.pid.reservations.entity.Representation;
import be.icc.pid.reservations.entity.Reservation;
import be.icc.pid.reservations.entity.ReservationStatus;
import be.icc.pid.reservations.repository.PaiementRepository;
import be.icc.pid.reservations.repository.RepresentationRepository;
import be.icc.pid.reservations.repository.ReservationRepository;
import be.icc.pid.reservations.repository.UserRepository;
import be.icc.pid.reservations.service.EmailService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.PaymentMethod;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/paiements")
@CrossOrigin(origins = "*")
public class PaiementController {

    private static final Logger log = LoggerFactory.getLogger(PaiementController.class);

    private final PaiementRepository paiementRepository;
    private final ReservationRepository reservationRepository;
    private final RepresentationRepository representationRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final String frontendUrl;

    public PaiementController(PaiementRepository paiementRepository,
                              ReservationRepository reservationRepository,
                              RepresentationRepository representationRepository,
                              UserRepository userRepository,
                              EmailService emailService,
                              @Value("${app.frontend.url}") String frontendUrl) {
        this.paiementRepository = paiementRepository;
        this.reservationRepository = reservationRepository;
        this.representationRepository = representationRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.frontendUrl = frontendUrl;
    }

    // ================================================
    // Liste de tous les paiements (admin)
    // ================================================
    @GetMapping
    public ResponseEntity<java.util.List<Paiement>> getAll() {
        return ResponseEntity.ok(paiementRepository.findAll());
    }

    // ================================================
    // Cree une Stripe Checkout Session et retourne l'URL
    // de la page hostee par Stripe (qui propose toutes les
    // methodes activees : carte, Bancontact, iDEAL, etc.)
    // ================================================
    @Transactional
    @PostMapping("/create-checkout-session")
    public ResponseEntity<Map<String, String>> createCheckoutSession(@RequestParam Long reservationId) {

        try {
            Reservation reservation = reservationRepository.findById(reservationId)
                    .orElseThrow(() -> new EntityNotFoundException("Reservation introuvable: " + reservationId));

            if (reservation.getRepresentation() == null
                    || reservation.getRepresentation().getSpectacle() == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Representation ou spectacle introuvable pour la reservation #" + reservationId);
                return ResponseEntity.badRequest().body(error);
            }

            // Anti-double-paiement
            java.util.Optional<Paiement> existing = paiementRepository.findByReservation(reservation);
            if (existing.isPresent()) {
                Paiement p = existing.get();
                if ("PAYE".equals(p.getStatut())) {
                    Map<String, String> error = new HashMap<>();
                    error.put("error", "Cette reservation est deja payee.");
                    return ResponseEntity.badRequest().body(error);
                }
                paiementRepository.delete(p);
                paiementRepository.flush();
            }

            String spectacleTitle = reservation.getRepresentation().getSpectacle().getTitle();
            long montantCentimes = Math.round(reservation.getNumberOfSeats()
                    * reservation.getRepresentation().getSpectacle().getPrice() * 100);

            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl(frontendUrl + "/paiement/success?session_id={CHECKOUT_SESSION_ID}&reservationId=" + reservationId)
                    .setCancelUrl(frontendUrl + "/paiement/cancel?reservationId=" + reservationId)
                    .setLocale(SessionCreateParams.Locale.FR)
                    .putMetadata("reservation_id", reservationId.toString())
                    .addLineItem(
                            SessionCreateParams.LineItem.builder()
                                    .setQuantity((long) reservation.getNumberOfSeats())
                                    .setPriceData(
                                            SessionCreateParams.LineItem.PriceData.builder()
                                                    .setCurrency("eur")
                                                    .setUnitAmount(Math.round(reservation.getRepresentation().getSpectacle().getPrice() * 100))
                                                    .setProductData(
                                                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                    .setName(spectacleTitle)
                                                                    .setDescription("Reservation #" + reservationId
                                                                            + " - " + reservation.getNumberOfSeats() + " place(s)")
                                                                    .build()
                                                    )
                                                    .build()
                                    )
                                    .build()
                    )
                    .build();

            Session session = Session.create(params);

            // Sauvegarde du paiement EN_ATTENTE avec l'ID de la session
            Paiement paiement = new Paiement();
            paiement.setMontant(montantCentimes / 100.0);
            paiement.setMethode("CHECKOUT");
            paiement.setStatut("EN_ATTENTE");
            paiement.setStripePaymentIntentId(session.getId());
            paiement.setReservation(reservation);
            paiementRepository.save(paiement);

            Map<String, String> response = new HashMap<>();
            response.put("url", session.getUrl());
            response.put("sessionId", session.getId());
            response.put("montant", String.valueOf(montantCentimes / 100.0));

            return ResponseEntity.ok(response);

        } catch (StripeException e) {
            log.error("Erreur Stripe lors de la creation de la session", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Stripe: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            log.error("Erreur serveur lors de la creation de la session", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Erreur serveur: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    // ================================================
    // Confirme le paiement apres le retour de Stripe
    // (appele par la page /paiement/success)
    // ================================================
    @Transactional
    @PostMapping("/confirmer-checkout")
    public ResponseEntity<Map<String, String>> confirmerCheckout(@RequestParam String sessionId) {

        try {
            Session session = Session.retrieve(sessionId);

            if (!"paid".equals(session.getPaymentStatus())) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Paiement non finalise (statut Stripe : " + session.getPaymentStatus() + ")");
                return ResponseEntity.badRequest().body(error);
            }

            String reservationIdStr = session.getMetadata().get("reservation_id");
            if (reservationIdStr == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Metadonnee reservation_id manquante");
                return ResponseEntity.badRequest().body(error);
            }
            Long reservationId = Long.parseLong(reservationIdStr);

            Reservation reservation = reservationRepository.findById(reservationId)
                    .orElseThrow(() -> new EntityNotFoundException("Reservation introuvable: " + reservationId));

            Paiement paiement = paiementRepository.findByReservation(reservation)
                    .orElseThrow(() -> new EntityNotFoundException("Paiement introuvable pour la reservation: " + reservationId));

            // Idempotent : si deja PAYE on retourne juste OK
            if ("PAYE".equals(paiement.getStatut())) {
                Map<String, String> response = new HashMap<>();
                response.put("status", "success");
                response.put("message", "Paiement deja confirme");
                response.put("methode", paiement.getMethode());
                return ResponseEntity.ok(response);
            }

            // Recupere la vraie methode utilisee (card, bancontact, ideal, etc.)
            String methodeUtilisee = "CARD";
            if (session.getPaymentIntent() != null) {
                try {
                    PaymentIntent intent = PaymentIntent.retrieve(session.getPaymentIntent());
                    if (intent.getPaymentMethod() != null) {
                        PaymentMethod pm = PaymentMethod.retrieve(intent.getPaymentMethod());
                        if (pm.getType() != null) {
                            methodeUtilisee = pm.getType().toUpperCase();
                        }
                    }
                } catch (StripeException e) {
                    log.warn("Impossible de recuperer la methode Stripe : {}", e.getMessage());
                }
            }

            paiement.setStatut("PAYE");
            paiement.setMethode(methodeUtilisee);
            paiementRepository.save(paiement);

            // Decremente les places disponibles maintenant que le paiement est confirme
            Representation representation = reservation.getRepresentation();
            if (representation != null) {
                int placesRestantes = representation.getPlacesDisponibles() - reservation.getNumberOfSeats();
                if (placesRestantes < 0) {
                    log.warn("Overbooking detecte sur representation #{} : {} places dispo, {} demandees. " +
                                    "Le paiement a deja ete encaisse par Stripe, decrementation forcee a 0.",
                            representation.getId(), representation.getPlacesDisponibles(),
                            reservation.getNumberOfSeats());
                    placesRestantes = 0;
                }
                representation.setPlacesDisponibles(placesRestantes);
                representationRepository.save(representation);
            }

            reservation.setStatus(ReservationStatus.CONFIRMED);
            reservationRepository.save(reservation);

            // Email de confirmation de paiement (recu)
            if (reservation.getUser() != null && reservation.getUser().getId() != null) {
                final Paiement paiementFinal = paiement;
                final Reservation reservationFinal = reservation;
                userRepository.findById(reservation.getUser().getId())
                        .ifPresent(user -> emailService.sendPaymentConfirmationEmail(user, reservationFinal, paiementFinal));
            }

            Map<String, String> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Paiement confirme et reservation validee");
            response.put("methode", methodeUtilisee);

            return ResponseEntity.ok(response);

        } catch (StripeException e) {
            log.error("Erreur Stripe lors de la confirmation", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Stripe: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        } catch (Exception e) {
            log.error("Erreur lors de la confirmation du paiement", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Erreur lors de la confirmation: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
}
