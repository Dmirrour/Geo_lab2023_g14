package uy.edu.tsig.service;

import jakarta.ejb.Remote;
import org.locationtech.jts.geom.Geometry;
import uy.edu.tsig.dto.HospitalDTO;
import uy.edu.tsig.entity.Hospital;
import uy.edu.tsig.model.Hospitales;

@Remote
public interface IHospitalService {
    void altaHospital(Hospital h);
    Hospitales obtenerHospitales();
    Hospital asignarPuntoHospital(int idHospital, Geometry pto);
}
