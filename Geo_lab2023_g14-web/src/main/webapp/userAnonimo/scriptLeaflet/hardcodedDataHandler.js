function hardcodedDataPoint() {

    ///////////////////////// ADD GEOMETRY /////////////////////////
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
        },
            // Agrega más puntos
        ]
    };
    //  L.geoJSON(puntos2).addTo(map);

    /////////////////// ICON ///////////////////
    var miIcono = L.icon({
        iconUrl: '../resources/marker-icons/mapbox-marker-icon-purple.svg',
        iconSize: [64, 64],
    });

    /////////////////////// MARKER ///////////////////////
    L.geoJSON(puntos2, {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, { icon: miIcono });
        }
    }).addTo(map);

    //////////////////// MARKER //////////////////// descomentar addto(map) para visualizar
    marcador = L.marker([-34.8797018070320851, -56.262557241497211]).addTo(map) // Icono del marcador
    marcador.bindPopup("Mi ubicación")

    //////////////////// CIRCLE //////////////////// descomentar addto(map) para visualizar
    circulo = L.circle([-34.8797018070320851, -56.262557241497211], { // Circulo zona personalizado
        radius: 1700,
        color: "green"
    }).addTo(map)
    circulo.bindPopup("Circulo")
}


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