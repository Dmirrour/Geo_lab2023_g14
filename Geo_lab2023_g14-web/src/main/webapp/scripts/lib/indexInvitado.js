function CrearMapaInvitado() {
    var map;

    ///////////////////////// MAPAS /////////////////////////
    var openst = L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        attribution: '© Grupo 14'
    });

    var google = L.tileLayer('https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
        attribution: '© Grupo 14'
    });

    ///////////////////////// CAPAS WMS /////////////////////////
    var layerEjes = L.tileLayer.wms('http://localhost:8081/geoserver/Geo_lab2023_g14PersistenceUnit/wms?', {
        title: 'ft_01_ejes',
        layers: 'Geo_lab2023_g14PersistenceUnit:ft01_ejes',
        srs: 'EPSG:32721',
        format: 'image/png',
        transparent: true,
        VERSION: '1.1.0'
    });

    var layerDepartamento = L.tileLayer.wms('http://localhost:8081/geoserver/Geo_lab2023_g14PersistenceUnit/wms?', {
        title: 'ft_00departamento',
        layers: 'Geo_lab2023_g14PersistenceUnit:ft_00departamento',
        srs: 'EPSG:32721',
        format: 'image/png',
        transparent: true,
        VERSION: '1.1.0'
    });

    var layerRuta = L.tileLayer.wms('http://localhost:8081/Geo_lab2023_g14PersistenceUnit/geoserver/wms?', {
        title: 'vista_a_rec',
        layers: 'Geo_lab2023_g14PersistenceUnit:vista_a_rec',
        srs: 'EPSG:32721',
        format: 'image/png',
        transparent: true,
        version: '1.1.0'
    });

    var layerServicio = L.tileLayer.wms('http://localhost:8081/geoserver/Geo_lab2023_g14PersistenceUnit/wms?', {
        title: 'servicioemergencia',
        layers: 'Geo_lab2023_g14PersistenceUnit:servicioemergencia',
        srs: 'EPSG:32721',
        format: 'image/png',
        transparent: true,
        VERSION: '1.1.0'
    });

    // de anonimoIndex.js
    var layerAmbulancia = L.tileLayer.wms('http://localhost:8081/geoserver/Geo_lab2023_g14PersistenceUnit/wms?', {
        title: 'layerAmbulancia',
        layers: 'Geo_lab2023_g14PersistenceUnit:ambulancia',
        srs: 'EPSG:32721',
        format: 'image/png',
        transparent: true,
        VERSION: '1.1.0'
    });


    ///////////////////////// OPCIONES DE MAPA /////////////////////////
    map = L.map('map', {
        center: [-34.88219465245854, -56.17280777776989],
        zoom: 13,
        minZoom: 3,
        maxZoom: 18,
        layers: [openst],
        zoomControl: true
    });

    let baselayers = {
        "Open Street Map": openst,
        "Google Maps": google
    };

    let overlayers = {
        "Ambulancia": layerAmbulancia,
        "Rutas": layerRuta,
        "Servicio Emergencia": layerServicio,
        "Ejes": layerEjes,
        "Departamentos": layerDepartamento
    };

    L.control.layers(baselayers, overlayers, { collapsed: true, position: 'bottomright' }).addTo(map);

    drawLayers = new L.FeatureGroup(); // Agrupa elementos graficos
    drawControl = new L.Control.DrawPlus({
        position: 'topright',
        draw: {
            circle: false,
            polyline: false
        },
        // edit: {
        //     featureGroup: drawLayers,
        //     edit: false
        // }
    });

    map.addLayer(drawLayers);
    //  map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, function (e) {
        //  console.log("drawLayers: ", e.layer);
        drawLayers.addLayer(e.layer);

    });
    ///////////////////////// FIN OPCIONES DE MAPA /////////////////////////


    ///////////////////////// COORDENAS EVENTO CLICK /////////////////////////
    drawLayers.on('click', function (e) {
        let latitud = e.latlng.lat;
        let longitud = e.latlng.lng;
        //   alert("Click en coordenadas: " + "\n" + "[" + latitud + "] [" + longitud + "]")
        console.log("Click en coordenadas: ")
        console.log("Latitud:", latitud) // .toFixed(2) muestra 2 decimales(no usar para guardar datos en bd)
        console.log("Longitud:", longitud)
    });
    map.on('click', function (e) {
        let latitud = e.latlng.lat;
        let longitud = e.latlng.lng;
        let userLat = -56.185222811229534;
        let userLon = -34.8503303549236;
        // alert("Click en coordenadas: " + "\n" + "[" + latitud + "] [" + longitud + "]")
        // console.log("Latitud:", latitud)//.toFixed(5)) // .toFixed(2) muestra 2 decimales(no usar para guardar datos en bd)
        console.log("Clic coordenadas: " + "\n" + "[" + latitud + "], [" + longitud + "]")
        //  console.log("sssuse" + L.Routing.waypoints.coordsToLatLng);
        // Distancia entre puntos
        let punto1 = { x: userLat, y: userLon };
        let punto2 = { x: longitud, y: latitud };
        console.log("Distancia euclidiana: " + euclideanDistancia(punto1, punto2));
        console.log("Distancia en metros: " + euclideanDistanciaMetros(punto1, punto2));
        // console.log(addObjLatLng(longitud, latitud));
    });

    return map;
}


