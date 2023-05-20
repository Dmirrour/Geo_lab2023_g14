package uy.edu.tsig.service;

import jakarta.ejb.Remote;
import uy.edu.tsig.dto.AmbulanciaDTO;
import uy.edu.tsig.entity.Ambulancia;

@Remote
public interface IAmbulaciasService {
    AmbulanciaDTO altaAmbulacia(Ambulancia a, Long hospital);
}
