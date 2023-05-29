package uy.edu.tsig.bean;

import jakarta.ejb.EJB;
import jakarta.enterprise.context.RequestScoped;
import jakarta.faces.application.FacesMessage;
import jakarta.faces.context.FacesContext;
import jakarta.inject.Named;
import uy.edu.tsig.dto.ServicioEmergenciaDTO;
import uy.edu.tsig.entity.ServicioEmergencia;
import uy.edu.tsig.model.ServiciosEmergencias;
import uy.edu.tsig.service.IServicioEmergenciaService;

import java.sql.*;
import java.util.ArrayList;

@Named("servicioEBean")
@RequestScoped
public class ServicioEmBean {

    @EJB
    IServicioEmergenciaService iServicioEmergenciaService;
    private String nombreS;
    private int totalCama;
    private ServiciosEmergencias s;
    private ArrayList<ServicioEmergenciaDTO> servicioEmergenciaDTOS;
    private double latitud; // agregamos la propiedad latitud
    private double longitud; // agregamos la propiedad longitud

    //---------atributos necesarios extras----------//
    private Long idHospital;


    public void initS() {
        s = iServicioEmergenciaService.listarServiciosEmergensias();
        servicioEmergenciaDTOS = s.getListServiciosEmergencias();
    }
    public void addServicioE() {
        ServicioEmergencia se = ServicioEmergencia.builder()
                .totalCama(totalCama)
                .nombre(nombreS)
                .build();
        ServicioEmergenciaDTO sedto=iServicioEmergenciaService.altaServicioE(se, idHospital,longitud,latitud);

        System.out.println("ATENCION: si no guarda puntos en la vista, verificar el archivo ServicioEmBEan.java, metodo addServicioE(); poner la contraseña correcta para su equipo.");

        String url = "jdbc:postgresql://localhost:5432/Geo_lab2023_g14PersistenceUnit";
        String usuario = "postgres";
        String contraseña = "lapass";

        Connection conn;
        try {
            conn = DriverManager.getConnection(url, usuario, contraseña);
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(
                    "UPDATE servicioemergencia set point = (ST_SetSRID(ST_MakePoint(" + longitud + ", " + latitud
                            + "), 32721)) WHERE idservicio=" + sedto.getIdServicio() + ";");
            System.out.println("Punto insertado correctamente.");
        } catch (SQLException e) {
            // e.printStackTrace();s
            System.out.println("No conecta.");
        }
        String msj = String.format("Se agregó el servicio de emergencia con %s camas.", totalCama);
        addMensaje("S. Emergencia", msj);
    }

    public void eliminarS(Long idSE) {
        boolean r = iServicioEmergenciaService.borrarSE(idSE);

        if (r) {
            initS();
            String msj = String.format("Se Borro el Servicio con id %s.", idSE);
            addMensaje("Servicio", msj);
        } else {
            String msj = String.format("No se puedo Borrar el Servicio con id %s", idSE);
            addMensaje("Servicio", msj);
        }
    }


   /* public void actualizarServicio() {
        try {
            // Establecer la conexión a la base de datos
            String url = "jdbc:postgresql://localhost:5432/Geo_lab2023_g14PersistenceUnit";
            String usuario = "postgres";
            //String pass = "lapass";//Seba
            String pass = "123456d";//Damian
            Connection conn = DriverManager.getConnection(url, usuario, pass);

            // Crear y ejecutar la consulta SQL
            // String sql = "UPDATE servicioemergencia SET geom=(ST_SetSRID(ST_MakePoint(" + "ubicacion"
            // + "), 32721)) WHERE idservicio=?";
            String sql = "UPDATE servicioemergencia SET geom='LINESTRING(11.5 -0.1, 21.52 -0.25, 51.53 -2.12)' WHERE idservicio=?";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setInt(1, idServicio);
            stmt.executeUpdate();

            // Cerrar la conexión
            conn.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }*/

    //-----------atributos de control-----------------------//
    private void addMensaje(String summary, String detail) {
        FacesMessage mensaje = new FacesMessage(FacesMessage.SEVERITY_INFO, summary, detail);
        FacesContext.getCurrentInstance().addMessage(null, mensaje);
    }


    public String getNombreS() {
        return nombreS;
    }

    public void setNombreS(String nombreS) {
        this.nombreS = nombreS;
    }

    public void setServicioEmergenciaDTOS(ArrayList<ServicioEmergenciaDTO> servicioEmergenciaDTOS) {
        this.servicioEmergenciaDTOS = servicioEmergenciaDTOS;
    }

    public ArrayList<ServicioEmergenciaDTO> getServicioEmergenciaDTOS() {
        return servicioEmergenciaDTOS;
    }

    public void setTotalCama(int totalCama) {
        this.totalCama = totalCama;
    }

    public int getTotalCama() {
        return totalCama;
    }

    public double getLatitud() {
        return latitud;
    }

    public void setLatitud(double latitud) {
        this.latitud = latitud;
    }

    public double getLongitud() {
        return longitud;
    }

    public void setLongitud(double longitud) {
        this.longitud = longitud;
    }

    public Long getIdHospital() {
        return idHospital;
    }

    public void setIdHospital(Long idHospital) {
        this.idHospital = idHospital;
    }
}
