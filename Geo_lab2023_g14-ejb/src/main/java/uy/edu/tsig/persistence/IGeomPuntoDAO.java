package uy.edu.tsig.persistence;

import jakarta.ejb.Remote;
import uy.edu.tsig.entity.GeomPunto;

@Remote
public interface IGeomPuntoDAO {
    GeomPunto geomPunto(GeomPunto pto);
}
