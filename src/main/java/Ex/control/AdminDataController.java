package Ex.control;

import Ex.domain.*;
import Ex.modele.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Контроллер для получения полных данных в админке.
 * Spring Data REST не включает ID поля в ответ, поэтому нужен кастомный контроллер.
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
    public ResponseEntity<List<Map<String, Object>>> getAllBatiments() {
        List<Batiment> batiments = batimentRepository.findAll();
        
        // Charger toutes les composantes une seule fois pour éviter les requêtes N+1
        List<Composante> allComposantes = composantRepository.findAll();
        
        // Créer une map: codeB -> liste des acronymes de composantes
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
        
        List<Map<String, Object>> result = batiments.stream().map(b -> {
            Map<String, Object> map = new HashMap<>();
            map.put("codeB", b.getCodeB());
            map.put("anneeC", b.getAnneeC());
            map.put("latitude", b.getLatitude());
            map.put("longitude", b.getLongitude());
            if (b.getCampus() != null) {
                Map<String, Object> campusMap = new HashMap<>();
                campusMap.put("nomC", b.getCampus().getNomC());
                campusMap.put("ville", b.getCampus().getVille());
                map.put("campus", campusMap);
            }
            // Ajouter la liste des composantes
            List<String> acronymes = batimentToComposantes.getOrDefault(b.getCodeB(), new ArrayList<>());
            List<Map<String, Object>> composantesList = acronymes.stream().map(acronyme -> {
                Map<String, Object> compMap = new HashMap<>();
                compMap.put("acronyme", acronyme);
                return compMap;
            }).collect(Collectors.toList());
            map.put("composanteList", composantesList);
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/campus")
    public ResponseEntity<List<Map<String, Object>>> getAllCampus() {
        List<Campus> campusList = campusRepository.findAll();
        List<Map<String, Object>> result = campusList.stream().map(c -> {
            Map<String, Object> map = new HashMap<>();
            map.put("nomC", c.getNomC());
            map.put("ville", c.getVille());
            if (c.getUniversite() != null) {
                Map<String, Object> univMap = new HashMap<>();
                univMap.put("nom", c.getUniversite().getNom());
                map.put("universite", univMap);
            }
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/salles")
    public ResponseEntity<List<Map<String, Object>>> getAllSalles() {
        List<Salle> salles = salleRepository.findAll();
        List<Map<String, Object>> result = salles.stream().map(s -> {
            Map<String, Object> map = new HashMap<>();
            map.put("numS", s.getNumS());
            map.put("capacite", s.getCapacite());
            map.put("typeS", s.getTypeS() != null ? s.getTypeS().name() : null);
            map.put("acces", s.getAcces());
            map.put("etage", s.getEtage());
            if (s.getBatiment() != null) {
                Map<String, Object> batMap = new HashMap<>();
                batMap.put("codeB", s.getBatiment().getCodeB());
                map.put("batiment", batMap);
            }
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/composantes")
    public ResponseEntity<List<Map<String, Object>>> getAllComposantes() {
        List<Composante> composantes = composantRepository.findAll();
        List<Map<String, Object>> result = composantes.stream().map(c -> {
            Map<String, Object> map = new HashMap<>();
            map.put("acronyme", c.getAcronyme());
            map.put("nom", c.getNom());
            map.put("responsable", c.getResponsable());
            // Ajouter la liste des bâtiments
            if (c.getBatimentList() != null) {
                List<Map<String, Object>> batimentsList = c.getBatimentList().stream().map(b -> {
                    Map<String, Object> batMap = new HashMap<>();
                    batMap.put("codeB", b.getCodeB());
                    return batMap;
                }).collect(Collectors.toList());
                map.put("batimentList", batimentsList);
            }
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/universites")
    public ResponseEntity<List<Map<String, Object>>> getAllUniversites() {
        List<Universite> universites = universityRepository.findAll();
        List<Map<String, Object>> result = universites.stream().map(u -> {
            Map<String, Object> map = new HashMap<>();
            map.put("nom", u.getNom());
            map.put("acronyme", u.getAcronyme());
            map.put("creation", u.getCreation());
            map.put("presidence", u.getPresidence());
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }
}

