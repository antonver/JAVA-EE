package Ex.modele;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.Date;

/**
 * Table de liaison entre User (enseignant) et Salle
 * Représente une réservation de salle pour un cours
 */
@Entity
@Table(name = "reservation")
public class Reservation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User enseignant;
    
    @ManyToOne
    @JoinColumn(name = "salle_num", nullable = false)
    private Salle salle;
    
    @Column(nullable = false)
    private LocalDateTime dateDebut;
    
    @Column(nullable = false)
    private LocalDateTime dateFin;
    
    @Column(nullable = false, length = 100)
    private String matiere;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Date createdAt;
    
    // Constructeurs
    public Reservation() {
    }
    
    public Reservation(User enseignant, Salle salle, LocalDateTime dateDebut, LocalDateTime dateFin, String matiere) {
        this.enseignant = enseignant;
        this.salle = salle;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.matiere = matiere;
    }
    
    // Getters et Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getEnseignant() {
        return enseignant;
    }
    
    public void setEnseignant(User enseignant) {
        this.enseignant = enseignant;
    }
    
    public Salle getSalle() {
        return salle;
    }
    
    public void setSalle(Salle salle) {
        this.salle = salle;
    }
    
    public LocalDateTime getDateDebut() {
        return dateDebut;
    }
    
    public void setDateDebut(LocalDateTime dateDebut) {
        this.dateDebut = dateDebut;
    }
    
    public LocalDateTime getDateFin() {
        return dateFin;
    }
    
    public void setDateFin(LocalDateTime dateFin) {
        this.dateFin = dateFin;
    }
    
    public String getMatiere() {
        return matiere;
    }
    
    public void setMatiere(String matiere) {
        this.matiere = matiere;
    }
    
    public Date getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
}

