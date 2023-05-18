package uy.edu.tsig.entity;

import jakarta.persistence.*;
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
@Entity
public class GeomPunto implements Serializable {

    private static final Long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPunto;

    @Column(name = "point", nullable = false, columnDefinition = "geometry(Point,4326)")
    private Geometry point;

    /**
     * implementar
     * @OneToOne
     */
    private Long idHospital;

}