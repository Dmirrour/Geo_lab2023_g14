package uy.edu.tsig.persistence.impl;

import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import uy.edu.tsig.dto.HospitalDTO;
import uy.edu.tsig.entity.Ambulancia;
import uy.edu.tsig.entity.Hospital;
import uy.edu.tsig.entity.ServicioEmergencia;
import uy.edu.tsig.persistence.IHospitalDAO;
import uy.edu.tsig.util.qualifier.Geo_lab2023_g14PersistenceUnit;

import java.util.ArrayList;
import java.util.List;


@Stateless
public class HospitalDAO implements IHospitalDAO {

    @Geo_lab2023_g14PersistenceUnit
    @Inject
    public EntityManager em;
    @Override
    public void altaHospital(Hospital h){
            em.persist(h);
    }
    @Override
    public Hospital buscarHospital(Long idHospital){
        return em.find(Hospital.class, idHospital);
    }
    @Override
    public void asignarAmbulacia(Hospital hospital, Ambulancia a){
        Hospital h = em.find(Hospital.class, hospital.getIdHospital());
        h.getAmbulancia().add(a);
        em.merge(h);
    }
    @Override
    public void updateDesviculo(Hospital hospital){
        Hospital h = em.find(Hospital.class, hospital.getIdHospital());
        em.merge(h);
    }

    @Override
    public void asignarServicioE(Hospital hospital, ServicioEmergencia s){
        Hospital h = em.find(Hospital.class, hospital.getIdHospital());
        h.setServicioEmergencia(s);
        em.merge(h);
    }

    @Override
    public ArrayList<HospitalDTO> obtenerHospitales(){
        Query q= em.createQuery("select h from Hospital h", Hospital.class);
        List<Hospital> result = q.getResultList();
        return getHospitalesDTO(result);
    }

    private ArrayList<HospitalDTO> getHospitalesDTO(List<Hospital> h){
        ArrayList<HospitalDTO> res= new ArrayList<>();

        h.forEach(hospital -> res.add(HospitalDTO.builder()
                .idHospital(hospital.getIdHospital())
                .nombreHospital(hospital.getNombreHospital())
                .tipoHospital(hospital.getTipoHospital())
                .servicioEmergencia(hospital.getServicioEmergencia())
                .ambulanciaDTOS(hospital.getAmbulanciasDTOS())
                .build()));
        return res;
    }
    @Override
    public boolean eliminarH(Long idHospital){
        Hospital h= buscarHospital(idHospital);
        if(h!=null){
            em.remove(h);
            return true;
        }else{
            return false;
        }
    }


}
