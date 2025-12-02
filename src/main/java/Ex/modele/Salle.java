package Ex.modele;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Salle {
    @Id
    @Column(length=16)
    private String numS;
    private int capacite;
    @Enumerated(EnumType.STRING)
    @Column(length=12)
    private TypeSalle typeS;
    @Column(length=3)
    private String acces;
    @Column(length=3)
    private String etage;
    @ManyToOne
    @JoinColumn(name="batiment")
    @JsonIgnoreProperties({"salleList", "composanteList", "campus"})
    private Batiment batiment;

    public Salle(String numS, int capacite, TypeSalle typeS, String acces, String etage, Batiment batiment) {
        this.numS = numS;
        this.capacite = capacite;
        this.typeS = typeS;
        this.acces = acces;
        this.etage = etage;
        this.batiment = batiment;
    }

    public Salle(){
    }

    public String getNumS() {
        return numS;
    }

    public void setNumS(String numS) {
        this.numS = numS;
    }

    public int getCapacite() {
        return capacite;
    }

    public void setCapacite(int capacite) {
        this.capacite = capacite;
    }

    public TypeSalle getTypeS() {
        return typeS;
    }

    public void setTypeS(TypeSalle typeS) {
        this.typeS = typeS;
    }

    public String getAcces() {
        return acces;
    }

    public void setAcces(String acces) {
        this.acces = acces;
    }

    public String getEtage() {
        return etage;
    }

    public void setEtage(String etage) {
        this.etage = etage;
    }

    public Batiment getBatiment() {
        return batiment;
    }

    public void setBatiment(Batiment batiment) {
        this.batiment = batiment;
    }

    @Override
    public  String toString(){
        return "Salle [numS=" + numS + ", capacite=" + capacite + ", typeS=" + typeS + ", acces=" + acces + ", etage=" + etage + ", batiment=" + batiment + "]";
    }
}
