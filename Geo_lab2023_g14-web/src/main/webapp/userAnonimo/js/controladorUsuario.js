
/////////////////// SELECCIONAR HOSPITAL ////////////////////
function wfsSelectHospitales() {

    let hospitalesItems = [];
    let defaultValue = null;
    let urlHospi =
        'http://localhost:8081/geoserver/wfs?' +
        'service=WFS&' +
        'request=GetFeature&' +
        'typeName=Geo_lab2023_g14PersistenceUnit:hospital&' +
        'srsName=EPSG:32721&' +
        'outputFormat=application/json';

    fetch(urlHospi)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            var features = data.features;
            for (var i = 0; i < features.length; i++) {
                var item = features[i].properties.nombrehospital;
                hospitalesItems.push({ label: item, value: item });
            }
            defaultValue = hospitalesItems[0];

            var defaultValue = hospitalesItems[0].label;
            L.control.select({
                position: "topleft",
                selectedDefault: defaultValue,
                items: hospitalesItems,
                onSelect: function (newItemValue) {
                    //   drawMarker(newItemValue);

                    wfsBuscarServicioEmergencia(newItemValue);
                },
            }).addTo(map);
        })
        .catch(function (error) {
            console.error('Error:', error);
        });
}


///////////////////// WFS SERVICIO EMERGENCIA /////////////////////
function wfsServicioEmergencia() {
    var geojsonLayer = L.geoJSON().addTo(map); // Crear una capa de GeoJSON
    var url =
        'http://localhost:8081/geoserver/wfs?' +
        'service=WFS&' +
        'request=GetFeature&' +
        'typeName=Geo_lab2023_g14PersistenceUnit:servicioemergencia&' +
        'srsName=EPSG:32721&' +
        'outputFormat=application/json';
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            geojsonLayer.addData(data); // Agregar los datos a la capa de GeoJSON
            console.log(data) // Obtener datos json. Muestra estructura de datos
            geojsonLayer.eachLayer(function (layer) {
                layer.on('click', function (e) {
                    let properties = e.target.feature.properties;
                    let popupContent = '<div class="popup-content">' + properties.nombre + '</div>';
                    let popupOptions = {
                        className: 'custom-popup'
                    };
                    layer.closePopup();
                    layer.bindPopup(popupContent, popupOptions);

                    dibujaLinea(e.latlng.lng, e.latlng.lat); // AGREGAR LINESTRING
                })
            })
        })
        .catch(function (error) {
            console.error('Error:', error);
        });
}


///////////// RECORRIDO AMBULANCIA->USER->SERVICIOE //////////////
let userLat = -56.185222811229534;
let userLon = -34.8503303549236;
let ambLat = -56.18869543075562;
let ambLon = -34.871260000672475;
// let ambLat = -56.19249343872071;
// let ambLon = -34.8657268109403;
let existe = false;
let geoJSONLayer;
function dibujaLinea(latitud, longitud) {
    if (existe) {
        map.removeLayer(geoJSONLayer);
        existe = false;
    } else {
        var lineString = {       // Crear una capa GeoJSON con un LineString
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [latitud, longitud],  // Servicio emergencia (coordenadas)
                    [userLat, userLon],    // Ubicacion usuario
                    [ambLat, ambLon]  // Ubicacion ambulancia
                ]
            },
            "properties": {
                "name": "Mi LineString"
            }
        };
        geoJSONLayer = L.geoJSON(lineString).addTo(map);
        existe = true;
    }
}


/////////////////// WFS AMBULANCIA ///////////////////
function wfsAmbulancia() {
    var geojsonLayer = L.geoJSON().addTo(map);
    let urls =
        'http://localhost:8081/geoserver/wfs?' +
        'service=WFS&' +
        'request=GetFeature&' +
        'typeName=Geo_lab2023_g14PersistenceUnit:ambulancia&' +
        'srsName=EPSG:32721&' +
        'outputFormat=application/json';
    fetch(urls)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            geojsonLayer.addData(data);
            console.log(data)
            geojsonLayer.eachLayer(function (layer) {  // Evento clic marcadores
                layer.on('click', function (e) {
                    let properties = e.target.feature.properties;
                    let popupContent = '<div class="popup-content">' + properties.idcodigo + '</div>';
                    let popupOptions = {
                        className: 'custom-popup'
                    };
                    layer.closePopup();
                    layer.bindPopup(popupContent, popupOptions);
                    //    layer.bindPopup(popupContent, popupOptions).openPopup();
                })
            })
        })
        .catch(function (error) {
            console.error('Error:', error);
        });

    //// POINT AMBULANCIA ////
    var iconAmbulancia = L.icon({
        iconUrl: '../resources/marker-icons/ambulance.svg',
        iconSize: [36, 36],
    });
    var fijarAmbulancia = {
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'Point',
                coordinates: [ambLat, ambLon]
            }
        },
        ]
    };
    L.geoJSON(fijarAmbulancia, {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
                icon: iconAmbulancia
            });
        }
    }).addTo(map);
}


/////////////////// WFS LIST SERVICIO EMRGENCIA ///////////////////
function wfsBuscarServicioEmergencia(newItemValue) {

    console.log("wfsBuscarServicioEmergencia" + newItemValue);
    var strHospital = newItemValue;
    var wfs = L.Geoserver.wfs("http://localhost:8081/geoserver/wfs?", {
        layers: `Geo_lab2023_g14PersistenceUnit:vista_se_h`,
        style: {
            color: "red",
            fillOpacity: 0.5,
            opacity: 1,
            stockWidth: 1
        },
        onEachFeature: function (f, l) {
            l.bindPopup('<pre>' + JSON.stringify(f.properties.nombre, null, ' ').replace(/[\{\}"]/, '') + '</pre>');
        },
        CQL_FILTER: "nombrehospital=" + newItemValue + "",
    });
    wfs.addTo(map);
}


/////////////////// WFS LIST AMBULANCIA ///////////////////
function wfsBuscarAmbulancia() {
    let strHospital = 1;
    var wfs = L.Geoserver.wfs("http://localhost:8081/geoserver/wfs?", {
        layers: `Geo_lab2023_g14PersistenceUnit:ambulancia`,
        style: {
            color: "red",
            fillOpacity: 0.5,
            opacity: 1,
            stockWidth: 1
        },
        onEachFeature: function (f, l) {
            l.bindPopup('<pre>' + JSON.stringify(f.properties.nombre, null, ' ').replace(/[\{\}"]/, '') + '</pre>');
        },
        CQL_FILTER: "hospital_idhospital =" + strHospital + "",
    });
    wfs.addTo(map);
}


// Elimina el marcador del mapa
function BorrarMarcadorALtaSE() {
    console.log("borrando marcador");
    this.map.removeLayer(this.markerSE);
}

/*
let bufferedLayer = L.geoJSON(turf.buffer(data, 100, { units: 'meters' }), {
    style: {
      color: 'red',
      weight:50,
      opacity: 0.7
    }
 });
    
*/
