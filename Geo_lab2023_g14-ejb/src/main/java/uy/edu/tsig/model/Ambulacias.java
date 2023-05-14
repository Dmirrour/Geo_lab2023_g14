package uy.edu.tsig.model;

import uy.edu.tsig.dto.AmbulanciaDTO;

import java.io.Serializable;
import java.util.ArrayList;

public class Ambulacias implements Serializable {
    private static final Long serialVersionUID = 1L;
    private ArrayList<AmbulanciaDTO> ambulancias;

    public ArrayList<AmbulanciaDTO> getListaAmbulancias() {
        return ambulancias;
    }

    public void setListaAmbulancias(ArrayList<AmbulanciaDTO> ambulancias) {
        this.ambulancias = ambulancias;
    }
}
