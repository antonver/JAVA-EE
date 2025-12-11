package Ex.dto;

/**
 * DTO для создания/обновления здания
 */
public record BatimentRequestDto(
    String codeB,
    Integer anneeC,
    Double latitude,
    Double longitude,
    String campusNomC
) {}

