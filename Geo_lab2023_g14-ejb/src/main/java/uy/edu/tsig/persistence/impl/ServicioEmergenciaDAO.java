package uy.edu.tsig.persistence.impl;

import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import uy.edu.tsig.dto.ServicioEmergenciaDTO;
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

    @EJB
    IHospitalDAO iHospitalDAO;
    @Override
    public ServicioEmergencia altaServicioE(ServicioEmergencia se){
        em.persist(se);
        return se;
    }
    @Override
    public boolean borrarSE(Long idSE, Long idHospital){
        Hospital h= iHospitalDAO.buscarHospital(idHospital);

        ServicioEmergencia se= em.find(ServicioEmergencia.class,idSE);
        if(se!=null){
            h.setServicioEmergencia(null);
            em.remove(se);
            return true;
        }else{
            return false;
        }

    }

    @Override
    public ArrayList<ServicioEmergenciaDTO> obtenerServicioE(){
        Query q= em.createQuery("select se from ServicioEmergencia se", ServicioEmergencia.class);
        List<ServicioEmergencia> se =q.getResultList();
        return getServiciosDTO(se);
    }

    private ArrayList<ServicioEmergenciaDTO> getServiciosDTO(List<ServicioEmergencia> lSE){
        ArrayList<ServicioEmergenciaDTO> res =new ArrayList<>();

        lSE.forEach(servicioEmergencia -> res.add(ServicioEmergenciaDTO
                .builder()
                .idServicio(servicioEmergencia.getIdServicio())
                .camasLibres(servicioEmergencia.getCamasLibres())
                .hospital(servicioEmergencia.getHospitalDTO())
                .totalCama(servicioEmergencia.getTotalCama())
                .build()
                ));
        return res;
    }


}
