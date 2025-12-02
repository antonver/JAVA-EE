package Ex.dto;

/**
 * Informations sur un bâtiment (réponse API)
 */
public record BatimentInfo(
    String code,
    Double latitude,
    Double longitude,
    String campus
) {}

