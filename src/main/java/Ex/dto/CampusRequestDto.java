package Ex.dto;

/**
 * DTO для создания/обновления кампуса
 */
public record CampusRequestDto(
    String nomC,
    String ville,
    String universiteNom
) {}

