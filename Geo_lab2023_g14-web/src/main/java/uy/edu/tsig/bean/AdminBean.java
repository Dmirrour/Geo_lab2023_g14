package uy.edu.tsig.bean;

import jakarta.ejb.EJB;
import jakarta.enterprise.context.SessionScoped;
import jakarta.faces.context.FacesContext;
import jakarta.inject.Named;
import uy.edu.tsig.dto.HospitalDTO;
import uy.edu.tsig.dto.UsuarioDTO;
import uy.edu.tsig.entity.Ambulancia;
import uy.edu.tsig.entity.Hospital;
import uy.edu.tsig.entity.TipoHospital;
import uy.edu.tsig.model.Hospitales;
import uy.edu.tsig.service.IAmbulaciasService;
import uy.edu.tsig.service.IHospitalService;

import java.io.Serializable;
import java.util.ArrayList;

@Named("adminBean")
@SessionScoped
public class AdminBean implements Serializable {
    @EJB
    IHospitalService iHospitalService;
    @EJB
    IAmbulaciasService iAmbulaciasService;

    // alta hospital
    private String nombreH;
    private TipoHospital tipoH;

    // alta Ambulancia
    private long idHospital;
    private int desvio;
    private int codigo;
    private Hospitales h;
    private ArrayList<HospitalDTO> hospitalDTOS;

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
    }

    public void addHospital() {
        Hospital h = Hospital.builder()
                .nombreHospital(nombreH)
                .tipoHospital(tipoH)
                .build();
        iHospitalService.altaHospital(h);
    }

    public void verificarSesion() {
        try {
            FacesContext FC = FacesContext.getCurrentInstance();
            UsuarioDTO u = (UsuarioDTO) FC.getExternalContext().getSessionMap().get("usuario");

            if (u == null) {
                // acceso sin privilegios
                FC.getExternalContext().redirect("/Geo_lab2023_g14-web/login.xhtml?faces-redirect=true");
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
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

}