///////////////////////// GENERA COLOR /////////////////////////
function generarColor(numero) {
    // Calcula los componentes de color
    var rojo = (numero * 17) % 256;   // Rango de 0 a 255
    var verde = (numero * 13) % 256;  // Rango de 0 a 255
    var azul = (numero * 21) % 256;   // Rango de 0 a 255
    // Retorna el color hexadecimal en el formato "#RRGGBB"
    return "#" + rojo.toString(16).padStart(2, '0') +
        verde.toString(16).padStart(2, '0') +
        azul.toString(16).padStart(2, '0');
}


///////////////////////// INITIALIZE LAYERS /////////////////////////
function initLayers(itemValue) {
    let filter = "idhospital='" + itemValue + "'";
    let urlSe =
        'http://localhost:8081/geoserver/wfs?' +
        'service=WFS&' +
        'request=GetFeature&' +
        'typeName=Geo_lab2023_g14PersistenceUnit:vista_se_h&' +
        'srsName=EPSG:32721&' +
        'outputFormat=application/json';

    let filter2 = "hospital_idhospital='" + itemValue + "'";
    let urlAmbu =
        'http://localhost:8081/geoserver/wfs?' +
        'service=WFS&' +
        'request=GetFeature&' +
        'typeName=Geo_lab2023_g14PersistenceUnit:ambulancia&' +
        'srsName=EPSG:32721&' +
        'outputFormat=application/json';

    if (itemValue > 0) {
        urlSe += '&CQL_FILTER=' + filter;
        urlAmbu += '&CQL_FILTER=' + filter2;
    }

    initLayerServicioEm(urlSe, 'layerSE'); // POINT SERVICIO EMERGENCIA
    initLayerLineAmbu(urlAmbu, 'layerAmulancia'); // POLYLINE AMBULANCIA
    initLayerPointAmbu(urlAmbu, 'pointAmulancia'); // POINT AMBULANCIA
}


