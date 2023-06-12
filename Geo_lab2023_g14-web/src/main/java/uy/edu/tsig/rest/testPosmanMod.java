package uy.edu.tsig.rest;

import jakarta.ejb.EJB;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import uy.edu.tsig.dto.AmbulanciaDTO;
import uy.edu.tsig.dto.HospitalDTO;
import uy.edu.tsig.dto.ServicioEmergenciaDTO;
// import uy.edu.tsig.entity.Ambulancia;
import uy.edu.tsig.model.Ambulacias;
import uy.edu.tsig.model.Hospitales;
import uy.edu.tsig.model.ServiciosEmergencias;
import uy.edu.tsig.service.IAmbulaciasService;
import uy.edu.tsig.service.IHospitalService;
import uy.edu.tsig.service.IServicioEmergenciaService;

@Path("/test")
@Consumes(MediaType.APPLICATION_JSON)
@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
public class testPosmanMod {
    @EJB
    IHospitalService iHospitalService;
    @EJB
    IServicioEmergenciaService iServicioEmergenciaService;
    @EJB
    IAmbulaciasService iAmbulaciasService;

    @GET
    @Path("/listarH")
    public Hospitales listarh() {
        // http://localhost:8080/Geo_lab2023_g14-web/rest/test/listarH
        return iHospitalService.obtenerHospitales();
    }

    @POST
    @Path("/borrarser")
    public boolean borrarserv() {
        long i = 2;
        return iServicioEmergenciaService.borrarSE(i);
    }

    @POST
    @Path("/modificarH")
    public void modH(HospitalDTO h) {
        // http://localhost:8080/Geo_lab2023_g14-web/rest/test/modificarH
        iHospitalService.modificar(h);
    }

    @GET
    @Path("/listarS")
    public ServiciosEmergencias listarS() {
        // http://localhost:8080/Geo_lab2023_g14-web/rest/test/listarS
        return iServicioEmergenciaService.listarServiciosEmergensias();
    }

    @POST
    @Path("/modificarS")
    public void modS(ServicioEmergenciaDTO s) {
        // http://localhost:8080/Geo_lab2023_g14-web/rest/test/modificarS
        iServicioEmergenciaService.modificar(s);
    }

    @GET
    @Path("/listarA")
    public Ambulacias listarA() {
        // http://localhost:8080/Geo_lab2023_g14-web/rest/test/listarA
        return iAmbulaciasService.listarAmbulancias();
    }

    @POST
    @Path("/modificarA")
    public void modA(AmbulanciaDTO a) {
        // http://localhost:8080/Geo_lab2023_g14-web/rest/test/modificarA
        iAmbulaciasService.modificar(a);
    }
}
