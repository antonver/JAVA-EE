package Ex.dto;

import java.time.LocalDateTime;

/**
 * DTO pour créer une réservation
 */
public record ReservationRequest(
    String salleNum,
    LocalDateTime dateDebut,
    LocalDateTime dateFin,
    String matiere
) {}

