package Ex.dto;

/**
 * DTO для ответа с информацией о профиле пользователя
 */
public record UserProfileResponse(
        Integer id,
        String email,
        String fullName,
        String role
) {}

