package Ex.dto;

/**
 * Réponse complète du calcul de distance entre deux bâtiments
 */
public record DistanceResponseDto(
    BatimentInfoDto batiment1,
    BatimentInfoDto batiment2,
    DistanceInfoDto distance
) {}

