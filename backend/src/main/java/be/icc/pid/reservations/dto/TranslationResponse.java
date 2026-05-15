package be.icc.pid.reservations.dto;

public class TranslationResponse {

    private String translatedText;
    private String detectedSourceLang;
    private String targetLang;
    private String provider; // "Google" ou "MyMemory"

    public TranslationResponse() {
    }

    public TranslationResponse(String translatedText, String detectedSourceLang, String targetLang, String provider) {
        this.translatedText = translatedText;
        this.detectedSourceLang = detectedSourceLang;
        this.targetLang = targetLang;
        this.provider = provider;
    }

    public String getTranslatedText() { return translatedText; }
    public void setTranslatedText(String translatedText) { this.translatedText = translatedText; }

    public String getDetectedSourceLang() { return detectedSourceLang; }
    public void setDetectedSourceLang(String detectedSourceLang) { this.detectedSourceLang = detectedSourceLang; }

    public String getTargetLang() { return targetLang; }
    public void setTargetLang(String targetLang) { this.targetLang = targetLang; }

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }
}
