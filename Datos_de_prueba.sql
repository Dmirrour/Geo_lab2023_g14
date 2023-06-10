/*************** DATOS DE PRUEBA ***************/

--*-*-*-*-*-*-*-*-*- INSERT USUARIO -*-*-*-*-*-*-*-*-*--
INSERT INTO usuario(usuario,pass)VALUES('grupo14','admin');
INSERT INTO usuario(usuario,pass)VALUES('admin','admin');
INSERT INTO usuario(usuario,pass)VALUES('sgonzalez','123');
INSERT INTO usuario(usuario,pass)VALUES('apisano','123');
INSERT INTO usuario(usuario,pass)VALUES('warriola','123');
INSERT INTO usuario(usuario,pass)VALUES('dpoblete','123');
INSERT INTO usuario(usuario,pass)VALUES('dvera','123');
INSERT INTO usuario(usuario,pass)VALUES('mservian','123');


--*-*-*-*-*-*-*-*-*- INSERT HOSPITAL -*-*-*-*-*-*-*-*-*--
INSERT INTO hospital("idhospital","nombrehospital","tipohospital")VALUES(1,'Hospital de Clinicas',2);
INSERT INTO hospital("idhospital","nombrehospital","tipohospital")VALUES(2,'Medica Uruguaya',0);
INSERT INTO hospital("idhospital","nombrehospital","tipohospital")VALUES(3,'Circulo Catolico',0);
INSERT INTO hospital("idhospital","nombrehospital","tipohospital")VALUES(4,'CASMU',0);
INSERT INTO hospital("idhospital","nombrehospital","tipohospital")VALUES(5,'Asociación Española',0);
INSERT INTO hospital("idhospital","nombrehospital","tipohospital")VALUES(6,'Hospital Maciel',2);


--*-*-*-*-*-*-*-*-*- INSERT AMBULANCIA -*-*-*-*-*-*-*-*-*--
INSERT INTO ambulancia("idambulancia","distanciamaxdesvio","idcodigo","hospital_idhospital","polyline")VALUES(1,100,10,1,null);
INSERT INTO ambulancia("idambulancia","distanciamaxdesvio","idcodigo","hospital_idhospital","polyline")VALUES(2,155,15,1,null);
INSERT INTO ambulancia("idambulancia","distanciamaxdesvio","idcodigo","hospital_idhospital","polyline")VALUES(3,200,20,2,null);
INSERT INTO ambulancia("idambulancia","distanciamaxdesvio","idcodigo","hospital_idhospital","polyline")VALUES(4,120,25,2,null);
INSERT INTO ambulancia("idambulancia","distanciamaxdesvio","idcodigo","hospital_idhospital","polyline")VALUES(5,300,30,2,null);
INSERT INTO ambulancia("idambulancia","distanciamaxdesvio","idcodigo","hospital_idhospital","polyline")VALUES(6,250,35,3,null);
--*-*-*-*-*-*-*-*-*- UPDATE AMBULANCIA -*-*-*-*-*-*-*-*-*--
UPDATE ambulancia SET polyline='LINESTRING(-56.19890928268433 -34.87205101405393,-56.18869543075562 -34.871346829572325,-56.18227447776008 -34.870898537473224, -56.18304669857026 -34.87280360455116)' WHERE idambulancia=1;
UPDATE ambulancia SET polyline='LINESTRING(-56.24213576316834 -34.87111126177625,-56.22702956199647 -34.8587365053499,-56.2242615222931 -34.86014068248701, -56.22278630733491 -34.858529618291136)' WHERE idambulancia=2;
UPDATE ambulancia SET polyline='LINESTRING(-56.16814613290445 -34.863877701507064,-56.1479886937741 -34.87931822276983,-56.15241050720215 -34.881974972559426, -56.15324199199677 -34.881147655057795)' WHERE idambulancia=3;
UPDATE ambulancia SET polyline='LINESTRING(-56.198608875274665 -34.90644748064126,-56.193619966506965 -34.90606914064883,-56.192906498909 -34.912747025259556, -56.19525611400605 -34.91206518447018)' WHERE idambulancia=4;
UPDATE ambulancia SET polyline='LINESTRING(-56.164666414206295 -34.89814433959129,-56.16328418254853 -34.91090384260483,-56.171126961708076 -34.90824237220117)' WHERE idambulancia=5;
UPDATE ambulancia SET polyline='LINESTRING(-56.197106838226325 -34.84093351099642,-56.19352877140046 -34.837367166344926,-56.170676350593574 -34.81493528019694)' WHERE idambulancia=6;


