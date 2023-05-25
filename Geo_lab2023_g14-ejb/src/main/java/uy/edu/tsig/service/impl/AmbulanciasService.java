package uy.edu.tsig.service.impl;

import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import uy.edu.tsig.dto.AmbulanciaDTO;
import uy.edu.tsig.dto.ServicioEmergenciaDTO;
import uy.edu.tsig.entity.Ambulancia;
import uy.edu.tsig.entity.Hospital;
import uy.edu.tsig.model.Ambulacias;
import uy.edu.tsig.persistence.IAmbulaciaDAO;
import uy.edu.tsig.persistence.IHospitalDAO;
import uy.edu.tsig.service.IAmbulaciasService;

@Stateless
public class AmbulanciasService implements IAmbulaciasService {

    @EJB
    IAmbulaciaDAO iAmbulaciaDAO;
    @EJB
    IHospitalDAO iHospitalDAO;
    @Override
    public AmbulanciaDTO altaAmbulacia(Ambulancia a, Long hospital){
        Hospital h= iHospitalDAO.buscarHospital(hospital);
        a.setHospital(h);
        Ambulancia persit=iAmbulaciaDAO.altaAmbulacia(a);
        iHospitalDAO.asignarAmbulacia(h, persit);
        return persit.getAmbulanciaDTO();
    }

    @Override
    public void borrarA(long idAmbulancia){
        iAmbulaciaDAO.borrarambulancia(idAmbulancia);
    }

    @Override
    public Ambulacias listarAmbulancias() {
        Ambulacias a= new Ambulacias();
        a.setListaAmbulancias(iAmbulaciaDAO.obtenerAmbulanciaDtos());
        return a;
    }
    @Override
    public void modificar(AmbulanciaDTO ambu){

        Ambulancia a= iAmbulaciaDAO.buscarAmbu(ambu.getIdAmbulancia());
        a.setIdCodigo(ambu.getIdCodigo());
        a.setDistanciaMaxDesvio(ambu.getDistanciaMaxDesvio());

        iAmbulaciaDAO.modificar(a);

    }
}
