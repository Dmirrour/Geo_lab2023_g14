package uy.edu.tsig.persistence;

import jakarta.ejb.Remote;
import uy.edu.tsig.dto.AmbulanciaDTO;
import uy.edu.tsig.entity.Ambulancia;

import java.util.ArrayList;

@Remote
public interface IAmbulaciaDAO {
    Ambulancia altaAmbulacia(Ambulancia a);

    boolean borrarambulancia(Long idAmbulancia);

    ArrayList<AmbulanciaDTO> obtenerAmbulanciaDtos();
    void modificar(Ambulancia ambu);
    Ambulancia buscarAmbu(Long ambu);
}
