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
INSERT INTO ambulancia("idambulancia","distanciamaxdesvio","idcodigo","hospital_idhospital","polyline")VALUES(1,1000,10,1,null);
INSERT INTO ambulancia("idambulancia","distanciamaxdesvio","idcodigo","hospital_idhospital","polyline")VALUES(2,155,450,2,null);
INSERT INTO ambulancia("idambulancia","distanciamaxdesvio","idcodigo","hospital_idhospital","polyline")VALUES(3,2000,25,4,null);
INSERT INTO ambulancia("idambulancia","distanciamaxdesvio","idcodigo","hospital_idhospital","polyline")VALUES(4,420,25,5,null);

INSERT INTO ambulancia("idambulancia","distanciamaxdesvio","idcodigo","hospital_idhospital","polyline")VALUES(5,300,30,2,null);
INSERT INTO ambulancia("idambulancia","distanciamaxdesvio","idcodigo","hospital_idhospital","polyline")VALUES(6,250,35,3,null);
--*-*-*-*-*-*-*-*-*- UPDATE AMBULANCIA -*-*-*-*-*-*-*-*-*--
UPDATE ambulancia SET polyline='LINESTRING(-56.19890928268433 -34.87205101405393,-56.18869543075562 -34.871346829572325,-56.18227447776008 -34.870898537473224, -56.18304669857026 -34.87280360455116)' WHERE idambulancia=1;
UPDATE ambulancia SET polyline='LINESTRING(-56.24213576316834 -34.87111126177625,-56.22702956199647 -34.8587365053499,-56.2242615222931 -34.86014068248701, -56.22278630733491 -34.858529618291136)' WHERE idambulancia=2;
UPDATE ambulancia SET polyline='LINESTRING(-56.16814613290445 -34.86387770150706,-56.1479886937741 -34.87931822276983,-56.15241050720215 -34.881974972559426, -56.15324199199677 -34.881147655057795)' WHERE idambulancia=3;
UPDATE ambulancia SET polyline='LINESTRING(-56.19317088836397 -34.89957290575177,-56.19279588987410 -34.90334227984780)' WHERE idambulancia=4;


UPDATE ambulancia SET polyline='LINESTRING(-56.198608875274665 -34.90644748064126,-56.193619966506965 -34.90606914064883,-56.192906498909 -34.912747025259556, -56.19525611400605 -34.91206518447018)' WHERE idambulancia=4;
UPDATE ambulancia SET polyline='LINESTRING(-56.164666414206295 -34.89814433959129,-56.16328418254853 -34.71090384260483,-56.171126961708076 -34.70824237220117)' WHERE idambulancia=5;
UPDATE ambulancia SET polyline='LINESTRING(-56.897106838226325 -34.84093351099642,-56.19352877140046 -34.837367166344926,-56.170676350593574 -34.81493528019694)' WHERE idambulancia=6;
-34.89957290575177], [-56.19317088836397
-34.903342279847806], [-56.192795889874105]

--*-*-*-*-*-*-*-*-*- HOSPITAL_AMBULANCIA -*-*-*-*-*-*-*-*-*--
INSERT INTO hospital_ambulancia(hospital_idhospital,ambulancia_idambulancia)VALUES(1,1);
INSERT INTO hospital_ambulancia(hospital_idhospital, ambulancia_idambulancia)VALUES (1, 2);
INSERT INTO hospital_ambulancia(hospital_idhospital, ambulancia_idambulancia)VALUES (2, 3);

--*-*-*-*-*-*-*-*-*- INSERT SERVICIO EMERGENCIA -*-*-*-*-*-*-*-*-*--
INSERT INTO servicioemergencia("idservicio","camaslibres","nombre","totalcama","hospital_idhospital","point")VALUES(1,50,'Hospital de Clinicas',290,1,(ST_SetSRID(st_makepoint(-81, -36), 32721)));
INSERT INTO servicioemergencia("idservicio","camaslibres","nombre","totalcama","hospital_idhospital","point")VALUES(2,120,'Medica Uruguaya La Paz',150,2,null);
INSERT INTO servicioemergencia("idservicio","camaslibres","nombre","totalcama","hospital_idhospital","point")VALUES(3,20,'Medica Uruguaya Paso Cerro',80,2,null);
INSERT INTO servicioemergencia("idservicio","camaslibres","nombre","totalcama","hospital_idhospital","point")VALUES(4,87,'Hospital Maciel',203,3,null);
INSERT INTO servicioemergencia("idservicio","camaslibres","nombre","totalcama","hospital_idhospital","point")VALUES(5,80,'Hospital Pereira Rosell',1500,1,null);

