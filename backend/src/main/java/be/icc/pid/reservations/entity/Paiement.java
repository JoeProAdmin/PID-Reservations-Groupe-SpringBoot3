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

    private LocalDateTime datePaiement;

    @Enumerated(EnumType.STRING)
    private PaiementStatut statut;

    @OneToOne
    @JoinColumn(name = "reservation_id")
    private Reservation reservation;

    public Paiement() {
    }

    public Long getId() {
        return id;
    }

    public Double getMontant() {
        return montant;
    }

    public LocalDateTime getDatePaiement() {
        return datePaiement;
    }

    public PaiementStatut getStatut() {
        return statut;
    }

    public Reservation getReservation() {
        return reservation;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setMontant(Double montant) {
        this.montant = montant;
    }

    public void setDatePaiement(LocalDateTime datePaiement) {
        this.datePaiement = datePaiement;
    }

    public void setStatut(PaiementStatut statut) {
        this.statut = statut;
    }

    public void setReservation(Reservation reservation) {
        this.reservation = reservation;
    }
}