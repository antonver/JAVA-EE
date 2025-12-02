package Ex.dto;

/**
 * Informations sur la distance calculée (réponse API)
 */
public record DistanceInfo(
    Double meters,
    Double kilometers,
    String type,
    String description
) {}

