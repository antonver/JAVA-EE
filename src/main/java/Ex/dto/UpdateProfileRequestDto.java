package Ex.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO для обновления профиля пользователя
 */
public record UpdateProfileRequestDto(
        @NotBlank(message = "Le nom complet est obligatoire")
        String fullName
) {}

