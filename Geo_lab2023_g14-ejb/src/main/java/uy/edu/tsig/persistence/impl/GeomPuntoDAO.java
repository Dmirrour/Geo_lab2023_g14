package uy.edu.tsig.persistence.impl;

import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import uy.edu.tsig.entity.GeomPunto;
import uy.edu.tsig.persistence.IGeomPuntoDAO;
import uy.edu.tsig.util.qualifier.Geo_lab2023_g14PersistenceUnit;

import java.io.Serializable;

@Stateless
public class GeomPuntoDAO implements IGeomPuntoDAO {
    @Geo_lab2023_g14PersistenceUnit
    @Inject
    public EntityManager em;

    @Override
    public GeomPunto geomPunto(GeomPunto pto){
        em.persist(pto);
        return pto;
    }
}
