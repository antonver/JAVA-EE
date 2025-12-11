package Ex.domain;

import Ex.modele.Composante;
import Ex.modele.TypeSalle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ComposantRepository extends JpaRepository<Composante, String> {

    @Query(
            "SELECT SUM(s.capacite) FROM Composante cm " +
                    "JOIN cm.batimentList b " +
                    "JOIN b.salleList s " +
                    "WHERE cm.acronyme = :acronymeComposante"
    )
    int getTotalCapacityForComposante(String acronymeComposante);


    @Query(
            "SELECT s.numS FROM Salle s " +
                    "JOIN s.batiment b " +
                    "JOIN b.composanteList c " +
                    "WHERE c.acronyme = :acronyme AND " +
                    "s.typeS = :type AND " +
                    "s.capacite >= :minCapacity"
    )
    List<String> findSallesForComposanteByCriteria(String acronyme, TypeSalle type, int minCapacity);

}
