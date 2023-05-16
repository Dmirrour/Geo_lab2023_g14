function CargarMapa() {
    var map = new GeoMap();
    var layers = new GeoLayers();

    map.CrearMapa('map', [layers.ObtenerLayersBase(), layers.ObtenerLayersSobrepuestos(), layers.ObtenerLayersPruebas(), layers.ObtenerLayersGeoJSON()], null, 15);
    map.CrearControlBarra();
    map.CrearControlBarraDibujo();
    map.CrearBarraBusquedaGeoJson(layers.vectorGeoJson);
   // layers.ObtenerLayersPruebas.name;
   // console.log("asd", layers.ObtenerLayersPruebas.name)
    
}