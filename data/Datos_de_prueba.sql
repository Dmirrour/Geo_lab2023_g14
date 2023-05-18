-- Script Datos de Prueba

INSERT INTO usuario(usuario, pass) VALUES('grupo14','admin');
INSERT INTO usuario(usuario, pass) VALUES('admin','admin');
INSERT INTO usuario(usuario, pass) VALUES('sgonzalez','123');
INSERT INTO usuario(usuario, pass) VALUES('apisano','123');
INSERT INTO usuario(usuario, pass) VALUES('warriola','123');
INSERT INTO usuario(usuario, pass) VALUES('dpoblete','123');
INSERT INTO usuario(usuario, pass) VALUES('dvera','123');
INSERT INTO usuario(usuario, pass) VALUES('mservian','123');



UPDATE ambulancia SET geom=(ST_SetSRID(ST_MakePoint(-41, -56), 32721)) WHERE idambulancia=3

CREATE TABLE st_asgml(geom) FROM ft_01_ejes WHERE nom_calle='MAGALLANES';	


INSERT INTO ft_recorridos (geom)
      VALUES ('0101000020D17F00004005164262482141ABA432E665725741');


st_asewkt(geom)


CREATE TABLE IF NOT EXISTS ft_recorridos(
    gId integer NOT NULL DEFAULT nextval('ft_00_vias_gid_seq'::regclass),
    fnode_ double precision,
    tnode_ double precision,
    lpoly_ double precision,
    rpoly_ double precision,
    length double precision,
    ulferr_ double precision,
    ulferr_id double precision,
    map double precision,
    geom geometry(MultiLineString,32721),
    CONSTRAINT ft_00_vias_pkey PRIMARY KEY (gid)
)

SELECT st_asgml(geom) FROM ft_recorridos;	


CREATE INDEX IF NOT EXISTS ft_00_vias_geom_idx
    ON public.ft_00_vias USING gist
    (geom)
    TABLESPACE pg_default;


SELECT * FROM localhost


SELECT * FROM ft_recorridos;
SELECT * FROM usuario;
SELECT * FROM hospital;
SELECT * FROM ambulancia;
SELECT * FROM hospital_ambulancia;
SELECT * FROM servicioemergencia;


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