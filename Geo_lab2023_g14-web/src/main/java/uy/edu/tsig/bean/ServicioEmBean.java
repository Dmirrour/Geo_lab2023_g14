package uy.edu.tsig.bean;

import jakarta.ejb.EJB;
import jakarta.enterprise.context.RequestScoped;
import jakarta.enterprise.context.SessionScoped;
import jakarta.faces.application.FacesMessage;
import jakarta.faces.context.ExternalContext;
import jakarta.faces.context.FacesContext;
import jakarta.faces.context.Flash;
import jakarta.faces.event.AjaxBehaviorEvent;
import jakarta.faces.view.ViewScoped;
import jakarta.inject.Inject;
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
    private String contraseña = "1234";
    private int size;

    private ServicioEmergenciaDTO servselect;

    // ---------atributos necesarios extras----------//
    private Long idHospital;
    private ServicioEmergenciaDTO selectedEmergencyService;
    private List<AmbulanciaDTO> ambuPerjudicadas = new ArrayList<>();
    private ServicioEmergenciaDTO sA;
    private String departede;
    private String camasLib;
    @Inject
    private AdminBean adminBean;
    private boolean eliomod;

    public void initS() {
        s = iServicioEmergenciaService.listarServiciosEmergensias();
        servicioEmergenciaDTOS = s.getListServiciosEmergencias();
        size = servicioEmergenciaDTOS.size() - 1;// arracamos de 0 asi que le restamos 1
    }
    
    public void addServicioE() throws IOException {
        ServicioEmergencia se = ServicioEmergencia.builder()
                .totalCama(totalCama)
                .nombre(idHospital+"_"+nombreS)
                .build();
        try {
            ServicioEmergenciaDTO sedto=iServicioEmergenciaService.altaServicioE(se, idHospital,longitud,latitud);
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
                System.out.println("ATENCION: si no guarda, verificar el archivo ServicioEmBEan.java, cambiar pass en las propiedades de la calse.");
                System.out.println("No conecta."+e.getMessage());
            }

            String msj = String.format("Se agregó el servicio de emergencia con %s camas.", totalCama);
            addMensaje("S. Emergencia", msj, "exito");
            totalCama = 0;
            nombreS = null;
            idHospital = null;
            latitud = 0;
            longitud = 0;
            adminBean.setCanseldesvio(0);
            System.out.println("guardado SE, redireccion....");
            FacesContext fC = FacesContext.getCurrentInstance();
            ExternalContext eC = fC.getExternalContext();
            eC.redirect(eC.getRequestContextPath() + "/admin/indexAdm.xhtml?faces-redirect=true"); // Reemplaza con la URL de la página de confirmación

        }catch (Exception e){
            String msj = String.format("Codigo repetido");
            addMensaje("S. Emergencia", msj, "error");
            latitud = 0;
            longitud = 0;
        }
    }

    private ServicioEmergenciaDTO buscarDTO(){
        ServicioEmergenciaDTO servicioEmergenciaEncontrado = null;

        for (ServicioEmergenciaDTO servicioEmergencia : servicioEmergenciaDTOS) {
            if (servicioEmergencia.getIdServicio().equals(idServE)) {
                servicioEmergenciaEncontrado = servicioEmergencia;
                break;
            }
        }
        return servicioEmergenciaEncontrado;

    }

    public void modServ() {
        ServicioEmergenciaDTO a = buscarDTO();
        boolean vas=true;

        if(camasLib.isEmpty()){
            camasLibre=-1;
        }else{
            camasLibre= Integer.parseInt(camasLib);
        }
        if(camasLibre==-1){
            camasLibre=a.getCamasLibres();
            if(totalCama==0)
                totalCama=a.getTotalCama();
            else if(a.getCamasLibres()>totalCama) {
                camasLibre = totalCama - (a.getTotalCama() - a.getCamasLibres());//si se sacaron camas pero el servicio de emergencia tenia mas agarro la nuevas cantidad de camas y le resto las que estaban ocupadas
                if (camasLibre < 0) {
                    FacesContext.getCurrentInstance().addMessage(null, new FacesMessage(FacesMessage.SEVERITY_ERROR, "Tienes menos camas quelas ocupadas", ""));
                    return;
                }
            }
        }else{
            if(totalCama==0)
                totalCama=a.getTotalCama();
            if(totalCama<camasLibre){
                totalCama=camasLibre;
            }
        }

        if(nombreS.isEmpty()) {
            nombreS = a.getNombre();
            vas=false;
        }
        ServicioEmergenciaDTO mod= ServicioEmergenciaDTO.builder()
                .idServicio(a.getIdServicio())
                .totalCama(totalCama)
                .camasLibres(camasLibre)
                .nombre(vas ? (a.getHospital().getIdHospital()+"_"+nombreS) : nombreS)
                .build();
        String msj;
        try {
            iServicioEmergenciaService.modificar(mod);
            msj = String.format("Se a modificado los datos");
            addMensaje("Servivio de Emergencia", msj,"exito");
            initS();


        }catch (Exception e){
             msj = String.format("El Codigo seleccionado ya existe");
            addMensaje("S. Emergencia", msj, "error");
        }


        try {
            if(longitud!=0.0 && latitud!=0.0){
                Connection conn = DriverManager.getConnection(url, usuario, contraseña);
                Statement stmt = conn.createStatement();
                String sql="SELECT a.* " +
                        "FROM ambulancia a " +
                        "JOIN servicioemergencia se ON a.hospital_idhospital = se.hospital_idhospital " +
                        "WHERE se.idservicio = "+ a.getIdServicio() +
                        "  AND a.hospital_idhospital = "+a.getHospital().getIdHospital()+
                        "  AND ST_Intersects(ST_Buffer(a.polyline, ((a.distanciamaxdesvio * 9.41090001733132E-4) / 100)), se.point) " +
                        "  AND NOT EXISTS ( " +
                        "    SELECT 1 " +
                        "    FROM servicioemergencia se2 " +
                        "    JOIN ambulancia a2 ON a2.hospital_idhospital = se.hospital_idhospital " +
                        "    WHERE se2.idservicio <> " + a.getIdServicio() +
                        "      AND a2.idambulancia = a.idambulancia " +
                        "      AND ST_Intersects(ST_Buffer(a2.polyline, ((a.distanciamaxdesvio * 9.41090001733132E-4) / 100)), se2.point) " +
                        "  ) " +
                        "  AND NOT EXISTS ( " +
                        "    SELECT 1 " +
                        "    FROM ambulancia a3 " +
                        "    WHERE a3.idambulancia = a.idambulancia " +
                        "      AND ST_Intersects(ST_Buffer(a3.polyline, ((a.distanciamaxdesvio * 9.41090001733132E-4) / 100)), ST_SetSRID(ST_MakePoint(" + longitud + ", " + latitud + "), 32721)) " +
                        "  );";//Primero calcula sus buffers, luego chequea que esta en la inteseccion de su buffers no tengan mas de un servicio exlullendo el que estamos modificando, y al final exclulle aquellas que esten tocando la nueva ubiccaccion del serviccio
                System.out.println(sql);
                ResultSet rs = stmt.executeQuery(sql);
                if (rs.next()) {
                    msj = String.format("Conflicto con ambulacias");
                    addMensaje("Servivio de Emergencia", msj,"advertencia");
                    ambuPerjudicadas.clear();
                    System.out.println("el resultado no es null");
                    do {

                        AmbulanciaDTO ambulanciaDTO= AmbulanciaDTO.builder()
                                .idAmbulancia(rs.getLong("idambulancia"))
                                .idCodigo(rs.getString("idcodigo"))
                                .distanciaMaxDesvio(rs.getInt("distanciamaxdesvio"))
                                .build();
                        ambuPerjudicadas.add(ambulanciaDTO);
                    } while (rs.next());
                    System.out.println(ambuPerjudicadas);
                    sA=a;
                    departede="Mod";
                    eliomod=true;
                    FacesContext fC = FacesContext.getCurrentInstance();
                    ExternalContext eC = fC.getExternalContext();
                    eC.redirect(eC.getRequestContextPath() + "/admin/indexAdm.xhtml?faces-redirect=true&showDialogs=true");

                }else{
                    stmt.executeUpdate(
                            "UPDATE servicioemergencia set point = (ST_SetSRID(ST_MakePoint(" + longitud + ", " + latitud
                                    + "), 32721)) WHERE idservicio=" + idServE + ";");
                    totalCama = 0;
                    nombreS = null;
                    idHospital = null;
                    camasLib=null;
                    camasLibre = -1;
                    latitud = 0;
                    longitud = 0;
                    msj = String.format("Se Modifico la ubicación");
                    addMensaje("Servivio de Emergencia", msj,"exito");
                    FacesContext facesContext = FacesContext.getCurrentInstance();
                    ExternalContext externalContext = facesContext.getExternalContext();
                    externalContext.redirect(externalContext.getRequestContextPath() + "/admin/indexAdm.xhtml");
                }

            }else{
                camasLib=null;
            }
        } catch (SQLException  | IOException e) {
            // e.printStackTrace();
            System.out.println("ATENCION: si no guarda, verificar el archivo ServicioEmBEan.java, cambiar pass en las propiedades de la calse.");
            System.out.println("No conecta."+e.getMessage());
        }
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
                            .idCodigo(rs.getString("idcodigo"))
                            .distanciaMaxDesvio(rs.getInt("distanciamaxdesvio"))
                            .build();
                    ambuPerjudicadas.add(ambulanciaDTO);
                } while (rs.next());
                System.out.println(ambuPerjudicadas);
                sA=se;
                departede="Eliminar";
                eliomod=false;
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

    private void borrardefinitivo(long ids) throws IOException {
        boolean r = iServicioEmergenciaService.borrarSE(ids);

        if (r) {
            initS();
            String msj = String.format("Se Borro el Servicio con id %s.", ids);
            addMensaje("Servicio", msj, "exito");
        } else {
            String msj = String.format("No se puedo Borrar el Servicio con id %s", ids);
            addMensaje("Servicio", msj, "error");
        }
        FacesContext fC = FacesContext.getCurrentInstance();
        ExternalContext eC = fC.getExternalContext();
        eC.redirect(eC.getRequestContextPath() + "/admin/indexAdm.xhtml?faces-redirect=true");
    }

    private void addMensaje(String summary, String detail, String tipoMensaje) {
        FacesContext facesContext = FacesContext.getCurrentInstance();
        Flash flash = facesContext.getExternalContext().getFlash();
        flash.setKeepMessages(true);

        FacesMessage.Severity severity = null;
        switch (tipoMensaje) {
            case "exito":
                severity = FacesMessage.SEVERITY_INFO;
                break;
            case "advertencia":
                severity = FacesMessage.SEVERITY_WARN;
                break;
            case "error":
                severity = FacesMessage.SEVERITY_ERROR;
                break;
            default:
                // Tipo de mensaje no válido, se asume error por defecto
                severity = FacesMessage.SEVERITY_ERROR;
                break;
        }

        facesContext.addMessage(null, new FacesMessage(severity, summary, detail));
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

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public String getDepartede() {
        return departede;
    }

    public void setDepartede(String departede) {
        this.departede = departede;
    }

    public String getCamasLib() {
        return camasLib;
    }

    public void setCamasLib(String camasLib) {
        this.camasLib = camasLib;
    }

    public boolean isEliomod() {
        return eliomod;
    }

    public void setEliomod(boolean eliomod) {
        this.eliomod = eliomod;
    }
}