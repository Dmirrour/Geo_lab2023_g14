package uy.edu.tsig.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.locationtech.jts.geom.Geometry;
import uy.edu.tsig.entity.GeomPunto;
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

    private Long idHospital;
    private String nombreHospital;
    private TipoHospital tipoHospital;
    private GeomPuntoDTO geomPunto;

    private ServicioEmergenciaDTO servicioEmergencia;

    @Builder.Default
    ArrayList<AmbulanciaDTO> ambulanciaDTOS =new ArrayList<>();

    public HospitalDTO (Long idHospital, String nombreHospital, TipoHospital tipoHospital){
        this.nombreHospital=nombreHospital;
        this.tipoHospital=tipoHospital;
        this.idHospital=idHospital;
    }

}
