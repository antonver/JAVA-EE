package Ex.control;

import Ex.domain.*;
import Ex.modele.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Contrôleur REST pour la gestion des Universités
 * Gère le CRUD avec suppression cascade complète
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

    /**
     * Créer une nouvelle université
     */
    @PostMapping
    @Transactional
    public ResponseEntity<?> createUniversite(@RequestBody Map<String, Object> request) {
        String nom = (String) request.get("nom");
        String acronyme = (String) request.get("acronyme");
        Integer creation = request.get("creation") != null ? ((Number) request.get("creation")).intValue() : null;
        String presidence = (String) request.get("presidence");

        if (universiteRepository.existsById(nom)) {
            return ResponseEntity.badRequest().body("Une université avec ce nom existe déjà");
        }

        Universite universite = new Universite();
        universite.setNom(nom);
        universite.setAcronyme(acronyme);
        if (creation != null) universite.setCreation(creation);
        universite.setPresidence(presidence);

        universiteRepository.save(universite);
        return ResponseEntity.ok(universite);
    }

    /**
     * Mettre à jour une université
     */
    @PatchMapping("/{nom}")
    @Transactional
    public ResponseEntity<?> updateUniversite(@PathVariable String nom, @RequestBody Map<String, Object> request) {
        Universite universite = universiteRepository.findById(nom)
                .orElseThrow(() -> new RuntimeException("Université non trouvée"));

        if (request.containsKey("acronyme")) {
            universite.setAcronyme((String) request.get("acronyme"));
        }
        if (request.containsKey("creation") && request.get("creation") != null) {
            universite.setCreation(((Number) request.get("creation")).intValue());
        }
        if (request.containsKey("presidence")) {
            universite.setPresidence((String) request.get("presidence"));
        }

        universiteRepository.save(universite);
        return ResponseEntity.ok(universite);
    }

    /**
     * Supprimer une université avec CASCADE COMPLET:
     * Université -> Campus -> Bâtiments -> Salles -> Réservations
     * + Suppression des liens Exploite (Composante - Bâtiment)
     */
    @DeleteMapping("/{nom}")
    @Transactional
    public ResponseEntity<?> deleteUniversite(@PathVariable String nom) {
        Universite universite = universiteRepository.findById(nom).orElse(null);
        if (universite == null) {
            return ResponseEntity.notFound().build();
        }

        // Statistiques pour le rapport
        int totalCampus = 0;
        int totalBatiments = 0;
        int totalSalles = 0;
        int totalReservations = 0;

        // 1. Récupérer tous les campus de l'université
        List<Campus> campusList = campusRepository.findAll().stream()
                .filter(c -> c.getUniversite() != null && c.getUniversite().getNom().equals(nom))
                .toList();
        totalCampus = campusList.size();

        // 2. Pour chaque campus, traiter les bâtiments
        List<String> allBatimentCodes = new ArrayList<>();
        for (Campus campus : campusList) {
            List<Batiment> batiments = batimentRepository.findAll().stream()
                    .filter(b -> b.getCampus() != null && b.getCampus().getNomC().equals(campus.getNomC()))
                    .toList();
            
            for (Batiment batiment : batiments) {
                allBatimentCodes.add(batiment.getCodeB());
                totalBatiments++;

                // 3. Pour chaque bâtiment, supprimer les réservations des salles
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

        // 4. Supprimer les liens dans la table Exploite (Composante - Bâtiment)
        List<Composante> allComposantes = composantRepository.findAll();
        for (Composante composante : allComposantes) {
            if (composante.getBatimentList() != null) {
                boolean modified = composante.getBatimentList().removeIf(b -> allBatimentCodes.contains(b.getCodeB()));
                if (modified) {
                    composantRepository.save(composante);
                }
            }
        }

        // 5. Supprimer l'université (cascade supprimera campus -> bâtiments -> salles)
        universiteRepository.delete(universite);

        return ResponseEntity.ok(String.format(
                "Université '%s' supprimée avec %d campus, %d bâtiments, %d salles et %d réservations",
                nom, totalCampus, totalBatiments, totalSalles, totalReservations
        ));
    }
}

