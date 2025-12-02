package Ex.control;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import Ex.modele.Campus;
import Ex.service.CampusService;

import java.util.List;
import java.util.Optional;

@Controller
public class CampusController {

	@Autowired
	private CampusService cs;

	@GetMapping("/listeCampus")
	public String home(	Model model) {
		model.addAttribute("campuses", cs.findAll());
		return "campuses";
	}

	public CampusController() {
		System.out.println("les campus ");
	}
}

