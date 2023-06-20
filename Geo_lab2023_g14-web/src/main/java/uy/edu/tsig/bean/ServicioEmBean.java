package uy.edu.tsig.bean;

import jakarta.ejb.EJB;
import jakarta.enterprise.context.RequestScoped;
import jakarta.enterprise.context.SessionScoped;
import jakarta.faces.application.FacesMessage;
import jakarta.faces.context.ExternalContext;
import jakarta.faces.context.FacesContext;
import jakarta.faces.event.AjaxBehaviorEvent;
import jakarta.faces.view.ViewScoped;
import jakarta.inject.Named;
import org.primefaces.PrimeFaces;
import org.primefaces.event.RowEditEvent;
import uy.edu.tsig.dto.AmbulanciaDTO;
import uy.edu.tsig.dto.ServicioEmergenciaDTO;
import uy.edu.tsig.entity.Ambulancia;
import uy.edu.tsig.entity.ServicioEmergencia;
import uy.edu.tsig.model.ServiciosEmergencias;
import uy.edu.tsig.service.IHospitalService;
import uy.edu.tsig.service.IServicioEmergenciaService;

import java.io.IOException;
import java.io.Serializable;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;


@Named("servicioEBean")
@SessionScoped
public class ServicioEmBean implements Serializable {

    @EJB
    IServicioEmergenciaService iServicioEmergenciaService;
    @EJB
    IHospitalService iHospitalService;
    private String nombreS;
    private int totalCama;
    private int camasLibre;
    private Long idServE;
    private ServiciosEmergencias s;
    private ArrayList<ServicioEmergenciaDTO> servicioEmergenciaDTOS;
    private double latitud; // agregamos la propiedad latitud
    private double longitud; // agregamos la propiedad longitud
    private String url = "jdbc:postgresql://localhost:5432/Geo_lab2023_g14PersistenceUnit";
    private String usuario = "postgres";
    private String contraseña = "lapass";
    // private String contraseña = "1234";

    private ServicioEmergenciaDTO servselect;

    // ---------atributos necesarios extras----------//
    private Long idHospital;
    private ServicioEmergenciaDTO selectedEmergencyService;
    private List<AmbulanciaDTO> ambuPerjudicadas= new ArrayList<>();
    private ServicioEmergenciaDTO sA;


    public void initS() {
        s = iServicioEmergenciaService.listarServiciosEmergensias();
        servicioEmergenciaDTOS = s.getListServiciosEmergencias();
    }

    public void addServicioE() throws IOException {
        ServicioEmergencia se = ServicioEmergencia.builder()
                .totalCama(totalCama)
                .nombre(nombreS)
                .build();
        ServicioEmergenciaDTO sedto=iServicioEmergenciaService.altaServicioE(se, idHospital,longitud,latitud);

        System.out.println("ATENCION: si no guarda puntos en la vista, verificar el archivo ServicioEmBEan.java, metodo addServicioE(); poner la contraseña correcta para su equipo.");

        Connection conn;
        try {
            conn = DriverManager.getConnection(url, usuario, contraseña);
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(
                    "UPDATE servicioemergencia set point = (ST_SetSRID(ST_MakePoint(" + longitud + ", " + latitud
                            + "), 32721)) WHERE idservicio=" + sedto.getIdServicio() + ";");
            System.out.println("Punto insertado correctamente.");
        } catch (SQLException e) {
            // e.printStackTrace();
            System.out.println("No conecta." + e.getMessage());
        }

        String msj = String.format("Se agregó el servicio de emergencia con %s camas.", totalCama);
        addMensaje("S. Emergencia", msj);
        totalCama = 0;
        nombreS = null;
        idHospital = null;
        latitud = 0;
        longitud = 0;
        System.out.println("guardado SE, redireccion....");
        FacesContext fC = FacesContext.getCurrentInstance();
        ExternalContext eC = fC.getExternalContext();
        eC.redirect(eC.getRequestContextPath() + "/admin/indexAdm.xhtml?faces-redirect=true"); // Reemplaza con la URL
                                                                                               // de la página de
                                                                                               // confirmación
    }

