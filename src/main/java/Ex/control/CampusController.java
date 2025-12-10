package Ex.control;

import Ex.domain.*;
import Ex.modele.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Contrôleur REST pour la gestion des Campus
 */
@RestController
@RequestMapping("/campus-admin")
@PreAuthorize("hasRole('GESTIONNAIRE')")
public class CampusController {

    private final CampusRepository campusRepository;
    private final BatimentRepository batimentRepository;
    private final ComposantRepository composantRepository;
    private final UniversityRepository universityRepository;
    private final SalleRepository salleRepository;
    private final ReservationRepository reservationRepository;

    public CampusController(CampusRepository campusRepository, 
                           BatimentRepository batimentRepository,
                           ComposantRepository composantRepository,
                           UniversityRepository universityRepository,
                           SalleRepository salleRepository,
                           ReservationRepository reservationRepository) {
        this.campusRepository = campusRepository;
        this.batimentRepository = batimentRepository;
        this.composantRepository = composantRepository;
        this.universityRepository = universityRepository;
        this.salleRepository = salleRepository;
        this.reservationRepository = reservationRepository;
    }

    /**
     * Créer un nouveau campus
     */
    @PostMapping
    @Transactional
    public ResponseEntity<?> createCampus(@RequestBody Map<String, String> request) {
        String nomC = request.get("nomC");
        String ville = request.get("ville");
        String universiteNom = request.get("universiteNom");

        if (campusRepository.existsById(nomC)) {
            return ResponseEntity.badRequest().body("Un campus avec ce nom existe déjà");
        }

        Campus campus = new Campus(nomC, ville);
        
        if (universiteNom != null && !universiteNom.isEmpty()) {
            Universite universite = universityRepository.findById(universiteNom).orElse(null);
            campus.setUniversite(universite);
        }

        campusRepository.save(campus);
        return ResponseEntity.ok(campus);
    }

    /**
     * Mettre à jour un campus
     */
    @PatchMapping("/{nomC}")
    @Transactional
    public ResponseEntity<?> updateCampus(@PathVariable String nomC, @RequestBody Map<String, String> request) {
        Campus campus = campusRepository.findById(nomC)
                .orElseThrow(() -> new RuntimeException("Campus non trouvé"));

        if (request.containsKey("ville")) {
            campus.setVille(request.get("ville"));
        }
        
        if (request.containsKey("universiteNom")) {
            String universiteNom = request.get("universiteNom");
            if (universiteNom != null && !universiteNom.isEmpty()) {
                Universite universite = universityRepository.findById(universiteNom).orElse(null);
                campus.setUniversite(universite);
            } else {
                campus.setUniversite(null);
            }
        }

        campusRepository.save(campus);
        return ResponseEntity.ok(campus);
    }

    /**
     * Supprimer un campus avec tous ses bâtiments
     * Gère correctement les relations ManyToMany avec Composante et les réservations
     */
    @DeleteMapping("/{nomC}")
    @Transactional
    public ResponseEntity<?> deleteCampus(@PathVariable String nomC) {
        Campus campus = campusRepository.findById(nomC).orElse(null);
        if (campus == null) {
            return ResponseEntity.notFound().build();
        }

        // 1. Récupérer tous les bâtiments du campus
        List<Batiment> batiments = batimentRepository.findAll().stream()
                .filter(b -> b.getCampus() != null && b.getCampus().getNomC().equals(nomC))
                .toList();

        // 2. Récupérer toutes les salles des bâtiments du campus
        List<Salle> salles = salleRepository.findAll().stream()
                .filter(s -> s.getBatiment() != null && 
                        s.getBatiment().getCampus() != null && 
                        s.getBatiment().getCampus().getNomC().equals(nomC))
                .toList();

        // 3. Supprimer toutes les réservations liées à ces salles
        for (Salle salle : salles) {
            List<Reservation> reservations = reservationRepository.findBySalle(salle);
            reservationRepository.deleteAll(reservations);
        }

        // 4. Pour chaque bâtiment, supprimer les liens avec les composantes (table Exploite)
        List<Composante> allComposantes = composantRepository.findAll();
        for (Composante composante : allComposantes) {
            if (composante.getBatimentList() != null) {
                composante.getBatimentList().removeIf(b -> 
                    b.getCampus() != null && b.getCampus().getNomC().equals(nomC)
                );
                composantRepository.save(composante);
            }
        }

        // 5. Supprimer le campus (cascade supprimera les bâtiments et salles)
        campusRepository.delete(campus);
        
        return ResponseEntity.ok("Campus supprimé avec " + batiments.size() + " bâtiment(s) et " + salles.size() + " salle(s)");
    }
}
