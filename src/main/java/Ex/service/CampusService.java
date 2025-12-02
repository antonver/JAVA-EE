package Ex.service;
import Ex.modele.Batiment;
import Ex.modele.Salle;
import org.hibernate.annotations.DialectOverride;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Ex.domain.CampusRepository;
import Ex.modele.Campus;
import jakarta.transaction.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

@Service
public class CampusService  implements ICampusService {

    private final CampusRepository cr;

    @Autowired
    public CampusService(CampusRepository cr) {
        this.cr = cr;
    }

    public List<Campus> findAll() {
        return cr.findAll();
    }

    public List<String[]> showsEntities() {
        return cr.campusEtCodeB();
    }

    public void campusEtBatiments() {
        Iterable<String[]> e = showsEntities();
        System.out.println("les campus avec leurs batiments (nomC) :");
        if (StreamSupport.stream(e.spliterator(), false).count() != 0) {
            for (String[] s : e) {
                for (String entry : s) {
                    System.out.print(entry + " ");
                }
                System.out.println("");
            }
        } else System.out.println("pas grand chose dans la base");
    }

    @Override
    public List<String[]> getNumberOfBatiments() {
        List<String[]> list = cr.getNumberOfBatiments();
        for (String[] s : list) {
            System.out.println("Campus: " + s[0] + ", Number of Batiments: " + s[1]);
        }
        return list;
    }

    @Override
    public List<String[]> getNumberOfSalles() {
        List<String[]> list = cr.getNumberOfSalles();
        for (String[] s : list) {
            System.out.println("Campus: " + s[0] + ", Number of Salles: " + s[1]);
        }
        return list;
    }

    @Override
    public int getNumberOfSallePourPersonneHandicapees() {
        int count = cr.getNumberOfSallePourPersonneHandicapees();
        System.out.println("Number of Salles for Handicapped Persons: " + count);
        return count;
    }

    @Override
    public List<Salle> getAmphisTriolet() {
        List<Salle> list = cr.getAmphisTriolet();
        for (Salle s : list) {
            System.out.println(s.toString());
        }
        return list;
    }

    @Override
    public int numberOfPlacesAssisesParBat(String codeB) {
        int totalSeats = cr.numberOfPlacesAssisesParBat(codeB);
        System.out.println("Total Seats in Batiment " + codeB + ": " + totalSeats);
        return totalSeats;

    }

    @Override
    public int numberOfPlacesAssisesParCampus(String nomC) {
        ;
        int totalSeats = cr.numberOfPlacesAssisesParCampus(nomC);
        System.out.println("Total Seats in Campus " + nomC + ": " + totalSeats);
        return totalSeats;
    }


    @Override
    public int numberDeGroupesParCampus(String nomC){
        int numberOfGroups = this.numberOfPlacesAssisesParCampus(nomC) / 30;
        System.out.println("Number of Groups in Campus " + nomC + ": " + numberOfGroups);
        return numberOfGroups;
    }

    @Override
    public int numberDeGroupesParBatiment(String codeB){
        int numberOfGroups = this.numberOfPlacesAssisesParBat(codeB) / 30;
        System.out.println("Number of Groups in Batiment " + codeB + ": " + numberOfGroups);
        return numberOfGroups;
    }

    public void campusParVille(String ville) {
        Iterable<Campus> e = cr.findByVille(ville);
        System.out.println("La liste des campus de " + ville);
        if (StreamSupport.stream(e.spliterator(), false).count() != 0) {
            for (Campus c : e) {
                System.out.println(c.toString());
            }
        } else System.out.println("pas de campus connu sur " + ville);
    }

    @Override
    public 	int numberDeGroupesParSalleDeTypeSpecificDeCampus(String nomC, String typeS){
        return cr.numberDeGroupesParSalleDeTypeSpecificDeCampus(nomC, typeS);
    }

    @Override
    public int numberDeGroupesParSalleDeTypeSpecificDeBatiment(String codeB, String typeS){
        return cr.numberDeGroupesParSalleDeTypeSpecificDeBatiment(codeB, typeS);
    }

    public Optional<Campus> campusParId(String id) {
        return cr.findById(id);
    }

    @Transactional
    public Campus createCampus(Campus campus) {
        return cr.save(campus);
    }

    @Transactional
    public Campus updateCampus(String id, Campus updatedCampus) {
        return cr.findById(id)
                .map(campus -> {
                    campus.setVille(updatedCampus.getVille());
                    campus.setBatiments(updatedCampus.getBatiments());
                    return cr.save(campus);
                })
                .orElseThrow(() -> new RuntimeException("Campus not found with nomC: " + id));
    }

    @Transactional
    public void deleteCampus(String id) {
        cr.deleteById(id);
    }
}
