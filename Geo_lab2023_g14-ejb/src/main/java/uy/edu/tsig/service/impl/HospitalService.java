package uy.edu.tsig.service.impl;

import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;

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
    public HospitalDTO altaHospital(Hospital h){
        return iHospitalDAO.altaHospital(h);
    }
    @Override
    public Hospitales obtenerHospitales(){
        Hospitales h=new Hospitales();
        h.setListHospitales(iHospitalDAO.obtenerHospitales());
        return h;
    }
    @Override
    public boolean borrarH(Long idHospital){
        return iHospitalDAO.eliminarH(idHospital);
    }

    @Override
    public void modificar(HospitalDTO h){

        Hospital r = iHospitalDAO.buscarHospital(h.getIdHospital());
        r.setTipoHospital(h.getTipoHospital());
        r.setNombreHospital(h.getNombreHospital());

        iHospitalDAO.modificar(r);
    }
}
