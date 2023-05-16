package uy.edu.tsig.persistence.impl;

import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
<<<<<<< HEAD
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

=======
import uy.edu.tsig.entity.ServicioEmergencia;
import uy.edu.tsig.persistence.IServicioEmergenciaDAO;
import uy.edu.tsig.util.qualifier.Geo_lab2023_g14PersistenceUnit;
>>>>>>> 63986cf429605ebc976650426a9559cc4fd33b31
@Stateless
public class ServicioEmergenciaDAO implements IServicioEmergenciaDAO {
    @Geo_lab2023_g14PersistenceUnit
    @Inject
    public EntityManager em;

    @Override
<<<<<<< HEAD
    public void altaServicioEmergencia(ServicioEmergencia s) {
        em.persist(s);
    }

    @Override
    public void asignarServicioEmergencia(ServicioEmergencia s, Hospital hs) {
        // ServicioEmergencia service = em.find(s.class, s.getIdServicio());
        s.setHospital(hs);
        em.merge(s);
    }

=======
    public ServicioEmergencia altaServicioE(ServicioEmergencia se){
        em.persist(se);
        return se;
    }
>>>>>>> 63986cf429605ebc976650426a9559cc4fd33b31
}
