package Ex.control;

import Ex.domain.BatimentRepository;
import Ex.domain.ComposantRepository;
import Ex.domain.SalleRepository;
import Ex.dto.BatimentInfoDto;
import Ex.modele.Batiment;
import Ex.modele.Composante;
import Ex.modele.Salle;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;


@RestController
@RequestMapping("/api/data")
@Transactional(readOnly = true)
public class MapDataController {

    private final BatimentRepository batimentRepository;
    private final SalleRepository salleRepository;
    private final ComposantRepository composantRepository;

    public MapDataController(BatimentRepository batimentRepository,
                            SalleRepository salleRepository,
                            ComposantRepository composantRepository) {
        this.batimentRepository = batimentRepository;
        this.salleRepository = salleRepository;
        this.composantRepository = composantRepository;
    }

    @GetMapping("/batiments")
    public ResponseEntity<List<BatimentInfoDto>> getBatimentsForMap() {
        List<BatimentInfoDto> result = batimentRepository.findAll().stream()
                .map(b -> new BatimentInfoDto(
                        b.getCodeB(),
                        b.getLatitude(),
                        b.getLongitude(),
                        b.getCampus() != null ? b.getCampus().getNomC() : null
                ))
                .toList();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/salles")
    public ResponseEntity<List<Map<String, Object>>> getSallesForReservation() {
        List<Map<String, Object>> result = salleRepository.findAll().stream()
                .map(s -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("numS", s.getNumS());
                    map.put("capacite", s.getCapacite());
                    map.put("typeS", s.getTypeS() != null ? s.getTypeS().name() : null);
                    map.put("batimentCodeB", s.getBatiment() != null ? s.getBatiment().getCodeB() : null);
                    return map;
                })
                .toList();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/composantes")
    public ResponseEntity<List<Map<String, Object>>> getComposantesForReservation() {
        List<Map<String, Object>> result = composantRepository.findAll().stream()
                .map(c -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("acronyme", c.getAcronyme());
                    map.put("nom", c.getNom());
                    return map;
                })
                .toList();
        return ResponseEntity.ok(result);
    }
}

