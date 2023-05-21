package uy.edu.tsig.bean;

import jakarta.ejb.EJB;
import jakarta.enterprise.context.SessionScoped;
import jakarta.faces.application.FacesMessage;
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
    private Ambulacias a;
    private ArrayList<AmbulanciaDTO> ambulanciaDTOS;
    private ArrayList<HospitalDTO> hospitalDTOS;

    //alta Servicio de Emergencia
    private int totalCama;

    private ServiciosEmergencias s;
    private ArrayList<ServicioEmergenciaDTO> servicioEmergenciaDTOS;


    public void initH() {
        h = iHospitalService.obtenerHospitales();
        hospitalDTOS = h.getListHospitales();
    }

    public void initS(){
        s = iServicioEmergenciaService.listarServiciosEmergensias();
        servicioEmergenciaDTOS =s.getListServiciosEmergencias();
    }

    public void initA(){
        a = iAmbulaciasService.listarAmbulancias();
        ambulanciaDTOS = a.getListaAmbulancias();
    }

    public void addAmbulancia() {
        Ambulancia a = Ambulancia.builder()
                .idCodigo(codigo)
                .distanciaMaxDesvio(desvio)
                .build();
        AmbulanciaDTO aDTO = iAmbulaciasService.altaAmbulacia(a, idHospital);

        //aDTO contiene los datos que van de la logica como el id, en lo posible para manejar vinculadas de forma trasera tranten de crear
        //la tabla con el mismo id de la tabla de hibernate asi vamos a tener una relacion entre ellos que nosotros vamos a poder vincular
        //esto haciendole aDTO.getid, y bueno si quieren ademas agregarle el nombre a la geografica tambien se puede
        //aca parte geografia
        //eso o como vi que hicieron llamar a otra funcion pero es lo mismo lo unico que a esa funcion le ban a tener que pasar el long id

        //--------x------------x--------------

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
        HospitalDTO hos= iHospitalService.altaHospital(h);

        //hos contiene los datos que van de la logica como el id, en lo posible para manejar vinculadas de forma trasera tranten de crear
        //la tabla con el mismo id de la tabla de hibernate asi vamos a tener una relacion entre ellos que nosotros vamos a poder vincular
        //esto haciendole hos.getidHospital, y bueno si quieren ademas agregarle el nombre a la geografica tambien se puede
        //aca parte geografia
        //eso o como vi que hicieron llamar a otra funcion pero es lo mismo lo unico que a esa funcion le ban a tener que pasar el long id
        //--------x------------x--------------

        String msj = String.format("Se agregó el hospital %s.", nombreH);
        addMensaje("Hospitales", msj);
    }

    public void addServicioE(){
        ServicioEmergencia se =ServicioEmergencia.builder()
                .totalCama(totalCama)
                .build();
        ServicioEmergenciaDTO sedto = iServicioEmergenciaService.altaServicioE(se,idHospital);


        //sedto contiene los datos que van de la logica como el id, en lo posible para manejar vinculadas de forma trasera tranten de crear
        //la tabla con el mismo id de la tabla de hibernate asi vamos a tener una relacion entre ellos que nosotros vamos a poder vincular
        //esto haciendole sedto.getidHospital, y bueno si quieren ademas agregarle el nombre a la geografica tambien se puede
        //aca parte geografia
        //eso o como vi que hicieron llamar a otra funcion pero es lo mismo lo unico que a esa funcion le ban a tener que pasar el long id

        //--------x------------x--------------


        String msj = String.format("Se agregó el servicio de emergencia con %s camas.", totalCama);
        addMensaje("S. Emergencia", msj);
    }

    public void eliminarH(Long idHospital) {
        boolean r = iHospitalService.borrarH(idHospital);
        if (r) {
            initH();
            String msj = String.format("Se Borro el Hospital con id %s.", idHospital);
            addMensaje("Hospitales", msj);
        }
        else{
            String msj = String.format("No se puedo Borrar el Hospital con id %s", idHospital);
            addMensaje("Hospitales", msj);
       }
    }

    public void eliminarB(Long idSE){
        boolean r = iServicioEmergenciaService.borrarSE(idSE);

        if (r) {
            initS();
            String msj = String.format("Se Borro el Servicio con id %s.", idSE);
            addMensaje("Servicio", msj);
        }
        else{
            String msj = String.format("No se puedo Borrar el Servicio con id %s", idSE);
            addMensaje("Servicio", msj);
        }
    }

    public void eliminarA(Long idAmbulancia){
        iAmbulaciasService.borrarA(idAmbulancia);
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

    public ArrayList<ServicioEmergenciaDTO> getServicioEmergenciaDTOS() {
        return servicioEmergenciaDTOS;
    }

    public void setServicioEmergenciaDTOS(ArrayList<ServicioEmergenciaDTO> servicioEmergenciaDTOS) {
        this.servicioEmergenciaDTOS = servicioEmergenciaDTOS;
    }

    public ArrayList<AmbulanciaDTO> getAmbulanciaDTOS() {
        return ambulanciaDTOS;
    }

    public void setAmbulanciaDTOS(ArrayList<AmbulanciaDTO> ambulanciaDTOS) {
        this.ambulanciaDTOS = ambulanciaDTOS;
    }
}