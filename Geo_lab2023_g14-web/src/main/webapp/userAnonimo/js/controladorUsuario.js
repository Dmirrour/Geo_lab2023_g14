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
                    let popupContent =
                        '<div class="popup-content">' + properties.nombre + '</div>';
                    let popupOptions = {
                        className: 'custom-popup'
                    };
                    layer.closePopup(); // Cerrar el popup anterior si existe
                    layer.bindPopup(popupContent, popupOptions);

                    dibujaLinea(e.latlng.lng, e.latlng.lat); // Agregar Linestring a partir de point
                })
            })
        })
        .catch(function (error) {
            console.error('Error:', error);
        });
}


///////////////////// LAYER WFS AMBULANCIA /////////////////////
function wfsAmbulancia() {
    var geojsonLayer = L.geoJSON().addTo(map);
    let urls =
        'http://localhost:8081/geoserver/wfs?' +
        'service=WFS&' +
        'request=GetFeature&' +
        'typeName=Geo_lab2023_g14PersistenceUnit:vista_a_rec&' +
        'srsName=EPSG:32721&' +
        'outputFormat=application/json';
    fetch(urls)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            geojsonLayer.addData(data);
            console.log("antes")
            console.log(data)
            console.log("despues")

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

    //// POINT UBICACION AMBULANCIA 
    var iconAmbulancia = L.icon({
        iconUrl: '../resources/marker-icons/mapbox-marker-icon-purple.svg',
        iconSize: [64, 64],
    });
    var fijarAmbulancia = {
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'Point',
                coordinates: [-56.19233, -34.87158]
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

///////////// RECORRIDO AMBULANCIA->USUARIO->SERVICIO EMERGENCIA //////////////
let existe = false;
let geoJSONLayer;
let userLat = -56.185222811229534;
let userLon = -34.8503303549236;
let ambLat = -56.19233;
let ambLon = -34.87158;
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


/////////////////// WFS LIST SERVICIO MERGENCIA ///////////////////
function wfsListServicioEmergencia() {
    let strHospital = 2;
    var wfs = L.Geoserver.wfs("http://localhost:8081/geoserver/wfs?", {
        layers: `Geo_lab2023_g14PersistenceUnit:servicioemergencia`,
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


/////////////////// WFS LIST AMBULANCIA ///////////////////
// function wfsListAmbulancia() {
//     let strHospital = 2;
//     var wfs = L.Geoserver.wfs("http://localhost:8081/geoserver/wfs?", {
//         layers: `Geo_lab2023_g14PersistenceUnit:servicioemergencia`,
//         style: {
//             color: "red",
//             fillOpacity: 0.5,
//             opacity: 1,
//             stockWidth: 1
//         },
//         onEachFeature: function (f, l) {
//             l.bindPopup('<pre>' + JSON.stringify(f.properties, null, ' ').replace(/[\{\}"]/, '') + '</pre>');
//         },
//         CQL_FILTER: "hospital_idhospital =" + strHospital + "",
//     });
//     wfs.addTo(map);
// }


///////////// arriba bien
function dibujaLinea2() {
    // var polyline = L.polyline([]).addTo(map); // Crear un Polyline vacío y agregarlo al mapa
    // map.on('click', function (event) {
    //     var latlng = event.latlng; // Obtener las coordenadas del clic del usuario
    //     var marker = L.marker(latlng).addTo(map);     // Crear el marcador en las coordenadas del clic
    //     marker.bindPopup("¡Soy un marcador en el Polyline!").openPopup();  // Vincular un contenido emergente al marcador
    //     polyline.addLatLng(latlng);       // Agregar las coordenadas del marcador al Polyline
    // });
    // Definir una línea utilizando un conjunto de coordenadas
    // 1. Coordenadas de la polilínea
    var polylineCoordinates = [
        [10, 10],
        [20, 20],
        [30, 10]
    ];

    // 2. Crear un polígono buffer
    var lineString = turf.lineString(polylineCoordinates);
    var buffer = turf.buffer(lineString, 100, { units: 'meters' });

    // 3. Convertir el polígono buffer en una capa GeoJSON
    var bufferLayer = L.geoJSON(buffer);

    // 4. Establecer el estilo para la capa de buffer
    bufferLayer.setStyle({
        fillColor: '#ff0000',
        fillOpacity: 0.5,
        color: '#000000',
        weight: 2
    });

    // 5. Agregar la capa de buffer al mapa
    bufferLayer.addTo(map);
}


function addLayersAnonimoWFSTrabajabdo() {
    let overlayArray = [];
    let urlHospi =
        'http://localhost:8081/geoserver/wfs?' +
        'service=WFS&' +
        // 'version=1.1.0&' +
        'request=GetFeature&' +
        'typeName=Geo_lab2023_g14PersistenceUnit:ambulancia&' +
        'srsName=EPSG:32721&' +
        'outputFormat=application/json';

    fetch(urlHospi)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            var features = data.features;
            for (var i = 0; i < features.length; i++) {
                var valor = features[i].properties.nombrehospital;
                overlayArray.push(valor);
            }
            // console.log(overlayArray.length);
            // console.log(overlayArray);
            console.log(overlayArray.length);
            let baselayerss = {};
            var overlayerss = {};
            console.log(overlayArray.length);

            // for (let i = 0; i < overlayArray.length; i++) {
            //     let overlayName = overlayArray[i];
            //     let overlayLayer = getOverlayLayer(overlayName); // Función para obtener la capa correspondiente según el nombre
            //     console.log("llegue150");
            //     overlayerss[overlayName] = overlayLayer; // Agregar la capa al objeto overlayerss
            //     console.log("llegue");
            //     console.log(overlayerss);
            // }

            function getOverlayLayer(overlayName) {
            }
        })
        .catch(function (error) {
            console.error('Error:', error);
        });


    let url =
        'http://localhost:8081/geoserver/wfs?' +
        'service=WFS&' +
        // 'version=1.1.0&' +
        'request=GetFeature&' +
        'typeName=Geo_lab2023_g14PersistenceUnit:ambulancia&' +
        'srsName=EPSG:32721&' +
        'outputFormat=application/json';
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            geojsonLayer.addData(data);
            // Crear un buffer alrededor de las líneas
            let bufferedLayer = L.geoJSON(turf.buffer(data, 100, { units: 'meters' }), {
                style: {
                    color: 'red',
                    weight: 4,
                    opacity: 0.7
                }
            }).addTo(map);
        })
        .catch(function (error) {
            console.error('Error:', error);
        });
    //  }

}

// TTRegion
function cargarMapaAltaSE() {
    // Crea un marcador y guarda la posición en los campos de latitud y longitud
    let markerSE = L.marker([0, 0]).addTo(this.map);
    this.map.on('click', function (e) {
        let prefijo = "frmAltaSE";
        let latitud = e.latlng.lat;
        let longitud = e.latlng.lng;

        markerSE.setLatLng(e.latlng);
        markerSE.bindPopup("Agregar Servicio de Emergencia en:<br>Latitud: " + latitud.toFixed(6) + "<br>Longitud: " + longitud.toFixed(6)).openPopup();

        document.getElementById(prefijo + ":latitud").value = e.latlng.lat;
        document.getElementById(prefijo + ":longitud").value = e.latlng.lng;

        this.markerSE = markerSE;
    }, this);
}

function BorrarMarcadorALtaSE() { // Elimina el marcador del mapa
    console.log("borrando marcador");
    this.map.removeLayer(this.markerSE);
}
// var puntos = {
//     "type": "FeatureCollection",
//     "features": [{
//         "type": "Feature",
//         "geometry": {
//             "type": "LineString",
//             "coordinates": [
//                 [longitud, latitud],                       // Servicio emergencia seleccionado
//                 [-56.185222811229534, -34.8503303549236],  // Ubicacion usuario
//                 [-56.19233, -34.87158]                     // Ubicacion Anonimo
//             ]
//         },
//         "properties": {
//             "prop0": "value0",
//             "prop1": 0.0
//         }
//     }]
// }
// L.geoJSON(puntos).addTo(map);
function cargarMapaAltaAmbulancia() {
    /*
     // var recorrido = [];
     // let marker = L.marker([0, 0]).addTo(mapAmbulancia);
     // mapAmbulancia.on('click', function (e) {
     //     let latitud = e.latlng.lat;
     //     let longitud = e.latlng.lng;
     //     let punto;
    
     //     recorrido.push({
     //         latitud,
     //         longitud
     //     });
     //     for (var i = 0; i < recorrido.length; i++) {
     //         punto = recorrido[i];
     //     }
     //     console.log('Latitud:', punto.latitud, 'Longitud:', punto.longitud);
    
     //     var data = 'LINESTRING(' + punto + ')';
     //     console.log('Punto:', data);
     //     marker.setLatLng(e.latlng);
     //     document.getElementById("j_idt61:rec").value = data;;
     // });
     
     
     // // Configuración del mapa Leaflet
     // var map = L.map('map').setView([51.505, -0.09], 13);
    
     // // Crear una capa de dibujo
     // var drawnItems = new L.FeatureGroup().addTo(this.map);
    
     // // Configurar la herramienta de dibujo
     // var drawControl = new L.Control.Draw({
     //     draw: {
     //         polyline: true,
     //         // Otras opciones de dibujo
     //     },
     //     edit: {
     //         featureGroup: drawnItems,
     //         // Opciones de edición
     //     }
     // }).addTo(this.map);
     
     // Evento para capturar la polilínea dibujada
     this.map.on('draw:created', function (e) {
         var layer = e.layer;
         var polyline = layer.toGeoJSON().geometry.coordinates;
         var formattedPolyline = this.formatPolyline(polyline);
         this.savePolyline(formattedPolyline);
         this.drawLayers.addLayer(layer);
     }, this);
    
    }
    
    // Función para formatear la polilínea en el formato deseado
    formatPolyline(polyline) {
     // Realizar la transformación o formateo necesario (ejemplo: a WKT)
     // Puedes utilizar bibliotecas como Wicket o JTS para esta tarea
     // Devolver la polilínea formateada
     // Convertir la polilínea a formato WKT utilizando JSTS
     const wktWriter = new jsts.io.WKTWriter();
     const geometryFactory = new jsts.geom.GeometryFactory();
     const coordinates = polyline.map(([lng, lat]) => new jsts.geom.Coordinate(lng, lat));
     const jstsPolyline = geometryFactory.createLineString(coordinates);
     const wkt = wktWriter.write(jstsPolyline);
    
     // Devolver la polilínea formateada en WKT
     return wkt;
    }
    
    // Función para guardar la polilínea en la base de datos
    savePolyline(polyline) {
     // Enviar la polilínea formateada al backend para su almacenamiento en la base de datos
     // Utilizar las funciones de persistencia de tu framework de backend para guardar los datos en la tabla correspondiente
     console.log(polyline);
     let prefijo = "formAA";
     document.getElementById(prefijo + ":rec").value = polyline;
     */
}





///dpto no se usa
    // var geojsonLayer = L.geoJSON().addTo(map); // Crear una capa de GeoJSON
    // var url =
    //     'http://localhost:8081/geoserver/wfs?' +
    //     'service=WFS&' +
    //     'request=GetFeature&' +
    //     'typeName=Geo_lab2023_g14PersistenceUnit:ft_depto&' +
    //     'srsName=EPSG:4326&' +
    //     'outputFormat=application/json';

    // fetch(url)
    //     .then(function (response) {
    //         return response.json();
    //     })
    //     .then(function (data) {
    //         geojsonLayer.addData(data);      // Agregar los datos a la capa de GeoJSON

    //     })
    //     .catch(function (error) {
    //         console.error('Error:', error);
    //     });