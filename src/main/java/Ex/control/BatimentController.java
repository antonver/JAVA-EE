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
 * Contrôleur REST pour la gestion des Bâtiments
 */
@RestController
@RequestMapping("/batiments")
@PreAuthorize("hasRole('GESTIONNAIRE')")
public class BatimentController {

    private final BatimentRepository batimentRepository;
    private final CampusRepository campusRepository;
    private final ComposantRepository composantRepository;
    private final SalleRepository salleRepository;
    private final ReservationRepository reservationRepository;

    public BatimentController(BatimentRepository batimentRepository,
                             CampusRepository campusRepository,
                             ComposantRepository composantRepository,
                             SalleRepository salleRepository,
                             ReservationRepository reservationRepository) {
        this.batimentRepository = batimentRepository;
        this.campusRepository = campusRepository;
        this.composantRepository = composantRepository;
        this.salleRepository = salleRepository;
        this.reservationRepository = reservationRepository;
    }

    /**
     * Créer un nouveau bâtiment
     */
    @PostMapping
    @Transactional
    public ResponseEntity<?> createBatiment(@RequestBody Map<String, Object> request) {
        String codeB = (String) request.get("codeB");
        Integer anneeC = request.get("anneeC") != null ? ((Number) request.get("anneeC")).intValue() : null;
        Double latitude = request.get("latitude") != null ? ((Number) request.get("latitude")).doubleValue() : null;
        Double longitude = request.get("longitude") != null ? ((Number) request.get("longitude")).doubleValue() : null;
        String campusNomC = (String) request.get("campusNomC");

        if (batimentRepository.existsById(codeB)) {
            return ResponseEntity.badRequest().body("Un bâtiment avec ce code existe déjà");
        }

        Batiment batiment = new Batiment();
        batiment.setCodeB(codeB);
        if (anneeC != null) batiment.setAnneeC(anneeC);
        batiment.setLatitude(latitude);
        batiment.setLongitude(longitude);

        if (campusNomC != null && !campusNomC.isEmpty()) {
            Campus campus = campusRepository.findById(campusNomC).orElse(null);
            batiment.setCampus(campus);
        }

        batimentRepository.save(batiment);
        return ResponseEntity.ok(batiment);
    }

    /**
     * Mettre à jour un bâtiment
     */
    @PatchMapping("/{codeB}")
    @Transactional
    public ResponseEntity<?> updateBatiment(@PathVariable String codeB, @RequestBody Map<String, Object> request) {
        Batiment batiment = batimentRepository.findById(codeB)
                .orElseThrow(() -> new RuntimeException("Bâtiment non trouvé"));

        if (request.containsKey("anneeC") && request.get("anneeC") != null) {
            batiment.setAnneeC(((Number) request.get("anneeC")).intValue());
        }
        if (request.containsKey("latitude")) {
            batiment.setLatitude(request.get("latitude") != null ? ((Number) request.get("latitude")).doubleValue() : null);
        }
        if (request.containsKey("longitude")) {
            batiment.setLongitude(request.get("longitude") != null ? ((Number) request.get("longitude")).doubleValue() : null);
        }
        if (request.containsKey("campusNomC")) {
            String campusNomC = (String) request.get("campusNomC");
            if (campusNomC != null && !campusNomC.isEmpty()) {
                Campus campus = campusRepository.findById(campusNomC).orElse(null);
                batiment.setCampus(campus);
            } else {
                batiment.setCampus(null);
            }
        }

        batimentRepository.save(batiment);
        return ResponseEntity.ok(batiment);
    }

    /**
     * Supprimer un bâtiment avec toutes ses salles et réservations
     */
    @DeleteMapping("/{codeB}")
    @Transactional
    public ResponseEntity<?> deleteBatiment(@PathVariable String codeB) {
        Batiment batiment = batimentRepository.findById(codeB).orElse(null);
        if (batiment == null) {
            return ResponseEntity.notFound().build();
        }

        // 1. Récupérer toutes les salles du bâtiment
        List<Salle> salles = salleRepository.findAll().stream()
                .filter(s -> s.getBatiment() != null && s.getBatiment().getCodeB().equals(codeB))
                .toList();

        // 2. Supprimer toutes les réservations liées à ces salles
        for (Salle salle : salles) {
            List<Reservation> reservations = reservationRepository.findBySalle(salle);
            reservationRepository.deleteAll(reservations);
        }

        // 3. Supprimer les liens avec les composantes (table Exploite)
        List<Composante> allComposantes = composantRepository.findAll();
        for (Composante composante : allComposantes) {
            if (composante.getBatimentList() != null) {
                composante.getBatimentList().removeIf(b -> b.getCodeB().equals(codeB));
                composantRepository.save(composante);
            }
        }

        // 4. Supprimer les salles
        salleRepository.deleteAll(salles);

        // 5. Supprimer le bâtiment
        batimentRepository.delete(batiment);

        return ResponseEntity.ok("Bâtiment supprimé avec " + salles.size() + " salle(s)");
    }
}


