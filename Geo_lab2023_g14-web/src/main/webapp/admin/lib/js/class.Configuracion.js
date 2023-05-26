class Configuracion {
    urlOpenStreet;
    urlGoogle;
    puertoGeoServer;
    baseDatos;

    constructor() {
        this.urlOpenStreet = 'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png';
        this.urlGoogle = 'https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}';
        this.puertoGeoServer = 8081;
        this.baseDatos = 'Geo_lab2023_g14PersistenceUnit';
    }
}