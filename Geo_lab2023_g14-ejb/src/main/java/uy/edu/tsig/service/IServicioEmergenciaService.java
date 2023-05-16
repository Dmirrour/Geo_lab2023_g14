package uy.edu.tsig.service;

import jakarta.ejb.Remote;
<<<<<<< HEAD
import uy.edu.tsig.dto.HospitalDTO;
import uy.edu.tsig.entity.Hospital;
import uy.edu.tsig.entity.ServicioEmergencia;
import uy.edu.tsig.model.Hospitales;

@Remote
public interface IServicioEmergenciaService {
    void altaServicioEmergencia(ServicioEmergencia s);

    void asignarServicioEmergencia(ServicioEmergencia s, Hospital h);
=======
import uy.edu.tsig.entity.ServicioEmergencia;

@Remote
public interface IServicioEmergenciaService {
    void altaServicioE(ServicioEmergencia se, Long hospital);
>>>>>>> 63986cf429605ebc976650426a9559cc4fd33b31
}