--*-*-*-*-*-*-*-*-*- UPDATE SERVICIO EMERGENCIA -*-*-*-*-*-*-*-*-*--
UPDATE servicioemergencia SET point=(ST_SetSRID(st_makepoint(-56.15112304, -34.8921377450), 32721)) WHERE "idservicio"=1;
UPDATE servicioemergencia SET point=(ST_SetSRID(st_makepoint( -56.15584373474122,-34.876285765111696), 32721)) WHERE "idservicio"=2;
UPDATE servicioemergencia SET point=(ST_SetSRID(st_makepoint(-56.23947723007203, -34.863766265959946), 32721)) WHERE "idservicio"=3;
UPDATE servicioemergencia SET point=(ST_SetSRID(st_makepoint(-56.19952350, -34.8521477950), 32721)) WHERE "idservicio"=4;
UPDATE servicioemergencia SET point=(ST_SetSRID(st_makepoint(-56.19721412658692, -34.90419985667401), 32721)) WHERE "idservicio"=5;

--*-*-*-*-*-*-*-*- INSERT HOSPITAL SERVICIO EMERGENCIA -*-*-*-*-*-*-*-*--
INSERT INTO hospital_servicioemergencia(hospital_idhospital,  servicioemergencia_idservicio)VALUES (1, 1);
INSERT INTO hospital_servicioemergencia(hospital_idhospital,  servicioemergencia_idservicio)VALUES (2, 2);
INSERT INTO hospital_servicioemergencia(hospital_idhospital,  servicioemergencia_idservicio)VALUES (2, 3);


--*-*-*-*-*-*-*-*-*- COLUMNA GEOMETRY -*-*-*-*-*-*-*-*-*--
ALTER TABLE servicioemergencia ADD COLUMN point GEOMETRY(Point, 32721);
ALTER TABLE ambulancia ADD COLUMN polyline GEOMETRY(LineString, 32721);


--*-*-*-*-*-*-*-*-*-*-*- VISTA -*-*-*-*-*-*-*-*-*-*-*--

-- public.vista_selects;
CREATE OR REPLACE VIEW public.vista_selects AS
    SELECT DISTINCT a.idambulancia, g.hospital_idhospital,
        st_buffer(a.polyline, (a.distanciamaxdesvio::numeric * 0.000941090001733132 / 100::numeric)::double precision) AS st_buffer,
        st_pointn(a.polyline, 1) AS st_pointn
       FROM servicioemergencia g, ambulancia a
    WHERE a.hospital_idhospital = g.hospital_idhospital;

-- vista_buffer_no_intersect
CREATE OR REPLACE VIEW vista_buffer_no_intersect AS
    WITH intersecciones AS (
        SELECT
            se.idservicio,
            se.nombre,
            se.camaslibres,
            ST_Intersection(se.point, buffer.buffer_geom) AS interseccion
        FROM
            servicioemergencia se
        JOIN (
            SELECT
              a.hospital_idhospital,
              ST_Buffer(a.polyline, ((a.distanciamaxdesvio * 9.41090001733132E-4) / 100)) AS buffer_geom
            FROM
              ambulancia a
            GROUP BY
              a.idambulancia, a.distanciamaxdesvio, a.polyline
        ) AS buffer ON se.hospital_idhospital = buffer.hospital_idhospital AND ST_Intersects(se.point, buffer.buffer_geom)
    )
        SELECT
            i.idservicio,
            i.nombre,
            i.camaslibres,
            COUNT(i.interseccion) AS cantidad_buffers,
            ST_Union(i.interseccion) AS union_buffers
        FROM
            intersecciones i
        GROUP BY
            i.idservicio, i.nombre, i.camaslibres
        HAVING COUNT(i.interseccion) = (
        SELECT MAX(count_buffers)
        FROM (
                 SELECT COUNT(interseccion) AS count_buffers
                 FROM intersecciones
                 GROUP BY idservicio
             ) AS subquery
    );

  -- View: public.vista_se_h
  CREATE OR REPLACE VIEW public.vista_se_h AS
  SELECT se.idservicio, se.camaslibres, se.nombre, se.totalcama, se.point, h.idhospital, h.nombrehospital,
    CASE h.tipohospital
        WHEN 0 THEN 'MUTUALISTA'
        WHEN 1 THEN 'SEGURO PRIVADO'
        WHEN 2 THEN 'SERVICIO ESTATAL'
        ELSE 'Desconocido'
        END AS tipohospital
    FROM servicioemergencia se 
    JOIN hospital h ON se.hospital_idhospital = h.idhospital;


