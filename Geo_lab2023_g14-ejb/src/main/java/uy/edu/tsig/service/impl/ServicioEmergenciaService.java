package uy.edu.tsig.service.impl;

import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import uy.edu.tsig.entity.Hospital;
import uy.edu.tsig.entity.ServicioEmergencia;
import uy.edu.tsig.model.ServiciosEmergencias;
import uy.edu.tsig.persistence.IHospitalDAO;
import uy.edu.tsig.persistence.IServicioEmergenciaDAO;
import uy.edu.tsig.service.IServicioEmergenciaService;

@Stateless
public class ServicioEmergenciaService implements IServicioEmergenciaService {
    @EJB
    IServicioEmergenciaDAO iServicioEmergenciaDAO;
    @EJB
    IHospitalDAO iHospitalDAO;

    @Override
    public void altaServicioE(ServicioEmergencia se, Long hospital){
        Hospital h= iHospitalDAO.buscarHospital(hospital);
        se.setHospital(h);
        se.setCamasLibres(se.getTotalCama());
        ServicioEmergencia persist=iServicioEmergenciaDAO.altaServicioE(se);
        iHospitalDAO.asignarServicioE(h,persist);
    }

    @Override
    public boolean borrarSE(Long idSE, Long idHospital){

        return iServicioEmergenciaDAO.borrarSE(idSE, idHospital);
    }

    @Override
    public ServiciosEmergencias listarServiciosEmergensias(){
        ServiciosEmergencias s= new ServiciosEmergencias();
        s.setListServiciosEmergencias(iServicioEmergenciaDAO.obtenerServicioE());
        return s;
    }
}
