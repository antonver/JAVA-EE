package Ex.service;

import java.util.List;
import java.util.Optional;

import Ex.modele.Batiment;
import Ex.modele.Salle;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import Ex.modele.Campus;


public interface ICampusService {
	
	Campus createCampus(Campus campus) ;

	void deleteCampus(String id);

	Optional<Campus> campusParId(String nomC);
	
	void campusParVille(String ville) ;

	void campusEtBatiments();

	List<String[]> getNumberOfBatiments();

	List<String[]> getNumberOfSalles();

	int getNumberOfSallePourPersonneHandicapees();

	List<Salle> getAmphisTriolet();

	int numberOfPlacesAssisesParBat(String codeB);

	int numberOfPlacesAssisesParCampus(String nomC);

	int numberDeGroupesParCampus(String nomC);

	int numberDeGroupesParBatiment(String codeB);

	int numberDeGroupesParSalleDeTypeSpecificDeCampus(String nomC, String typeS);

	int numberDeGroupesParSalleDeTypeSpecificDeBatiment(String codeB, String typeS);
}
