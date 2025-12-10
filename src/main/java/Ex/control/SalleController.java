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
 * Contrôleur REST pour la gestion des Salles
 */
@RestController
@RequestMapping("/salles")
@PreAuthorize("hasRole('GESTIONNAIRE')")
public class SalleController {

    private final SalleRepository salleRepository;
    private final BatimentRepository batimentRepository;
    private final ReservationRepository reservationRepository;

    public SalleController(SalleRepository salleRepository,
                          BatimentRepository batimentRepository,
                          ReservationRepository reservationRepository) {
        this.salleRepository = salleRepository;
        this.batimentRepository = batimentRepository;
        this.reservationRepository = reservationRepository;
    }

    /**
     * Créer une nouvelle salle
     */
    @PostMapping
    @Transactional
    public ResponseEntity<?> createSalle(@RequestBody Map<String, Object> request) {
        String numS = (String) request.get("numS");
        Integer capacite = request.get("capacite") != null ? ((Number) request.get("capacite")).intValue() : 0;
        String typeS = (String) request.get("typeS");
        String acces = (String) request.get("acces");
        String etage = (String) request.get("etage");
        String batimentCodeB = (String) request.get("batimentCodeB");

        if (salleRepository.existsById(numS)) {
            return ResponseEntity.badRequest().body("Une salle avec ce numéro existe déjà");
        }

        Salle salle = new Salle();
        salle.setNumS(numS);
        salle.setCapacite(capacite);
        if (typeS != null) {
            salle.setTypeS(TypeSalle.valueOf(typeS));
        }
        salle.setAcces(acces);
        salle.setEtage(etage);

        if (batimentCodeB != null && !batimentCodeB.isEmpty()) {
            Batiment batiment = batimentRepository.findById(batimentCodeB).orElse(null);
            salle.setBatiment(batiment);
        }

        salleRepository.save(salle);
        return ResponseEntity.ok(salle);
    }

    /**
     * Mettre à jour une salle
     */
    @PatchMapping("/{numS}")
    @Transactional
    public ResponseEntity<?> updateSalle(@PathVariable String numS, @RequestBody Map<String, Object> request) {
        Salle salle = salleRepository.findById(numS)
                .orElseThrow(() -> new RuntimeException("Salle non trouvée"));

        if (request.containsKey("capacite") && request.get("capacite") != null) {
            salle.setCapacite(((Number) request.get("capacite")).intValue());
        }
        if (request.containsKey("typeS") && request.get("typeS") != null) {
            salle.setTypeS(TypeSalle.valueOf((String) request.get("typeS")));
        }
        if (request.containsKey("acces")) {
            salle.setAcces((String) request.get("acces"));
        }
        if (request.containsKey("etage")) {
            salle.setEtage((String) request.get("etage"));
        }
        if (request.containsKey("batimentCodeB")) {
            String batimentCodeB = (String) request.get("batimentCodeB");
            if (batimentCodeB != null && !batimentCodeB.isEmpty()) {
                Batiment batiment = batimentRepository.findById(batimentCodeB).orElse(null);
                salle.setBatiment(batiment);
            } else {
                salle.setBatiment(null);
            }
        }

        salleRepository.save(salle);
        return ResponseEntity.ok(salle);
    }

    /**
     * Supprimer une salle avec toutes ses réservations
     */
    @DeleteMapping("/{numS}")
    @Transactional
    public ResponseEntity<?> deleteSalle(@PathVariable String numS) {
        Salle salle = salleRepository.findById(numS).orElse(null);
        if (salle == null) {
            return ResponseEntity.notFound().build();
        }

        // 1. Supprimer toutes les réservations liées à cette salle
        List<Reservation> reservations = reservationRepository.findBySalle(salle);
        reservationRepository.deleteAll(reservations);

        // 2. Supprimer la salle
        salleRepository.delete(salle);

        return ResponseEntity.ok("Salle supprimée avec " + reservations.size() + " réservation(s)");
    }
}


