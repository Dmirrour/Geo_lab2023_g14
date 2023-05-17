package uy.edu.tsig.persistence;

import jakarta.ejb.Remote;
import uy.edu.tsig.dto.HospitalDTO;
import uy.edu.tsig.entity.Ambulancia;
import uy.edu.tsig.entity.Hospital;
import uy.edu.tsig.entity.ServicioEmergencia;

import java.util.ArrayList;
@Remote
public interface IHospitalDAO {
    void asignarAmbulacia(Hospital hospital, Ambulancia a);
    void asignarServicioE(Hospital hospital, ServicioEmergencia a);
    ArrayList<HospitalDTO> obtenerHospitales();
    void altaHospital(Hospital h);
    Hospital buscarHospital(Long idHospital);
    boolean eliminarH(Long idHospital);
    void updateDesviculo(Hospital hospital);
}
