package uy.edu.tsig.persistence;

import jakarta.ejb.Remote;
import uy.edu.tsig.dto.HospitalDTO;
import uy.edu.tsig.entity.Ambulancia;
import uy.edu.tsig.entity.Hospital;

import java.util.ArrayList;
@Remote
public interface IHospitalDAO {
    void asignarAmbulacia(Hospital hospital, Ambulancia a);
    ArrayList<HospitalDTO> obtenerHospitales();
    void altaHospital(Hospital h);
    Hospital buscarHospital(Long idHospital);
}
