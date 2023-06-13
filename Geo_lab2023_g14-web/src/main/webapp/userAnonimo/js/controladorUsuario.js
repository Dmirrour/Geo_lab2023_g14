/////////////////// SELECCIONAR HOSPITAL ////////////////////
function wfsSelectHospitales() {
    console.log("wfsSelectHospitales");
    let hospitalesItems = [];
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
                var item = features[i].properties;
                var idH = i + 1;
                hospitalesItems.push({ label: item.nombrehospital, value: idH });
            }
            let t = hospitalesItems.length + 1;
            hospitalesItems.push({ label: "↪ Mostrar Todo", value: t });
            defaultValue = hospitalesItems[0];
            var defaultValue = hospitalesItems[0].label;
            L.control.select({
                position: "topleft",
                selectedDefault: defaultValue,
                items: hospitalesItems,
                onSelect: function (newItemValue) {
                    if (newItemValue == t) {
                        console.log("Mostrar todo");
                        initLayers();
                    } else {
                        removerLayer();
                        wfsBuscarServicioEmergencia(newItemValue);
                        wfsBuscarAmbulancia(newItemValue);
                    }
                },
            }).addTo(map);
        })
        .catch(function (error) {
            console.error('Error:', error);
        });
}


/////////////////// FILTRAR SERVICIO EMERGENCIA ///////////////////
let existeLayer = false;
let wfs;
function wfsBuscarServicioEmergencia(newItemValue) {
    if (existeLayer) {
        existeLayer = false;
        map.removeLayer(wfs);
    }
    wfs = L.Geoserver.wfs("http://localhost:8081/geoserver/wfs?", {
        layers: `Geo_lab2023_g14PersistenceUnit:vista_se_h`,
        CQL_FILTER: "idhospital='" + newItemValue + "'",
        onEachFeature: function (f, l) {
            let popupContent =
                '<div class="popup-content">' +
                '<h5><b>' + f.properties.nombre + '</b></h5>' +
                '<em>Camas libres: </em><b>' + f.properties.camaslibres + '</b></br>' +
                '<em>Total de camas: </em><b>' + f.properties.totalcama + '</b></br>' +
                '<em>Hospital Nombre: </em><b>' + f.properties.nombrehospital + '</b></br>' +
                '<em>Hospital Tipo: </em><b>' + f.properties.tipohospital + '</b></br>' + '</div>';
            //   l.closePopup();
            l.bindPopup(popupContent, null).openPopup();
        },
        pointToLayer: function (feature, latlng) {
            let idh = feature.properties.idhospital * 20;
            let markerColor = generarColor(idh) || 'blue';
            return L.circleMarker(latlng, {
                radius: 8,
                fillColor: markerColor,
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        }
    })
    wfs.addTo(map);
    existeLayer = true;
}

/////////////////// FILTRAR AMBULANCIA ///////////////////
function wfsBuscarAmbulancia(newItemValue) {
    let filtro = "hospital_idhospital='" + newItemValue + "'";
    let url =
        'http://localhost:8081/geoserver/wfs?' +
        'service=WFS&' +
        'request=GetFeature&' +
        'typeName=Geo_lab2023_g14PersistenceUnit:ambulancia&' +
        'srsName=EPSG:32721&' +
        'CQL_FILTER=' + filtro + '&' +
        'outputFormat=application/json';
    geojsonLayer = L.geoJSON(null, {
        pointToLayer: function (feature, latlng) {
            let idh = feature.properties.idhospital * 20;
            let markerColor = generarColor(idh) || 'blue';
            return L.circleMarker(latlng, {
                radius: 8,
                fillColor: markerColor,
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        }
    }).addTo(map);
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            geojsonLayer.addData(data);
            geojsonLayer.options.layerName = layerName;
        })
        .catch(function (error) {
            console.error('Error:', error);
        });
}








/////////////////////////////   ARRIBA TODO OK



// let existeLayer2 = false;
// let wfs2;
function wfsBuscarAmbulancia2(newItemValue) {

    if (existeLayer2) {
        existeLayer2 = false;
        map.removeLayer(wfs2);
    }
    wfs2 = L.Geoserver.wfs("http://localhost:8081/geoserver/wfs?", {
        layers: `Geo_lab2023_g14PersistenceUnit:ambulancia`,
        CQL_FILTER: "hospital_idhospital='" + newItemValue + "'",
        //  onEachFeature: function (f, l) {
        //  let popupContent =
        //   '<div class="popup-content">' +
        //  '<h5><b>' + f.properties.idhospital + '</b></h5>' +
        // '<em>Camas libres: </em><b>' + f.properties.camaslibres + '</b></br>' +
        // '<em>Total de camas: </em><b>' + f.properties.totalcama + '</b></br>' +
        // '<em>Hospital Nombre: </em><b>' + f.properties.nombrehospital + '</b></br>' +
        // '<em>Hospital Tipo: </em><b>' + f.properties.tipohospital + '</b></br>' + 
        // '</div>';
        //  l.closePopup();
        //  l.bindPopup(popupContent, null).openPopup();
        // },
        pointToLayer: function (feature, latlng) {
            let idh = feature.properties.idhospital * 20;
            let markerColor = generarColor(idh) || 'blue';
            return L.circleMarker(latlng, {
                radius: 8,
                fillColor: markerColor,
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        }
    })
    wfs2.addTo(map);
    existeLayer2 = true;
}


//// POINT AMBULANCIA ////
// var iconAmbulancia = L.icon({
//     iconUrl: 'resources/marker-icons/ambulance.svg',
//     iconSize: [36, 36],
// });
// var fijarAmbulancia = {
//     type: 'FeatureCollection',
//     features: [{
//         type: 'Feature',
//         properties: {},
//         geometry: {
//             type: 'Point',
//             coordinates: [ambLat, ambLon]
//         }
//     },
//     ]
// };

// L.geoJSON(fijarAmbulancia, {
//     pointToLayer: function (Feature, latlng) {
//         return L.marker(latlng, {
//             icon: iconAmbulancia
//         });
//     }
// }).addTo(map);



/////////////////// WFS  ///////////////////
function wfscql() {
    var geojsonLayer = L.geoJSON().addTo(map);
    let urls =
        'http://localhost:8081/geoserver/wfs?' +
        'service=WFS&' +
        'request=GetFeature&' +
        'typeName=Geo_lab2023_g14PersistenceUnit:servicioemergencia&' +
        'srsName=EPSG:32721&' +
        'CQL_FILTER=DWITHIN(point, POINT(-56.18581498973073 -34.86255776861203), 5000000000, meters)&' +
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
        iconUrl: 'resources/marker-icons/ambulance.svg',
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

/////////////////// WFS AMBULANCIA ///////////////////
function wfsAmbulancia() {  ///OKKKKKKKKKKKKKKKKKKKKK
    var geojsonLayer = L.geoJSON().addTo(map);
    let urls =
        'http://localhost:8081/geoserver/wfs?' +
        'service=WFS&' +
        'request=GetFeature&' +
        'typeName=Geo_lab2023_g14PersistenceUnit:ambulancia&' +
        'srsName=EPSG:32721&' +
        'CQL_FILTER=DWITHIN(polyline, POINT(-56.18581498973073 -34.86255776861203), 0.05, feet)&' +
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
    // var iconAmbulancia = L.icon({
    //     iconUrl: '../resources/marker-icons/ambulance.svg',
    //     iconSize: [36, 36],
    // });
    // var fijarAmbulancia = {
    //     type: 'FeatureCollection',
    //     features: [{
    //         type: 'Feature',
    //         properties: {},
    //         geometry: {
    //             type: 'Point',
    //             coordinates: [ambLat, ambLon]
    //         }
    //     },
    //     ]
    // };
    // L.geoJSON(fijarAmbulancia, {
    //     pointToLayer: function (feature, latlng) {
    //         return L.marker(latlng, {
    //             icon: iconAmbulancia
    //         });
    //     }
    // }).addTo(map);
}

////////////////// TODOS LOS SERVICIOS DE EMERGENCIA //////////////////
function wfsServicioEmergencia() {
    var newItemValue = 1;
    var geojsonLayer = L.geoJSON().addTo(map); // Crear una capa de GeoJSON
    var url =
        'http://localhost:8081/geoserver/wfs?' +
        'service=WFS&' +
        'request=GetPropertyValue&' +
        'typeName=Geo_lab2023_g14PersistenceUnit:servicioemergencia&' +
        'version=1.1.0&' +
        'srsName=EPSG:32721&';
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
                    //  dibujaLinea(e.latlng.lng, e.latlng.lat); // AGREGAR LINESTRING
                    layer.closePopup();
                    layer.bindPopup(popupContent, popupOptions);
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
// Elimina el marcador del mapa
function BorrarMarcadorALtaSE() {
    console.log("borrando marcador");
    this.map.removeLayer(this.markerSE);
}

function wfsAllLayers() {
    var exi = true;
    let hospitalesItems = [];
    let defaultValue = null;

    let geojsonLayer = L.geoJSON(null, {
        pointToLayer: function (feature, latlng) {
            let idh = feature.properties.idhospital;
            let colors = [
                'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'cyan', 'magenta', 'lime', 'pink',
                'teal', 'maroon', 'navy', 'olive', 'silver', 'aqua', 'fuchsia', 'gray', 'black', 'white'
            ];
            let markerColor = colors[idh - 1] || 'blue'

            return L.circleMarker(latlng, {
                radius: 8,
                fillColor: markerColor,
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        }
    }).addTo(this.map); // Crear una capa de GeoJSON
    // Crear capa de grupo para las capas WFS
    var wfsGroup = L.layerGroup().addTo(map);
    let url =
        'http://localhost:8081/geoserver/wfs?' +
        'service=WFS&' +
        'request=GetFeature&' +
        'typeName=Geo_lab2023_g14PersistenceUnit:vista_se_h&' +
        'srsName=EPSG:32721&' +
        'outputFormat=application/json';
    let url2 =
        'http://localhost:8081/geoserver/wfs?' +
        'service=WFS&' +
        'request=GetFeature&' +
        'typeName=Geo_lab2023_g14PersistenceUnit:ambulancia&' +
        'srsName=EPSG:32721&' +
        'outputFormat=application/json';

    // Función para cargar y mostrar una capa WFS
    function loadWFS(url, layerName) {
        fetch(url)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                var geojsonLayer = L.geoJSON(data, {
                    onEachFeature: function (feature, layer) {
                        // Personalizar la interacción con cada elemento de la capa
                        layer.bindPopup('<pre>' + JSON.stringify(feature.properties, null, ' ') + '</pre>');
                    }
                });
                wfsGroup.addLayer(geojsonLayer);
            })
            .catch(function (error) {
                console.error('Error:', error);
            });
    }
    // Cargar y mostrar las capas WFS
    loadWFS(url, 'Capa 1');
    loadWFS(url2, 'Capa 2');
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
