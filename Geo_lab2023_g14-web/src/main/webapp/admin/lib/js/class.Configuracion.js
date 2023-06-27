class Configuracion {
    urlOpenStreet;
    urlGoogle;
    puertoGeoServer;
    baseDatos;
    srid;
    rutas;
    ejes;
    deptos;
    colors;
    // vistas
    vista_SEH;
    vista_LineString;
    vista_buf;
    vista_bufNoIntersec;

    constructor() {
        this.urlOpenStreet = 'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png';
        this.urlGoogle = 'https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}';
        this.puertoGeoServer = 8081;
        this.baseDatos = 'Geo_lab2023_g14PersistenceUnit';
        this.srid = 'EPSG:32721';
        this.rutas = 'ft_00cam_dig';
        this.ejes = 'ft01_ejes';
        this.deptos = 'ft_00departamento';
        this.vista_SEH = 'vista_se_h';
        this.vista_LineString = 'vista_a_rec';
        this.vista_buf = 'vista_buf';
        this.vista_bufNoIntersec = 'vista_buffer_no_intersect';
    }
}