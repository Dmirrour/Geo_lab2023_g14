package uy.edu.tsig.service.impl;

import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;

import org.locationtech.jts.geom.Geometry;
import uy.edu.tsig.dto.HospitalDTO;
import uy.edu.tsig.entity.Hospital;
import uy.edu.tsig.model.Hospitales;
import uy.edu.tsig.persistence.IHospitalDAO;
import uy.edu.tsig.service.IHospitalService;

@Stateless
public class HospitalService implements IHospitalService{
    @EJB
    IHospitalDAO iHospitalDAO;

    @Override
    public void altaHospital(Hospital h){
        iHospitalDAO.altaHospital(h);
    }
    @Override
    public Hospitales obtenerHospitales(){
        Hospitales h=new Hospitales();
        h.setListHospitales(iHospitalDAO.obtenerHospitales());
        return h;
    }

    @Override
    public Hospital asignarPuntoHospital(int idHospital, Geometry pto) {
        /**
         * TODO:
         * debo recuperar el hospital de la que estoy guardado en el metodo
         * alta ambulancia, y pasar ese idAmbulancia, mas el pto
         */
        return null;
    }
}
