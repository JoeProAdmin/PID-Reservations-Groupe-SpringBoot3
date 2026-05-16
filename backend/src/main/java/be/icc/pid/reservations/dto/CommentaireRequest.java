package be.icc.pid.reservations.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CommentaireRequest {

    @NotBlank(message = "Le commentaire ne peut pas être vide")
    @Size(max = 2000, message = "Le commentaire est trop long (max 2000 caractères)")
    private String contenu;

    @NotNull(message = "La note est obligatoire")
    @Min(value = 1, message = "La note doit être entre 1 et 5")
    @Max(value = 5, message = "La note doit être entre 1 et 5")
    private Integer note;

    public CommentaireRequest() {
    }

    public String getContenu() { return contenu; }
    public void setContenu(String contenu) { this.contenu = contenu; }

    public Integer getNote() { return note; }
    public void setNote(Integer note) { this.note = note; }
}
