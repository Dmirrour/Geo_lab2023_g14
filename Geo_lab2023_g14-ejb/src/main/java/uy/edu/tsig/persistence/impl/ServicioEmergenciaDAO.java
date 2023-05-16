package uy.edu.tsig.persistence.impl;

import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import uy.edu.tsig.dto.HospitalDTO;
import uy.edu.tsig.dto.ServicioEmergenciaDTO;
import uy.edu.tsig.entity.Ambulancia;
import uy.edu.tsig.entity.Hospital;
import uy.edu.tsig.entity.ServicioEmergencia;
import uy.edu.tsig.persistence.IHospitalDAO;
import uy.edu.tsig.persistence.IServicioEmergenciaDAO;
import uy.edu.tsig.util.qualifier.Geo_lab2023_g14PersistenceUnit;

import java.util.ArrayList;
import java.util.List;

@Stateless
public class ServicioEmergenciaDAO implements IServicioEmergenciaDAO {
    @Geo_lab2023_g14PersistenceUnit
    @Inject
    public EntityManager em;

    @Override
    public void altaServicioEmergencia(ServicioEmergencia s) {
        em.persist(s);
    }

    @Override
    public void asignarServicioEmergencia(ServicioEmergencia s, Hospital hs) {
        // ServicioEmergencia service = em.find(s.class, s.getIdServicio());
        s.setHospital(hs);
        em.merge(s);
    }

}
