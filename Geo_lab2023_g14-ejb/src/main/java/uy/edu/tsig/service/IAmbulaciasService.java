package uy.edu.tsig.service;

import jakarta.ejb.Remote;
import uy.edu.tsig.entity.Ambulancia;

@Remote
public interface IAmbulaciasService {
    void altaAmbulacia(Ambulancia a, Long hospital);
}
