function heatMap(data){
    let points = [];    // array para almacenar los puntos iniciales de cada recorrido

    // Iterar sobre los datos de recorrido
    data.features.forEach(function(feature) {
        let coordinates = feature.geometry.coordinates[0];// Obtener las coordenadas del punto inicial de cada recorrido
        let point = L.latLng(coordinates[1], coordinates[0]); //latitud-longitud
        points.push(point);
    });

    // Crear una capa de mapa de calor en base a los puntos
    var heatLayer = L.heatLayer(points, { radius: 20 }).addTo(map); // Ajusta el radio según tus necesidades

    map.fitBounds(heatLayer.getBounds());
}