--*-*-*-*-*-*-*-*-*- HOSPITAL_AMBULANCIA -*-*-*-*-*-*-*-*-*--
INSERT INTO hospital_ambulancia(idambulancia,hospital_idhospital)VALUES(1,1);
INSERT INTO hospital_ambulancia(hospital_idhospital, ambulancia_idambulancia)VALUES (2, 1);


--*-*-*-*-*-*-*-*-*- INSERT SERVICIO EMERGENCIA -*-*-*-*-*-*-*-*-*--
INSERT INTO servicioemergencia("idservicio","camaslibres","nombre","totalcama","hospital_idhospital","point")VALUES(1,50,'Hospital de Clinicas',290,1,(ST_SetSRID(st_makepoint(-81, -36), 32721)));
INSERT INTO servicioemergencia("idservicio","camaslibres","nombre","totalcama","hospital_idhospital","point")VALUES(2,120,'Medica Uruguaya La Paz',150,2,null);
INSERT INTO servicioemergencia("idservicio","camaslibres","nombre","totalcama","hospital_idhospital","point")VALUES(3,20,'Medica Uruguaya Paso Cerro',80,2,null);
INSERT INTO servicioemergencia("idservicio","camaslibres","nombre","totalcama","hospital_idhospital","point")VALUES(4,87,'Hospital Maciel',203,4,null);


--*-*-*-*-*-*-*-*-*- UPDATE SERVICIO EMERGENCIA -*-*-*-*-*-*-*-*-*--
UPDATE servicioemergencia SET point=(ST_SetSRID(st_makepoint(-56.15112304, -34.8921377450), 32721)) WHERE "idservicio"=1;
UPDATE servicioemergencia SET point=(ST_SetSRID(st_makepoint(-56.2615234, -34.8521477450), 32721)) WHERE "idservicio"=2;
UPDATE servicioemergencia SET point=(ST_SetSRID(st_makepoint(-56.23247723007203, -34.863756264959946), 32721)) WHERE "idservicio"=3;
UPDATE servicioemergencia SET point=(ST_SetSRID(st_makepoint(-56.19952350, -34.8521477950), 32721)) WHERE "idservicio"=4;


--*-*-*-*-*-*-*-*- INSERT HOSPITAL SERVICIO EMERGENCIA -*-*-*-*-*-*-*-*--
INSERT INTO hospital_servicioemergencia(hospital_idhospital,  servicioemergencia_idservicio)VALUES (1, 1);
INSERT INTO hospital_servicioemergencia(hospital_idhospital,  servicioemergencia_idservicio)VALUES (2, 2);
INSERT INTO hospital_servicioemergencia(hospital_idhospital,  servicioemergencia_idservicio)VALUES (2, 3);


--*-*-*-*-*-*-*-*-*- COLUMNA GEOMETRY -*-*-*-*-*-*-*-*-*--
ALTER TABLE servicioemergencia ADD COLUMN point GEOMETRY(Point, 32721);
ALTER TABLE ambulancia ADD COLUMN polyline GEOMETRY(LineString, 32721);


--*-*-*-*-*-*-*-*-*- SELECT -*-*-*-*-*-*-*-*-*--
SELECT * FROM ambulancia;
SELECT * FROM servicioemergencia;
SELECT * FROM hospital_servicioemergencia;
SELECT * FROM hospital;
SELECT * FROM hospital_ambulancia;
SELECT * FROM usuario;


--*-*-*-*-*-*-*-*-*- ELIMINAR -*-*-*-*-*-*-*-*-*--
DROP TABLE ambulancia CASCADE;
DROP TABLE hospital_ambulancia CASCADE;
DROP TABLE hospital CASCADE;
DROP TABLE hospital_servicioemergencia CASCADE;
DROP TABLE servicioemergencia CASCADE;
DROP TABLE usuario CASCADE;


--*-*-*-*-*-*-*-*-*-  DATOS PRUEBAS TRABAJANDO -*-*-*-*-*-*-*-*-*--
SELECT ST_AsText(ST_PointN(polyline, 2)) AS punto FROM ambulancia WHERE idambulancia = 1; -- Devuelve un point del linestring
SELECT st_astext(st_union(geom)) FROM ft_01_ejes;
SELECT st_astext(st_linemerge(st_union(polyline))) FROM ambulancia WHERE nom_calle='MAGALLANES';
CREATE TABLE st_asgml(geom) FROM ft01_ejes WHERE nom_calle='MAGALLANES';
SELECT st_asgml(geom) FROM ambulancia;

--*-*-*-*-*-*-*-*-*-
INSERT INTO ambulancia(recorrido)VALUES('LINESTRING(-56.197106838226325 -34.84093351099642,-56.19352877140046 -34.837367166344926,-56.170676350593574 -34.81493528019694)');
UPDATE servicioemergencia SET geom=(ST_SetSRID(st_makepoint(-31, -36), 32721)) WHERE idservicio=2;

