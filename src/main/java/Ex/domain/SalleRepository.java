package Ex.domain;



import Ex.modele.Salle;
import Ex.modele.TypeSalle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SalleRepository extends JpaRepository<Salle, String> {
//   1. il faut écrir le premiere methode

//    2. retourner toutes les salles de td situ´ees dans le bˆatiment 36
    @Query("SELECT s FROM Salle s WHERE s.batiment.codeB = '36'")
    List<Salle> retournerSalleBat36();
//3. retourner les salles qui sont localis´ees dans un bˆatiment dont le code est pass´e en param`etre
    @Query("SELECT s FROM Salle s WHERE s.numS = :numS")
    List<Salle> retournerSalleParNumDeBat(@Param("numS") String numS);
//4. retourner toutes les salles d'un campus dont le nom est `a pr´eciser en param`etre
    @Query("""
SELECT s FROM Salle s
 JOIN s.batiment
 WHERE s.batiment.campus.nomC = :nom"""
    )
    List<Salle> retournerSalleParNomDeCampus(@Param("nom") String nom);

//5. retourner le nombre de salles par bˆatiment
@Query("""
SELECT COUNT(s) FROM Salle s WHERE s.numS = :numS
""")
     int retourneNombreDeSalleParBatiment(@Param("numS") String nums);

//6. retourner le nombre de salles par type de salle
@Query("""
SELECT COUNT(s) FROM Salle s WHERE s.typeS = :typeS
""")
    int retournerNombreSallesParType(@Param("typeS") TypeSalle nums);
}
