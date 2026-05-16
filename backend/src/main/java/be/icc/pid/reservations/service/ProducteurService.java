package be.icc.pid.reservations.service;

import be.icc.pid.reservations.dto.CommentaireResponse;
import be.icc.pid.reservations.dto.ProducteurStatsResponse;
import be.icc.pid.reservations.entity.CommentaireStatut;

import java.util.List;

public interface ProducteurService {

    ProducteurStatsResponse getStats(String producerEmail);

    List<CommentaireResponse> getCommentairesForProducer(String producerEmail);

    CommentaireResponse moderateCommentaire(String producerEmail, Long commentaireId, CommentaireStatut statut);

    void deleteCommentaire(String producerEmail, Long commentaireId);
}
