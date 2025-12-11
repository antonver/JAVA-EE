package Ex.control;

import Ex.domain.ReservationRepository;
import Ex.domain.SalleRepository;
import Ex.dto.ReservationRequestDto;
import Ex.dto.ReservationResponseDto;
import Ex.modele.Reservation;
import Ex.modele.Salle;
import Ex.modele.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Contrôleur REST pour la gestion des réservations de salles
 */
@RestController
@RequestMapping("/reservations")
@PreAuthorize("hasRole('ENSEIGNANT')")
public class ReservationController {

    @Autowired
    private ReservationRepository reservationRepository;
    
    @Autowired
    private SalleRepository salleRepository;


    @PostMapping
    public ResponseEntity<?> createReservation(@RequestBody ReservationRequestDto request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User enseignant = (User) authentication.getPrincipal();
        
        Salle salle = salleRepository.findById(request.salleNum())
            .orElseThrow(() -> new RuntimeException("Salle non trouvée"));
        
        List<Reservation> salleConflicts = reservationRepository.findConflicts(
            salle, request.dateDebut(), request.dateFin()
        );
        
        if (!salleConflicts.isEmpty()) {
            return ResponseEntity.badRequest()
                .body("La salle est déjà réservée pour cette période");
        }
        
        List<Reservation> subjectConflicts = reservationRepository.findConflictsByTeacherAndSubject(
            enseignant, request.matiere(), request.dateDebut(), request.dateFin()
        );
        
        if (!subjectConflicts.isEmpty()) {
            return ResponseEntity.badRequest()
                .body("Vous avez déjà un cours de " + request.matiere() + " prévu à cette période");
        }
        
        Reservation reservation = new Reservation(
            enseignant,
            salle,
            request.dateDebut(),
            request.dateFin(),
            request.matiere()
        );
        
        reservation = reservationRepository.save(reservation);
        
        return ResponseEntity.ok(mapToDTO(reservation));
    }

    @GetMapping("/mes-reservations")
    public ResponseEntity<List<ReservationResponseDto>> getMesReservations() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User enseignant = (User) authentication.getPrincipal();
        
        List<Reservation> reservations = reservationRepository.findByEnseignant(enseignant);
        
        List<ReservationResponseDto> response = reservations.stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }

 
    @GetMapping
    @PreAuthorize("hasRole('GESTIONNAIRE')")
    public ResponseEntity<List<ReservationResponseDto>> getAllReservations() {
        List<Reservation> reservations = reservationRepository.findAll();
        
        List<ReservationResponseDto> response = reservations.stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }

    /**
     * Supprimer une réservation
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReservation(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User enseignant = (User) authentication.getPrincipal();
        
        Reservation reservation = reservationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Réservation non trouvée"));
        
        if (!reservation.getEnseignant().getId().equals(enseignant.getId())) {
            return ResponseEntity.status(403).body("Vous ne pouvez supprimer que vos propres réservations");
        }
        
        reservationRepository.delete(reservation);
        return ResponseEntity.ok("Réservation supprimée");
    }

    /**
     * Mapper Reservation Entity vers ReservationResponseDto DTO
     */
    private ReservationResponseDto mapToDTO(Reservation reservation) {
        return new ReservationResponseDto(
            reservation.getId(),
            reservation.getEnseignant().getFullName(),
            reservation.getSalle().getNumS(),
            reservation.getSalle().getBatiment() != null ? 
                reservation.getSalle().getBatiment().getCodeB() : null,
            reservation.getDateDebut(),
            reservation.getDateFin(),
            reservation.getMatiere(),
            reservation.getSalle().getCapacite()
        );
    }
}
