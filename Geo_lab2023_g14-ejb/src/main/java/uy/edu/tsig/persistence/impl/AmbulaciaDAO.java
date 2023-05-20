package uy.edu.tsig.persistence.impl;

import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import uy.edu.tsig.entity.Ambulancia;
import uy.edu.tsig.persistence.IAmbulaciaDAO;
import uy.edu.tsig.util.qualifier.Geo_lab2023_g14PersistenceUnit;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;

@Stateless
public class AmbulaciaDAO implements IAmbulaciaDAO {
    @Geo_lab2023_g14PersistenceUnit
    @Inject
    public EntityManager em;

    @Override
    public Ambulancia altaAmbulacia(Ambulancia a) {
        em.persist(a);
        // a.getIdAmbulancia();

        return a;
    }

    @Override
    public void crearGeometrias(Ambulancia a) {
        Query q = em.createQuery(
                "UPDATE ambulancia SET geom=(ST_SetSRID(ST_MakePoint(-35, -54), 32721)) WHERE idambulancia=7",
                Ambulancia.class);

    }

}
