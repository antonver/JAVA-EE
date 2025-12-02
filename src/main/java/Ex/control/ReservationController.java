package Ex.control;

import Ex.domain.ReservationRepository;
import Ex.domain.SalleRepository;
import Ex.dto.ReservationRequest;
import Ex.dto.ReservationResponse;
import Ex.modele.Reservation;
import Ex.modele.Salle;
import Ex.modele.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Contrôleur REST pour la gestion des réservations de salles
 */
@RestController
@RequestMapping("/reservations")
public class ReservationController {

    @Autowired
    private ReservationRepository reservationRepository;
    
    @Autowired
    private SalleRepository salleRepository;

    /**
     * Créer une nouvelle réservation
     */
    @PostMapping
    public ResponseEntity<?> createReservation(@RequestBody ReservationRequest request) {
        // Récupérer l'utilisateur connecté
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User enseignant = (User) authentication.getPrincipal();
        
        // Vérifier que la salle existe
        Salle salle = salleRepository.findById(request.salleNum())
            .orElseThrow(() -> new RuntimeException("Salle non trouvée"));
        
        // Vérifier les conflits de réservation de salle
        List<Reservation> salleConflicts = reservationRepository.findConflicts(
            salle, request.dateDebut(), request.dateFin()
        );
        
        if (!salleConflicts.isEmpty()) {
            return ResponseEntity.badRequest()
                .body("La salle est déjà réservée pour cette période");
        }
        
        // Vérifier que l'enseignant n'a pas déjà un cours de cette matière au même moment
        // (éviter de donner le même cours dans plusieurs salles simultanément)
        List<Reservation> subjectConflicts = reservationRepository.findConflictsByTeacherAndSubject(
            enseignant, request.matiere(), request.dateDebut(), request.dateFin()
        );
        
        if (!subjectConflicts.isEmpty()) {
            return ResponseEntity.badRequest()
                .body("Vous avez déjà un cours de " + request.matiere() + " prévu à cette période");
        }
        
        // Créer la réservation
        Reservation reservation = new Reservation(
            enseignant,
            salle,
            request.dateDebut(),
            request.dateFin(),
            request.matiere()
        );
        
        reservation = reservationRepository.save(reservation);
        
        // Retourner le DTO
        return ResponseEntity.ok(mapToDTO(reservation));
    }

    /**
     * Récupérer toutes les réservations de l'enseignant connecté
     */
    @GetMapping("/mes-reservations")
    public ResponseEntity<List<ReservationResponse>> getMesReservations() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User enseignant = (User) authentication.getPrincipal();
        
        // Получаем ВСЕ резервации учителя (не только будущие)
        List<Reservation> reservations = reservationRepository.findByEnseignant(enseignant);
        
        // DEBUG: выводим количество найденных резервация
        System.out.println("🔍 Найдено резервация для учителя " + enseignant.getFullName() + ": " + reservations.size());
        reservations.forEach(r -> 
            System.out.println("  - ID: " + r.getId() + ", Salle: " + r.getSalle().getNumS() + ", Matière: " + r.getMatiere())
        );
        
        List<ReservationResponse> response = reservations.stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
        
        System.out.println("🔍 Возвращаем DTO: " + response.size());
        
        return ResponseEntity.ok(response);
    }

    /**
     * Récupérer toutes les réservations (admin)
     */
    @GetMapping
    public ResponseEntity<List<ReservationResponse>> getAllReservations() {
        List<Reservation> reservations = reservationRepository.findAll();
        
        List<ReservationResponse> response = reservations.stream()
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
        
        // Vérifier que c'est bien l'enseignant qui a créé la réservation
        if (!reservation.getEnseignant().getId().equals(enseignant.getId())) {
            return ResponseEntity.status(403).body("Vous ne pouvez supprimer que vos propres réservations");
        }
        
        reservationRepository.delete(reservation);
        return ResponseEntity.ok("Réservation supprimée");
    }

    /**
     * Mapper Reservation Entity vers ReservationResponse DTO
     */
    private ReservationResponse mapToDTO(Reservation reservation) {
        return new ReservationResponse(
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

