package uy.edu.tsig.persistence;

import jakarta.ejb.Remote;
import uy.edu.tsig.dto.HospitalDTO;
import uy.edu.tsig.entity.Ambulancia;
import uy.edu.tsig.entity.Hospital;
import uy.edu.tsig.entity.ServicioEmergencia;

import java.util.ArrayList;

@Remote
public interface IServicioEmergenciaDAO {
    void altaServicioEmergencia(ServicioEmergencia s);

    void asignarServicioEmergencia(ServicioEmergencia s, Hospital h);
}
