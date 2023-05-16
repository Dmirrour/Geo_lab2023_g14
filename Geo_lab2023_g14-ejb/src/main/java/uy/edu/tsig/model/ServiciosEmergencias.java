package uy.edu.tsig.model;

import uy.edu.tsig.dto.ServicioEmergenciaDTO;

import java.io.Serializable;
import java.util.ArrayList;

public class ServiciosEmergencias implements Serializable {
    private static final Long serialVersionUID = 1L;

    private ArrayList<ServicioEmergenciaDTO> listaServiciosEmergencias;

    public void setListServiciosEmergencias(ArrayList<ServicioEmergenciaDTO> listaServiciosEmergencias) {
        this.listaServiciosEmergencias = listaServiciosEmergencias;
    }

    public ArrayList<ServicioEmergenciaDTO> getListServiciosEmergencias() {
        return listaServiciosEmergencias;
    }
}
