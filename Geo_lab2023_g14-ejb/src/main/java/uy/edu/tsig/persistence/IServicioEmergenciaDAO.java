package uy.edu.tsig.persistence;

import jakarta.ejb.Remote;
import uy.edu.tsig.entity.ServicioEmergencia;
@Remote
public interface IServicioEmergenciaDAO {
    ServicioEmergencia altaServicioE(ServicioEmergencia se);
}