//////////////////////// SERVICIO EMERGENCIA ///////////////////////
let geojsonLayer;
var coorServicioEmer;
function initLayerServicioEm(urlSe, layerName) {
    // console.log("function initLayerServicioEm");
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
    }).addTo(map); // Crear una capa de GeoJSON, agrega los puntos de SERVICIO EMERGENCIA

    fetch(urlSe)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            geojsonLayer.addData(data);
            //   console.log(data);
            let puntosArray2 = [];
            for (let i = 0; i < data.features.length; i++) {
                laAmb2 = data.features[i].geometry.coordinates[1];
                loAmb2 = data.features[i].geometry.coordinates[0];
                //   console.log(loAmb2+ " 99 " + laAmb2);
                puntosArray2.push({
                    laAmb2,
                    loAmb2
                });
            }

            geojsonLayer.eachLayer(function (layer) {
                layer.on('click', function (e) {
                    let properties = e.target.feature.properties;
                    coorServicioEmer = e.target.feature.geometry.coordinates;
                    //  let coordenadas = e.target.feature.geometry.coordinates;
                    //  console.log(coorServicioEmer);
                    let popupContent =
                        '<div class="popup-content">' +
                        '<h5><b>' + properties.nombre + '</b></h5>' +
                        '<em>Camas libres: </em><b>' + properties.camaslibres + '</b></br>' +
                        '<em>Total de camas: </em><b>' + properties.totalcama + '</b></br>' +
                        '<em>Hospital Nombre: </em><b>' + properties.nombrehospital + '</b></br>' +
                        '<em>Hospital Tipo: </em><b>' + properties.tipohospital + '</b></br>' +
                        '<em>Coordenadas: </em><b>' + coorServicioEmer[0] + " , " + coorServicioEmer[1] + '</b></br>' +
                        '</div>';
                    let popupOptions = {
                        className: 'custom-popup'
                    };
                    layer.closePopup(); // Cerrar el popup anterior si existe
                    layer.bindPopup(popupContent, popupOptions).openPopup();
                })
            });
            geojsonLayer.options.layerName = layerName;
        })
        .catch(function (error) {
            console.error('Error:', error);
        });
}


//////////////////////// LINESTRING AMBULANCIA ///////////////////////
let geojsonLayere;
function initLayerLineAmbu(urlAmbu, layerName) {
    fetch(urlAmbu)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            //  geojsonLayere.addData(data);
            geojsonLayere.options.layerName = layerName; // console.log(laAmb + ' ' + loAmb);
        })
        .catch(function (error) {
            console.error('Error:', error);
        });
    geojsonLayere = L.geoJSON(null, {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
                // icon: iconA
            });
        }
    }).addTo(map);
}


