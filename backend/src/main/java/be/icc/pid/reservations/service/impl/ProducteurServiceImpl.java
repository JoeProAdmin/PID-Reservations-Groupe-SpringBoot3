package be.icc.pid.reservations.service.impl;

import be.icc.pid.reservations.dto.CommentaireResponse;
import be.icc.pid.reservations.dto.ProducteurStatsResponse;
import be.icc.pid.reservations.entity.*;
import be.icc.pid.reservations.exception.ResourceNotFoundException;
import be.icc.pid.reservations.repository.*;
import be.icc.pid.reservations.service.ProducteurService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProducteurServiceImpl implements ProducteurService {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    private final UserRepository userRepository;
    private final SpectacleRepository spectacleRepository;
    private final RepresentationRepository representationRepository;
    private final ReservationRepository reservationRepository;
    private final PaiementRepository paiementRepository;
    private final CommentaireRepository commentaireRepository;

    public ProducteurServiceImpl(UserRepository userRepository,
                                 SpectacleRepository spectacleRepository,
                                 RepresentationRepository representationRepository,
                                 ReservationRepository reservationRepository,
                                 PaiementRepository paiementRepository,
                                 CommentaireRepository commentaireRepository) {
        this.userRepository = userRepository;
        this.spectacleRepository = spectacleRepository;
        this.representationRepository = representationRepository;
        this.reservationRepository = reservationRepository;
        this.paiementRepository = paiementRepository;
        this.commentaireRepository = commentaireRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public ProducteurStatsResponse getStats(String producerEmail) {
        User producer = userRepository.findByEmail(producerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Producteur introuvable"));

        List<Spectacle> spectacles = spectacleRepository.findByProducerIdOrderByDateDesc(producer.getId());
        List<Reservation> allReservations = reservationRepository.findByRepresentationSpectacleProducerId(producer.getId());
        List<Paiement> paiementsPaye = paiementRepository
                .findByReservationRepresentationSpectacleProducerIdAndStatut(producer.getId(), "PAYE");

        // Index pour le calcul par spectacle
        Map<Long, List<Reservation>> reservationsBySpectacle = allReservations.stream()
                .filter(r -> r.getRepresentation() != null && r.getRepresentation().getSpectacle() != null)
                .collect(Collectors.groupingBy(r -> r.getRepresentation().getSpectacle().getId()));

        Map<Long, List<Paiement>> paiementsBySpectacle = paiementsPaye.stream()
                .filter(p -> p.getReservation() != null
                        && p.getReservation().getRepresentation() != null
                        && p.getReservation().getRepresentation().getSpectacle() != null)
                .collect(Collectors.groupingBy(p -> p.getReservation().getRepresentation().getSpectacle().getId()));

        ProducteurStatsResponse response = new ProducteurStatsResponse();
        List<ProducteurStatsResponse.SpectacleStats> spectaclesStats = new ArrayList<>();

        int totalRepresentations = 0;
        int totalSeatsSold = 0;
        double totalRevenue = 0.0;
        int totalComments = 0;
        double notesSum = 0.0;
        int notesCount = 0;

        for (Spectacle s : spectacles) {
            ProducteurStatsResponse.SpectacleStats stats = new ProducteurStatsResponse.SpectacleStats();
            stats.setId(s.getId());
            stats.setTitle(s.getTitle());
            stats.setLocation(s.getLocation());
            stats.setDate(s.getDate() != null ? s.getDate().format(DATE_FORMAT) : null);

            List<Representation> reps = representationRepository.findBySpectacleId(s.getId());
            stats.setRepresentationsCount(reps.size());
            totalRepresentations += reps.size();

            // Capacité totale = somme initiale (places restantes + places vendues)
            int seatsSold = reservationsBySpectacle.getOrDefault(s.getId(), List.of()).stream()
                    .mapToInt(Reservation::getNumberOfSeats).sum();
            int placesRestantes = reps.stream().mapToInt(Representation::getPlacesDisponibles).sum();
            int totalCapacity = placesRestantes + seatsSold;

            stats.setSeatsSold(seatsSold);
            stats.setTotalCapacity(totalCapacity);
            stats.setFillRate(totalCapacity > 0 ? (seatsSold * 100.0 / totalCapacity) : 0.0);
            stats.setReservationsCount(reservationsBySpectacle.getOrDefault(s.getId(), List.of()).size());

            double revenue = paiementsBySpectacle.getOrDefault(s.getId(), List.of()).stream()
                    .mapToDouble(p -> p.getMontant() != null ? p.getMontant() : 0.0).sum();
            stats.setRevenue(revenue);

            List<Commentaire> comments = commentaireRepository.findBySpectacleId(s.getId());
            List<Commentaire> publishedComments = comments.stream()
                    .filter(c -> c.getStatut() == CommentaireStatut.PUBLIE)
                    .toList();
            stats.setCommentsCount(comments.size());
            if (!publishedComments.isEmpty()) {
                double avg = publishedComments.stream().mapToInt(Commentaire::getNote).average().orElse(0.0);
                stats.setAverageRating(Math.round(avg * 10.0) / 10.0);
                notesSum += publishedComments.stream().mapToInt(Commentaire::getNote).sum();
                notesCount += publishedComments.size();
            }

            totalSeatsSold += seatsSold;
            totalRevenue += revenue;
            totalComments += comments.size();

            spectaclesStats.add(stats);
        }

        response.setTotalSpectacles(spectacles.size());
        response.setTotalRepresentations(totalRepresentations);
        response.setTotalReservations(allReservations.size());
        response.setTotalSeatsSold(totalSeatsSold);
        response.setTotalRevenue(totalRevenue);
        response.setTotalComments(totalComments);
        response.setAverageRating(notesCount > 0 ? Math.round((notesSum / notesCount) * 10.0) / 10.0 : null);
        response.setSpectacles(spectaclesStats);

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentaireResponse> getCommentairesForProducer(String producerEmail) {
        User producer = userRepository.findByEmail(producerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Producteur introuvable"));
        return commentaireRepository.findBySpectacleProducerIdOrderByCreatedAtDesc(producer.getId())
                .stream().map(CommentaireResponse::from).toList();
    }

    @Override
    @Transactional
    public CommentaireResponse moderateCommentaire(String producerEmail, Long commentaireId, CommentaireStatut statut) {
        Commentaire c = loadAndCheckOwnership(producerEmail, commentaireId);
        c.setStatut(statut);
        return CommentaireResponse.from(commentaireRepository.save(c));
    }

    @Override
    @Transactional
    public void deleteCommentaire(String producerEmail, Long commentaireId) {
        Commentaire c = loadAndCheckOwnership(producerEmail, commentaireId);
        commentaireRepository.delete(c);
    }

    private Commentaire loadAndCheckOwnership(String producerEmail, Long commentaireId) {
        Commentaire c = commentaireRepository.findById(commentaireId)
                .orElseThrow(() -> new ResourceNotFoundException("Commentaire introuvable"));
        if (c.getSpectacle() == null || c.getSpectacle().getProducer() == null
                || !c.getSpectacle().getProducer().getEmail().equalsIgnoreCase(producerEmail)) {
            throw new AccessDeniedException("Vous ne pouvez modérer que les commentaires de vos propres spectacles");
        }
        return c;
    }
}
