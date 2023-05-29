-- Script Datos de Prueba

/**
 * DROP TABLE CASCADE
 */



*
 * Para crear la vista de los servicios de emergencias con la informacion del hosptial al que pertences
 * Hay que crear una vista en Postgres con el siguiente codigo sql
 *
  -- View: public.vista_se_h

  -- DROP VIEW public.vista_se_h;

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


Probablemente no sea necesario asignar el propieatrio esto ya lo hace autoamtico pero por si acaso:

  ALTER TABLE public.vista_se_h
      OWNER TO postgres;


DROP TABLE ambulancia CASCADE;
DROP TABLE hospital CASCADE;
DROP TABLE hospital_ambulancia CASCADE;
DROP TABLE servicioemergencia CASCADE;

ALTER TABLE servicioemergencia ADD COLUMN point GEOMETRY(Point, 32721);

INSERT INTO usuario(usuario, pass) VALUES('grupo14','admin');
INSERT INTO usuario(usuario, pass) VALUES('admin','admin');
INSERT INTO usuario(usuario, pass) VALUES('sgonzalez','123');
INSERT INTO usuario(usuario, pass) VALUES('apisano','123');
INSERT INTO usuario(usuario, pass) VALUES('warriola','123');
INSERT INTO usuario(usuario, pass) VALUES('dpoblete','123');
INSERT INTO usuario(usuario, pass) VALUES('dvera','123');
INSERT INTO usuario(usuario, pass) VALUES('mservian','123');

-- HOSPITAL
INSERT INTO hospital ("idhospital", "nombrehospital", "tipohospital", "servicioemergencia_idservicio") VALUES (1,'Clinicas',2,null);
INSERT INTO hospital ("idhospital", "nombrehospital", "tipohospital", "servicioemergencia_idservicio") VALUES (2,'Medica Uruguaya',0,null);
INSERT INTO hospital ("idhospital", "nombrehospital", "tipohospital", "servicioemergencia_idservicio") VALUES (3,'Circulo',0,null);
INSERT INTO hospital ("idhospital", "nombrehospital", "tipohospital", "servicioemergencia_idservicio") VALUES (4,'Casmu',0,null);
INSERT INTO hospital ("idhospital", "nombrehospital", "tipohospital", "servicioemergencia_idservicio") VALUES (5,'Asociación Española',0,null);

-- AMBULANCIA
INSERT INTO ambulancia("idambulancia","distanciamaxdesvio","idcodigo","hospital_idhospital","recorrido")VALUES(1, 100, 91, 3, null);	
INSERT INTO ambulancia("idambulancia","distanciamaxdesvio","idcodigo","hospital_idhospital","recorrido")VALUES(2, 155, 95, 1, null);	
INSERT INTO ambulancia("idambulancia","distanciamaxdesvio","idcodigo","hospital_idhospital","recorrido")VALUES(3, 200, 4,	3, null);	
INSERT INTO ambulancia("idambulancia","distanciamaxdesvio","idcodigo","hospital_idhospital","recorrido")VALUES(4, 120, 91, 3, null);	
INSERT INTO ambulancia("idambulancia","distanciamaxdesvio","idcodigo","hospital_idhospital","recorrido")VALUES(5, 300, 94, 3,null);
INSERT INTO ambulancia("idambulancia","distanciamaxdesvio","idcodigo","hospital_idhospital","recorrido")VALUES(6, 250, 1, 1,null);

UPDATE ambulancia SET recorrido='LINESTRING(-56.19890928268433 -34.87205101405393,-56.18869543075562 -34.871346829572325,-56.18227447776008 -34.870898537473224, -56.18304669857026 -34.87280360455116)' WHERE idambulancia=1;
UPDATE ambulancia SET recorrido='LINESTRING(-56.24213576316834 -34.87111126177625,-56.22702956199647 -34.8587365053499,-56.2242615222931 -34.86014068248701, -56.22278630733491 -34.858529618291136)' WHERE idambulancia=2;
UPDATE ambulancia SET recorrido='LINESTRING(-56.16814613290445 -34.863877701507064,-56.1479886937741 -34.87931822276983,-56.15241050720215 -34.881974972559426, -56.15324199199677 -34.881147655057795)' WHERE idambulancia=3;
UPDATE ambulancia SET recorrido='LINESTRING(-56.198608875274665 -34.90644748064126,-56.193619966506965 -34.90606914064883,-56.192906498909 -34.912747025259556, -56.19525611400605 -34.91206518447018)' WHERE idambulancia=4;
UPDATE ambulancia SET recorrido='LINESTRING(-56.164666414206295 -34.89814433959129,-56.16328418254853 -34.91090384260483,-56.171126961708076 -34.90824237220117)' WHERE idambulancia=5;
UPDATE ambulancia SET recorrido='LINESTRING(-56.197106838226325 -34.84093351099642,-56.19352877140046 -34.837367166344926,-56.170676350593574 -34.81493528019694)' WHERE idambulancia=6;



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