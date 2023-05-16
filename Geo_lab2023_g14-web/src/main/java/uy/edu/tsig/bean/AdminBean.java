package uy.edu.tsig.bean;

import jakarta.ejb.EJB;
import jakarta.enterprise.context.SessionScoped;
import jakarta.faces.application.FacesMessage;
import jakarta.faces.context.FacesContext;
import jakarta.inject.Named;
import uy.edu.tsig.dto.HospitalDTO;
import uy.edu.tsig.dto.UsuarioDTO;
import uy.edu.tsig.entity.Ambulancia;
import uy.edu.tsig.entity.Hospital;
import uy.edu.tsig.entity.ServicioEmergencia;
import uy.edu.tsig.entity.TipoHospital;
import uy.edu.tsig.model.Hospitales;
import uy.edu.tsig.service.IAmbulaciasService;
import uy.edu.tsig.service.IHospitalService;
import uy.edu.tsig.service.IServicioEmergenciaService;

import java.io.Serializable;
import java.util.ArrayList;

@Named("adminBean")
@SessionScoped
public class AdminBean implements Serializable {
    @EJB
    IHospitalService iHospitalService;
    @EJB
    IAmbulaciasService iAmbulaciasService;
    @EJB
    IServicioEmergenciaService iServicioEmergenciaService;

    // alta hospital
    private String nombreH;
    private TipoHospital tipoH;

    // alta Ambulancia
    private long idHospital;
    private int desvio;
    private int codigo;
    private Hospitales h;
    private ArrayList<HospitalDTO> hospitalDTOS;

    //alta Servicio de Emergencia
    private int totalCama;


    public void initH() {
        h = iHospitalService.obtenerHospitales();
        hospitalDTOS = h.getListHospitales();
    }

    public void addAmbulancia() {
        Ambulancia a = Ambulancia.builder()
                .idCodigo(codigo)
                .distanciaMaxDesvio(desvio)
                .build();
        iAmbulaciasService.altaAmbulacia(a, idHospital);
        String msj = String.format("Se agregó la ambulancia %s.", codigo);
        addMensaje("Ambulancias", msj);
    }

    private void addMensaje(String summary, String detail) {
        FacesMessage mensaje = new FacesMessage(FacesMessage.SEVERITY_INFO, summary, detail);
        FacesContext.getCurrentInstance().addMessage(null, mensaje);
    }

    public void addHospital() {
        Hospital h = Hospital.builder()
                .nombreHospital(nombreH)
                .tipoHospital(tipoH)
                .build();
        iHospitalService.altaHospital(h);
        String msj = String.format("Se agregó el hospital %s.", nombreH);
        addMensaje("Hospitales", msj);
    }

    public void addServicioE(){
        ServicioEmergencia se =ServicioEmergencia.builder()
                .totalCama(totalCama)
                .build();
        iServicioEmergenciaService.altaServicioE(se,idHospital);
        String msj = String.format("Se agregó el servicio de emergencia con %s camas.", totalCama);
        addMensaje("S. Emergencia", msj);
    }

    public String getNombreH() {
        return nombreH;
    }

    public void setNombreH(String nombreH) {
        this.nombreH = nombreH;
    }

    public void setTipoH(TipoHospital tipoH) {
        this.tipoH = tipoH;
    }

    public TipoHospital getTipoH() {
        return tipoH;
    }

    // ambulacias

    public ArrayList<HospitalDTO> getHospitalDTOS() {
        return hospitalDTOS;
    }

    public int getCodigo() {
        return codigo;
    }

    public int getDesvio() {
        return desvio;
    }

    public long getIdHospital() {
        return idHospital;
    }

    public void setHospitalDTOS(ArrayList<HospitalDTO> hospitalDTOS) {
        this.hospitalDTOS = hospitalDTOS;
    }

    public void setIdHospital(long idHospital) {
        this.idHospital = idHospital;
    }

    public void setCodigo(int codigo) {
        this.codigo = codigo;
    }

    public void setDesvio(int desvio) {
        this.desvio = desvio;
    }

    public int getTotalCama() {
        return totalCama;
    }

    public void setTotalCama(int totalCama) {
        this.totalCama = totalCama;
    }
}