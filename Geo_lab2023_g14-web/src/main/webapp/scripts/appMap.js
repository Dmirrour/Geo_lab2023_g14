function CargarMapa(){
    var map =new GeoMap();
    var layers = new GeoLayers();
   
    map.CrearMapa('map',[layers.ObtenerLayersBase(), layers.ObtenerLayersSobrepuestos(), layers.ObtenerLayersGeoJSON()],null,16);
    map.CrearControlBarra();
    map.CrearControlBarraDibujo();
    map.CrearBarraBusquedaGeoJson(layers.vectorGeoJson);
}