class Configuracion {
    urlOpenStreet;
    urlGoogle;
    puertoGeoServer;
    baseDatos;

    constructor() {
        this.urlOpenStreet = 'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png';
        this.urlGoogle = 'https://mt1.googles.com/vt/lyrs=r&x={x}&y={y}&z={z}';
        this.puertoGeoServer = 8088;
        this.baseDatos = 'Geo_lab2023_g14PersistenceUnit';
    }
}