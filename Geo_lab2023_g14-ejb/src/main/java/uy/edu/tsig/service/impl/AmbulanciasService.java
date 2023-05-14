package uy.edu.tsig.service.impl;

import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import uy.edu.tsig.entity.Ambulancia;
import uy.edu.tsig.entity.Hospital;
import uy.edu.tsig.persistence.IAmbulaciaDAO;
import uy.edu.tsig.persistence.IHospitalDAO;
import uy.edu.tsig.service.IAmbulaciasService;

@Stateless
public class AmbulanciasService implements IAmbulaciasService {

    @EJB
    IAmbulaciaDAO iAmbulaciaDAO;
    @EJB
    IHospitalDAO iHospitalDAO;
    public void altaAmbulacia(Ambulancia a, Long hospital){
        Hospital h= iHospitalDAO.buscarHospital(hospital);
        a.setHospital(h);
        Ambulancia persit=iAmbulaciaDAO.altaAmbulacia(a);
        iHospitalDAO.asignarAmbulacia(h, persit);
    }
}
