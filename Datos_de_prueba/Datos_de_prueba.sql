-- Script Datos de Prueba

INSERT INTO usuario(usuario, pass) VALUES('grupo14','admin');
INSERT INTO usuario(usuario, pass) VALUES('admin','admin');
INSERT INTO usuario(usuario, pass) VALUES('sgonzalez','123');
INSERT INTO usuario(usuario, pass) VALUES('apisano','123');
INSERT INTO usuario(usuario, pass) VALUES('warriola','123');
INSERT INTO usuario(usuario, pass) VALUES('dpoblete','123');
INSERT INTO usuario(usuario, pass) VALUES('dvera','123');
INSERT INTO usuario(usuario, pass) VALUES('mservian','123');

--  DATOS PRUEBAS TRABAJANDO!!!!!!


CREATE TABLE st_asgml(geom) FROM ft_01_ejes WHERE nom_calle='MAGALLANES';	


CREATE TABLE IF NOT EXISTS ft_recorridos(
    gId integer NOT NULL DEFAULT nextval('ft_00_vias_gid_seq' :: regclass),
    fnode_ double precision,
    tnode_ double precision,
    lpoly_ double precision,
    rpoly_ double precision,
    length double precision,
    ulferr_ double precision,
    ulferr_id double precision,
    map double precision,
    geom geometry(MultiLineString, 32721),
    CONSTRAINT ft_00_vias_pkey PRIMARY KEY (gid)
)

SELECT st_asgml(geom) FROM ft_recorridos;	

CREATE INDEX IF NOT EXISTS ft_00_vias_geom_idx ON public.ft_00_vias USING gist (geom) TABLESPACE pg_default;
    
------------------
	 
INSERT INTO ambulancia (geom) VALUES ('0101000020D17F00004005164262482141ABA432E665725741');
    
UPDATE servicioemergencia SET geom=(ST_SetSRID(st_makepoint(-31, -36), 32721)) WHERE idservicio=2;
   
UPDATE servicioemergencia SET point =('0101000020D17F000000000000008041C000000000000038C0') WHERE idservicio=1;
UPDATE servicioemergencia SET point =('0101000020D17F00004005164262482141ABA432E665725741') WHERE idservicio=2;

UPDATE servicioemergencia SET point='LINESTRING(11.5 -0.1, 21.52 -0.25, 51.53 -2.12)' WHERE idservicio=1;
UPDATE servicioemergencia SET point='LINESTRING(0.5 -10.1, 23.52 -30.25, 41.53 22.12)' WHERE idservicio=2;

UPDATE ambulancia	SET geom='LINESTRING(0.5 -10.1, 23.52 -30.25, 41.53 22.12)' WHERE idambulancia=1;      

------------------

SELECT * FROM servicioemergencia;
SELECT * FROM hospital;
SELECT * FROM ambulancia;
SELECT * FROM hospital_ambulancia;
SELECT * FROM usuario;


------------------

SELECT * FROM ft_ine_depto;
SELECT * FROM ft_00_cam_dig;
SELECT * FROM ft_01_ejes;

------------------

SELECT * FROM ft_00_departamento;
SELECT * FROM ft_00_loc_pg;
SELECT * FROM ft_00_vias;
SELECT * FROM ft_01_esp_libres;
SELECT * FROM ft_01_manzanas;
SELECT * FROM ft_01_parcelas;
SELECT * FROM ft_03_cam_dig;
SELECT * FROM ft_03_ejes;
SELECT * FROM ft_recorridos;
SELECT * FROM ine_barrios_mvd;