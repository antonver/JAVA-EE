package Ex;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import Ex.domain.CampusRepository;

import Ex.modele.Batiment;
import Ex.modele.Campus;
import Ex.service.CampusService;
import jakarta.transaction.Transactional;

@Transactional 
@SpringBootApplication
public class CL_Appli implements CommandLineRunner {

		 @Autowired
		 private CampusService cs;
		 @Autowired
		 private CampusRepository cr;
		 
		public static void main(String[] args) {
			SpringApplication.run(CL_Appli.class, args);
		}


	@Override
	public void run(String... args) throws Exception {

	}
}
