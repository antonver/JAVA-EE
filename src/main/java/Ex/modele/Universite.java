
package Ex.modele;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Universite {

    @Id
    private String nom;

    @Column(length = 20)
    private String acronyme;
    @Column
    private int creation;
    @Column
    private String presidence;
    @OneToMany(
            fetch = FetchType.LAZY,  mappedBy="universite",
            cascade = CascadeType.REMOVE
    )
    private List<Campus> campusList;

    public Universite() {}

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getAcronyme() {
        return acronyme;
    }

    public void setAcronyme(String acronyme) {
        this.acronyme = acronyme;
    }

    public int getCreation() {
        return creation;
    }

    public void setCreation(int creation) {
        this.creation = creation;
    }

    public String getPresidence() {
        return presidence;
    }

    public void setPresidence(String presidence) {
        this.presidence = presidence;
    }

    public List<Campus> getCampusList() {
        return campusList;
    }

    public void setCampusList(List<Campus> campusList) {
        this.campusList = campusList;
    }
}
