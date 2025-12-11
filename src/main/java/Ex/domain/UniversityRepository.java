package Ex.domain;

import Ex.modele.Universite;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UniversityRepository extends JpaRepository<Universite, String> {

}
