package Ex.dto;

import java.time.LocalDateTime;

/**
 * DTO pour la réponse d'une réservation
 */
public record ReservationResponseDto(
    Long id,
    String enseignantNom,
    String salleNum,
    String batimentCode,
    LocalDateTime dateDebut,
    LocalDateTime dateFin,
    String matiere,
    int capacite
) {}

