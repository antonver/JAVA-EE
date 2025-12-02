package Ex.projection;

import Ex.modele.Batiment;
import Ex.modele.Salle;
import Ex.modele.TypeSalle;
import org.springframework.data.rest.core.config.Projection;

@Projection(name = "full", types = { Salle.class })
public interface SalleFullProjection {
    String getNumS();
    int getCapacite();
    TypeSalle getTypeS();
    String getAcces();
    String getEtage();
    Batiment getBatiment();
}

