package be.icc.pid.reservations.service.impl;

import be.icc.pid.reservations.dto.CommentaireRequest;
import be.icc.pid.reservations.dto.CommentaireResponse;
import be.icc.pid.reservations.entity.Commentaire;
import be.icc.pid.reservations.entity.CommentaireStatut;
import be.icc.pid.reservations.entity.Spectacle;
import be.icc.pid.reservations.entity.User;
import be.icc.pid.reservations.exception.BadRequestException;
import be.icc.pid.reservations.exception.ResourceNotFoundException;
import be.icc.pid.reservations.repository.CommentaireRepository;
import be.icc.pid.reservations.repository.SpectacleRepository;
import be.icc.pid.reservations.repository.UserRepository;
import be.icc.pid.reservations.service.CommentaireService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CommentaireServiceImpl implements CommentaireService {

    private final CommentaireRepository commentaireRepository;
    private final UserRepository userRepository;
    private final SpectacleRepository spectacleRepository;

    public CommentaireServiceImpl(CommentaireRepository commentaireRepository,
                                  UserRepository userRepository,
                                  SpectacleRepository spectacleRepository) {
        this.commentaireRepository = commentaireRepository;
        this.userRepository = userRepository;
        this.spectacleRepository = spectacleRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentaireResponse> getPublishedForSpectacle(Long spectacleId) {
        return commentaireRepository
                .findBySpectacleIdAndStatutOrderByCreatedAtDesc(spectacleId, CommentaireStatut.PUBLIE)
                .stream()
                .map(CommentaireResponse::from)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentaireResponse> getAll() {
        return commentaireRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(CommentaireResponse::from)
                .toList();
    }

    @Override
    @Transactional
    public CommentaireResponse create(Long spectacleId, String userEmail, CommentaireRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable"));

        Spectacle spectacle = spectacleRepository.findById(spectacleId)
                .orElseThrow(() -> new ResourceNotFoundException("Spectacle introuvable"));

        if (commentaireRepository.existsByUserIdAndSpectacleId(user.getId(), spectacleId)) {
            throw new BadRequestException("Vous avez déjà commenté ce spectacle. Modifiez votre commentaire existant.");
        }

        Commentaire commentaire = new Commentaire();
        commentaire.setUser(user);
        commentaire.setSpectacle(spectacle);
        commentaire.setContenu(request.getContenu());
        commentaire.setNote(request.getNote());
        commentaire.setStatut(CommentaireStatut.PUBLIE);

        return CommentaireResponse.from(commentaireRepository.save(commentaire));
    }

    @Override
    @Transactional
    public CommentaireResponse update(Long commentaireId, String userEmail, CommentaireRequest request) {
        Commentaire commentaire = commentaireRepository.findById(commentaireId)
                .orElseThrow(() -> new ResourceNotFoundException("Commentaire introuvable"));

        if (commentaire.getUser() == null || !commentaire.getUser().getEmail().equalsIgnoreCase(userEmail)) {
            throw new AccessDeniedException("Vous ne pouvez modifier que vos propres commentaires");
        }

        commentaire.setContenu(request.getContenu());
        commentaire.setNote(request.getNote());

        return CommentaireResponse.from(commentaireRepository.save(commentaire));
    }

    @Override
    @Transactional
    public CommentaireResponse changeStatut(Long commentaireId, CommentaireStatut statut) {
        Commentaire commentaire = commentaireRepository.findById(commentaireId)
                .orElseThrow(() -> new ResourceNotFoundException("Commentaire introuvable"));
        commentaire.setStatut(statut);
        return CommentaireResponse.from(commentaireRepository.save(commentaire));
    }

    @Override
    @Transactional
    public void delete(Long commentaireId, String userEmail, boolean isAdmin) {
        Commentaire commentaire = commentaireRepository.findById(commentaireId)
                .orElseThrow(() -> new ResourceNotFoundException("Commentaire introuvable"));

        boolean isOwner = commentaire.getUser() != null
                && commentaire.getUser().getEmail().equalsIgnoreCase(userEmail);

        if (!isAdmin && !isOwner) {
            throw new AccessDeniedException("Vous ne pouvez supprimer que vos propres commentaires");
        }

        commentaireRepository.delete(commentaire);
    }
}
