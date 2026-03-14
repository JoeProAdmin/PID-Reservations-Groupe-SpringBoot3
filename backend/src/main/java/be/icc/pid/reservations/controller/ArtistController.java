package be.icc.pid.reservations.controller;

import be.icc.pid.reservations.entity.Artist;
import be.icc.pid.reservations.repository.ArtistRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/artists")
public class ArtistController {

    private final ArtistRepository artistRepository;

    public ArtistController(ArtistRepository artistRepository) {
        this.artistRepository = artistRepository;
    }

    // GET ALL
    @GetMapping
    public List<Artist> getAllArtists() {
        return artistRepository.findAll();
    }

    // GET BY ID
    @GetMapping("/{id}")
    public Artist getArtistById(@PathVariable Long id) {
        return artistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Artist not found"));
    }

    // CREATE
    @PostMapping
    public Artist createArtist(@RequestBody Artist artist) {
        artist.setCreatedAt(LocalDateTime.now());
        artist.setUpdatedAt(LocalDateTime.now());
        return artistRepository.save(artist);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Artist updateArtist(@PathVariable Long id, @RequestBody Artist updatedArtist) {
        Artist artist = artistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Artist not found"));

        artist.setName(updatedArtist.getName());
        artist.setGenre(updatedArtist.getGenre());
        artist.setCountry(updatedArtist.getCountry());
        artist.setDescription(updatedArtist.getDescription());
        artist.setUpdatedAt(LocalDateTime.now());

        return artistRepository.save(artist);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArtist(@PathVariable Long id) {
        Artist artist = artistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Artist not found"));

        artistRepository.delete(artist);
        return ResponseEntity.noContent().build();
    }
}
