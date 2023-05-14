package uy.edu.tsig.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
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
public class Ambulacias implements Serializable {

    private static final Long serialVersionUID = 1L;
    @Id
    private String idAmbulacia;

    @ManyToOne
    private Hospital hospital;

    public Ambulacias (String idAmbulacia){
        this.idAmbulacia=idAmbulacia;
    }

    public HospitalDTO geHospitalDTO(){
        return HospitalDTO.builder()
                .nombreHospital(hospital.getNombreHospital())
                .tipoHospital(hospital.getTipoHospital())
                .servicioEmergencia(hospital.getServicioEmergencia())
                .ambulanciasDTOS(hospital.getAmbulanciasDTOS())
                .build();
    }
}
