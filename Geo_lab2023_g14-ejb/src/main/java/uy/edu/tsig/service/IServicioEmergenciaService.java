package uy.edu.tsig.service;

import jakarta.ejb.Remote;
import uy.edu.tsig.dto.ServicioEmergenciaDTO;
import uy.edu.tsig.entity.ServicioEmergencia;
import uy.edu.tsig.model.ServiciosEmergencias;

@Remote
public interface IServicioEmergenciaService {
    ServicioEmergenciaDTO altaServicioE(ServicioEmergencia se, Long hospital);
    boolean borrarSE(Long idSE, Long idHospital);
    ServiciosEmergencias listarServiciosEmergensias();
}
