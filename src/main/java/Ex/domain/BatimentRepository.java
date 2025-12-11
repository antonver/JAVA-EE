package Ex.domain;

import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import Ex.modele.*;

public interface BatimentRepository extends JpaRepository<Batiment, String> {
	// JPQL Query
	@Query("SELECT b FROM Batiment b WHERE b.codeB IN :ids")
	List<Batiment> findByIds(@Param("ids") List<String> ids);
	
	List<Batiment> findByCampus(Campus campus);
	
	//SQL Join with Campus
	@Query(value = "SELECT c.*, b.* from campus c, batiment b "
	 + " where b.campus = c.nomC "	  , nativeQuery = true)
	List<Map<String, Object>> findBatimentByCampus();
}
