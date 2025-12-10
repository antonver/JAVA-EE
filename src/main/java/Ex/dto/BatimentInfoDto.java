package Ex.dto;

/**
 * Informations sur un bâtiment (réponse API)
 */
public record BatimentInfoDto(
    String code,
    Double latitude,
    Double longitude,
    String campus
) {}

