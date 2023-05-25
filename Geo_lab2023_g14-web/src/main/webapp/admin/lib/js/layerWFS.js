function addLayers() {
    var puntos = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [-56.0, 0.0],
                    [-57.0, 1.0],
                    [-58.0, 0.0],
                    [-61.0, 1.0]
                ]
            },
            "properties": {
                "prop0": "value0",
                "prop1": 0.0
            }
        }, {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [[-66.0, -20.0],
                    [-67.0, -20.0],
                    [-67.0, -21.0],
                    [-66.0, -21.0],
                    [-66.0, -20.0]]
                ]
            },
            "properties": {
                "prop0": "value0",
                "prop1": {
                    "this": "that"
                }
            }
        }]
    }
    L.geoJSON(puntos).addTo(map);

    // Otro ejemplo
    var puntos2 = {
        type: 'FeatureCollection',
        features: [
            {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'Point',
                    coordinates: [-64.5, -34.1] // Cambia las coordenadas según tus puntos
                }
            },
            // Agrega más puntos según sea necesario
        ]
    };
    L.geoJSON(puntos2).addTo(map);

    L.geoJSON(puntos2, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: 20,
                fillColor: 'rgba(69,255,21,0.34)',
                color: '#0e4400',
                weight: 2,
                opacity: 90,
                fillOpacity: 0.8
            });
        }
    }).addTo(map);
}
