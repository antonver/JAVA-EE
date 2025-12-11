package Ex.control;

import Ex.domain.*;
import Ex.dto.SalleRequestDto;
import Ex.modele.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<?> createSalle(@RequestBody SalleRequestDto request) {
        if (salleRepository.existsById(request.numS())) {
            return ResponseEntity.badRequest().body("Une salle avec ce numéro existe déjà");
        }

        Salle salle = new Salle();
        salle.setNumS(request.numS());
        salle.setCapacite(request.capacite() != null ? request.capacite() : 0);
        if (request.typeS() != null) {
            salle.setTypeS(TypeSalle.valueOf(request.typeS()));
        }
        salle.setAcces(request.acces());
        salle.setEtage(request.etage());

        if (request.batimentCodeB() != null && !request.batimentCodeB().isEmpty()) {
            Batiment batiment = batimentRepository.findById(request.batimentCodeB()).orElse(null);
            salle.setBatiment(batiment);
        }

        salleRepository.save(salle);
        return ResponseEntity.ok(salle);
    }


    @PatchMapping("/{numS}")
    @Transactional
    public ResponseEntity<?> updateSalle(@PathVariable String numS, @RequestBody SalleRequestDto request) {
        Salle salle = salleRepository.findById(numS)
                .orElseThrow(() -> new RuntimeException("Salle non trouvée"));

        if (request.capacite() != null) {
            salle.setCapacite(request.capacite());
        }
        if (request.typeS() != null) {
            salle.setTypeS(TypeSalle.valueOf(request.typeS()));
        }
        if (request.acces() != null) {
            salle.setAcces(request.acces());
        }
        if (request.etage() != null) {
            salle.setEtage(request.etage());
        }
        if (request.batimentCodeB() != null) {
            if (!request.batimentCodeB().isEmpty()) {
                Batiment batiment = batimentRepository.findById(request.batimentCodeB()).orElse(null);
                salle.setBatiment(batiment);
            } else {
                salle.setBatiment(null);
            }
        }

        salleRepository.save(salle);
        return ResponseEntity.ok(salle);
    }

  
    @DeleteMapping("/{numS}")
    @Transactional
    public ResponseEntity<?> deleteSalle(@PathVariable String numS) {
        Salle salle = salleRepository.findById(numS).orElse(null);
        if (salle == null) {
            return ResponseEntity.notFound().build();
        }

        List<Reservation> reservations = reservationRepository.findBySalle(salle);
        reservationRepository.deleteAll(reservations);

        salleRepository.delete(salle);

        return ResponseEntity.ok("Salle supprimée avec " + reservations.size() + " réservation(s)");
    }
}
