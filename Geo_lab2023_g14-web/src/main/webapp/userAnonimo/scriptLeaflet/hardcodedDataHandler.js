function hardcodedDataPoint() {

    ///////////////////////// ADD GEOMETRY /////////////////////////
    var lineStr = {
        "type": "FeatureCollection",
        "features": [
            {
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
            }]
    }
    // L.geoJSON(lineStr).addTo(map);


    /// POLIGONO
    var polygon = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [[-56.12345 - 34.56789],
                        [-56.23456 - 34.67890],
                        [-56.34567 - 34.78901],
                        [-56.45678 - 34.89012],
                        [-56.12345 - 34.56789]]
                    ]
                },
                "properties": {
                    "prop0": "value0",
                    "prop1": {
                        "this": "that"
                    }
                }
            }
        ]
    }
    L.geoJSON(polygon).addTo(map);

    ///////////////////////// ADD POINT 2 /////////////////////////
    var puntos2 = {
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'Point',
                coordinates: [-64.5, -34.1] // Coordenadas según sus puntos
            }
        },  // Agrega más puntos
        ]
    };
    // L.geoJSON(puntos2).addTo(map);


    /////////////////// ICON ///////////////////
    var iconAnonimo = L.icon({
        iconUrl: 'resources/marker-icons/mapbox-marker-icon-blue.svg',
        iconSize: [56, 56],
    });
    var iconAmbulancia = L.icon({
        iconUrl: 'resources/marker-icons/ambulance.svg',
        iconSize: [28, 28],
    });

    //////////////////// MARKER ////////////////////
    L.geoJSON(puntos2, {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
                icon: iconAmbulancia
            });
        }
    })//.addTo(map);

    //////////////////// MARKER ////////////////////
    // marcador = L.marker([-34.8797018070320851, -56.262557241497211], {
    marcador = L.marker([-34.8503303549236, -56.185222811229534], {
        icon: iconAnonimo
    })//.addTo(map)
    marcador.bindPopup("Usuario Anonimo")


    /////////////////// CIRCLE /////////////////// addto(map) para visualizar
    circulo = L.circle([-34.8503303549236, -56.185222811229534], { // Circulo zona personalizado
        radius: 1300,
         color: "green"
    })///.addTo(map)
    //circulo.bindPopup("Circulo")
}



    // var polygons = turf.polygon([[
    //     [126, -28],
    //     [140, -28],
    //     [140, -20],
    //     [126, -20],
    //     [126, -28]
    // ]], {
    //     "fill": "#00F",
    //     "fill-opacity": 0.1
    // });
    
///////////////////////// EJEMPLO OBJETO GEOJSON FEATURECOLLECTION /////////////////////////
// {
//     "type": "FeatureCollection",
//     "features": [{
//         "type": "Feature",
//         "geometry": {
//           "type": "Point",
//           "coordinates": [longitude, latitude]
//         },
//         "properties": {
//           "name": "Location A"
//         }
//       },
//       {
//         "type": "Feature",
//         "geometry": {
//           "type": "Point",
//           "coordinates": [longitude, latitude]
//         },
//         "properties": {
//           "name": "Location B"
//         }
//       }
//     ]
//   }

///////////////////////// CIRCLEMAKER /////////////////////////
// L.geoJSON(puntos2, {
//     pointToLayer: function (feature, latlng) {
//         return L.circleMarker(latlng, {
//             radius: 20,
//             fillColor: 'rgba(9,200,121,19)',
//             color: '#0e4400',
//             weight: 2,
//             icon: miIcono,
//             // opacity: 50,
//             fillOpacity: 0.8
//         });
//     }
// }).addTo(map);


// iconAnchor: [16, 32], // Anclaje segun su marcador // icon
// popupAnchor: [0, -32] // Anclaje segun si marcador // popup