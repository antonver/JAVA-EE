package Ex.service;

import Ex.modele.Batiment;
import Ex.modele.Salle;
import Ex.modele.TypeSalle;

import java.util.List;

public interface IComposantService {
    List<Batiment> getBatimentsForComposante(String acronymeComposante);

    int getTotalCapacityForComposante(String acronymeComposante);

    List<String> findSallesForComposanteByCriteria(String acronyme, TypeSalle type, int minCapacity);


}
