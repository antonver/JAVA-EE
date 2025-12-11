package Ex.dto;

/**
 * DTO для создания/обновления университета
 */
public record UniversiteRequestDto(
    String nom,
    String acronyme,
    Integer creation,
    String presidence
) {}

