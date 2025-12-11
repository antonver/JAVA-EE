package Ex.dto;

/**
 * Informations sur un bâtiment (réponse API)
 */
public record BatimentInfoDto(
    String codeB,
    Double latitude,
    Double longitude,
    String campus
) {}

