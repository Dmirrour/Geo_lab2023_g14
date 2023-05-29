package uy.edu.tsig.persistence.impl;

import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import uy.edu.tsig.dto.AmbulanciaDTO;
import uy.edu.tsig.entity.Ambulancia;
import uy.edu.tsig.entity.Hospital;
import uy.edu.tsig.entity.ServicioEmergencia;
import uy.edu.tsig.persistence.IAmbulaciaDAO;
import uy.edu.tsig.util.qualifier.Geo_lab2023_g14PersistenceUnit;

import java.util.ArrayList;
import java.util.List;

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
    @Override
    public void borrarambulancia(Long idAmbulancia){
        Ambulancia ambulanciaEliminar = em.find(Ambulancia.class, idAmbulancia);
        Hospital hospital = ambulanciaEliminar.getHospital();
        hospital.getAmbulancia().remove(ambulanciaEliminar);

        ambulanciaEliminar.setHospital(null);
        em.remove(ambulanciaEliminar);

        System.out.println("Ambulancia eliminada correctamente.");


    }

    @Override
    public ArrayList<AmbulanciaDTO> obtenerAmbulanciaDtos() {
        Query q= em.createQuery("select a from Ambulancia a", Ambulancia.class);
        List<Ambulancia> a=q.getResultList();
        return getAmbulanciaDTOS(a);
    }

    private ArrayList<AmbulanciaDTO> getAmbulanciaDTOS(List<Ambulancia> lA){
        ArrayList<AmbulanciaDTO> res= new ArrayList<>();

        lA.forEach(Ambulancia -> res.add(AmbulanciaDTO.builder()
                .idAmbulancia(Ambulancia.getIdAmbulancia())
                .distanciaMaxDesvio(Ambulancia.getDistanciaMaxDesvio())
                .hospital(Ambulancia.getHospitalDTO())
                .idCodigo(Ambulancia.getIdCodigo())
                .build()
        ));
        return res;
    }
    @Override
    public Ambulancia buscarAmbu(Long ambu) {
        return em.find(Ambulancia.class,ambu);
    }
    @Override
    public void modificar(Ambulancia ambu) {
        em.merge(ambu);
    }

}
