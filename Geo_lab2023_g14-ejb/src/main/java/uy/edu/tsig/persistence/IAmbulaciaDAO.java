package uy.edu.tsig.persistence;

import jakarta.ejb.Remote;
import uy.edu.tsig.dto.AmbulanciaDTO;
import uy.edu.tsig.entity.Ambulancia;

import java.util.ArrayList;

@Remote
public interface IAmbulaciaDAO {
    Ambulancia altaAmbulacia(Ambulancia a);

    void borrarambulancia(Long idAmbulancia);

    ArrayList<AmbulanciaDTO> obtenerAmbulanciaDtos();
}
