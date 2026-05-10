package be.icc.pid.reservations.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "paiements")
public class Paiement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double montant;

    private String methode; // CARD, CASH, ONLINE

    private String statut; // EN_ATTENTE, PAYE, REFUSE

    private LocalDateTime datePaiement;

    @Column(name = "stripe_payment_intent_id")
    private String stripePaymentIntentId;

    @OneToOne
    @JoinColumn(name = "reservation_id")
    private Reservation reservation;

    @PrePersist
    public void prePersist() {
        this.datePaiement = LocalDateTime.now();
    }

    // GETTERS / SETTERS

    public Long getId() { return id; }

    public Double getMontant() { return montant; }
    public void setMontant(Double montant) { this.montant = montant; }

    public String getMethode() { return methode; }
    public void setMethode(String methode) { this.methode = methode; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public LocalDateTime getDatePaiement() { return datePaiement; }

    public String getStripePaymentIntentId() { return stripePaymentIntentId; }
    public void setStripePaymentIntentId(String stripePaymentIntentId) { this.stripePaymentIntentId = stripePaymentIntentId; }

    public Reservation getReservation() { return reservation; }
    public void setReservation(Reservation reservation) { this.reservation = reservation; }
}