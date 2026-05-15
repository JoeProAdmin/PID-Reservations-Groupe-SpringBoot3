package be.icc.pid.reservations.controller;

import be.icc.pid.reservations.entity.Representation;
import be.icc.pid.reservations.entity.Spectacle;
import be.icc.pid.reservations.repository.RepresentationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/rss")
public class RssController {

    private static final Logger log = LoggerFactory.getLogger(RssController.class);

    private static final DateTimeFormatter RFC_822 =
            DateTimeFormatter.ofPattern("EEE, dd MMM yyyy HH:mm:ss Z", Locale.ENGLISH);

    private static final DateTimeFormatter HUMAN_DATE =
            DateTimeFormatter.ofPattern("EEEE d MMMM yyyy 'à' HH'h'mm", Locale.FRENCH);

    private final RepresentationRepository representationRepository;
    private final String frontendUrl;

    public RssController(RepresentationRepository representationRepository,
                         @Value("${app.frontend.url:http://localhost:3000}") String frontendUrl) {
        this.representationRepository = representationRepository;
        this.frontendUrl = frontendUrl;
    }

    @GetMapping(value = "/spectacles", produces = MediaType.APPLICATION_XML_VALUE)
    @Transactional(readOnly = true)
    public ResponseEntity<String> spectaclesFeed() {

        List<Representation> upcoming =
                representationRepository.findByDateHeureGreaterThanEqualOrderByDateHeureAsc(LocalDateTime.now());

        log.info("RSS spectacles : {} représentations à venir", upcoming.size());

        String pubDate = ZonedDateTime.now(ZoneId.of("Europe/Brussels")).format(RFC_822);

        StringBuilder xml = new StringBuilder();
        xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        xml.append("<rss version=\"2.0\" xmlns:atom=\"http://www.w3.org/2005/Atom\">\n");
        xml.append("  <channel>\n");
        xml.append("    <title>PID Réservations — Prochains spectacles</title>\n");
        xml.append("    <link>").append(escape(frontendUrl)).append("</link>\n");
        xml.append("    <atom:link href=\"").append(escape(frontendUrl)).append("/rss/spectacles\" rel=\"self\" type=\"application/rss+xml\" />\n");
        xml.append("    <description>Flux RSS des prochaines représentations programmées sur PID Réservations.</description>\n");
        xml.append("    <language>fr-be</language>\n");
        xml.append("    <lastBuildDate>").append(pubDate).append("</lastBuildDate>\n");

        for (Representation rep : upcoming) {
            try {
                Spectacle s = rep.getSpectacle();
                if (s == null || rep.getDateHeure() == null) continue;

                String title = (s.getTitle() != null ? s.getTitle() : "Spectacle")
                        + " — " + rep.getDateHeure().format(HUMAN_DATE);
                String link = frontendUrl + "/spectacles/" + s.getId();
                String descr = buildDescription(s, rep);
                String repPubDate = rep.getDateHeure()
                        .atZone(ZoneId.of("Europe/Brussels"))
                        .format(RFC_822);

                xml.append("    <item>\n");
                xml.append("      <title>").append(escape(title)).append("</title>\n");
                xml.append("      <link>").append(escape(link)).append("</link>\n");
                xml.append("      <guid isPermaLink=\"false\">representation-").append(rep.getId()).append("</guid>\n");
                xml.append("      <pubDate>").append(repPubDate).append("</pubDate>\n");
                xml.append("      <description>").append(escape(descr)).append("</description>\n");
                xml.append("    </item>\n");
            } catch (Exception e) {
                log.warn("Représentation #{} ignorée dans le flux RSS : {}", rep.getId(), e.getMessage());
            }
        }

        xml.append("  </channel>\n");
        xml.append("</rss>\n");

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/rss+xml; charset=UTF-8"))
                .body(xml.toString());
    }

    private String buildDescription(Spectacle s, Representation rep) {
        StringBuilder sb = new StringBuilder();
        if (s.getLocation() != null && !s.getLocation().isBlank()) {
            sb.append("Lieu : ").append(s.getLocation()).append(". ");
        }
        sb.append("Date : ").append(rep.getDateHeure().format(HUMAN_DATE)).append(". ");
        if (s.getPrice() != null) {
            sb.append("Prix : ").append(String.format(Locale.FRENCH, "%.2f €", s.getPrice())).append(". ");
        }
        sb.append("Places disponibles : ").append(rep.getPlacesDisponibles()).append(". ");
        if (s.getDescription() != null && !s.getDescription().isBlank()) {
            sb.append(s.getDescription());
        }
        return sb.toString();
    }

    private String escape(String s) {
        if (s == null) return "";
        return s.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&apos;");
    }
}
