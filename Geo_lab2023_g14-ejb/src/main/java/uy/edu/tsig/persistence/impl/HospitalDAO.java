package uy.edu.tsig.persistence.impl;

import jakarta.ejb.Stateless;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.io.WKBReader;
import uy.edu.tsig.dto.HospitalDTO;
import uy.edu.tsig.entity.Ambulancia;
import uy.edu.tsig.entity.GeomPunto;
import uy.edu.tsig.entity.Hospital;
import uy.edu.tsig.entity.ServicioEmergencia;
import uy.edu.tsig.persistence.IHospitalDAO;
import uy.edu.tsig.util.qualifier.Geo_lab2023_g14PersistenceUnit;

import java.util.ArrayList;
import java.util.List;


@Stateless
public class HospitalDAO implements IHospitalDAO {

    @Geo_lab2023_g14PersistenceUnit
    @Inject
    public EntityManager em;

    private byte[] hexToBytes(String hexString) {
        int len = hexString.length();
        byte[] bytes = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            bytes[i / 2] = (byte) ((Character.digit(hexString.charAt(i), 16) << 4)
                    + Character.digit(hexString.charAt(i + 1), 16));
        }
        return bytes;
    }

    @Override
    public void altaHospital(Hospital h){
/*    String hexValue = "0101000020D17F00004005164262482141ABA432E665725741";
    GeometryFactory geometryFactory = new GeometryFactory();
    WKBReader wkbReader = new WKBReader(geometryFactory);

    try {
        // Convertir el valor hexadecimal a un objeto Geometry
        byte[] wkb = hexToBytes(hexValue);
        Geometry point = wkbReader.read(wkb);

        // Establecer el objeto Geometry en el atributo 'point' de la clase Hospital
        h.setPoint(point);

    } catch (Exception e) {
        // Manejar cualquier excepción que pueda ocurrir
        e.printStackTrace();
    }*/

                // Crear un GeometryFactory
                  GeometryFactory geometryFactory = new GeometryFactory();

          // Crear un punto en las coordenadas (x, y)
          double x = 1.0;
          double y = 2.0;
          //Point point = geometryFactory.createPoint(new Coordinate(x, y));
          //h.setPoint(point);
        GeomPunto g= new GeomPunto();
        //g.setPoint(point);
        em.persist(g);
        em.persist(h);
    }
    @Override
    public Hospital buscarHospital(Long idHospital){
        return em.find(Hospital.class, idHospital);
    }

    @Override
    public Hospital asignarPuntoHospital(int idHospital, Geometry pto) {
        Hospital hospital = em.find(Hospital.class, idHospital);
        String query = "SELECT ST_GeomFromText(:valorHexadecimal, :srid)";
        String valorHexadecimal = "0101000020D17F00004005164262482141ABA432E665725741";
        Geometry geometria = (Geometry) em.createNativeQuery(query)
                .setParameter("valorHexadecimal", "SRID=32721;" + valorHexadecimal)  // Especifica el sistema de referencia espacial (SRID) adecuado
                .setParameter("srid", 32721)  // Especifica el SRID adecuado
                .getSingleResult();
        hospital.setPoint(geometria);
        em.merge(hospital);
        return hospital;
    }

    @Override
    public void asignarAmbulacia(Hospital hospital, Ambulancia a){
        Hospital h = em.find(Hospital.class, hospital.getIdHospital());
        h.getAmbulancia().add(a);
        em.merge(h);
    }
    @Override
    public void asignarServicioE(Hospital hospital, ServicioEmergencia s){
        Hospital h = em.find(Hospital.class, hospital.getIdHospital());
        h.setServicioEmergencia(s);
        em.merge(h);
    }

    @Override
    public ArrayList<HospitalDTO> obtenerHospitales(){
        Query q= em.createQuery("select h from Hospital h", Hospital.class);
        List<Hospital> result = q.getResultList();
        return getHospitalesDTO(result);
    }

    private ArrayList<HospitalDTO> getHospitalesDTO(List<Hospital> h){
        ArrayList<HospitalDTO> res= new ArrayList<>();

        h.forEach(hospital -> res.add(HospitalDTO.builder()
                .idHospital(hospital.getIdHospital())
                .nombreHospital(hospital.getNombreHospital())
                .tipoHospital(hospital.getTipoHospital())
                .servicioEmergencia(hospital.getServicioEmergencia())
                .ambulanciaDTOS(hospital.getAmbulanciasDTOS())
                .build()));
        return res;
    }


}
