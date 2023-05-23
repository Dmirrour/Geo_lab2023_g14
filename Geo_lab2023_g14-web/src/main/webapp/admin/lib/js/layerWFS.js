
function addLayersWFS() {
    var geojsonLayer = L.geoJSON().addTo(map); // Crear una capa de GeoJSON
    var url =
        'http://localhost:8081/geoserver/wfs?' +
        'service=WFS&' +
        // 'version=1.1.0&' +
        'request=GetFeature&' +
        'typeName=Geo_lab2023_g14PersistenceUnit:servicioemergencia&' +
        'srsName=EPSG:32721&' +
        'outputFormat=application/json';

    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            geojsonLayer.addData(data);      // Agregar los datos a la capa de GeoJSON
        })
        .catch(function (error) {
            console.error('Error:', error);
        });

    // var geojsonLayer = L.geoJSON().addTo(map); // Crear una capa de GeoJSON
    var url =
        'http://localhost:8081/geoserver/wfs?' +
        'service=WFS&' +
        // 'version=1.1.0&' +
        'request=GetFeature&' +
        'typeName=Geo_lab2023_g14PersistenceUnit:ft_depto&' +
        'srsName=EPSG:4326&' +
        'outputFormat=application/json';

    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            geojsonLayer.addData(data);      // Agregar los datos a la capa de GeoJSON
        })
        .catch(function (error) {
            console.error('Error:', error);
        });

}

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


///// OK
// var url = 'http://localhost:8081/geoserver/topp/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=topp:tasmania_state_boundaries&maxFeatures=50&outputFormat=application%2Fjson';
// var url =
//     'http://localhost:8081/geoserver/wfs?' +
//     'service=WFS&' +
//     'version=1.0.0&' +
//     'request=GetFeature&' +
//     'typeName=topp:tasmania_state_boundaries&' +
//     'srsName=EPSG:4326&' +
//     'outputFormat=application/json';
///// OK


// http://localhost:8081/geoserver/Geo_lab2023_g14PersistenceUnit/ows?
// service=WFS
// version=1.0.0
// request=GetFeature
// typeName=Geo_lab2023_g14PersistenceUnit:ft00_cam_dig
// Format=application/json
//http://localhost:8081/geoserver/Geo_lab2023_g14PersistenceUnit/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Geo_lab2023_g14PersistenceUnit%3Aservicioemergencia&maxFeatures=50&outputFormat=application%2Fjson
// http://localhost:8081/geoserver/topp/ows?
// service=WFS&
// version=1.0.0
// &request=GetFeature&
// typeName=topp:tasmania_water_bodies
//typeName = topp:tasmania_state_boundaries
// &maxFeatures=50&output
// Format=application%2Fjson
// Ver ejemplo en pestaña nueva.
// Ahora modificamos los datos del ejemplo para añadir una capa de nuestro servidor GeoServer:
// var map = L.map('map').setView([0, 0], 2);
// var geojsonLayer = L.geoJSON().addTo(map); // Crear una capa de GeoJSON
// var boundaries = new L.WFS({
//     url: 'http://localhost:8081/geoserver/wfs?',
//     typeNS: 'Geo_lab2023_g14PersistenceUnit',
//     typeName: 'countries',
//     crs: L.CRS.EPSG4326,
//     style: {
//         'color': "#e12a2a",
//         'fill': false,
//         'dashArray': "5, 5",
//         'weight': 2,
//         'opacity': 0.6
//     }
// }, new L.Format.GeoJSON({ crs: L.CRS.EPSG4326 }))
//     .addTo(map);
// A GeoJSON FeatureCollection:
// $.ajax('http://localhost:8081/geoserver/wfs?', {
//Geoserver Web Feature Service
// $.ajax('http://localhost:8080/geoserver/wfs', {
//     type: 'GET',
//     data: {
//         service: 'WFS',
//         version: '1.1.0',
//         request: 'GetFeature',
//         typename: 'workspace:layer_name',
//         srsname: 'EPSG:4326',
//         outputFormat: 'text/javascript',
//     },
//     dataType: 'jsonp',
//     jsonpCallback: 'callback:handleJson',
//     jsonp: 'format_options'
// });

// // the ajax callback function
// function handleJson(data) {
//     selectedArea = L.geoJson(data).addTo(map);
//     map.fitBounds(selectedArea.getBounds());
// }
// var map = L.map('map').setView([0, 0], 2);   // Ejemplo básico de visualización un servicio WFS en Leaflet

// var boundaries = new L.WFS({
//     url: 'http://localhost:8081/geoserver/topp/ows?',
//     typeNS: 'topp',
//     typeName: 'tasmania_state_boundaries',
//     crs: L.CRS.EPSG326,
//     style: {
//         color: 'blue',
//         weight: 2
//     }
// }).addTo(map)
//     .on('load', function () {
//         map.fitBounds(boundaries);
//     })