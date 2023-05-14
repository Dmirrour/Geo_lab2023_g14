package uy.edu.tsig.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
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
    private String idServicio;
    private int totalCama;
    private int camasLibres;
    @OneToOne
    private Hospital hospital;

    public ServicioEmergencia (String idServicio, int totalCama, int camasLibres){
        this.camasLibres=camasLibres;
        this.idServicio=idServicio;
        this.totalCama=totalCama;
    }

    public HospitalDTO getHospitalDTO(){
        return HospitalDTO.builder()
                .nombreHospital(hospital.getNombreHospital())
                .tipoHospital(hospital.getTipoHospital())
                .build();
    }

}
