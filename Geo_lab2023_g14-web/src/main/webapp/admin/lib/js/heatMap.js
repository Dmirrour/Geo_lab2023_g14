// Función para crear la capa de mapa de calor
function createHeatMapLayer() {
    $.ajax({
        url: 'http://localhost:8081/geoserver/wfs',
        data: {
            service: 'WFS',
            request: 'GetFeature',
            typeName: 'Geo_lab2023_g14PersistenceUnit:vista_a_rec',
            srsName: '32721',
            outputFormat: 'application/json'
        },
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
            L.heatLayer(heatLines, {
                radius: 20,
                blur: 15,
                gradient: {
                    0.2: 'blue',
                    0.4: 'cyan',
                    0.6: 'lime',
                    0.8: 'yellow',
                    1.0: 'red'
                }
            }).addTo(map);
        }
    });
}