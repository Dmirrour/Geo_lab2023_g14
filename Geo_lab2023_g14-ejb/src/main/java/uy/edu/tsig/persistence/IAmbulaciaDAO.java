package uy.edu.tsig.persistence;

import jakarta.ejb.Remote;
import uy.edu.tsig.entity.Ambulancia;

@Remote
public interface IAmbulaciaDAO {
    Ambulancia altaAmbulacia(Ambulancia a);

    void crearGeometrias(Ambulancia a);
}
