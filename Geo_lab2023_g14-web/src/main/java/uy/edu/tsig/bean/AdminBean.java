package uy.edu.tsig.bean;

import jakarta.ejb.EJB;
import jakarta.enterprise.context.SessionScoped;
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
    private String codigo;
    private Hospitales h;
    private ArrayList<HospitalDTO> hospitalDTOS;

    // Alta Servicio de Emergencia
    private Long idServicio;
    private int totalC;
    private int camasLi;
    private Hospital hospital;

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

    // Servicio E
    public void addServicioEmergencia() {
        // try {

        // if (camasLi < totalC) {
        // throw new Error("La cantidad de camas libre no puede ser mayor a la cantidad
        // de camas totales");
        // }
        ServicioEmergencia servicio = ServicioEmergencia.builder()
                .idServicio(idServicio)
                .camasLibres(camasLi)
                .totalCama(totalC)
                .build();
        iServicioEmergenciaService.asignarServicioEmergencia(servicio, hospital);

        // } catch (Exception e) {
        // System.out.println("Error: " + e);
        // }
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

    public String getCodigo() {
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

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public void setDesvio(int desvio) {
        this.desvio = desvio;
    }

}