--*-*-*-*-*-*-*-*-*- SELECT -*-*-*-*-*-*-*-*-*--
SELECT * FROM ft_depto;
SELECT * FROM ft_00_cam_dig;
SELECT * FROM ft01_ejes;

SELECT * FROM ft_00_departamento;
SELECT * FROM ft_00_loc_pg;
SELECT * FROM ft_00_vias;

  -- View: public.vista_se_h
  CREATE OR REPLACE VIEW public.vista_se_h AS
  SELECT se.idservicio,se.camaslibres,se.nombre,se.totalcama,se.point,h.idhospital,h.nombrehospital,
    CASE h.tipohospital
        WHEN 0 THEN 'MUTUALISTA'
        WHEN 1 THEN 'SEGURO PRIVADO'
        WHEN 2 THEN 'SERVICIO ESTATAL'
        ELSE 'Desconocido'
        END AS tipohospital
    FROM servicioemergencia seJOIN hospital h ON se.hospital_idhospital = h.idhospital;


-- DROP VIEW vista_a_rec;
CREATE OR REPLACE VIEW public.vista_a_rec AS
SELECT a.idambulancia,a.distanciamaxdesvio,a.idcodigo,a.polyline,h.idhospital,h.nombrehospital
FROM ambulancia a JOIN hospital h ON a.hospital_idhospital = h.idhospital;

-- Probablemente no sea necesario asignar el propieatrio esto ya lo hace autoamtico pero por si acaso:
  ALTER TABLE public.vista_se_h
      OWNER TO postgres;

DROP TABLE ambulancia CASCADE;
DROP TABLE hospital CASCADE;
DROP TABLE hospital_ambulancia CASCADE;
DROP TABLE servicioemergencia CASCADE;

ALTER TABLE servicioemergencia ADD COLUMN point GEOMETRY(Point, 32721);
ALTER TABLE ambulancia ADD COLUMN  polyline GEOMETRY(LineString, 32721);

SELECT g.idservicio, ST_Buffer(a.polyline, 0.0005) AS buffer_geom
FROM servicioemergencia g, ambulancia a 
WHERE a.idambulancia=1 AND ST_Intersects( a.polyline,g.point);

--*-*-*-*-*-*-*-*-*- PUNTO MAS CERCANO AL USUARIO -*-*-*-*-*-*-*-*-*--
SELECT * FROM servicioemergencia
ORDER BY ST_Distance(point, ST_SetSRID(ST_MakePoint(-56.185222811229534,-34.8503303549236), 32721)) LIMIT 1;
SELECT * FROM servicioemergencia
ORDER BY ST_Distance(point, ST_SetSRID(ST_MakePoint(-56.185222811229534,-34.8503303549236), 32721)) LIMIT 3;

--*-*-*-*-*-*-*-*-*- PUNTO QUE CONTINEE LA RECTA -*-*-*-*-*-*-*-*-*--
SELECT * FROM servicioemergencia s, ambulancia h WHERE ST_Contains(h.polyline, s.point);


--*-*-*-*-*-*-*-*-*- lONGITUD CALLE -*-*-*-*-*-*-*-*-*--
SELECT SUM(st_length(geom)) from ft_01_ejes WHERE nom_calle='MAGALLANES';
SELECT ST_Length(st_linemerge(st_union(st_astext(geom)))) FROM ft_01_ejes WHERE nom_calle='MAGALLANES';


SELECT st_astext(st_linemerge(st_union(geom))) FROM ft_01_ejes WHERE nom_calle='MAGALLANES';

--*-*-*-*-*-*-*-*-*- BUFFER OK -*-*-*-*-*-*-*-*-*--
SELECT g.idservicio,ST_Buffer(a.polyline,0.05),g.point FROM servicioemergencia g, ambulancia a 
WHERE ST_Intersects(g.point,(ST_Buffer(a.polyline,0.05)));

SELECT a.nombre FROM ft_00departamento a, servicioemergencia g WHERE ST_OVERLAPS(a.geom,ST_BUFFER(g.point,0.001)) and a.nombre='MONTEVIDEO';
DWITHIN(polyline, POINT(-34.20049069242444 -56.1905006852794), 50, meters)

SELECT g.point FROM servicioemergencia g WHERE ST_BUFFER(g.point,0.001);
SELECT ST_BUFFER(g.point,0.001) FROM servicioemergencia g;
SELECT st_endpoint(polyline) FROM ambulancia

SELECT st_endpoint(polyline) from ambulancia