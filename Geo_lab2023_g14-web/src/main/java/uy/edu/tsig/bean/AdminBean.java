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
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.Geometry;
import com.vividsolutions.jts.geom.GeometryFactory;
import com.vividsolutions.jts.geom.Point;

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
    private String geometria;

    // alta Servicio de Emergencia
    private int totalCama;

    public void initH() {
        h = iHospitalService.obtenerHospitales();
        hospitalDTOS = h.getListHospitales();
    }

    public void addAmbulancia() {
        // Coordenadas de ejemplo
        // double longitud = -75.1652;
        // double latitud = 39.9526;

        // Crear un objeto de fábrica de geometría
        GeometryFactory geometryFactory = new GeometryFactory();
        // Crear un objeto Point utilizando las coordenadas
        Coordinate coordinate = new Coordinate(-34, -54);
        Point point = geometryFactory.createPoint(coordinate);

        // crearGeometria();
        Ambulancia a = Ambulancia.builder()
                .idCodigo(codigo)
                .distanciaMaxDesvio(desvio)
                .build();
        iAmbulaciasService.altaAmbulacia(a, idHospital);
        String msj = String.format("Se agregó la ambulancia %s.", codigo);
        addMensaje("Ambulancias", msj);

        System.out.println("geometris: " + geometria);
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

    public void addServicioE() {
        ServicioEmergencia se = ServicioEmergencia.builder()
                .totalCama(totalCama)
                .build();
        iServicioEmergenciaService.altaServicioE(se, idHospital);
        String msj = String.format("Se agregó el servicio de emergencia con %s camas.", totalCama);
        addMensaje("S. Emergencia", msj);
    }

    public void crearGeometria() {
        /*
         * String url =
         * "jdbc:postgresql://localhost:5432/Geo_lab2023_g14PersistenceUnit";
         * String usuario = "postgres";
         * String contraseña = "lapass";
         * Connection conn;
         * try {
         * conn = DriverManager.getConnection(url, usuario, contraseña);
         * Statement stmt = conn.createStatement();
         * ResultSet rs = stmt.executeQuery(
         * "UPDATE ambulancia SET geom=(ST_SetSRID(ST_MakePoint(-35, -54), 32721)) WHERE idambulancia=8"
         * );
         * System.out.println("Punto insertado correctamente.");
         * } catch (SQLException e) {
         * e.printStackTrace();
         * }
         */
    }
    // try (Connection conn = DriverManager.getConnection(url, usuario, contraseña))
    // {
    // // Coordenadas de ejemplo
    // double longitud = -75.1652;
    // double latitud = 39.9526;

    // // Consulta SQL con ST_MakePoint
    // String sql = "UPDATE ambulancia SET geom=(ST_SetSRID(ST_MakePoint(?, ?),
    // 32721)) WHERE idambulancia=1";

    // try (PreparedStatement pstmt = conn.prepareStatement(sql)) { // Establecer
    // los parámetros de la consulta
    // pstmt.setDouble(1, longitud);
    // pstmt.setDouble(2, latitud);

    // // Ejecutar la consulta
    // pstmt.executeUpdate();

    // }
    // } catch (SQLException e) {
    // System.out.println("Error al conectar a la base de datos: " +
    // e.getMessage());
    // }
    // }

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

    public int getTotalCama() {
        return totalCama;
    }

    public void setTotalCama(int totalCama) {
        this.totalCama = totalCama;
    }

}