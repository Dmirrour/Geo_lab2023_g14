package uy.edu.tsig.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.locationtech.jts.geom.LineString;

import java.io.Serializable;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GeomRecorridoDTO implements Serializable {
    private static final Long serialVersionUID = 1L;
    private Long id;
    private LineString ruta;
}
