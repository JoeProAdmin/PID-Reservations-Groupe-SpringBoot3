package be.icc.pid.reservations.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class TranslationRequest {

    @NotBlank(message = "Le texte à traduire est obligatoire")
    @Size(max = 5000, message = "Le texte est trop long (max 5000 caractères)")
    private String text;

    @NotBlank(message = "La langue cible est obligatoire")
    private String targetLang;

    private String sourceLang; // optionnel : auto-detection si vide

    public TranslationRequest() {
    }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public String getTargetLang() { return targetLang; }
    public void setTargetLang(String targetLang) { this.targetLang = targetLang; }

    public String getSourceLang() { return sourceLang; }
    public void setSourceLang(String sourceLang) { this.sourceLang = sourceLang; }
}
