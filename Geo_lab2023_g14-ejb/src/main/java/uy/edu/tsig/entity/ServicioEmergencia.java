package uy.edu.tsig.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uy.edu.tsig.dto.HospitalDTO;
import uy.edu.tsig.dto.ServicioEmergenciaDTO;

import java.awt.*;
import java.io.Serializable;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class ServicioEmergencia implements Serializable {

    private static final Long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idServicio;
    @Column(unique = true)
    private String nombre;
    private int totalCama;
    private int camasLibres;
    @ManyToOne
    private Hospital hospital;

    // En tu clase de entidad, donde tienes el campo point, asegúrate de utilizar la
    // anotación @Type de Hibernate para
    // especificar el tipo de datos espacial. Además, utiliza la anotación
    // @Column(columnDefinition = "geometry(Point,32721)")
    // para definir la columna en la base de datos con el SRID requerido. Por
    // ejemplo:
    @Transient
    @Column(name = "point", columnDefinition = "geometry(Point,32721)")
    private Point geometry;

    public ServicioEmergencia(Long idServicio, String nombre, int totalCama, int camasLibres) {
        this.camasLibres = camasLibres;
        this.idServicio = idServicio;
        this.totalCama = totalCama;
        this.nombre = nombre;
    }

    public HospitalDTO getHospitalDTO() {
        return HospitalDTO.builder()
                .idHospital(hospital.getIdHospital())
                .nombreHospital(hospital.getNombreHospital())
                .tipoHospital(hospital.getTipoHospital())
                .ambulanciaDTOS(hospital.getAmbulanciasDTOS())
                .build();
    }

    public ServicioEmergenciaDTO getServicioEmergenciaDTO() {
        return new ServicioEmergenciaDTO(this.getIdServicio(), this.nombre, this.totalCama, this.camasLibres);
    }
}
