package be.icc.pid.reservations.dto;

import be.icc.pid.reservations.entity.Commentaire;
import be.icc.pid.reservations.entity.CommentaireStatut;

import java.time.LocalDateTime;

public class CommentaireResponse {

    private Long id;
    private String contenu;
    private Integer note;
    private CommentaireStatut statut;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Long userId;
    private String userPrenom;
    private String userNom;

    private Long spectacleId;
    private String spectacleTitle;

    public CommentaireResponse() {
    }

    public static CommentaireResponse from(Commentaire c) {
        CommentaireResponse dto = new CommentaireResponse();
        dto.id = c.getId();
        dto.contenu = c.getContenu();
        dto.note = c.getNote();
        dto.statut = c.getStatut();
        dto.createdAt = c.getCreatedAt();
        dto.updatedAt = c.getUpdatedAt();
        if (c.getUser() != null) {
            dto.userId = c.getUser().getId();
            dto.userPrenom = c.getUser().getPrenom();
            dto.userNom = c.getUser().getNom();
        }
        if (c.getSpectacle() != null) {
            dto.spectacleId = c.getSpectacle().getId();
            dto.spectacleTitle = c.getSpectacle().getTitle();
        }
        return dto;
    }

    public Long getId() { return id; }
    public String getContenu() { return contenu; }
    public Integer getNote() { return note; }
    public CommentaireStatut getStatut() { return statut; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public Long getUserId() { return userId; }
    public String getUserPrenom() { return userPrenom; }
    public String getUserNom() { return userNom; }
    public Long getSpectacleId() { return spectacleId; }
    public String getSpectacleTitle() { return spectacleTitle; }
}
