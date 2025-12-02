package Ex.modele;


import jakarta.persistence.*;

import java.util.List;

@Entity
public class Composante {
    @Id
    @Column(length=15)
    private String acronyme;
    @Column(length=100)
    private String nom;
    @Column(length=100)
    private String responsable;
    @ManyToMany
    @JoinTable(
            name = "Exploite",
            joinColumns = @JoinColumn(name="team"),
            inverseJoinColumns = @JoinColumn(name="building")
    )
    private List<Batiment> batimentList;

    public Composante() {}

    public Composante(String acronyme, String nom, String responsable) {
        super();
        this.acronyme = acronyme;
        this.nom = nom;
        this.responsable = responsable;
    }
    public String getAcronyme() {
        return acronyme;
    }
    public void setAcronyme(String acronyme) {
        this.acronyme = acronyme;
    }
    public String getNom() {
        return nom;
    }
    public void setNom(String nom) {
        this.nom = nom;
    }
    public String getResponsable() {
        return this.responsable;
    }

    public void setResponsable(String responsable) {
        this.responsable = responsable;
    }
    @Override
    public String toString() {
        return "Composante [acronyme=" + acronyme + ", nom=" + nom + ", responsable=" + responsable + "]";
    }

    public List<Batiment> getBatimentList() {
        return batimentList;
    }

    public void setBatimentList(List<Batiment> batimentList) {
        this.batimentList = batimentList;
    }
}
