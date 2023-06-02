package uy.edu.tsig.bean;

import jakarta.ejb.EJB;
import jakarta.enterprise.context.SessionScoped;
import jakarta.faces.application.FacesMessage;
import jakarta.faces.context.ExternalContext;
import jakarta.faces.context.FacesContext;
import jakarta.inject.Named;
import uy.edu.tsig.dto.AmbulanciaDTO;
import uy.edu.tsig.dto.HospitalDTO;
import uy.edu.tsig.dto.ServicioEmergenciaDTO;
import uy.edu.tsig.dto.UsuarioDTO;
import uy.edu.tsig.entity.Ambulancia;
import uy.edu.tsig.entity.Hospital;
import uy.edu.tsig.entity.ServicioEmergencia;
import uy.edu.tsig.entity.TipoHospital;
import uy.edu.tsig.model.Ambulacias;
import uy.edu.tsig.model.Hospitales;
import uy.edu.tsig.model.ServiciosEmergencias;
import uy.edu.tsig.service.IAmbulaciasService;
import uy.edu.tsig.service.IHospitalService;
import uy.edu.tsig.service.IServicioEmergenciaService;

import java.io.IOException;
import java.io.Serializable;
import java.sql.*;
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

    private String rec;
    private Hospitales h;
    private Ambulacias a;
    private ArrayList<AmbulanciaDTO> ambulanciaDTOS;
    private ArrayList<HospitalDTO> hospitalDTOS;

    private ServiciosEmergencias s;
    private ArrayList<ServicioEmergenciaDTO> servicioEmergenciaDTOS;

    public void initH() {
        h = iHospitalService.obtenerHospitales();
        hospitalDTOS = h.getListHospitales();
    }

    public void initA() {
        a = iAmbulaciasService.listarAmbulancias();
        ambulanciaDTOS = a.getListaAmbulancias();
    }

    public void addAmbulancia() throws IOException {
        Ambulancia a = Ambulancia.builder()
                .idCodigo(codigo)
                .distanciaMaxDesvio(desvio)
                .build();
        AmbulanciaDTO aDTO = iAmbulaciasService.altaAmbulacia(a, idHospital);

        System.out.println(rec);
        System.out.println("ATENCION: si no guarda linestring en la vista, verificar el archivo AdminBEan.java, metodo addAmbulancia(); poner la contraseña correcta para su equipo.");

        String url = "jdbc:postgresql://localhost:5432/Geo_lab2023_g14PersistenceUnit";
        String usuario = "postgres";
        String contraseña = "admin";

        Connection conn;
        try {
            conn = DriverManager.getConnection(url, usuario, contraseña);
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(
                "UPDATE ambulancia SET polyline = ST_SetSRID(ST_GeomFromText('"+ rec +"'), 32721)" +
                    "WHERE idambulancia=" + aDTO.getIdAmbulancia() + ";");
            System.out.println("Recorrido insertado correctamente.");
        } catch (SQLException e) {
            // e.printStackTrace();
            System.out.println("No conecta."+e.getMessage());
        }

        String msj = String.format("Se agregó la ambulancia %s.", codigo);
        addMensaje("Ambulancias", msj);

        codigo = 0;
        desvio = 0;
        idHospital = 0;
        rec = "";
        System.out.println("guardado recA, redireccion....");
        FacesContext fC = FacesContext.getCurrentInstance();
        ExternalContext eC = fC.getExternalContext();
        eC.redirect(eC.getRequestContextPath() + "/admin/indexAdm.xhtml?faces-redirect=true"); // Reemplaza con la URL de la página de confirmación
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
        HospitalDTO hos = iHospitalService.altaHospital(h);


        String msj = String.format("Se agregó el hospital %s.", nombreH);
        addMensaje("Hospitales", msj);
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

    public void eliminarA(Long idAmbulancia) {

        boolean r= iAmbulaciasService.borrarA(idAmbulancia);
        if (r) {
            initA();
            String msj = String.format("Se Borro el Servicio con id %s.", idAmbulancia);
            addMensaje("Servicio", msj);
        } else {
            String msj = String.format("No se puedo Borrar el Servicio con id %s", idAmbulancia);
            addMensaje("Servicio", msj);
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

    public String getRec() { return rec;}
    public void setRec(String rec) {
        this.rec = rec;
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

    public ArrayList<AmbulanciaDTO> getAmbulanciaDTOS() {
        return ambulanciaDTOS;
    }

    public void setAmbulanciaDTOS(ArrayList<AmbulanciaDTO> ambulanciaDTOS) {
        this.ambulanciaDTOS = ambulanciaDTOS;
    }
}