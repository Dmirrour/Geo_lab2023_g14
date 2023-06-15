package uy.edu.tsig.service;

import jakarta.ejb.Remote;
import uy.edu.tsig.dto.HospitalDTO;
import uy.edu.tsig.dto.ServicioEmergenciaDTO;
import uy.edu.tsig.entity.Hospital;
import uy.edu.tsig.model.Hospitales;

import java.util.ArrayList;

@Remote
public interface IHospitalService {
    HospitalDTO altaHospital(Hospital h);
    Hospitales obtenerHospitales();
    boolean borrarH(Long idHospital);
    void modificar(HospitalDTO h);
    ArrayList<ServicioEmergenciaDTO> serviciosAsignadosL(Long id);
}
