package uy.edu.tsig.dto;

import jakarta.persistence.ManyToOne;
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
public class AmbulanciasDTO implements Serializable {
    private static final Long serialVersionUID = 1L;

    private String idAmbulacia;
    private Hospital hospital;

    public AmbulanciasDTO (String idAmbulacia){
        this.idAmbulacia=idAmbulacia;
    }
}
