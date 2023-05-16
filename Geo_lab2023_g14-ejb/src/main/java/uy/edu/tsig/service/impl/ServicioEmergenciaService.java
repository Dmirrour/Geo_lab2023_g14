package uy.edu.tsig.service.impl;

import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import uy.edu.tsig.entity.Hospital;
import uy.edu.tsig.entity.ServicioEmergencia;
<<<<<<< HEAD
=======
import uy.edu.tsig.persistence.IHospitalDAO;
>>>>>>> 63986cf429605ebc976650426a9559cc4fd33b31
import uy.edu.tsig.persistence.IServicioEmergenciaDAO;
import uy.edu.tsig.service.IServicioEmergenciaService;

@Stateless
public class ServicioEmergenciaService implements IServicioEmergenciaService {
    @EJB
    IServicioEmergenciaDAO iServicioEmergenciaDAO;
<<<<<<< HEAD

    @Override
    public void altaServicioEmergencia(ServicioEmergencia s) {
        iServicioEmergenciaDAO.altaServicioEmergencia(s);
    }

    @Override
    public void asignarServicioEmergencia(ServicioEmergencia s, Hospital h) {
        iServicioEmergenciaDAO.asignarServicioEmergencia(s, h);
    }

=======
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
>>>>>>> 63986cf429605ebc976650426a9559cc4fd33b31
}
