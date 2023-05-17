package uy.edu.tsig.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uy.edu.tsig.dto.HospitalDTO;

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
    private int totalCama;
    private int camasLibres;
    @OneToOne
    private Hospital hospital;

    public ServicioEmergencia (Long idServicio, int totalCama, int camasLibres){
        this.camasLibres=camasLibres;
        this.idServicio=idServicio;
        this.totalCama=totalCama;
    }


    public HospitalDTO getHospitalDTO(){
        return HospitalDTO.builder()
                .idHospital(hospital.getIdHospital())
                .nombreHospital(hospital.getNombreHospital())
                .tipoHospital(hospital.getTipoHospital())
                .ambulanciaDTOS(hospital.getAmbulanciasDTOS())
                .build();
    }

}