-- AMBULANCIA / HOSPITAL - vista_a_rec;
CREATE OR REPLACE VIEW public.vista_a_rec AS
SELECT a.idambulancia, a.distanciamaxdesvio, a.idcodigo, a.polyline, h.idhospital, h.nombrehospital
FROM ambulancia a 
JOIN hospital h ON a.hospital_idhospital = h.idhospital;


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

-- *
--  * Para crear la vista de los servicios de emergencias con la informacion del hosptial al que pertences
--  * Hay que crear una vista en Postgres con el siguiente codigo sql
--  *
     /*--vista de prueba de buffers se actualiza sola cada ves que agregas un recorrido o modificas el buffer ojo con modificar el buffer manual mente porque puede quedar fuera del servicio
     Vieja vista
     CREATE OR REPLACE VIEW public.vista_buf AS
        SELECT
            ST_Buffer(ST_Transform(st_linemerge(st_union(a.polyline)), 32721), ((a.distanciamaxdesvio*100)/(6378137*0.9996))) AS buffer_geom
        FROM
            ambulancia a
        GROUP BY
            a.distanciamaxdesvio;*/

  -- View: public.vista_se_h

     /*nueva vista*/
     CREATE OR REPLACE VIEW public.vista_buf AS
            SELECT ST_Buffer(ST_SetSRID(a.polyline, 32721), ((a.distanciamaxdesvio*9.41090001733132E-4) / 100)) AS buffer_geom
            FROM ambulancia a
            GROUP BY a.distanciamaxdesvio,a.polyline;
CREATE OR REPLACE VIEW public.vista_montevideo
 AS
 SELECT st_setsrid(a.geom, 32721) FROM ft_00departamento a WHERE a.nombre='MONTEVIDEO';
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

-- BUFFER / HOSPITAL - vista_buf;
CREATE OR REPLACE VIEW public.vista_buf AS
        SELECT a.idambulancia, ST_Buffer(ST_SetSRID(a.polyline, 32721), ((a.distanciamaxdesvio*9.41090001733132E-4) / 100)) AS buffer_geom
        FROM ambulancia a
        GROUP BY a.idambulancia;



CREATE OR REPLACE VIEW vista_buff_cobertura_user AS
SELECT DISTINCT a.idambulancia, g.hospital_idhospital, st_buffer(a.polyline, (a.distanciamaxdesvio * 0.000941090001733132 / 100)) AS buffer_zona_cobertura, st_pointn(a.polyline, 1) AS first_point_recorrido, g.point AS point_se FROM servicioemergencia g,ambulancia a WHERE a.hospital_idhospital = g.hospital_idhospital;


----  resp
CREATE OR REPLACE VIEW public.vista_buff_cobertura_user AS
SELECT DISTINCT a.idambulancia, g.hospital_idhospital, st_buffer(a.polyline, (a.distanciamaxdesvio * 0.000941090001733132 / 100)) AS buffer_zona_cobertura, st_pointn(a.polyline, 1) AS first_point_recorrido, g.point AS point_se FROM servicioemergencia g,ambulancia a WHERE a.hospital_idhospital = g.hospital_idhospital;


----
-- id ambulancia - punto servicio e - de linestring buffer - Primer punto en linestring

CREATE OR REPLACE VIEW vista_buff_cobertura_user AS SELECT DISTINCT a.idambulancia,g.hospital_idhospital,
    st_buffer(a.polyline, (a.distanciamaxdesvio * 0.000941090001733132 / 100)) AS buffer_zona_cobertura,st_pointn(a.polyline, 1) AS first_point_recorrido, g.point AS point_se
   FROM servicioemergencia g, ambulancia a WHERE a.hospital_idhospital = g.hospital_idhospital;


