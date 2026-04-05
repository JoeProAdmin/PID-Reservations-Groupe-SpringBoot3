package be.icc.pid.reservations.controller;

import be.icc.pid.reservations.entity.Artist;
import be.icc.pid.reservations.repository.ArtistRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDateTime;

@Controller
public class ArtistViewController {

    private final ArtistRepository artistRepository;

    public ArtistViewController(ArtistRepository artistRepository) {
        this.artistRepository = artistRepository;
    }

    @GetMapping("/artists")
    public String listArtists(Model model) {
        model.addAttribute("artists", artistRepository.findAll());
        model.addAttribute("title", "Liste des artistes");
        return "artists/index";
    }

    @GetMapping("/artists/create")
    public String showCreateForm() {
        return "artists/create";
    }

    @PostMapping("/artists/create")
    public String createArtist(@RequestParam String name,
                               @RequestParam String genre,
                               @RequestParam String country,
                               @RequestParam String description) {

        Artist artist = new Artist();
        artist.setName(name);
        artist.setGenre(genre);
        artist.setCountry(country);
        artist.setDescription(description);
        artist.setCreatedAt(LocalDateTime.now());
        artist.setUpdatedAt(LocalDateTime.now());

        artistRepository.save(artist);

        return "redirect:/artists";
    }
}