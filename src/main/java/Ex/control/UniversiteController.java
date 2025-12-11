package Ex.control;

import Ex.domain.*;
import Ex.dto.UniversiteRequestDto;
import Ex.modele.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Contrôleur REST pour la gestion des Universités
 */
@RestController
@RequestMapping("/universites")
@PreAuthorize("hasRole('GESTIONNAIRE')")
public class UniversiteController {

    private final UniversityRepository universiteRepository;
    private final CampusRepository campusRepository;
    private final BatimentRepository batimentRepository;
    private final SalleRepository salleRepository;
    private final ComposantRepository composantRepository;
    private final ReservationRepository reservationRepository;

    public UniversiteController(UniversityRepository universiteRepository,
                               CampusRepository campusRepository,
                               BatimentRepository batimentRepository,
                               SalleRepository salleRepository,
                               ComposantRepository composantRepository,
                               ReservationRepository reservationRepository) {
        this.universiteRepository = universiteRepository;
        this.campusRepository = campusRepository;
        this.batimentRepository = batimentRepository;
        this.salleRepository = salleRepository;
        this.composantRepository = composantRepository;
        this.reservationRepository = reservationRepository;
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> createUniversite(@RequestBody UniversiteRequestDto request) {
        if (universiteRepository.existsById(request.nom())) {
            return ResponseEntity.badRequest().body("Une université avec ce nom existe déjà");
        }

        Universite universite = new Universite();
        universite.setNom(request.nom());
        universite.setAcronyme(request.acronyme());
        if (request.creation() != null) universite.setCreation(request.creation());
        universite.setPresidence(request.presidence());

        universiteRepository.save(universite);
        return ResponseEntity.ok(universite);
    }

    @PatchMapping("/{nom}")
    @Transactional
    public ResponseEntity<?> updateUniversite(@PathVariable String nom, @RequestBody UniversiteRequestDto request) {
        Universite universite = universiteRepository.findById(nom)
                .orElseThrow(() -> new RuntimeException("Université non trouvée"));

        if (request.acronyme() != null) {
            universite.setAcronyme(request.acronyme());
        }
        if (request.creation() != null) {
            universite.setCreation(request.creation());
        }
        if (request.presidence() != null) {
            universite.setPresidence(request.presidence());
        }

        universiteRepository.save(universite);
        return ResponseEntity.ok(universite);
    }

    @DeleteMapping("/{nom}")
    @Transactional
    public ResponseEntity<?> deleteUniversite(@PathVariable String nom) {
        Universite universite = universiteRepository.findById(nom).orElse(null);
        if (universite == null) {
            return ResponseEntity.notFound().build();
        }

        int totalCampus = 0;
        int totalBatiments = 0;
        int totalSalles = 0;
        int totalReservations = 0;

        List<Campus> campusList = campusRepository.findAll().stream()
                .filter(c -> c.getUniversite() != null && c.getUniversite().getNom().equals(nom))
                .toList();
        totalCampus = campusList.size();

        List<String> allBatimentCodes = new ArrayList<>();
        for (Campus campus : campusList) {
            List<Batiment> batiments = batimentRepository.findAll().stream()
                    .filter(b -> b.getCampus() != null && b.getCampus().getNomC().equals(campus.getNomC()))
                    .toList();
            
            for (Batiment batiment : batiments) {
                allBatimentCodes.add(batiment.getCodeB());
                totalBatiments++;

                List<Salle> salles = salleRepository.findAll().stream()
                        .filter(s -> s.getBatiment() != null && s.getBatiment().getCodeB().equals(batiment.getCodeB()))
                        .toList();

                for (Salle salle : salles) {
                    List<Reservation> reservations = reservationRepository.findBySalle(salle);
                    totalReservations += reservations.size();
                    reservationRepository.deleteAll(reservations);
                    totalSalles++;
                }
            }
        }

        List<Composante> allComposantes = composantRepository.findAll();
        for (Composante composante : allComposantes) {
            if (composante.getBatimentList() != null) {
                boolean modified = composante.getBatimentList().removeIf(b -> allBatimentCodes.contains(b.getCodeB()));
                if (modified) {
                    composantRepository.save(composante);
                }
            }
        }

        universiteRepository.delete(universite);

        return ResponseEntity.ok(String.format(
                "Université '%s' supprimée avec %d campus, %d bâtiments, %d salles et %d réservations",
                nom, totalCampus, totalBatiments, totalSalles, totalReservations
        ));
    }
}
