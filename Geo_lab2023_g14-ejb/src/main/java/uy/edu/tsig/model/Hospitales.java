package uy.edu.tsig.model;

import uy.edu.tsig.dto.HospitalDTO;

import java.io.Serializable;
import java.util.ArrayList;

public class Hospitales implements Serializable {
    private static final Long serialVersionUID = 1L;

    private ArrayList<HospitalDTO> hospitales;

    public void setListHospitales(ArrayList<HospitalDTO> hospitales) {
        this.hospitales = hospitales;
    }

    public ArrayList<HospitalDTO> getListHospitales() {
        return hospitales;
    }
}
