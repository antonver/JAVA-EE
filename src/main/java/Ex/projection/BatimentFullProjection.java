package Ex.projection;

import Ex.modele.Batiment;
import Ex.modele.Campus;
import org.springframework.data.rest.core.config.Projection;

@Projection(name = "full", types = { Batiment.class })
public interface BatimentFullProjection {
    String getCodeB();
    int getAnneeC();
    double getLatitude();
    double getLongitude();
    Campus getCampus();
}

