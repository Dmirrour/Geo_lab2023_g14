package uy.edu.tsig.persistence.impl;

import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;
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
    @Transactional
    public boolean borrarSE(Long idSE){
        ServicioEmergencia se= em.find(ServicioEmergencia.class,idSE);

        if(se!=null){
            Hospital h = se.getHospital();
            h.getServicioEmergencia().remove(se);
            //h.setServicioEmergencia(null);
            se.setHospital(null);
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
                .nombre(servicioEmergencia.getNombre())
                .camasLibres(servicioEmergencia.getCamasLibres())
                .hospital(servicioEmergencia.getHospitalDTO())
                .totalCama(servicioEmergencia.getTotalCama())
                .build()
                ));
        return res;
    }
    @Override
    public void modificar(ServicioEmergencia serv) {
        em.merge(serv);
    }

    @Override
    public ServicioEmergencia buscarServ(Long serv) {
        return em.find(ServicioEmergencia.class,serv);
    }


}
