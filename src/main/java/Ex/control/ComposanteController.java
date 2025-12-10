package Ex.control;

import Ex.domain.BatimentRepository;
import Ex.domain.ComposantRepository;
import Ex.dto.ComposanteRequestDto;
import Ex.modele.Batiment;
import Ex.modele.Composante;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Contrôleur REST pour la gestion des composantes avec leurs bâtiments
 */
@RestController
@RequestMapping("/composantes")
@PreAuthorize("hasRole('GESTIONNAIRE')")
public class ComposanteController {

    private final ComposantRepository composantRepository;
    private final BatimentRepository batimentRepository;

    public ComposanteController(ComposantRepository composantRepository, BatimentRepository batimentRepository) {
        this.composantRepository = composantRepository;
        this.batimentRepository = batimentRepository;
    }

    /**
     * Créer une nouvelle composante avec ses bâtiments
     */
    @PostMapping
    public ResponseEntity<?> createComposante(@RequestBody ComposanteRequestDto request) {
        // Vérifier si l'acronyme existe déjà
        if (composantRepository.existsById(request.getAcronyme())) {
            return ResponseEntity.badRequest().body("Une composante avec cet acronyme existe déjà");
        }

        Composante composante = new Composante();
        composante.setAcronyme(request.getAcronyme());
        composante.setNom(request.getNom());
        composante.setResponsable(request.getResponsable());

        // Ajouter les bâtiments
        if (request.getBatimentCodes() != null && !request.getBatimentCodes().isEmpty()) {
            List<Batiment> batiments = batimentRepository.findAllById(request.getBatimentCodes());
            composante.setBatimentList(batiments);
        } else {
            composante.setBatimentList(new ArrayList<>());
        }

        composantRepository.save(composante);
        return ResponseEntity.ok(composante);
    }

    /**
     * Mettre à jour une composante existante
     */
    @PatchMapping("/{acronyme}")
    public ResponseEntity<?> updateComposante(@PathVariable String acronyme, @RequestBody ComposanteRequestDto request) {
        Composante composante = composantRepository.findById(acronyme)
                .orElseThrow(() -> new RuntimeException("Composante non trouvée"));

        if (request.getNom() != null) {
            composante.setNom(request.getNom());
        }
        if (request.getResponsable() != null) {
            composante.setResponsable(request.getResponsable());
        }

        // Mettre à jour les bâtiments
        if (request.getBatimentCodes() != null) {
            List<Batiment> batiments = batimentRepository.findAllById(request.getBatimentCodes());
            composante.setBatimentList(batiments);
        }

        composantRepository.save(composante);
        return ResponseEntity.ok(composante);
    }

    /**
     * Supprimer une composante
     */
    @DeleteMapping("/{acronyme}")
    public ResponseEntity<?> deleteComposante(@PathVariable String acronyme) {
        if (!composantRepository.existsById(acronyme)) {
            return ResponseEntity.notFound().build();
        }
        composantRepository.deleteById(acronyme);
        return ResponseEntity.ok("Composante supprimée");
    }
}


