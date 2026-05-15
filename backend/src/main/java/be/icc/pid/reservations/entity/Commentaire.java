package be.icc.pid.reservations.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "commentaires",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_commentaire_user_spectacle",
                columnNames = {"user_id", "spectacle_id"}
        )
)
public class Commentaire {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 2000)
    private String contenu;

    @Column(nullable = false)
    private Integer note;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CommentaireStatut statut;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password"})
    private User user;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "spectacle_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Spectacle spectacle;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Commentaire() {
    }

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) this.createdAt = LocalDateTime.now();
        if (this.statut == null) this.statut = CommentaireStatut.PUBLIE;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getContenu() { return contenu; }
    public void setContenu(String contenu) { this.contenu = contenu; }

    public Integer getNote() { return note; }
    public void setNote(Integer note) { this.note = note; }

    public CommentaireStatut getStatut() { return statut; }
    public void setStatut(CommentaireStatut statut) { this.statut = statut; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Spectacle getSpectacle() { return spectacle; }
    public void setSpectacle(Spectacle spectacle) { this.spectacle = spectacle; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