//////////////////////// POINT AMBULANCIA ///////////////////////
// let loAmb;let laAmb; let datosAmd;
let geojsonLayeres;
var marker3;
var recorridoInteractivoa;
function initLayerPointAmbu(urlAmbu, layerNames) {
    fetch(urlAmbu)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            geojsonLayeres = L.geoJSON(data, {
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng, {
                        //   icon: iconA
                    });
                }
            })
            geojsonLayeres.addData(data);

            let puntosArray = [];
            let concatenarPoints2 = "";
            for (let i = 0; i < data.features.length; i++) {
                laAmb = data.features[i].geometry.coordinates[0][0];
                loAmb = data.features[i].geometry.coordinates[0][1];
                datosAmd = data.features[i].properties.idcodigo;
                distancia = data.features[i].properties.distanciamaxdesvio;
                idhospital = data.features[i].properties.hospital_idhospital;
                let largo = 0;
                largo = data.features[i].geometry.coordinates.length;
                concatenarPoints2 = "";
                for (let j = 0; j < largo; j++) {
                    laAmba = data.features[i].geometry.coordinates[j][0];
                    loAmba = data.features[i].geometry.coordinates[j][1];
                    //    console.log("lardo ", largo - 1, j);
                    concatenarPoints2 = '[' + loAmba + ',' + laAmba + '],' + concatenarPoints2;
                    //  console.log(concatenarPoints2);
                }
                for (let j = largo - 1; j >= 0; j--) {
                    laAmba = data.features[i].geometry.coordinates[j][0];
                    loAmba = data.features[i].geometry.coordinates[j][1];
                    //    console.log("lardo ", largo - 1, j);
                    concatenarPoints2 = '[' + loAmba + ',' + laAmba + '],' + concatenarPoints2;
                    //     console.log(concatenarPoints2);
                }

                //   console.log(concatenarPoints2);
                concatenarPoints2 = concatenarPoints2.slice(0, -1); // quitar coma final
                concatenarPoints2 = '[' + concatenarPoints2 + ']';
                var coordPoint3 = JSON.parse(concatenarPoints2);

                var iconA = L.icon({
                    iconUrl: './resources/marker-icons/ambulance.png',
                    iconSize: [22, 22]
                });

                //  coordPoint3[0].push(coordPoint3[0][0]); // Para que la primera y ultima coordenada sean iguales 
                recorridoInteractivoa = coordPoint3;
                marker3 = L.Marker.movingMarker(recorridoInteractivoa,
                    [1500, 1500, 1500, 1500, 1500, 1200, 1500], {
                    autostart: true, loop: true, icon: iconA
                }).addTo(map);

                marker3.loops = 0;
                marker3.on('loop', function (e) {
                    marker3.loops++;
                });
                puntosArray.push({
                    laAmb,
                    loAmb,
                    datosAmd,
                    distancia,
                    idhospital
                });
            }

            // Point Ambulancia
            let puntos = {
                type: 'FeatureCollection',
                features: []
            };

            puntosArray.forEach(function (datos) {
                let feature = {
                    type: 'Feature',
                    properties: {
                        idcodigo: datos.datosAmd,
                        distanciamaxdesvio: datos.distancia,
                        hospital_idhospital: datos.idhospital,
                    },
                    geometry: {
                        type: 'Point',
                        coordinates: [datos.laAmb, datos.loAmb] // coordinates: [-56.1676025390625, -34.88353942127242]
                    }
                };
                puntos.features.push(feature);
            });

            geojsonLayeres = L.geoJSON(puntos, {
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng, {
                        icon: iconA
                    });
                }
            })//.addTo(map);
            geojsonLayeres.addData(puntos);

            geojsonLayeres.eachLayer(function (puntos) {
                puntos.on('click', function (e) {
                    let properties = e.target.feature.properties;
                    let geo = e.target.feature.geometry.coordinates;
                    // console.log(geo);
                    let popupContent =
                        '<div class="popup-content">' +
                        '<h5><b>Codigo ' + properties.idcodigo + '</b></h5>' +
                        '<em>Distancia max. desvio: </em><b>' + properties.distanciamaxdesvio + ' m</b></br>' +
                        '<em>Hospital: </em><b>' + properties.hospital_idhospital + '</b></br>' +
                        //    '<em>Coordenadas: </em><b>' + geo[0] + " , " + geo[1] + '</b></br>' +
                        '</div>';
                    let popupOptions = {
                        className: 'custom-popup'
                    };
                    puntos.closePopup(); // Cerrar el popup anterior si existe
                    puntos.bindPopup(popupContent, popupOptions).openPopup();
                })
            });
            geojsonLayeres.options.layerName = layerNames;
        })
        .catch(function (error) {
            console.error('Error:', error);
        });
}

var iconA = L.icon({
    iconUrl: './resources/marker-icons/ambulance.png',
    iconSize: [22, 22]
});


///////////////////// ZONAS SIN COBERTURA /////////////////////
let geojsonsLayere;
var bufferCoordinates;
var polygons;
let geojsonLayerBuff2;
function zonasSinCobertura() {
    // geojsonLayerBuff2 = L.geoJSON(null, {
    //     style: {
    //         //   color: 'red',
    //         weight: 1,
    //         opacity: 0.4
    //     },
    // })//.addTo(map);
    let urlSinCobertura =
        'http://localhost:8081/geoserver/wfs?' +
        'service=WFS&' +
        'request=GetFeature&' +
        'typeName=Geo_lab2023_g14PersistenceUnit:vista_union_buf&' +
        'srsName=EPSG:32721&' +
        'outputFormat=application/json';
    fetch(urlSinCobertura)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            //      geojsonLayerBuff2.addData(data);
            var features = data.features;
            features.forEach(function (feature) {
                var geometry = feature.geometry;
                bufferCoordinates = geometry.coordinates;
                buffLenght = geometry.coordinates.length;
                polygons = turf.polygon(bufferCoordinates[0], {});
            });
            L.geoJson(polygonMontevideo(), {
                onEachFeature: function (feature, layer) {
                    var poly1 = feature.geometry;
                    L.geoJson(polygons, {
                        onEachFeature: function (feature, layer) {
                            var poly2 = feature.geometry;
                            var intersection = turf.difference(poly1, poly2);
                            for (let i = 0; i < buffLenght; i++) {
                                polygons = turf.polygon(bufferCoordinates[i], {});
                                intersection = turf.difference(intersection, polygons);
                            }
                            //   L.geoJson(intersection).addTo(map);
                            L.geoJSON(intersection, {
                                style: {
                                    color: 'blue',
                                    weight: 1,
                                    opacity: 0.7
                                },
                            }).addTo(map);
                            //  console.log({ poly1, poly2, intersection })
                        }
                    })
                }
            })
            // difference // intersect
        })
        .catch(function (error) {
            console.error('Error:', error);
        });

}