    public void modServ(RowEditEvent event) {
        ServicioEmergenciaDTO a = (ServicioEmergenciaDTO) event.getObject();
        if (totalCama == 0)
            totalCama = a.getTotalCama();
        if (camasLibre == 0 && a.getCamasLibres() > totalCama) {
            camasLibre = a.getTotalCama() - (a.getTotalCama() - a.getCamasLibres());// si se sacaron camas pero el
                                                                                    // servicio de emergencia tenia mas
                                                                                    // agarro la nuevas cantidad de
                                                                                    // camas y le resto las que estaban
                                                                                    // ocupadas
            if (camasLibre < 0) {
                FacesContext.getCurrentInstance().addMessage(null,
                        new FacesMessage(FacesMessage.SEVERITY_ERROR, "Tienes menos camas quelas ocupadas", ""));
                return;
            }

    public void modServ(RowEditEvent event) throws IOException {
        System.out.println(latitud+"  "+longitud);
        FacesContext fC = FacesContext.getCurrentInstance();
        ExternalContext eC = fC.getExternalContext();
        eC.redirect(eC.getRequestContextPath() + "/admin/indexAdm.xhtml?faces-redirect=true&showDialogs=true");
        /*PrimeFaces.current().executeScript("tuFuncionJS();");*/

       /*         ServicioEmergenciaDTO a = (ServicioEmergenciaDTO) event.getObject();
        if(totalCama==0)
            totalCama=a.getTotalCama();
        if(camasLibre==0 && a.getCamasLibres()>totalCama) {
            camasLibre = a.getTotalCama() - (a.getTotalCama() - a.getCamasLibres());//si se sacaron camas pero el servicio de emergencia tenia mas agarro la nuevas cantidad de camas y le resto las que estaban ocupadas
            if(camasLibre<0){
                FacesContext.getCurrentInstance().addMessage(null, new FacesMessage(FacesMessage.SEVERITY_ERROR, "Tienes menos camas quelas ocupadas", ""));
                return;
            }

        }
        if(nombreS.isEmpty() && nombreS=="")
            nombreS=a.getNombre();
        ServicioEmergenciaDTO mod= ServicioEmergenciaDTO.builder()
                .idServicio(a.getIdServicio())
                .totalCama(totalCama)
                .camasLibres(camasLibre)
                .nombre(nombreS)
                .build();
        iServicioEmergenciaService.modificar(mod);
        System.out.println(mod+"\n");
        System.out.println(latitud+"   "+longitud+"   "+nombreS+"   "+camasLibre+"   "+totalCama);


        if(longitud!=0.0 && latitud!=0.0){


            Connection conn;
            try {
                conn = DriverManager.getConnection(url, usuario, contraseña);
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery(
                        "UPDATE servicioemergencia set point = (ST_SetSRID(ST_MakePoint(" + longitud + ", " + latitud
                                + "), 32721)) WHERE idservicio=" + idServE + ";");
                System.out.println("Punto modificado correctamente.");
            } catch (SQLException e) {
                // e.printStackTrace();
                System.out.println("No conecta." + e.getMessage());
            }
        }*/
    }
    public void cancelar(RowEditEvent event) {
        FacesContext.getCurrentInstance().addMessage(null, new FacesMessage(FacesMessage.SEVERITY_ERROR, "Cancelado", ""));
    }

    public void actualizarCampos() {
        nombreS=servselect.getNombre();
        totalCama=servselect.getTotalCama();
        camasLibre=servselect.getCamasLibres();
        idServE=servselect.getIdServicio();
        System.out.println(nombreS+totalCama+camasLibre+idServE );
    }

    public void eliminarS(ServicioEmergenciaDTO se) {
        try {
            Connection conn = DriverManager.getConnection(url, usuario, contraseña);
            Statement stmt = conn.createStatement();
            long ids=se.getIdServicio();
            long idh=se.getHospital().getIdHospital();
            String sql="SELECT a.* " +
                    "FROM ambulancia a " +
                    "JOIN servicioemergencia se ON a.hospital_idhospital = se.hospital_idhospital " +
                    "WHERE se.idservicio = "+ids +
                    " AND a.hospital_idhospital ="+idh+
                    " AND ST_Intersects(ST_Buffer(a.polyline,((a.distanciamaxdesvio*9.41090001733132E-4) / 100) ), se.point) " +
                    " AND NOT EXISTS ( " +
                    "    SELECT 1 " +
                    "    FROM servicioemergencia se2 " +
                    "    JOIN ambulancia a2 ON a2.hospital_idhospital = se.hospital_idhospital " +
                    "    WHERE se2.idservicio <>  "+ ids +
                    "    AND a2.idambulancia = a.idambulancia " +
                    "    AND ST_Intersects(ST_Buffer(a2.polyline, ((a.distanciamaxdesvio*9.41090001733132E-4) / 100)), se2.point));";
            System.out.println(idh+"  "+ids+"\n"+sql);
            ResultSet rs = stmt.executeQuery(sql);

            if (rs.next()) {
                ambuPerjudicadas.clear();
                System.out.println("el resultado no es null");
                do {

                    AmbulanciaDTO ambulanciaDTO= AmbulanciaDTO.builder()
                            .idAmbulancia(rs.getLong("idambulancia"))
                            .idCodigo(rs.getInt("idcodigo"))
                            .distanciaMaxDesvio(rs.getInt("distanciamaxdesvio"))
                            .build();
                    ambuPerjudicadas.add(ambulanciaDTO);
                } while (rs.next());
                System.out.println(ambuPerjudicadas);
                sA=se;
                FacesContext fC = FacesContext.getCurrentInstance();
                ExternalContext eC = fC.getExternalContext();
                eC.redirect(eC.getRequestContextPath() + "/admin/indexAdm.xhtml?faces-redirect=true&showDialogs=true");

            }else{
                borrardefinitivo(ids);
            }

        } catch (SQLException | IOException e) {
            // e.printStackTrace();
            System.out.println("No conecta.BorrarServ"+e.getMessage());
        }
    }
    private void borrardefinitivo(long ids){
        boolean r = iServicioEmergenciaService.borrarSE(ids);

        if (r) {
            initS();
            String msj = String.format("Se Borro el Servicio con id %s.", ids);
            addMensaje("Servicio", msj);
        } else {
            String msj = String.format("No se puedo Borrar el Servicio con id %s", ids);
            addMensaje("Servicio", msj);
        }
    }

    /*
     * public void actualizarServicio() {
     * try {
     * // Establecer la conexión a la base de datos
     * String url =
     * "jdbc:postgresql://localhost:5432/Geo_lab2023_g14PersistenceUnit";
     * String usuario = "postgres";
     * //String pass = "lapass";//Seba
     * String pass = "123456d";//Damian
     * Connection conn = DriverManager.getConnection(url, usuario, pass);
     * 
     * // Crear y ejecutar la consulta SQL
     * // String sql =
     * "UPDATE servicioemergencia SET geom=(ST_SetSRID(ST_MakePoint(" + "ubicacion"
     * // + "), 32721)) WHERE idservicio=?";
     * String sql =
     * "UPDATE servicioemergencia SET geom='LINESTRING(11.5 -0.1, 21.52 -0.25, 51.53 -2.12)' WHERE idservicio=?"
     * ;
     * PreparedStatement stmt = conn.prepareStatement(sql);
     * stmt.setInt(1, idServicio);
     * stmt.executeUpdate();
     * 
     * // Cerrar la conexión
     * conn.close();
     * } catch (Exception e) {
     * e.printStackTrace();
     * }
     * }
     */

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

    public int getCamasLibre() {
        return camasLibre;
    }

    public void setCamasLibre(int camasLibre) {
        this.camasLibre = camasLibre;
    }

    public Long getIdServE() {
        return idServE;
    }

    public void setIdServE(Long idServE) {
        this.idServE = idServE;
    }

    public ServicioEmergenciaDTO getServselect() {
        return servselect;
    }

    public void setServselect(ServicioEmergenciaDTO servselect) {
        this.servselect = servselect;
    }
    public ServicioEmergenciaDTO getSelectedEmergencyService() {
        return selectedEmergencyService;
    }

    public void setSelectedEmergencyService(ServicioEmergenciaDTO selectedEmergencyService) {
        this.selectedEmergencyService = selectedEmergencyService;
    }
    public List<AmbulanciaDTO> getAmbuPejudicadas() {
        return ambuPerjudicadas;
    }

    public void setAmbuPejudicadas(List<AmbulanciaDTO> ambuPejudicadas) {
        this.ambuPerjudicadas = ambuPejudicadas;
    }

    public ServicioEmergenciaDTO getsA() {
        return sA;
    }

    public void setsA(ServicioEmergenciaDTO sA) {
        this.sA = sA;
    }
}
