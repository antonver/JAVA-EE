package Ex.dto;

/**
 * DTO для создания/обновления аудитории
 */
public record SalleRequestDto(
    String numS,
    Integer capacite,
    String typeS,
    String acces,
    String etage,
    String batimentCodeB
) {}

