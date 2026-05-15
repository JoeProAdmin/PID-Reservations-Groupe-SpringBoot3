package be.icc.pid.reservations.controller;

import be.icc.pid.reservations.dto.TranslationRequest;
import be.icc.pid.reservations.dto.TranslationResponse;
import be.icc.pid.reservations.service.TranslationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/translate")
public class TranslationController {

    private final TranslationService translationService;

    public TranslationController(TranslationService translationService) {
        this.translationService = translationService;
    }

    @PostMapping
    public ResponseEntity<TranslationResponse> translate(@Valid @RequestBody TranslationRequest request) {
        return ResponseEntity.ok(
                translationService.translate(
                        request.getText(),
                        request.getTargetLang(),
                        request.getSourceLang()
                )
        );
    }
}
