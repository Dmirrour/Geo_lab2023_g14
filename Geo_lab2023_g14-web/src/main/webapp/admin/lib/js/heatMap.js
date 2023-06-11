// Función para crear la capa de mapa de calor
function createHeatMapLayer(data) {
    // Realizar la solicitud AJAX para obtener los datos de la capa de LineString desde GeoServer
    ({
        success: function(response) {
            // Crear un conjunto de coordenadas para las líneas
            var heatLines = [];

            // Recorrer los datos de respuesta y extraer las coordenadas de cada línea
            response.features.forEach(function(feature) {
                var coordinates = feature.geometry.coordinates;

                // Convertir cada línea en una serie de puntos
                var latLngs = coordinates.map(function(coord) {
                    return [coord[1], coord[0]];
                });

                // Agregar la serie de puntos al conjunto de coordenadas de las líneas
                heatLines.push(latLngs);
            });

            // Renderizar el mapa de calor utilizando Leaflet.heat
            var heatLayer = L.heatLayer(heatLines, {
                radius: 20,
                blur: 15,
                gradient: {
                    0.2: 'blue',
                    0.4: 'cyan',
                    0.6: 'lime',
                    0.8: 'yellow',
                    1.0: 'red'
                }
            });

            // Agregar la capa de mapa de calor al mapa Leaflet
            heatLayer.addTo(map);
        },
        error: function(xhr, status, error) {
            console.error(error);
        }
    });
}
