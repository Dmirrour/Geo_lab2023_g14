package uy.edu.tsig.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uy.edu.tsig.entity.Hospital;

import java.io.Serializable;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ServicioEmergenciaDTO implements Serializable {
    private static final Long serialVersionUID = 1L;

    private Long idServicio;
    private int totalCama;
    private int camasLibres;

    private Hospital hospital;

    public ServicioEmergenciaDTO(Long idServicio, int totalCama, int camasLibres){
        this.camasLibres=camasLibres;
        this.totalCama=totalCama;
        this.idServicio=idServicio;
    }
}
