package uy.edu.tsig.util;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.inject.Produces;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import uy.edu.tsig.util.qualifier.Geo_lab2023_g14PersistenceUnit;


@ApplicationScoped
public class EntityManagerProducer {
    @Produces
    @PersistenceContext(unitName = "Geo_lab2023_g14PersistenceUnit")
    @Geo_lab2023_g14PersistenceUnit
    private EntityManager em;

}
