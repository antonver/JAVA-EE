package Ex.control;

import Ex.domain.*;
import Ex.dto.AdminDataDto.*;
import Ex.modele.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Контроллер для получения данных в админке.
 */
@RestController
@RequestMapping("/admin/data")
@PreAuthorize("hasRole('GESTIONNAIRE')")
@Transactional(readOnly = true)
public class AdminDataController {

    private final BatimentRepository batimentRepository;
    private final CampusRepository campusRepository;
    private final SalleRepository salleRepository;
    private final ComposantRepository composantRepository;
    private final UniversityRepository universityRepository;

    public AdminDataController(
            BatimentRepository batimentRepository,
            CampusRepository campusRepository,
            SalleRepository salleRepository,
            ComposantRepository composantRepository,
            UniversityRepository universityRepository
    ) {
        this.batimentRepository = batimentRepository;
        this.campusRepository = campusRepository;
        this.salleRepository = salleRepository;
        this.composantRepository = composantRepository;
        this.universityRepository = universityRepository;
    }

    @GetMapping("/batiments")
    public ResponseEntity<List<BatimentAdminDto>> getAllBatiments() {
        List<Batiment> batiments = batimentRepository.findAll();
        List<Composante> allComposantes = composantRepository.findAll();

        Map<String, List<String>> batimentToComposantes = new HashMap<>();
        for (Composante c : allComposantes) {
            if (c.getBatimentList() != null) {
                for (Batiment b : c.getBatimentList()) {
                    batimentToComposantes
                            .computeIfAbsent(b.getCodeB(), k -> new ArrayList<>())
                            .add(c.getAcronyme());
                }
            }
        }

        List<BatimentAdminDto> result = batiments.stream()
                .map(b -> BatimentAdminDto.from(b, batimentToComposantes.getOrDefault(b.getCodeB(), List.of())))
                .toList();

        return ResponseEntity.ok(result);
    }

    @GetMapping("/campus")
    public ResponseEntity<List<CampusAdminDto>> getAllCampus() {
        List<CampusAdminDto> result = campusRepository.findAll().stream()
                .map(CampusAdminDto::from)
                .toList();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/salles")
    public ResponseEntity<List<SalleAdminDto>> getAllSalles() {
        List<SalleAdminDto> result = salleRepository.findAll().stream()
                .map(SalleAdminDto::from)
                .toList();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/composantes")
    public ResponseEntity<List<ComposanteAdminDto>> getAllComposantes() {
        List<ComposanteAdminDto> result = composantRepository.findAll().stream()
                .map(ComposanteAdminDto::from)
                .toList();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/universites")
    public ResponseEntity<List<UniversiteAdminDto>> getAllUniversites() {
        List<UniversiteAdminDto> result = universityRepository.findAll().stream()
                .map(UniversiteAdminDto::from)
                .toList();
        return ResponseEntity.ok(result);
    }
}
