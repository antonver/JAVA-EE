package Ex.projection;

import Ex.modele.Campus;
import Ex.modele.Universite;
import org.springframework.data.rest.core.config.Projection;

@Projection(name = "full", types = { Campus.class })
public interface CampusFullProjection {
    String getNomC();
    String getVille();
    Universite getUniversite();
}

