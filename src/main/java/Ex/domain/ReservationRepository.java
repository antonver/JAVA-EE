package Ex.domain;

import Ex.modele.Reservation;
import Ex.modele.Salle;
import Ex.modele.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository pour les réservations de salles
 */
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    
    /**
     * Trouver toutes les réservations d'un enseignant
     */
    List<Reservation> findByEnseignant(User enseignant);
    
    /**
     * Trouver toutes les réservations pour une salle
     */
    List<Reservation> findBySalle(Salle salle);
    
    /**
     * Vérifier si une salle est déjà réservée pour une période donnée
     */
    @Query("SELECT r FROM Reservation r WHERE r.salle = :salle " +
           "AND ((r.dateDebut <= :dateFin AND r.dateFin >= :dateDebut))")
    List<Reservation> findConflicts(
        @Param("salle") Salle salle,
        @Param("dateDebut") LocalDateTime dateDebut,
        @Param("dateFin") LocalDateTime dateFin
    );
    
    /**
     * Trouver les réservations à venir pour un enseignant
     */
    @Query("SELECT r FROM Reservation r WHERE r.enseignant = :enseignant " +
           "AND r.dateDebut >= :now ORDER BY r.dateDebut ASC")
    List<Reservation> findUpcomingByEnseignant(
        @Param("enseignant") User enseignant,
        @Param("now") LocalDateTime now
    );
    
    /**
     * Vérifier si un enseignant a déjà une réservation pour cette matière à cette période
     * (éviter de donner le même cours dans plusieurs salles en même temps)
     */
    @Query("SELECT r FROM Reservation r WHERE r.enseignant = :enseignant " +
           "AND r.matiere = :matiere " +
           "AND ((r.dateDebut <= :dateFin AND r.dateFin >= :dateDebut))")
    List<Reservation> findConflictsByTeacherAndSubject(
        @Param("enseignant") User enseignant,
        @Param("matiere") String matiere,
        @Param("dateDebut") LocalDateTime dateDebut,
        @Param("dateFin") LocalDateTime dateFin
    );
}

