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
public class Ambulancia implements Serializable {
    private static final Long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAmbulancia;
    @Column(unique = true)
    private String idCodigo;
    private int distanciaMaxDesvio; // DS

    @ManyToOne
    private Hospital hospital;

    public Ambulancia(Long idAmbulancia, String idCodigo, int distanciaMaxDesvio) {
        this.idAmbulancia = idAmbulancia;
        this.idCodigo = idCodigo;
        this.distanciaMaxDesvio = distanciaMaxDesvio;
    }

    public HospitalDTO geHospitalDTO() {
        return HospitalDTO.builder()
                .idHospital(hospital.getIdHospital())
                .nombreHospital(hospital.getNombreHospital())
                .tipoHospital(hospital.getTipoHospital())
                .servicioEmergencia(hospital.getServicioEmergencia())
                .ambulanciaDTOS(hospital.getAmbulanciasDTOS())
                .build();
    }
}
