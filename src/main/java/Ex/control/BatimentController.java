package Ex.control;

import Ex.domain.*;
import Ex.dto.BatimentRequestDto;
import Ex.modele.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<?> createBatiment(@RequestBody BatimentRequestDto request) {
        if (batimentRepository.existsById(request.codeB())) {
            return ResponseEntity.badRequest().body("Un bâtiment avec ce code existe déjà");
        }

        Batiment batiment = new Batiment();
        batiment.setCodeB(request.codeB());
        if (request.anneeC() != null) batiment.setAnneeC(request.anneeC());
        batiment.setLatitude(request.latitude());
        batiment.setLongitude(request.longitude());

        if (request.campusNomC() != null && !request.campusNomC().isEmpty()) {
            Campus campus = campusRepository.findById(request.campusNomC()).orElse(null);
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
    public ResponseEntity<?> updateBatiment(@PathVariable String codeB, @RequestBody BatimentRequestDto request) {
        Batiment batiment = batimentRepository.findById(codeB)
                .orElseThrow(() -> new RuntimeException("Bâtiment non trouvé"));

        if (request.anneeC() != null) {
            batiment.setAnneeC(request.anneeC());
        }
        if (request.latitude() != null) {
            batiment.setLatitude(request.latitude());
        }
        if (request.longitude() != null) {
            batiment.setLongitude(request.longitude());
        }
        if (request.campusNomC() != null) {
            if (!request.campusNomC().isEmpty()) {
                Campus campus = campusRepository.findById(request.campusNomC()).orElse(null);
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


        List<Salle> salles = salleRepository.findAll().stream()
                .filter(s -> s.getBatiment() != null && s.getBatiment().getCodeB().equals(codeB))
                .toList();


        for (Salle salle : salles) {
            List<Reservation> reservations = reservationRepository.findBySalle(salle);
            reservationRepository.deleteAll(reservations);
        }

        List<Composante> allComposantes = composantRepository.findAll();
        for (Composante composante : allComposantes) {
            if (composante.getBatimentList() != null) {
                composante.getBatimentList().removeIf(b -> b.getCodeB().equals(codeB));
                composantRepository.save(composante);
            }
        }


        salleRepository.deleteAll(salles);

        batimentRepository.delete(batiment);

        return ResponseEntity.ok("Bâtiment supprimé avec " + salles.size() + " salle(s)");
    }
}
