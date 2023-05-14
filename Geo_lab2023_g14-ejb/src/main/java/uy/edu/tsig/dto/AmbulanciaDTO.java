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
public class AmbulanciaDTO implements Serializable {
    private static final Long serialVersionUID = 1L;

    private Long idAmbulancia;
    private int idCodigo;
    private Hospital hospital;
    private int distanciaMaxDesvio;

    public AmbulanciaDTO(Long idAmbulancia, int idCodigo, int distanciaMaxDesvio){
        this.idAmbulancia =idAmbulancia;
        this.idCodigo=idCodigo;
        this.distanciaMaxDesvio=distanciaMaxDesvio;
    }
}
