-- Script Datos de Prueba

/**
 * DROP TABLE CASCADE
 */



*
 * Para crear la vista de los servicios de emergencias con la informacion del hosptial al que pertences
 * Hay que crear una vista en Postgres con el siguiente codigo sql
 *
  -- View: public.vista_se_h

  CREATE OR REPLACE VIEW public.vista_se_h
   AS
    SELECT se.idservicio,
           se.camaslibres,
           se.nombre,
           se.totalcama,
           se.point,
           h.idhospital,
           h.nombrehospital,
           CASE h.tipohospital
               WHEN 0 THEN 'MUTUALISTA'
               WHEN 1 THEN 'SEGURO PRIVADO'
               WHEN 2 THEN 'SERVICIO ESTATAL'
               ELSE 'Desconocido'
               END AS tipohospital
    FROM servicioemergencia se
             JOIN hospital h ON se.hospital_idhospital = h.idhospital;


-- DROP VIEW vista_a_rec;

CREATE OR REPLACE VIEW public.vista_a_rec
   AS
SELECT a.idambulancia,
       a.distanciamaxdesvio,
       a.idcodigo,
       a.polyline,
       h.idhospital,
       h.nombrehospital
FROM ambulancia a
         JOIN hospital h ON a.hospital_idhospital = h.idhospital;

Probablemente no sea necesario asignar el propieatrio esto ya lo hace autoamtico pero por si acaso:

  ALTER TABLE public.vista_se_h
      OWNER TO postgres;


DROP TABLE ambulancia CASCADE;
DROP TABLE hospital CASCADE;
DROP TABLE hospital_ambulancia CASCADE;
DROP TABLE servicioemergencia CASCADE;

ALTER TABLE servicioemergencia ADD COLUMN point GEOMETRY(Point, 32721);
ALTER TABLE ambulancia ADD COLUMN  polyline GEOMETRY(LineString, 32721);

INSERT INTO usuario(usuario, pass) VALUES('grupo14','admin');
INSERT INTO usuario(usuario, pass) VALUES('admin','admin');
INSERT INTO usuario(usuario, pass) VALUES('sgonzalez','123');
INSERT INTO usuario(usuario, pass) VALUES('apisano','123');
INSERT INTO usuario(usuario, pass) VALUES('warriola','123');
INSERT INTO usuario(usuario, pass) VALUES('dpoblete','123');
INSERT INTO usuario(usuario, pass) VALUES('dvera','123');
INSERT INTO usuario(usuario, pass) VALUES('mservian','123');


SELECT * FROM usuario;
SELECT * FROM ft_00_cam_dig;
SELECT * FROM ft_00_departamento;
SELECT * FROM ft_00_loc_pg;
SELECT * FROM ft_00_vias;
SELECT * FROM ft_01_ejes;
SELECT * FROM ft_01_esp_libres;
SELECT * FROM ft_01_manzanas;
SELECT * FROM ft_01_parcelas;
SELECT * FROM ft_03_cam_dig;
SELECT * FROM ft_03_ejes;