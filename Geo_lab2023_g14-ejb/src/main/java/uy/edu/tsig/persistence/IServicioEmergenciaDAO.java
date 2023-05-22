package uy.edu.tsig.persistence;

import jakarta.ejb.Remote;
import uy.edu.tsig.dto.ServicioEmergenciaDTO;
import uy.edu.tsig.entity.ServicioEmergencia;

import java.util.ArrayList;

@Remote
public interface IServicioEmergenciaDAO {
    ServicioEmergencia altaServicioE(ServicioEmergencia se);
    boolean borrarSE(Long idSE);
    ArrayList<ServicioEmergenciaDTO> obtenerServicioE();

}
