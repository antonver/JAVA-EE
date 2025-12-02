package Ex.dto;

/**
 * Réponse complète du calcul de distance entre deux bâtiments
 */
public record DistanceResponse(
    BatimentInfo batiment1,
    BatimentInfo batiment2,
    DistanceInfo distance
) {}

