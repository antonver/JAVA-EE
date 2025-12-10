package Ex.dto;

import java.util.List;

/**
 * DTO pour créer/modifier une composante avec ses bâtiments
 */
public class ComposanteRequestDto {
    private String acronyme;
    private String nom;
    private String responsable;
    private List<String> batimentCodes;

    public ComposanteRequestDto() {}

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
        return responsable;
    }

    public void setResponsable(String responsable) {
        this.responsable = responsable;
    }

    public List<String> getBatimentCodes() {
        return batimentCodes;
    }

    public void setBatimentCodes(List<String> batimentCodes) {
        this.batimentCodes = batimentCodes;
    }
}


