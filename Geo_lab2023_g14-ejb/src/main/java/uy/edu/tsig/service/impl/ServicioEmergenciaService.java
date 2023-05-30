package uy.edu.tsig.service.impl;

import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import uy.edu.tsig.dto.HospitalDTO;
import uy.edu.tsig.dto.ServicioEmergenciaDTO;
import uy.edu.tsig.entity.Hospital;
import uy.edu.tsig.entity.ServicioEmergencia;
import uy.edu.tsig.model.ServiciosEmergencias;
import uy.edu.tsig.persistence.IHospitalDAO;
import uy.edu.tsig.persistence.IServicioEmergenciaDAO;
import uy.edu.tsig.service.IServicioEmergenciaService;

import java.sql.*;

@Stateless
public class ServicioEmergenciaService implements IServicioEmergenciaService {
    @EJB
    IServicioEmergenciaDAO iServicioEmergenciaDAO;
    @EJB
    IHospitalDAO iHospitalDAO;
    private String url = "jdbc:postgresql://localhost:5432/Geo_lab2023_g14PersistenceUnit";
    private String usuario = "postgres";
    private String contraseña = "admin";

    @Override
    public ServicioEmergenciaDTO altaServicioE(ServicioEmergencia se, Long hospital,double longitud,double latitud){
        Hospital h= iHospitalDAO.buscarHospital(hospital);
        se.setHospital(h);
        se.setCamasLibres(se.getTotalCama());
        ServicioEmergencia persist=iServicioEmergenciaDAO.altaServicioE(se);
        iHospitalDAO.asignarServicioE(h,persist);
        //query geografica
        /*
        System.out.println("Entrando al try query SE.");
        try {
            Connection conn = DriverManager.getConnection(url, usuario, contraseña);
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(
                    "UPDATE servicioemergencia set point = (ST_SetSRID(ST_MakePoint(" + longitud + "," + latitud + "), 32721)) WHERE idservicio=" + persist.getIdServicio() + ";");
            System.out.println("Punto insertado correctamente.");
        } catch (SQLException e) {
            System.out.println("No conecta."+e.getMessage());
        }
        */
        return persist.getServicioEmergenciaDTO();
    }

    @Override
    public boolean borrarSE(Long idSE){

        return iServicioEmergenciaDAO.borrarSE(idSE);
    }

    @Override
    public ServiciosEmergencias listarServiciosEmergensias(){
        ServiciosEmergencias s= new ServiciosEmergencias();
        s.setListServiciosEmergencias(iServicioEmergenciaDAO.obtenerServicioE());
        return s;
    }

    @Override
    public void modificar(ServicioEmergenciaDTO serv){
        ServicioEmergencia s =iServicioEmergenciaDAO.buscarServ(serv.getIdServicio());
        s.setCamasLibres(serv.getCamasLibres());
        s.setTotalCama(serv.getTotalCama());
        iServicioEmergenciaDAO.modificar(s);
    }
}
