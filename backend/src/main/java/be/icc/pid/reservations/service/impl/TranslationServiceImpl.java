package be.icc.pid.reservations.service.impl;

import be.icc.pid.reservations.dto.TranslationResponse;
import be.icc.pid.reservations.exception.BadRequestException;
import be.icc.pid.reservations.service.TranslationService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class TranslationServiceImpl implements TranslationService {

    private static final Logger log = LoggerFactory.getLogger(TranslationServiceImpl.class);

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final String googleApiKey;
    private final String googleBaseUrl;
    private final String myMemoryUrl;

    public TranslationServiceImpl(@Value("${google.translate.api-key:}") String googleApiKey,
                                  @Value("${google.translate.base-url}") String googleBaseUrl,
                                  @Value("${mymemory.base-url}") String myMemoryUrl) {
        this.googleApiKey = googleApiKey;
        this.googleBaseUrl = googleBaseUrl;
        this.myMemoryUrl = myMemoryUrl;
    }

    @Override
    public TranslationResponse translate(String text, String targetLang, String sourceLang) {
        if (text == null || text.isBlank()) {
            throw new BadRequestException("Le texte à traduire est vide");
        }
        if (targetLang == null || targetLang.isBlank()) {
            throw new BadRequestException("La langue cible est obligatoire");
        }

        // Provider principal : Google Cloud Translation (si clé configurée)
        if (googleApiKey != null && !googleApiKey.isBlank()) {
            try {
                return translateWithGoogle(text, targetLang, sourceLang);
            } catch (Exception e) {
                log.warn("Google Translate a échoué ({}), fallback MyMemory", e.getMessage());
            }
        }

        // Fallback : MyMemory (gratuit, pas de clé requise)
        return translateWithMyMemory(text, targetLang, sourceLang);
    }

    private TranslationResponse translateWithGoogle(String text, String targetLang, String sourceLang) {
        String url = UriComponentsBuilder.fromHttpUrl(googleBaseUrl)
                .queryParam("key", googleApiKey)
                .build().toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("q", text);
        form.add("target", targetLang);
        if (sourceLang != null && !sourceLang.isBlank()) {
            form.add("source", sourceLang);
        }
        form.add("format", "text");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(form, headers);
        String body = restTemplate.exchange(url, HttpMethod.POST, request, String.class).getBody();

        try {
            JsonNode root = objectMapper.readTree(body);
            JsonNode translation = root.path("data").path("translations").path(0);
            String translatedText = translation.path("translatedText").asText();
            String detected = translation.has("detectedSourceLanguage")
                    ? translation.path("detectedSourceLanguage").asText()
                    : sourceLang;
            log.info("Traduction Google : '{}' → '{}' ({})", truncate(text), truncate(translatedText), targetLang);
            return new TranslationResponse(translatedText, detected, targetLang, "Google");
        } catch (Exception e) {
            throw new RuntimeException("Erreur parsing Google Translate : " + e.getMessage(), e);
        }
    }

    private TranslationResponse translateWithMyMemory(String text, String targetLang, String sourceLang) {
        // MyMemory exige source|target ; on suppose 'fr' si non précisée
        String source = (sourceLang != null && !sourceLang.isBlank()) ? sourceLang : "fr";
        String langpair = source + "|" + targetLang;

        String url = UriComponentsBuilder.fromHttpUrl(myMemoryUrl)
                .queryParam("q", text)
                .queryParam("langpair", langpair)
                .build().toUriString();

        try {
            String body = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(body);
            String translatedText = root.path("responseData").path("translatedText").asText();
            log.info("Traduction MyMemory : '{}' → '{}' ({})", truncate(text), truncate(translatedText), targetLang);
            return new TranslationResponse(translatedText, source, targetLang, "MyMemory");
        } catch (Exception e) {
            log.error("Erreur MyMemory : {}", e.getMessage(), e);
            throw new RuntimeException("Service de traduction indisponible : " + e.getMessage(), e);
        }
    }

    private String truncate(String s) {
        if (s == null) return "";
        return s.length() > 50 ? s.substring(0, 50) + "..." : s;
    }
}
