package uy.edu.tsig.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uy.edu.tsig.dto.AmbulanciaDTO;
import uy.edu.tsig.dto.HospitalDTO;
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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idHospital;
    @Column(unique = true)
    private String nombreHospital;

    private TipoHospital tipoHospital;

    @Builder.Default
    @OneToMany(fetch = FetchType.EAGER, orphanRemoval = true)
    List<ServicioEmergencia> ServicioEmergencia= new ArrayList<>();
 
    @Builder.Default
    @OneToMany(fetch = FetchType.EAGER, orphanRemoval = true)
    List<Ambulancia> Ambulancia = new ArrayList<>();

    public Hospital (Long idHospital, String nombreHospital, TipoHospital tipoHospital){
        this.nombreHospital=nombreHospital;
        this.tipoHospital=tipoHospital;
        this.idHospital=idHospital;
    }

    public ArrayList<ServicioEmergenciaDTO> getServicioEmergenciaDTO(){
            ArrayList<ServicioEmergenciaDTO> result= new ArrayList<>();
            ServicioEmergencia.forEach(servicioEmergencia -> {
                result.add(ServicioEmergenciaDTO.builder()
                        .idServicio(servicioEmergencia.getIdServicio())
                        .nombre(servicioEmergencia.getNombre())
                        .totalCama(servicioEmergencia.getTotalCama())
                        .camasLibres(servicioEmergencia.getCamasLibres())
                        //.hospital(servicioEmergencia.getHospitalDTO())
                        .build());
            });
            return result;
    }

    public ArrayList<AmbulanciaDTO> getAmbulanciasDTOS(){
        ArrayList<AmbulanciaDTO> result =new ArrayList<>();
        Ambulancia.forEach(ambulacia -> {
            result.add(AmbulanciaDTO.builder()
                    .idCodigo(ambulacia.getIdCodigo())
                    .distanciaMaxDesvio(ambulacia.getDistanciaMaxDesvio())
                    .idAmbulancia(ambulacia.getIdAmbulancia())
                    .hospital(ambulacia.getHospitalDTO())
                    .build());
        });
        return result;
    }

    public HospitalDTO getHospitalDTO(){
        return new HospitalDTO(this.getIdHospital(),this.nombreHospital,this.tipoHospital);
    }

}
