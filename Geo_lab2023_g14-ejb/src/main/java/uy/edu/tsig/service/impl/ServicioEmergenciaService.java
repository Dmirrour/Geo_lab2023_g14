package uy.edu.tsig.service.impl;

import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import uy.edu.tsig.entity.Hospital;
import uy.edu.tsig.entity.ServicioEmergencia;
import uy.edu.tsig.persistence.IServicioEmergenciaDAO;
import uy.edu.tsig.service.IServicioEmergenciaService;

@Stateless
public class ServicioEmergenciaService implements IServicioEmergenciaService {
    @EJB
    IServicioEmergenciaDAO iServicioEmergenciaDAO;

    @Override
    public void altaServicioEmergencia(ServicioEmergencia s) {
        iServicioEmergenciaDAO.altaServicioEmergencia(s);
    }

    @Override
    public void asignarServicioEmergencia(ServicioEmergencia s, Hospital h) {
        iServicioEmergenciaDAO.asignarServicioEmergencia(s, h);
    }

}
