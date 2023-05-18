package uy.edu.tsig.service;

import jakarta.ejb.Remote;
import uy.edu.tsig.entity.ServicioEmergencia;

@Remote
public interface IServicioEmergenciaService {
    void altaServicioE(ServicioEmergencia se, Long hospital);
}