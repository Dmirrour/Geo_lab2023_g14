package uy.edu.tsig.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uy.edu.tsig.entity.ServicioEmergencia;
import uy.edu.tsig.entity.TipoHospital;

import java.io.Serializable;
import java.util.ArrayList;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HospitalDTO implements Serializable {
    private static final Long serialVersionUID = 1L;

    private String nombreHospital;
    private TipoHospital tipoHospital;

    private ServicioEmergencia servicioEmergencia;
    @Builder.Default
    private ArrayList<AmbulanciasDTO> ambulanciasDTOS =new ArrayList<>();

    public HospitalDTO (String nombreHospital, TipoHospital tipoHospital){
        this.nombreHospital=nombreHospital;
        this.tipoHospital=tipoHospital;
    }

}
