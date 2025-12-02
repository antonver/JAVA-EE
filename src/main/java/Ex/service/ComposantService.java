package Ex.service;

import Ex.domain.ComposantRepository;
import Ex.modele.Batiment;
import Ex.modele.Salle;
import Ex.modele.TypeSalle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ComposantService implements IComposantService{

    private final ComposantRepository cr;

    @Autowired
    public ComposantService(ComposantRepository cr){
        this.cr = cr;
    }

    @Override
    public List<Batiment> getBatimentsForComposante(String acronymeComposante){
        return cr.findById(acronymeComposante).orElseThrow().getBatimentList();
    }

    @Override
    public int getTotalCapacityForComposante(String acronymeComposante){
        return cr.getTotalCapacityForComposante(acronymeComposante);
    }

    @Override
    public List<String> findSallesForComposanteByCriteria(String acronyme, TypeSalle type, int minCapacity){
    return cr.findSallesForComposanteByCriteria(acronyme, type, minCapacity);
    }
}
