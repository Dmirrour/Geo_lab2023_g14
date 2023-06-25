-- Table: public.hospital  -- DROP TABLE IF EXISTS public.hospital;
CREATE TABLE IF NOT EXISTS public.hospital(
    idhospital bigint NOT NULL DEFAULT nextval('hospital_idhospital_seq'::regclass),
    nombrehospital character varying(255) COLLATE pg_catalog."default",
    tipohospital smallint,
    CONSTRAINT hospital_pkey PRIMARY KEY (idhospital),
    CONSTRAINT uk_hnq6jx9ojme6qcx6htlgr1aor UNIQUE (nombrehospital)
)
TABLESPACE pg_default;
ALTER TABLE IF EXISTS public.hospital OWNER to postgres;
GRANT ALL ON TABLE public.hospital TO pg_checkpoint;
GRANT ALL ON TABLE public.hospital TO postgres;


-- Table: public.servicioemergencia  -- DROP TABLE IF EXISTS public.servicioemergencia;
CREATE TABLE IF NOT EXISTS public.servicioemergencia(
    idservicio bigint NOT NULL DEFAULT nextval('servicioemergencia_idservicio_seq'::regclass),
    camaslibres integer NOT NULL,
    nombre character varying(255) COLLATE pg_catalog."default",
    totalcama integer NOT NULL,
    hospital_idhospital bigint,
    CONSTRAINT servicioemergencia_pkey PRIMARY KEY (idservicio),
    CONSTRAINT fk16nn59gmehadk0gfcjvir1g0s FOREIGN KEY (hospital_idhospital)
        REFERENCES public.hospital (idhospital) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
TABLESPACE pg_default;
ALTER TABLE IF EXISTS public.servicioemergencia OWNER to postgres;
GRANT ALL ON TABLE public.servicioemergencia TO pg_checkpoint;
GRANT ALL ON TABLE public.servicioemergencia TO postgres;


-- Table: public.hospital_servicioemergencia  -- DROP TABLE IF EXISTS public.hospital_servicioemergencia;
CREATE TABLE IF NOT EXISTS public.hospital_servicioemergencia(
    hospital_idhospital bigint NOT NULL,
    servicioemergencia_idservicio bigint NOT NULL,
    CONSTRAINT uk_frg1ij87av46ygoromck1jsi0 UNIQUE (servicioemergencia_idservicio),
    CONSTRAINT fk2ntnwfp3b21hrwgai1mrobkoo FOREIGN KEY (servicioemergencia_idservicio)
        REFERENCES public.servicioemergencia (idservicio) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT fkpu365gxcuxayubcsgojobn53n FOREIGN KEY (hospital_idhospital)
        REFERENCES public.hospital (idhospital) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
TABLESPACE pg_default;
ALTER TABLE IF EXISTS public.hospital_servicioemergencia OWNER to postgres;
GRANT ALL ON TABLE public.hospital_servicioemergencia TO pg_checkpoint;
GRANT ALL ON TABLE public.hospital_servicioemergencia TO postgres;


-- Table: public.ambulancia  -- DROP TABLE IF EXISTS public.ambulancia;
CREATE SEQUENCE ambulancia_idambulancia_seq START 1;
CREATE TABLE IF NOT EXISTS public.ambulancia(
    idambulancia bigint NOT NULL DEFAULT nextval('ambulancia_idambulancia_seq'::regclass),
    distanciamaxdesvio integer NOT NULL,
    idcodigo integer,
    hospital_idhospital bigint,
    CONSTRAINT ambulancia_pkey PRIMARY KEY (idambulancia),
    CONSTRAINT uk_3aacpjkwiian54co9qsb82q52 UNIQUE (idcodigo),
    CONSTRAINT fkgc4o370tqjcarxv9twjsmm5p5 FOREIGN KEY (hospital_idhospital)
        REFERENCES public.hospital (idhospital) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
TABLESPACE pg_default;
ALTER TABLE IF EXISTS public.ambulancia OWNER to postgres;
GRANT ALL ON TABLE public.ambulancia TO pg_checkpoint;
GRANT ALL ON TABLE public.ambulancia TO postgres;


-- Table: public.hospital_ambulancia  -- DROP TABLE IF EXISTS public.hospital_ambulancia;
CREATE TABLE IF NOT EXISTS public.hospital_ambulancia(
    hospital_idhospital bigint NOT NULL,
    ambulancia_idambulancia bigint NOT NULL,
    CONSTRAINT uk_55mmpoasyj02f6jm65uekpmvt UNIQUE (ambulancia_idambulancia),
    CONSTRAINT fk2kb8vab0i303plipknmxo53me FOREIGN KEY (hospital_idhospital)
        REFERENCES public.hospital (idhospital) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT fkl57c0w381fh46ghsa7o66vyto FOREIGN KEY (ambulancia_idambulancia)
        REFERENCES public.ambulancia (idambulancia) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
TABLESPACE pg_default;
ALTER TABLE IF EXISTS public.hospital_ambulancia OWNER to postgres;
GRANT ALL ON TABLE public.hospital_ambulancia TO pg_checkpoint;
GRANT ALL ON TABLE public.hospital_ambulancia TO postgres;


-- Table: public.ambulancia_servicioemergencia  -- DROP TABLE IF EXISTS public.ambulancia_servicioemergencia;
CREATE TABLE IF NOT EXISTS public.ambulancia_servicioemergencia(
    ambulancia_idambulancia bigint NOT NULL,
    servedelrecorrido_idservicio bigint NOT NULL,
    CONSTRAINT fki6cep5ao7oa5c6c6n2xtugw7s FOREIGN KEY (servedelrecorrido_idservicio)
        REFERENCES public.servicioemergencia (idservicio) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT fkrm0ysuqp7w5t1tot700edht FOREIGN KEY (ambulancia_idambulancia)
        REFERENCES public.ambulancia (idambulancia) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
TABLESPACE pg_default;
ALTER TABLE IF EXISTS public.ambulancia_servicioemergencia OWNER to postgres;
GRANT ALL ON TABLE public.ambulancia_servicioemergencia TO pg_checkpoint;
GRANT ALL ON TABLE public.ambulancia_servicioemergencia TO postgres;

--*-*-*-*-*-*-*-*-*- ADD COLUMN GEOMETRY -*-*-*-*-*-*-*-*-*--
ALTER TABLE servicioemergencia ADD COLUMN point GEOMETRY(Point, 32721);
ALTER TABLE ambulancia ADD COLUMN polyline GEOMETRY(LineString, 32721);



--*-*-*-*-*-*-*-*-*- INSERT HOSPITAL -*-*-*-*-*-*-*-*-*--
INSERT INTO hospital("idhospital","nombrehospital","tipohospital")VALUES(1,'Hospital de Clinicas', 2);
INSERT INTO hospital("idhospital","nombrehospital","tipohospital")VALUES(2, 'Medica Uruguaya', 0);
INSERT INTO hospital("idhospital","nombrehospital","tipohospital")VALUES(3, 'Circulo Catolico', 0);
INSERT INTO hospital("idhospital","nombrehospital","tipohospital")VALUES(4, 'CASMU', 0);
INSERT INTO hospital("idhospital","nombrehospital","tipohospital")VALUES(5, 'Asociación Española', 0);
INSERT INTO hospital("idhospital","nombrehospital","tipohospital")VALUES(6,'Hospital F. Maciel', 2);


--*-*-*-*-*-*-*-*-*- INSERT SERVICIO EMERGENCIA -*-*-*-*-*-*-*-*-*--
INSERT INTO servicioemergencia("idservicio","camaslibres","nombre","totalcama","hospital_idhospital","point")VALUES(1 , 10, 'Hospital de Clinicas', 290, 1, null);
INSERT INTO servicioemergencia("idservicio","camaslibres","nombre","totalcama","hospital_idhospital","point")VALUES(2, 40, 'Medica Uruguaya Paso Cerro', 120, 2, null);
INSERT INTO servicioemergencia("idservicio","camaslibres","nombre","totalcama","hospital_idhospital","point")VALUES(3, 20, 'Circulo Catolico Juan Pablo II', 80, 3, null);
INSERT INTO servicioemergencia("idservicio","camaslibres","nombre","totalcama","hospital_idhospital","point")VALUES(4, 87, 'CASMU Agraciada', 203, 4, null);
INSERT INTO servicioemergencia("idservicio","camaslibres","nombre","totalcama","hospital_idhospital","point")VALUES(5, 50, 'Asociación Española Prado', 90, 5, null);
INSERT INTO servicioemergencia("idservicio","camaslibres","nombre","totalcama","hospital_idhospital","point")VALUES(6, 43, 'Hospital de Clinicas 2', 100, 1, null);

--*-*-*-*-*-*-*-*-*- UPDATE SERVICIO EMERGENCIA -*-*-*-*-*-*-*-*-*--
UPDATE servicioemergencia SET point=(ST_SetSRID(st_makepoint(-56.18722021579743, -34.87224905175731), 32721)) WHERE "idservicio"=1;
UPDATE servicioemergencia SET point=(ST_SetSRID(st_makepoint(-56.23197146858734, -34.86140256648831), 32721)) WHERE "idservicio"=2;
UPDATE servicioemergencia SET point=(ST_SetSRID(st_makepoint(-56.15258216857916, -34.86441034253912), 32721)) WHERE "idservicio"=3;
UPDATE servicioemergencia SET point=(ST_SetSRID(st_makepoint(-56.19952355554450, -34.85214775556950), 32721)) WHERE "idservicio"=4;
UPDATE servicioemergencia SET point=(ST_SetSRID(st_makepoint(-56.19721412658692, -34.90419985667401), 32721)) WHERE "idservicio"=5;
UPDATE servicioemergencia SET point=(ST_SetSRID(st_makepoint(-56.19847093272256, -34.87611088096442), 32721)) WHERE "idservicio"=6;


--*-*-*-*-*-*-*-*-*- INSERT AMBULANCIA -*-*-*-*-*-*-*-*-*--
INSERT INTO ambulancia("idambulancia","distanciamaxdesvio","idcodigo","hospital_idhospital","polyline")VALUES(1, 1000, 10, 1, null);
INSERT INTO ambulancia("idambulancia","distanciamaxdesvio","idcodigo","hospital_idhospital","polyline")VALUES(2, 455, 20, 2, null);
INSERT INTO ambulancia("idambulancia","distanciamaxdesvio","idcodigo","hospital_idhospital","polyline")VALUES(3, 2000, 30, 3, null);

--*-*-*-*-*-*-*-*-*- UPDATE AMBULANCIA -*-*-*-*-*-*-*-*-*--
UPDATE ambulancia SET polyline='LINESTRING(-56.19890928268433 -34.87205101405393,-56.18869543075562 -34.87134682957225,-56.18227447776008 -34.87089853747324, -56.18304669857026 -34.87280360455116)' WHERE idambulancia=1;
UPDATE ambulancia SET polyline='LINESTRING(-56.24213576316834 -34.87111126177625,-56.22702956199647 -34.85873650534999,-56.22426152220931 -34.86014068248701, -56.22278630733491 -34.85852961829136)' WHERE idambulancia=2;
UPDATE ambulancia SET polyline='LINESTRING(-56.16814613290445 -34.86387770150706,-56.14798869377481 -34.87931822276983,-56.15241050720215 -34.88197497259426, -56.15324199199677 -34.88114765505775)' WHERE idambulancia=3;


--*-*-*-*-*-*-*-*-*- HOSPITAL_AMBULANCIA -*-*-*-*-*-*-*-*-*--
INSERT INTO hospital_ambulancia(hospital_idhospital, ambulancia_idambulancia) VALUES (1, 1);
INSERT INTO hospital_ambulancia(hospital_idhospital, ambulancia_idambulancia) VALUES (2, 2);
INSERT INTO hospital_ambulancia(hospital_idhospital, ambulancia_idambulancia) VALUES (3, 3);

--*-*-*-*-*-*-*-*- INSERT HOSPITAL SERVICIO EMERGENCIA -*-*-*-*-*-*-*-*--
INSERT INTO hospital_servicioemergencia(hospital_idhospital,  servicioemergencia_idservicio) VALUES (1, 1);
INSERT INTO hospital_servicioemergencia(hospital_idhospital,  servicioemergencia_idservicio)VALUES (2, 2);
INSERT INTO hospital_servicioemergencia(hospital_idhospital,  servicioemergencia_idservicio)VALUES (2, 3);
INSERT INTO hospital_servicioemergencia(hospital_idhospital,  servicioemergencia_idservicio)VALUES (2,6);


--*-*-*-*-*-*-*-*-*-*-*- VISTA -*-*-*-*-*-*-*-*-*-*-*--

  -- vista_se_h  // HOSPITAL + SERVICIO DE EMERGENCIA
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


--  vista_a_rec // AMBULANCIA + HOSPITAL
CREATE OR REPLACE VIEW public.vista_a_rec AS
SELECT a.idambulancia, a.distanciamaxdesvio, a.idcodigo, a.polyline, h.idhospital, h.nombrehospital
FROM ambulancia a 
JOIN hospital h ON a.hospital_idhospital = h.idhospital;


-- vista_buff_cobertura_user // buffer_zona_cobertura / idambulancia / hospital_idhospital / first_point_recorrido /  point_se
CREATE OR REPLACE VIEW public.vista_buff_cobertura_user AS
SELECT DISTINCT a.idambulancia, g.hospital_idhospital, st_buffer(a.polyline, (a.distanciamaxdesvio * 0.000941090001733132 / 100)) AS buffer_zona_cobertura, 
st_pointn(a.polyline, 1) AS first_point_recorrido, g.point AS point_se 
FROM servicioemergencia g,ambulancia a 
WHERE a.hospital_idhospital = g.hospital_idhospital;

--  Primer punto linestring polyline (recorrido)
SELECT ST_PointN(polyline, 1) AS punto FROM ambulancia;

SELECT a.point_se
FROM vista_buff_cobertura_user a
WHERE ST_Intersects(ST_SetSRID('POLYGON((-56.0 -37.0, -58.0 -35.0, -56.0 -32.0, -56.0 -32.0, -56.0 -37.0))'::geometry, 32721),ST_SetSRID(a.point_se::geometry,32721));




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













INSERT INTO ambulancia("idambulancia","distanciamaxdesvio","idcodigo","hospital_idhospital","polyline")VALUES(4, 120, 25, 2, null);
INSERT INTO ambulancia("idambulancia","distanciamaxdesvio","idcodigo","hospital_idhospital","polyline")VALUES(5,300,30,2,null);
INSERT INTO ambulancia("idambulancia","distanciamaxdesvio","idcodigo","hospital_idhospital","polyline")VALUES(6,250,35,3,null);

UPDATE ambulancia SET polyline='LINESTRING(-56.198608875274665 -34.90644748064126,-56.193619966506965 -34.90606914064883,-56.192906498909 -34.912747025259556, -56.19525611400605 -34.91206518447018)' WHERE idambulancia=4;


UPDATE ambulancia SET polyline='LINESTRING(-56.164666414206295 -34.89814433959129,-56.16328418254853 -34.71090384260483,-56.171126961708076 -34.70824237220117)' WHERE idambulancia=5;
UPDATE ambulancia SET polyline='LINESTRING(-56.897106838226325 -34.84093351099642,-56.19352877140046 -34.837367166344926,-56.170676350593574 -34.81493528019694)' WHERE idambulancia=6;

--*-*-*-*-*-*-*-*-*- TABLA SERVICIO EMERGENCIA -*-*-*-*-*-*-*-*-*--