--------------------------------------------------------------


CREATE OR REPLACE VIEW public.vista_buff_cobertura AS
 SELECT DISTINCT a.idambulancia, g.hospital_idhospital,
    st_buffer(a.polyline, (a.distanciamaxdesvio * 0.000941090001733132 / 100)) AS buffer_zona_cobertura,
    st_pointn(a.polyline, 1) AS first_point_recorrido
   FROM servicioemergencia g, ambulancia a
  WHERE a.hospital_idhospital = g.hospital_idhospital;


 SELECT DISTINCT a.idambulancia, a.hospital_idhospital,
    st_buffer(a.polyline, (a.distanciamaxdesvio::numeric * 0.000941090001733132 / 100::numeric)::double precision) AS st_buffer
   FROM servicioemergencia g,
    ambulancia a
  WHERE a.hospital_idhospital = g.hospital_idhospital;



-- Primer punto en linestring(polyline) ambulancia
CREATE OR REPLACE VIEW public.vista_selectp AS
SELECT a.idambulancia, ST_PointN(a.polyline, 1)
FROM ambulancia a;


SELECT ST_PointN(polyline, 1) AS punto FROM ambulancia;



-- ------------------ 11/06/2023
SELECT * FROM vista_buff_cobertura
WHERE ST_Within(ST_SetSRID(ST_MakePoint(-56.241073608398445,-34.856779910488136), 32721), ST_Buffer(tu_geom_buffer, tu_radio_buffer))


SELECT Distinct a.idambulancia, ST_Buffer(a.polyline,(a.distanciamaxdesvio*9.41090001733132E-4) / 100)
FROM servicioemergencia g, ambulancia a 
WHERE (a.hospital_idhospital=g.hospital_idhospital) AND 
ST_Intersects(ST_SetSRID(st_makepoint(-56.241073608398445,-34.856779910488136), 32721),(ST_Buffer(a.polyline,(a.distanciamaxdesvio*9.41090001733132E-4) / 100)));
------------------

DROP TABLE ambulancia CASCADE;
DROP TABLE hospital CASCADE;
DROP TABLE hospital_ambulancia CASCADE;
DROP TABLE hospital_servicioemergencia CASCADE;
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

SELECT distinct g.idservicio,ST_Buffer(a.polyline,0.005),g.point FROM servicioemergencia g, ambulancia a 
WHERE ST_Intersects(g.point,(ST_Buffer(a.polyline,0.005)));


 
 SELECT DISTINCT g.idservicio, g.point, st_pointn(a.polyline, 1)
   FROM servicioemergencia g,ambulancia a
  WHERE (a.hospital_idhospital = g.hospital_idhospital AND ST_Intersects(ST_SetSRID(st_makepoint(-56.241073608398445,-34.856779910488136), 32721),(ST_Buffer(a.polyline,(a.distanciamaxdesvio*0.000941090001733132) / 100)));


 st_buffer(a.polyline, (a.distanciamaxdesvio::numeric * 0.000941090001733132 / 100::numeric)::double precision) AS st_buffer










  SELECT DISTINCT a.idambulancia, g.hospital_idhospital,
    st_buffer(g.point, (a.distanciamaxdesvio * 0.000941090001733132 / 100)) AS buffer_zona_cobertura,
    st_pointn(a.polyline, 1) AS first_point_recorrido
   FROM servicioemergencia g, ambulancia a
  WHERE a.hospital_idhospital = g.hospital_idhospital;










CREATE OR REPLACE VIEW public.vista_buff_cobertura_user
 AS SELECT DISTINCT a.idambulancia, g.hospital_idhospital,
   st_buffer(a.polyline, (a.distanciamaxdesvio::numeric * 0.000941090001733132 / 100::numeric)::double precision) AS buffer_zona_cobertura,
   st_pointn(a.polyline, 1) AS first_point_recorrido, g.point as point_se
   FROM servicioemergencia g, ambulancia a  WHERE a.hospital_idhospital = g.hospital_idhospital;