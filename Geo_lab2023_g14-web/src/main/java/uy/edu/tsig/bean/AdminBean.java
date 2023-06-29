package uy.edu.tsig.bean;

import jakarta.ejb.EJB;
import jakarta.enterprise.context.SessionScoped;
import jakarta.faces.application.FacesMessage;
import jakarta.faces.context.ExternalContext;
import jakarta.faces.context.FacesContext;
import jakarta.faces.context.Flash;
import jakarta.inject.Inject;
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
import java.util.List;

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
    private long idAmbu;
    private int size;

    private String rec;
    private Hospitales h;
    private Ambulacias a;
    private ArrayList<AmbulanciaDTO> ambulanciaDTOS;
    private ArrayList<HospitalDTO> hospitalDTOS;

    private ServiciosEmergencias s;
    private ArrayList<ServicioEmergenciaDTO> servicioEmergenciaDTOS;


    private String url = "jdbc:postgresql://localhost:5432/Geo_lab2023_g14PersistenceUnit";
    private String usuario = "postgres";
    //private String contraseña = "admin";
    private String contraseña = "1234";
    @Inject
    private ServicioEmBean servicioEmBean;

    private int canseldesvio;

    public void initH() {
        h = iHospitalService.obtenerHospitales();
        hospitalDTOS = h.getListHospitales();
    }

    public void initA() {
        a = iAmbulaciasService.listarAmbulancias();
        ambulanciaDTOS = a.getListaAmbulancias();
        size=ambulanciaDTOS.size()-1;//arracamos de 0 asi que le restamos 1
    }

    public void addAmbulancia() throws IOException {
        double grados=9.41090001733132E-4;//Probado hasta que encontrara saque una equivalencia en grados este numero equivale a esto+-5m
        double des=(desvio*grados)/100;//regla de 3
        Connection conn;
        try {
            conn = DriverManager.getConnection(url, usuario, contraseña);
            Statement stmt = conn.createStatement();
            //alta logicaa
            Ambulancia a = Ambulancia.builder()
                    .idCodigo(idHospital+"_"+codigo)
                    .distanciaMaxDesvio(desvio)
                    .build();
            try {
                AmbulanciaDTO aDTO = iAmbulaciasService.altaAmbulacia(a, idHospital);
                ResultSet resultSet = stmt.executeQuery("SELECT se.* FROM servicioemergencia se " +
                        "JOIN (SELECT ST_Buffer(ST_SetSRID(ST_GeomFromText('"+ rec +"'), 32721)," + des +") AS buffer_geom " +
                        "FROM ambulancia a WHERE a.idambulancia = "+ aDTO.getIdAmbulancia() +") AS buffer " +
                        "ON ST_Within(se.point, buffer.buffer_geom) " +
                        "WHERE se.hospital_idhospital = "+ idHospital +";");
                System.out.println("Pase la query");
                FacesContext fC = FacesContext.getCurrentInstance();
                ExternalContext eC = fC.getExternalContext();

                if (resultSet.next()) {
                    //alta recorrido
                    stmt.executeUpdate(
                            "UPDATE ambulancia SET polyline = ST_SetSRID(ST_GeomFromText('"+ rec +"'), 32721)" +
                                    "WHERE idambulancia=" + aDTO.getIdAmbulancia() + ";");
                    System.out.println("Recorrido insertado correctamente.");


                    String msj = String.format("Se agregó la ambulancia %s_%s.",idHospital,codigo);
                    addMensaje("Ambulancias", msj,"exito");

                    codigo = "";
                    desvio = 0;
                    idHospital = 0;
                    rec = "";
                    System.out.println("guardado recA, redireccion....");
                    initA();

                    eC.redirect(eC.getRequestContextPath() + "/admin/indexAdm.xhtml?faces-redirect=true"); // Reemplaza con la URL de la página de confirmación
                }else {
                    String msj = String.format("No hay servicios en su Zona.");
                    addMensaje("Ambulancias", msj,"advertencia");//creo que ninguno de los mensajes se captan en menu creo que es porque se recarga la paguina y no se ve
                    System.out.println("el resultado es null");
                    eliminarA(aDTO.getIdAmbulancia(),false);
                    eC.redirect(eC.getRequestContextPath() + "/admin/indexAdm.xhtml?faces-redirect=true");
                }

            }catch (SQLException e){
                System.out.println("No conecta."+e.getMessage());
            }
        }catch (Exception e){
            String msj = String.format("Codigo repetido");
            addMensaje("Ambulancias", msj,"error");//creo que ninguno de los mensajes se captan en menu creo que es porque se recarga la paguina y no se ve
        }
    }
    public void modAaux(AmbulanciaDTO amb, String tipo,boolean vacio){
        AmbulanciaDTO mod = AmbulanciaDTO.builder()
                .idAmbulancia(idAmbu)
                .idCodigo(vacio ? (amb.getHospital().getIdHospital() + "_" + codigo) : codigo)
                .distanciaMaxDesvio(desvio)
                .build();


        try {
            iAmbulaciasService.modificar(mod);
            String msj;
            switch (tipo){
                case "ahiSE":
                     msj = String.format("Se persistido los datos de logica.");
                    addMensaje("Ambulancias", msj,"exito");
                    break;
                case "bufout":
                    msj = String.format("Se persistido el codigo, no se a podido actulizar distancia fuera de S.E");
                    addMensaje("Ambulancias", msj,"advertencia");
                default:
                    break;
            }
        }catch (Exception e){
            String msj = String.format("Se persitido los datos de logica.");
            addMensaje("Ambulancias", msj,"error");
        }

    }
    public void modAmbu(){
        AmbulanciaDTO amb = buscarDTOA();
        Connection conn;
        boolean per =false;
        boolean novacio=true;
        try{
            conn = DriverManager.getConnection(url, usuario, contraseña);
            Statement stmt = conn.createStatement();
            double grados=9.41090001733132E-4;//Probado hasta que encontrara saque una equivalencia en grados este numero equivale a esto+-5m
            double des;
            if(codigo.isEmpty()){
                codigo=amb.getIdCodigo();
                novacio=false;
            }
            if(desvio==0){
                desvio=amb.getDistanciaMaxDesvio();
                modAaux(amb,"ahiSE",novacio);
            }else if(desvio<amb.getDistanciaMaxDesvio()){
                des=(desvio*grados)/100;
                ResultSet resultSet = stmt.executeQuery("SELECT se.* FROM servicioemergencia se " +
                        "JOIN (SELECT ST_Buffer(a.polyline," + des +") AS buffer_geom " +
                        "FROM ambulancia a WHERE a.idambulancia = "+ idAmbu +") AS buffer " +
                        "ON ST_Within(se.point, buffer.buffer_geom) " +
                        "WHERE se.hospital_idhospital = "+ amb.getHospital().getIdHospital() +";");
                if (resultSet.next()) {
                    modAaux(amb,"ahiSE",novacio);
                }else{//no hay servicios en el buffer queda ver el nuevo recorrido
                    per=true;
                }
            }else{//me ahorro la query sql ya que es mallor el buffer no va a quedarse sin buffer aunque no se cambien el recorrido
                modAaux(amb,"ahiSE",novacio);
            }

            if(!rec.isEmpty()){// si no es vasio entro al modifico
                des=(desvio*grados)/100;//regla de 3
                ResultSet resultSet = stmt.executeQuery("SELECT se.* FROM servicioemergencia se " +
                        "JOIN (SELECT ST_Buffer(ST_SetSRID(ST_GeomFromText('"+ rec +"'), 32721)," + des +") AS buffer_geom " +
                        "FROM ambulancia a WHERE a.idambulancia = "+ idAmbu +") AS buffer " +
                        "ON ST_Within(se.point, buffer.buffer_geom) " +
                        "WHERE se.hospital_idhospital = "+ amb.getHospital().getIdHospital() +";");

                System.out.println("Pase la query");
                FacesContext fC = FacesContext.getCurrentInstance();
                ExternalContext eC = fC.getExternalContext();
                if (resultSet.next()) {
                    System.out.println("el resultado no es null");
                    //update recorrido
                    int rowsAffected  = stmt.executeUpdate(
                            "UPDATE ambulancia SET polyline = ST_SetSRID(ST_GeomFromText('"+ rec +"'), 32721)" +
                                    "WHERE idambulancia=" + idAmbu + ";");
                    if(per){//solo se ejecuta en el caso de que se alla modificado el buffe y no quedara cubierto por el anterior recorrido
                        modAaux(amb,"ahiSE",novacio);
                    }

                    String msj = String.format("Se actualizo el recorrido de la ambulancia %s.", codigo);
                    addMensaje("Ambulancias", msj,"exito");
                    codigo = "";
                    desvio = 0;
                    idHospital = 0;
                    rec = "";

                    eC.redirect(eC.getRequestContextPath() + "/admin/indexAdm.xhtml?faces-redirect=true"); // Reemplaza con la URL de la página de confirmación
                }else {
                        if(per){
                            desvio=amb.getDistanciaMaxDesvio();
                            modAaux(amb,"bufout",novacio);
                        }
                        String msj = String.format("No se a modificado el recorrido queda fuera de servicios.");
                        addMensaje("Ambulancias", msj,"advertencia");
                        codigo = null;
                        desvio = 0;
                        idHospital = 0;
                        rec = null;
                        eC.redirect(eC.getRequestContextPath() + "/admin/indexAdm.xhtml?faces-redirect=true");
                }
            }else{
                if(per) {
                    desvio=amb.getDistanciaMaxDesvio();
                    modAaux(amb, "bufout", novacio);
                }
            }
        }catch (SQLException | IOException e){
            System.out.println("No conecta."+e.getMessage());
        }
        initA();
        codigo = null;
        desvio = 0;
        idHospital = 0;
        rec = null;



    }
    private AmbulanciaDTO buscarDTOA(){
        AmbulanciaDTO ambuDTO = null;

        for (AmbulanciaDTO amb : ambulanciaDTOS) {
            if (amb.getIdAmbulancia().equals(idAmbu)) {
                ambuDTO = amb;
                break;
            }
        }
        return ambuDTO;

    }

    /*private void addMensaje(String summary, String detail) {
        FacesMessage mensaje = new FacesMessage(FacesMessage.SEVERITY_INFO, summary, detail);
        FacesContext.getCurrentInstance().addMessage(null, mensaje);
    }*/
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

    public void modBuffer(){
        List<AmbulanciaDTO> a= servicioEmBean.getAmbuPejudicadas();
        System.out.println();
        canseldesvio= canseldesvio+desvio;
        for (AmbulanciaDTO ambulanciaDTO : a) {
            ambulanciaDTO.setDistanciaMaxDesvio(ambulanciaDTO.getDistanciaMaxDesvio()+desvio);
            System.out.println("AdminBean::distancia maxima: " + ambulanciaDTO.getDistanciaMaxDesvio());
            iAmbulaciasService.modificar(ambulanciaDTO);
        }
        switch (servicioEmBean.getDepartede()){
            case "Mod":
                servicioEmBean.modServ();
                break;
            case "Eliminar":
                servicioEmBean.eliminarS(servicioEmBean.getsA());
                break;
        }

    }

    public void addHospital() {
        Hospital h = Hospital.builder()
                .nombreHospital(nombreH)
                .tipoHospital(tipoH)
                .build();
        try {
            HospitalDTO hos = iHospitalService.altaHospital(h);
            initH();
            String msj = String.format("Se agregó el hospital %s.", nombreH);
            addMensaje("Hospitales", msj,"exito");
            redirectH();
        }catch (Exception e) {
            String msj = String.format("Se nombre de hospital %s repetido.", nombreH);
            addMensaje("Hospitales", msj, "error");
        }
    }

    public void eliminarH(Long idHospital) throws IOException {
        boolean r = iHospitalService.borrarH(idHospital);

        if (r) {
            initH();
            String msj = String.format("Se Borro el Hospital con id %s.", idHospital);
            addMensaje("Hospitales", msj,"exito");
            redirectH();
        } else {
            String msj = String.format("No se puedo Borrar el Hospital con id %s", idHospital);
            addMensaje("Hospitales", msj,"error");
            redirectH();
        }

    }
    private void redirectH() throws IOException {
        FacesContext fC = FacesContext.getCurrentInstance();
        ExternalContext eC = fC.getExternalContext();
        eC.redirect(eC.getRequestContextPath() + "/admin/indexAdm.xhtml?faces-redirect=true");
    }

    public void eliminarA(Long idAmbulancia, boolean mensaje) throws IOException {

        boolean r= iAmbulaciasService.borrarA(idAmbulancia);
        if(mensaje){
            if (r) {
                initA();
                String msj = String.format("Se Borro el Servicio con id %s.", idAmbulancia);
                addMensaje("Servicio", msj,"exito");
            } else {
                String msj = String.format("No se puedo Borrar el Servicio con id %s", idAmbulancia);
                addMensaje("Servicio", msj,"error");
            }
            redirectH();
        }

    }
    public void cancelar() throws IOException {
        List<AmbulanciaDTO> a= servicioEmBean.getAmbuPejudicadas();
        for (AmbulanciaDTO ambulanciaDTO : a) {
            ambulanciaDTO.setDistanciaMaxDesvio(ambulanciaDTO.getDistanciaMaxDesvio()-canseldesvio);
            System.out.println("AdminBean::distancia maxima: " + ambulanciaDTO.getDistanciaMaxDesvio());
            iAmbulaciasService.modificar(ambulanciaDTO);
        }
        servicioEmBean.getAmbuPejudicadas().clear();
        canseldesvio=0;
        String msj = String.format("No se actualizo la ubucación");
        addMensaje("Servicio Emergencia", msj,"error");
        redirectH();
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

    public void setCodigo(String codigo) {
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

    public long getIdAmbu() {
        return idAmbu;
    }

    public void setIdAmbu(long idAmbu) {
        this.idAmbu = idAmbu;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public int getCanseldesvio() {
        return canseldesvio;
    }

    public void setCanseldesvio(int canseldesvio) {
        this.canseldesvio = canseldesvio;
    }
}