/////////////////////////ARRIBA OK /////////////////////////
function moviendoAmbulancia() {
    control.log("mode ", loAmb);
    var recorridoInteractivo = [[51.507222, -0.1275], [50.85, 4.35], [50.85, 4.35], [51.507222, -0.1275]];
    var marker3 = L.Marker.movingMarker(recorridoInteractivo,
        [2000, 0, 2000, 0], { autostart: true, loop: true }).addTo(map);
    marker3.loops = 0;
    marker3.bindPopup('', { closeOnClick: false });
    marker3.on('loop', function (e) {
        marker3.loops++;
        if (e.elapsedTime < 50) {
            marker3.getPopup().setContent("<b>Loop: " + marker3.loops + "</b>")
            marker3.openPopup();
            setTimeout(function () {
                marker3.closePopup();
            }, 2000);
        }
    });
    map.fitBounds(recorridoInteractivo);
}

///trabajand
function montevideo() {
    let itemValuae = "MONTEVIDEO";
    // let filterc = "nombre='" + itemValuae + "'";
    let urlMon =
        'http://localhost:8081/geoserver/wfs?' +
        'service=WFS&' +
        'request=GetFeature&' +
        'typeName=Geo_lab2023_g14PersistenceUnit:vista_union_buf&' +
        'srsName=EPSG:32721&' +
        'outputFormat=application/json';
    //urlMon += '&CQL_FILTER=' + filterc;
    fetch(urlMon)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            geojsonsLayere.addData(data);
            //  geojsonsLayere.options.layerName = layerName; // console.log(laAmb + ' ' + loAmb);
        })
        .catch(function (error) {
            console.error('Error:', error);
        });
    geojsonsLayere = L.geoJSON(null, {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
                icon: iconA
            });
        }
    }).addTo(map);
}

///////////////////////// FUNCIONES AUXILIARES /////////////////////////
function euclideanDistancia(punto1, punto2) { // Distancia euclidiana entre dos puntos
    let dx = punto2.x - punto1.x;
    let dy = punto2.y - punto1.y;
    return Math.sqrt(dx * dx + dy * dy);
} // L.CRS.Simple.distance(latlng1, latlng2) --> Distancia euclidiana entre dos puntos

function euclideanDistanciaMetros(punto1, punto2) { // Distancia euclidiana a metros (a partir de dos punto(x,y))
    let latlng1 = L.latLng(punto1.y, punto1.x);
    let latlng2 = L.latLng(punto2.y, punto2.x);
    let distanciaEnMetros = latlng1.distanceTo(latlng2);
    return distanciaEnMetros;
}

function addObjLaLng(latitud, longitud) { // Crea objeto latlng
    let addObjLatLng = L.GeoJSON.coordsToLatLng([latitud, longitud]);
    return addObjLatLng
}

function euclideanDistanciaMetrosObj(latlng1, latlng2) { // Distancia euclidiana a metros (a partir de dos obj latlng)
    return latlng1.distanceTo(latlng2);
}

function removerLayer() {
    map.removeLayer(geojsonLayer);

    marker3.removeFrom(map);

    ocultarFrm();
}

function BorrarMarcadorALtaSE() {
    console.log("borrando marcador");
    this.map.removeLayer(this.markerSE);
}

