package Ex.domain;

import Ex.modele.Universite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(path = "universites")
public interface UniversityRepository extends JpaRepository<Universite, String> {

}
