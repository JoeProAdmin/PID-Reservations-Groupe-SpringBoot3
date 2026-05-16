package be.icc.pid.reservations.service;

import be.icc.pid.reservations.dto.CommentaireRequest;
import be.icc.pid.reservations.dto.CommentaireResponse;
import be.icc.pid.reservations.entity.CommentaireStatut;

import java.util.List;

public interface CommentaireService {

    List<CommentaireResponse> getPublishedForSpectacle(Long spectacleId);

    List<CommentaireResponse> getAll();

    CommentaireResponse create(Long spectacleId, String userEmail, CommentaireRequest request);

    CommentaireResponse update(Long commentaireId, String userEmail, CommentaireRequest request);

    CommentaireResponse changeStatut(Long commentaireId, CommentaireStatut statut);

    void delete(Long commentaireId, String userEmail, boolean isAdmin);
}
