package Ex.dto;

import java.util.List;

public record ComposanteRequestDto(
        String acronyme,
        String nom,
        String responsable,
        List<String> batimentCodes
) {}