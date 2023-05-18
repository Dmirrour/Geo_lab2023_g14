package uy.edu.tsig.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.locationtech.jts.geom.Geometry;

import java.io.Serializable;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GeomPuntoDTO implements Serializable {
    private static final Long serialVersionUID = 1L;
    private Long idPunto;
    private Geometry point;
    private Long idHospital;
}
