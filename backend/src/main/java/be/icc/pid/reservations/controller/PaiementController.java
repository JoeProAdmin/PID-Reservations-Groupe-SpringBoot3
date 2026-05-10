package be.icc.pid.reservations.controller;

import be.icc.pid.reservations.entity.Paiement;
import be.icc.pid.reservations.entity.Reservation;
import be.icc.pid.reservations.entity.ReservationStatus;
import be.icc.pid.reservations.repository.PaiementRepository;
import be.icc.pid.reservations.repository.ReservationRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

import org.springframework.transaction.annotation.Transactional;

@RestController
@RequestMapping("/api/paiements")
@CrossOrigin(origins = "*")
public class PaiementController {

    private final PaiementRepository paiementRepository;
    private final ReservationRepository reservationRepository;

    public PaiementController(PaiementRepository paiementRepository,
                              ReservationRepository reservationRepository) {
        this.paiementRepository = paiementRepository;
        this.reservationRepository = reservationRepository;
    }

    // ================================================
    // Liste de tous les paiements (admin)
    // ================================================
    @GetMapping
    public ResponseEntity<java.util.List<Paiement>> getAll() {
        return ResponseEntity.ok(paiementRepository.findAll());
    }

    // ================================================
    // Etape 1 : Creer un PaymentIntent Stripe
    // Le frontend recoit le clientSecret pour le formulaire
    // ================================================
    @Transactional
    @PostMapping("/create-payment-intent")
    public ResponseEntity<Map<String, String>> createPaymentIntent(@RequestParam Long reservationId) {

        try {
            Reservation reservation = reservationRepository.findById(reservationId)
                    .orElseThrow(() -> new EntityNotFoundException("Reservation introuvable: " + reservationId));

            if (reservation.getRepresentation() == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Representation non liee a la reservation #" + reservationId);
                return ResponseEntity.badRequest().body(error);
            }

            if (reservation.getRepresentation().getSpectacle() == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Spectacle non lie a la representation");
                return ResponseEntity.badRequest().body(error);
            }

            // --- FIX STRICT MODE REACT ---
            // Si l'utilisateur visite 2 fois la page, ou si React double-fetch, on evite l'erreur Duplicate (OneToOne)
            java.util.Optional<Paiement> existing = paiementRepository.findByReservation(reservation);
            if (existing.isPresent()) {
                Paiement p = existing.get();
                if ("PAYE".equals(p.getStatut())) {
                    Map<String, String> error = new HashMap<>();
                    error.put("error", "Cette reservation est deja payee.");
                    return ResponseEntity.badRequest().body(error);
                }
                // Supprimer l'ancien paiement en attente avant d'en recreer un nouveau
                paiementRepository.delete(p);
                paiementRepository.flush();
            }

            // Calcul du montant (Stripe utilise les centimes)
            long montantCentimes = Math.round(reservation.getNumberOfSeats()
                    * reservation.getRepresentation().getSpectacle().getPrice() * 100);

            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(montantCentimes)
                    .setCurrency("eur")
                    .setDescription("Reservation #" + reservation.getId()
                            + " - " + reservation.getRepresentation().getSpectacle().getTitle())
                    .putMetadata("reservation_id", reservation.getId().toString())
                    .build();

            PaymentIntent intent = PaymentIntent.create(params);

            // Sauvegarder le paiement en attente
            Paiement paiement = new Paiement();
            paiement.setMontant(montantCentimes / 100.0);
            paiement.setMethode("CARD");
            paiement.setStatut("EN_ATTENTE");
            paiement.setStripePaymentIntentId(intent.getId());
            paiement.setReservation(reservation);
            paiementRepository.save(paiement);

            Map<String, String> response = new HashMap<>();
            response.put("clientSecret", intent.getClientSecret());
            response.put("montant", String.valueOf(montantCentimes / 100.0));
            response.put("paiementId", paiement.getId().toString());

            return ResponseEntity.ok(response);

        } catch (StripeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Stripe: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Erreur serveur: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    // ================================================
    // Etape 2 : Confirmer le paiement apres succes Stripe
    // Le frontend appelle cet endpoint apres le paiement
    // ================================================
    @Transactional
    @PostMapping("/confirmer")
    public ResponseEntity<Map<String, String>> confirmerPaiement(@RequestParam Long reservationId) {

        try {
            Reservation reservation = reservationRepository.findById(reservationId)
                    .orElseThrow(() -> new EntityNotFoundException("Reservation introuvable: " + reservationId));

            Paiement paiement = paiementRepository.findByReservation(reservation)
                    .orElseThrow(() -> new EntityNotFoundException("Paiement introuvable pour la reservation: " + reservationId));

            paiement.setStatut("PAYE");
            paiementRepository.save(paiement);

            reservation.setStatus(ReservationStatus.CONFIRMED);
            reservationRepository.save(reservation);

            Map<String, String> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Paiement confirme et reservation validee");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Erreur lors de la confirmation: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
}