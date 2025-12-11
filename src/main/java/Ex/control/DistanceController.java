package Ex.control;

import Ex.domain.BatimentRepository;
import Ex.dto.BatimentInfoDto;
import Ex.dto.DistanceInfoDto;
import Ex.dto.DistanceResponseDto;
import Ex.modele.Batiment;
import org.apache.lucene.util.SloppyMath;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/distance")
public class DistanceController {

    @Autowired
    private BatimentRepository batimentRepository;

    @GetMapping("/between")
    public ResponseEntity<?> getDistanceBetweenBuildings(
            @RequestParam String code1,
            @RequestParam String code2) {
        
        Optional<Batiment> bat1Opt = batimentRepository.findById(code1);
        Optional<Batiment> bat2Opt = batimentRepository.findById(code2);

        if (bat1Opt.isEmpty() || bat2Opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Batiment bat1 = bat1Opt.get();
        Batiment bat2 = bat2Opt.get();

        if (bat1.getLatitude() == null || bat1.getLongitude() == null ||
            bat2.getLatitude() == null || bat2.getLongitude() == null) {
            return ResponseEntity.badRequest().body("Coordonnées GPS manquantes");
        }
        double distanceMeters = SloppyMath.haversinMeters(
            bat1.getLatitude(), bat1.getLongitude(),
            bat2.getLatitude(), bat2.getLongitude()
        );

        // Mapper les entités BD vers DTOs (séparation des couches)
        BatimentInfoDto bat1DTO = mapToDTO(bat1);
        BatimentInfoDto bat2DTO = mapToDTO(bat2);
        DistanceInfoDto distanceDTO = createDistanceInfo(distanceMeters);

        // Créer la réponse avec les DTOs
        DistanceResponseDto response = new DistanceResponseDto(bat1DTO, bat2DTO, distanceDTO);
        
        return ResponseEntity.ok(response);
    }

    
    @GetMapping("/calculate")
    public ResponseEntity<DistanceInfoDto> calculateDistance(
            @RequestParam Double lat1,
            @RequestParam Double lon1,
            @RequestParam Double lat2,
            @RequestParam Double lon2) {
        
        double distanceMeters = SloppyMath.haversinMeters(lat1, lon1, lat2, lon2);
        DistanceInfoDto response = createDistanceInfo(distanceMeters);
        
        return ResponseEntity.ok(response);
    }

    private BatimentInfoDto mapToDTO(Batiment batiment) {
        return new BatimentInfoDto(
                batiment.getCodeB(),
                batiment.getLatitude(),
                batiment.getLongitude(),
                batiment.getCampus() != null ? batiment.getCampus().getNomC() : null
        );
    }

    /**
     * Créer un DTO DistanceInfoDto à partir d'une distance en mètres
     */
    private DistanceInfoDto createDistanceInfo(double distanceMeters) {
        double meters = Math.round(distanceMeters * 100.0) / 100.0;
        double kilometers = Math.round(distanceMeters / 10.0) / 100.0;
        
        return new DistanceInfoDto(
            meters,
            kilometers,
            "haversine",
            "Distance à vol d'oiseau (ligne droite)"
        );
    }
}
