package uy.edu.tsig.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
// import uy.edu.tsig.entity.Hospital;

import java.io.Serializable;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ServicioEmergenciaDTO implements Serializable {
    private static final Long serialVersionUID = 1L;

    private Long idServicio;
    private String nombre;
    private int totalCama;
    private int camasLibres;

    private HospitalDTO hospital;

    public ServicioEmergenciaDTO(Long idServicio, String nombre, int totalCama, int camasLibres) {
        this.camasLibres = camasLibres;
        this.totalCama = totalCama;
        this.idServicio = idServicio;
        this.nombre = nombre;
    }
}
