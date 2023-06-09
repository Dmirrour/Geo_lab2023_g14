package uy.edu.tsig.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.locationtech.jts.geom.LineString;
import uy.edu.tsig.dto.AmbulanciaDTO;
import uy.edu.tsig.dto.HospitalDTO;
import org.hibernate.annotations.Type;
import org.postgis.PGgeometry;

import java.io.Serializable;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Ambulancia implements Serializable {

    private static final Long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAmbulancia;
    @Column(unique = true)
    private int idCodigo;
    private int distanciaMaxDesvio;

    @ManyToOne
    private Hospital hospital;

    // lo dejo asi entonces para q no joda, para referencia de lo q hay
    @Transient
    @Column(columnDefinition = "geometry(LineString, 32721)")
    @Type(type = "org.hibernate.spatial.GeometryType")
    private LineString polyline;


    public Ambulancia(Long idAmbulancia, int idCodigo, int distanciaMaxDesvio){
        this.idAmbulancia =idAmbulancia;
        this.idCodigo=idCodigo;
        this.distanciaMaxDesvio=distanciaMaxDesvio;
    }

    public HospitalDTO getHospitalDTO(){
        return HospitalDTO.builder()
                .idHospital(hospital.getIdHospital())
                .nombreHospital(hospital.getNombreHospital())
                .tipoHospital(hospital.getTipoHospital())
                .servicioEmergencia(hospital.getServicioEmergenciaDTO())
                //.ambulanciaDTOS(hospital.getAmbulanciasDTOS())
                .build();
    }

    public AmbulanciaDTO getAmbulanciaDTO(){
        return new AmbulanciaDTO(this.idAmbulancia,this.idCodigo,this.distanciaMaxDesvio);
    }
}
