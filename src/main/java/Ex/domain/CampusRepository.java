package Ex.domain;

import java.util.List;

import Ex.modele.Salle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import Ex.modele.Campus;


@Repository
public interface CampusRepository extends JpaRepository<Campus, String> {

	List<Campus> findByVille(String ville);

	@Query("SELECT c.nomC, bts.codeB FROM Campus c "
			+ "JOIN c.batiments bts ")
	List<String[]> campusEtCodeB();

	@Query(
			"SELECT c.nomC, COUNT(b) FROM Campus c JOIN c.batiments b GROUP BY c.nomC"
	)
	List<String[]> getNumberOfBatiments();

	@Query(
			"SELECT c.nomC, COUNT(s) FROM Campus c "
					+ "JOIN c.batiments b " +
					"JOIN Salle s " +
					"WHERE s.batiment = b "
					+ "GROUP BY c.nomC"
	)
	List<String[]> getNumberOfSalles();

	@Query(
			"SELECT COUNT(s) FROM Salle s WHERE s.typeS = 'td' and s.capacite >= 40 and s.acces = 'PMR' " +
					"AND s.batiment.campus.ville = 'Montpellier'"
	)
	int getNumberOfSallePourPersonneHandicapees();
	@Query(
			"SELECT s FROM Salle s " +
					"JOIN s.batiment b " +
					"WHERE b.campus.nomC = 'Triolet' " +
					"AND s.typeS = 'amphi' " +
					"AND s.capacite >= 80"
	)
	List<Salle> getAmphisTriolet();


	@Query(
			"SELECT SUM(s.capacite) FROM Salle s " +
					"JOIN s.batiment b " +
					"WHERE b.codeB = :codeB"
	)
	int numberOfPlacesAssisesParBat(String codeB);

	@Query(
			"SELECT SUM(s.capacite) FROM Salle s " +
					"JOIN s.batiment b " +
					"JOIN b.campus c " +
					"WHERE c.nomC = :nomC"
	)
	int numberOfPlacesAssisesParCampus(String nomC);

	@Query(
			"SELECT (SUM(s.capacite) / 30) FROM Salle s " +
					"JOIN s.batiment b " +
					"JOIN b.campus c " +
					"WHERE c.nomC = :nomC AND " +
					"s.typeS = :typeS"
	)
	int numberDeGroupesParSalleDeTypeSpecificDeCampus(String nomC, String typeS);

	@Query(
			"SELECT (SUM(s.capacite) / 30) FROM Salle s " +
					"JOIN s.batiment b " +
					"WHERE b.codeB = :codeB AND s.typeS = :typeS"
	)
	int numberDeGroupesParSalleDeTypeSpecificDeBatiment(String codeB, String typeS);
}
