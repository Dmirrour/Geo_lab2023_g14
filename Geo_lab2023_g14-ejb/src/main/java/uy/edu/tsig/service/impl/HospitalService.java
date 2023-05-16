package uy.edu.tsig.service.impl;

import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;

import uy.edu.tsig.dto.HospitalDTO;
import uy.edu.tsig.entity.Hospital;
import uy.edu.tsig.model.Hospitales;
import uy.edu.tsig.persistence.IHospitalDAO;
import uy.edu.tsig.service.IHospitalService;

@Stateless
public class HospitalService implements IHospitalService {
    @EJB
    IHospitalDAO iHospitalDAO;

    @Override
    public void altaHospital(Hospital h) {
        iHospitalDAO.altaHospital(h);
    }

    @Override
    public Hospitales obtenerHospitales() {
        Hospitales h = new Hospitales();
        h.setListHospitales(iHospitalDAO.obtenerHospitales());
        return h;
    }
}
