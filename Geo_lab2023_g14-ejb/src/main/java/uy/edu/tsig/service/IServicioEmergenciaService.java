package uy.edu.tsig.service;

import jakarta.ejb.Remote;
import uy.edu.tsig.dto.HospitalDTO;
import uy.edu.tsig.entity.Hospital;
import uy.edu.tsig.entity.ServicioEmergencia;
import uy.edu.tsig.model.Hospitales;

@Remote
public interface IServicioEmergenciaService {
    void altaServicioEmergencia(ServicioEmergencia s);

    void asignarServicioEmergencia(ServicioEmergencia s, Hospital h);
}
