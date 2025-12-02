package Ex.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO для обновления профиля пользователя
 */
public record UpdateProfileRequest(
        @NotBlank(message = "Le nom complet est obligatoire")
        String fullName
) {}

