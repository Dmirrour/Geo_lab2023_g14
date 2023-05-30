package uy.edu.tsig.bean;

import jakarta.ejb.EJB;
import jakarta.enterprise.context.RequestScoped;
import jakarta.faces.application.FacesMessage;
import jakarta.faces.context.ExternalContext;
import jakarta.faces.context.FacesContext;
import jakarta.inject.Named;
import uy.edu.tsig.dto.HospitalDTO;
import uy.edu.tsig.entity.Hospital;
import uy.edu.tsig.entity.TipoHospital;
import uy.edu.tsig.model.Hospitales;
import uy.edu.tsig.service.IHospitalService;

import java.io.IOException;
import java.util.ArrayList;

@Named("hospitalBean")
@RequestScoped
public class HospitalBean {

    @EJB
    IHospitalService iHospitalService;

    private ArrayList<HospitalDTO> hospitalDTOS;
    private String nombreH;
    private TipoHospital tipoH;
    private Hospitales h;
    public void initH() {
        h = iHospitalService.obtenerHospitales();
        hospitalDTOS = h.getListHospitales();
    }

    private void addMensaje(String summary, String detail) {
        FacesMessage mensaje = new FacesMessage(FacesMessage.SEVERITY_INFO, summary, detail);
        FacesContext.getCurrentInstance().addMessage(null, mensaje);
    }

    public void addHospital() throws IOException {
        Hospital h = Hospital.builder()
                .nombreHospital(nombreH)
                .tipoHospital(tipoH)
                .build();
        HospitalDTO hos = iHospitalService.altaHospital(h);

        String msj = String.format("Se agregó el hospital %s.", nombreH);
        addMensaje("Hospitales", msj);
        System.out.println("guardado H, redireccion....");
        FacesContext fC = FacesContext.getCurrentInstance();
        ExternalContext eC = fC.getExternalContext();
        eC.redirect(eC.getRequestContextPath() + "//admin/indexAdm.xhtml?faces-redirect=true");
    }

    public void eliminarH(Long idHospital) {
        boolean r = iHospitalService.borrarH(idHospital);
        if (r) {
            initH();
            String msj = String.format("Se Borro el Hospital con id %s.", idHospital);
            addMensaje("Hospitales", msj);
        } else {
            String msj = String.format("No se puedo Borrar el Hospital con id %s", idHospital);
            addMensaje("Hospitales", msj);
        }
    }

    //--------------- get-set
    public IHospitalService getiHospitalService() {
        return iHospitalService;
    }
    public void setiHospitalService(IHospitalService iHospitalService) {
        this.iHospitalService = iHospitalService;
    }

    public void setHospitalDTOS(ArrayList<HospitalDTO> hospitalDTOS) {
        this.hospitalDTOS = hospitalDTOS;
    }
    public ArrayList<HospitalDTO> getHospitalDTOS() {
        return hospitalDTOS;
    }

    public String getNombreH() {return nombreH;}
    public void setNombreH(String nombreH) {
        this.nombreH = nombreH;
    }

    public void setTipoH(TipoHospital tipoH) {
        this.tipoH = tipoH;
    }
    public TipoHospital getTipoH() {
        return tipoH;
    }
}
