function CrearMapaInvitado() {
    var map;

    ///////////////////////// MAPAS /////////////////////////
    var openst = L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        attribution: '© Grupo 14'
    });

    var google = L.tileLayer('https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
        attribution: '© Grupo 14'
    });
    ///////////////////////// FIN MAPAS /////////////////////////


    ///////////////////////// CAPAS WMS /////////////////////////
    var layerEjes = L.tileLayer.wms('http://localhost:8081/geoserver/Geo_lab2023_g14PersistenceUnit/wms?', {
        title: 'ft_01_ejes',
        layers: 'Geo_lab2023_g14PersistenceUnit:ft_01_ejes',
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

    var layerRuta = L.tileLayer.wms('http://localhost:8081/geoserver/Geo_lab2023_g14PersistenceUnit/wms?', {
        title: 'Rutas',
        layers: `Geo_lab2023_g14PersistenceUnit:vista_select`,
        srs: 'EPSG:4326',
        format: 'image/png',
        transparent: true,
        version: '1.0.0'
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
        title: 'ambulancia',
        layers: 'Geo_lab2023_g14PersistenceUnit:ambulancia',
        srs: 'EPSG:4326',
        format: 'image/png',
        transparent: true,
        VERSION: '1.1.0'
    });

    // var layerAll = L.tileLayer.wms('http://localhost:8081/geoserver/Geo_lab2023_g14PersistenceUnit/wms?', {
    //     title: 'layerAll',
    //     layers: 'Geo_lab2023_g14PersistenceUnit:ft01_ejes,ft_depto,servicioemergencia,ambulancia',
    //     srs: 'EPSG:32721',
    //     format: 'image/png',
    //     transparent: true,
    //     VERSION: '1.1.0'
    // });
    ///////////////////////// FIN CAPAS WMS  /////////////////////////


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

    var overlayers = {
        //"Mostrar ": layerAll,
        "Ambulancia": layerAmbulancia,
        "Servicio Emergencia": layerServicio,
        "Ejes": layerEjes,
        "Rutas": layerRuta,
        "Departamentos": layerDepartamento
    };

    L.control.layers(baselayers, overlayers, { collapsed: true, position: 'bottomright' }).addTo(map);

    drawLayers = new L.FeatureGroup(); // Agrupa elementos graficos
    drawControl = new L.Control.DrawPlus({
        position: 'topright',
        draw: {
            circle: true,
            polyline: true
        },
        edit: {
            featureGroup: drawLayers,
            edit: true
        }
    });

    map.addLayer(drawLayers);
    // map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, function (e) {
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


///////////////////////// INITLAYERS /////////////////////////
function initLayers(itemValue) {
    console.log("function init Layer Servicio Em: " + itemValue);

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

    initLayerServicioEm(urlSe, 'layerSE'); // punto se
    initLayerLineAmbu(urlAmbu, 'layerAmulancia'); // polyline
    initLayerPointAmbu(urlAmbu, 'pointAmulancia'); // punto Ambu
}


///////////////////////// INITIALIZE LAYERS /////////////////////////
let laSe;
let loSe;
let geojsonLayer; // variable global
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

            geojsonLayer.eachLayer(function (layer) {
                layer.on('click', function (e) {
                    let properties = e.target.feature.properties;
                    let popupContent =
                        '<div class="popup-content">' +
                        '<h5><b>' + properties.nombre + '</b></h5>' +
                        '<em>Camas libres: </em><b>' + properties.camaslibres + '</b></br>' +
                        '<em>Total de camas: </em><b>' + properties.totalcama + '</b></br>' +
                        '<em>Hospital Nombre: </em><b>' + properties.nombrehospital + '</b></br>' +
                        '<em>Hospital Tipo: </em><b>' + properties.tipohospital + '</b></br>' + '</div>';
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

let geojsonLayere;
function initLayerLineAmbu(urlAmbu, layerName) {
    fetch(urlAmbu)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            geojsonLayere.addData(data);// Agregar los datos a la capa de GeoJSON
            geojsonLayere.options.layerName = layerName;
            console.log(laAmb + ' ' + loAmb);
        })
        .catch(function (error) {
            console.error('Error:', error);
        });
    geojsonLayere = L.geoJSON(null, {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
                //   icon: iconA
            });
        }
    }).addTo(map);
}

let loAmb;
let laAmb;
let geojsonLayeres;
function initLayerPointAmbu(urlAmbu, layerNames) {
    fetch(urlAmbu)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            geojsonLayeres = L.geoJSON(data, {
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng, {
                        icon: iconA
                    });
                }
            });
            geojsonLayeres.addData(data);// Agregar los datos a la capa de GeoJSON
            let puntosArray = [];

            for (let i = 0; i < data.features.length; i++) {
                laAmb = data.features[i].geometry.coordinates[0][0];
                loAmb = data.features[i].geometry.coordinates[0][1];
                console.log(laAmb + " * " + loAmb);
                puntosArray.push({
                    laAmb,
                    loAmb
                });
            }
            geojsonLayeres.options.layerName = layerNames;

            //// POINT AMBULANCIA 
            let puntos = {
                type: 'FeatureCollection',
                features: []
            };

            // console.log(puntosArray);
            puntosArray.forEach(function (coordinates) {
                let feature = {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'Point',
                        //  coordinates:  [-56.1676025390625, -34.88353942127242]
                        coordinates: [coordinates.laAmb, coordinates.loAmb]
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
            }).addTo(map);
            geojsonLayeres.addData(puntos); // Agregar los datos a la capa de GeoJSON
        })
        .catch(function (error) {
            console.error('Error:', error);
        });
}

var iconA = L.icon({
    iconUrl: 'resources/marker-icons/ambulance.svg',
    iconSize: [30, 30],
});


///////////////////////// DISTANCIA /////////////////////////
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

function addObjLatLng(latitud, longitud) { // Crea objeto latlng
    let addObjLatLng = L.GeoJSON.coordsToLatLng([latitud, longitud]);
    return addObjLatLng
}

function euclideanDistanciaMetrosObj(latlng1, latlng2) { // Distancia euclidiana a metros (a partir de dos obj latlng)
    return latlng1.distanceTo(latlng2);
}

function removerLayer() {
    map.removeLayer(geojsonLayer);
}

// Elimina el marcador del mapa
function BorrarMarcadorALtaSE() {
    console.log("borrando marcador");
    this.map.removeLayer(this.markerSE);
}













// L.geoJSON(iconA, {
//     pointToLayer: function (Feature, latlng) {
//         return L.marker(latlng, {
//             icon: iconA
//         });
//     }
// }).addTo(map);

// const puntoIndex = 0; // Índice del punto que deseas acceder (comenzando desde 0)
// let punto = [];
// //punto.push(data.features.geometry.getLatLngs()[puntoIndex]);
// console.log("adriana");
// console.log("dataline" + data.features[0].geometry); // Imprime el punto en la consola
// console.log(data);
// let latAmb = data.features[0].geometry.coordinates[0][0];
// let lonAmb = data.features[0].geometry.coordinates[0][1];
// /// POINT AMBULANCIA ////
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
//             coordinates: [lonAmb, latAmb]
//         }
//     },
//     ]
// };

// L.geoJSON(fijarAmbulancia, {
//     pointToLayer: function (Feature, latlng) {
//         return L.marker(latlng, {
//             //   icon: iconAmbulancia
//         });
//     }
// }).addTo(map);
