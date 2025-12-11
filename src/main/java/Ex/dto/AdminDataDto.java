package Ex.dto;

import Ex.modele.*;

import java.util.List;

/**
 * DTO для админ-панели (все в одном файле для простоты)
 */
public class AdminDataDto {

    // === BATIMENT ===
    public record BatimentAdminDto(
            String codeB,
            int anneeC,
            Double latitude,
            Double longitude,
            CampusShortDto campus,
            List<ComposanteShortDto> composanteList
    ) {
        public static BatimentAdminDto from(Batiment b, List<String> composanteAcronyms) {
            return new BatimentAdminDto(
                    b.getCodeB(),
                    b.getAnneeC(),
                    b.getLatitude(),
                    b.getLongitude(),
                    b.getCampus() != null ? CampusShortDto.from(b.getCampus()) : null,
                    composanteAcronyms.stream().map(ComposanteShortDto::new).toList()
            );
        }
    }

    // === CAMPUS ===
    public record CampusAdminDto(
            String nomC,
            String ville,
            UniversiteShortDto universite
    ) {
        public static CampusAdminDto from(Campus c) {
            return new CampusAdminDto(
                    c.getNomC(),
                    c.getVille(),
                    c.getUniversite() != null ? UniversiteShortDto.from(c.getUniversite()) : null
            );
        }
    }

    // === SALLE ===
    public record SalleAdminDto(
            String numS,
            int capacite,
            String typeS,
            String acces,
            String etage,
            BatimentShortDto batiment
    ) {
        public static SalleAdminDto from(Salle s) {
            return new SalleAdminDto(
                    s.getNumS(),
                    s.getCapacite(),
                    s.getTypeS() != null ? s.getTypeS().name() : null,
                    s.getAcces(),
                    s.getEtage(),
                    s.getBatiment() != null ? BatimentShortDto.from(s.getBatiment()) : null
            );
        }
    }

    // === COMPOSANTE ===
    public record ComposanteAdminDto(
            String acronyme,
            String nom,
            String responsable,
            List<BatimentShortDto> batimentList
    ) {
        public static ComposanteAdminDto from(Composante c) {
            return new ComposanteAdminDto(
                    c.getAcronyme(),
                    c.getNom(),
                    c.getResponsable(),
                    c.getBatimentList() != null
                            ? c.getBatimentList().stream().map(BatimentShortDto::from).toList()
                            : List.of()
            );
        }
    }

    // === UNIVERSITE ===
    public record UniversiteAdminDto(
            String nom,
            String acronyme,
            int creation,
            String presidence
    ) {
        public static UniversiteAdminDto from(Universite u) {
            return new UniversiteAdminDto(
                    u.getNom(),
                    u.getAcronyme(),
                    u.getCreation(),
                    u.getPresidence()
            );
        }
    }

    // === ВЛОЖЕННЫЕ DTO (короткие версии для связей) ===

    public record CampusShortDto(String nomC, String ville) {
        public static CampusShortDto from(Campus c) {
            return new CampusShortDto(c.getNomC(), c.getVille());
        }
    }

    public record BatimentShortDto(String codeB) {
        public static BatimentShortDto from(Batiment b) {
            return new BatimentShortDto(b.getCodeB());
        }
    }

    public record ComposanteShortDto(String acronyme) {}

    public record UniversiteShortDto(String nom) {
        public static UniversiteShortDto from(Universite u) {
            return new UniversiteShortDto(u.getNom());
        }
    }
}

