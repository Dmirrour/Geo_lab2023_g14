package uy.edu.tsig.persistence.impl;

import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import uy.edu.tsig.entity.ServicioEmergencia;
import uy.edu.tsig.persistence.IServicioEmergenciaDAO;
import uy.edu.tsig.util.qualifier.Geo_lab2023_g14PersistenceUnit;
@Stateless
public class ServicioEmergenciaDAO implements IServicioEmergenciaDAO {
    @Geo_lab2023_g14PersistenceUnit
    @Inject
    public EntityManager em;

    @Override
    public ServicioEmergencia altaServicioE(ServicioEmergencia se){
        em.persist(se);
        return se;
    }
}