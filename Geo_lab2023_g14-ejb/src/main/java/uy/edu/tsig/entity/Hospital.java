package uy.edu.tsig.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uy.edu.tsig.dto.AmbulanciasDTO;
import uy.edu.tsig.dto.ServicioEmergenciaDTO;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Hospital implements Serializable {
    private static final Long serialVersionUID = 1L;

    @Id
    private String nombreHospital;
    private TipoHospital tipoHospital;

    @OneToOne
    private ServicioEmergencia servicioEmergencia;

    @Builder.Default
    @OneToMany
    private List<Ambulacias> listAmbulacias = new ArrayList<>();

    public Hospital (String nombreHospital, TipoHospital tipoHospital){
        this.nombreHospital=nombreHospital;
        this.tipoHospital=tipoHospital;
    }

    public ServicioEmergenciaDTO geServicioEmergenciaDTO(){
        return ServicioEmergenciaDTO.builder()
                .totalCama(servicioEmergencia.getTotalCama())
                .camasLibres(servicioEmergencia.getCamasLibres())
                .hospital(servicioEmergencia.getHospital())
                .build();
    }

    public ArrayList<AmbulanciasDTO> getAmbulanciasDTOS(){
        ArrayList<AmbulanciasDTO> result =new ArrayList<>();
        listAmbulacias.forEach(ambulacias -> {
            result.add(AmbulanciasDTO.builder()
                    .idAmbulacia(ambulacias.getIdAmbulacia())
                    .hospital(ambulacias.getHospital())
                    .build());
        });
        return result;
    }

}
