package uy.edu.tsig.persistence.impl;

import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import uy.edu.tsig.entity.Ambulancia;
import uy.edu.tsig.persistence.IAmbulaciaDAO;
import uy.edu.tsig.util.qualifier.Geo_lab2023_g14PersistenceUnit;

@Stateless
public class AmbulaciaDAO implements IAmbulaciaDAO {
    @Geo_lab2023_g14PersistenceUnit
    @Inject
    public EntityManager em;

    @Override
    public Ambulancia altaAmbulacia(Ambulancia a){
        em.persist(a);
        //a.getIdAmbulancia();
        return a;
    }

}
