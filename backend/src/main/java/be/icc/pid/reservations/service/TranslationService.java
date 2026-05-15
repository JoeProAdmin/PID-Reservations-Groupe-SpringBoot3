package be.icc.pid.reservations.service;

import be.icc.pid.reservations.dto.TranslationResponse;

public interface TranslationService {

    TranslationResponse translate(String text, String targetLang, String sourceLang);
}
