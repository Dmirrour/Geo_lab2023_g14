package uy.edu.tsig.bean;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Named;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;

@Named("bean")
@RequestScoped
public class ServicioEmBean {
    private int idServicio;
    private String ubicacion;

    public int getIdServicio() {
        return idServicio;
    }

    public void setIdServicio(int idServicio) {
        this.idServicio = idServicio;
    }

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

    public void actualizarServicio() {
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
    }
}
