/////////////////// SELECCIONAR HOSPITAL ////////////////////
let existeLayer = false;
let exisateLayer = false;
let wfs;
let wfse;
let urlHospi;
let coorUserlon;
let coorUserlat;
let a, b, c, d;
let puntose;
let latitudeGPS;
let longitudeGPS;
var idhosss;
var drawControlPoligon;
/////////////////// SELECT CONTROL ///////////////////
function menuInicio() {
    let listaSelect;
    listaSelect = [
        { label: "Cobertura en mi ubicación", value: 1 },
        {
            label: "Solicitar ambulancia", value: 2,
            items: [
                { label: "Seleccionar hospital", value: 21 },
                { label: "Ingresar dirección", value: 22 },
            ],
        },
        { label: "Graficar busqueda", value: 3 },
        { label: "Servicio con disponibilidad", value: 4 }
    ];

    selectCtrlInicio = L.control.select({
        position: "topleft",
        selectedDefault: 9,
        items: listaSelect,
        onSelect: function (newItemValue) {
            switch (newItemValue) {
                case 1:
                    console.log("Cobertura en mi ubicación");
                    // limpiarButton();
                    // initLayers(0);
                    ocultarFrm();
                    map.removeLayer(geojsonLayer);
                    obtenerCoordenadas()
                        .then(function (coor) {
                            coorUserlon = coor.longitud;
                            coorUserlat = coor.latitud;
                            console.log('Lat obtener Coordenadas: ', coorUserlat, ' ', coorUserlon);
                            intersectpoint(coorUserlat, coorUserlon);
                        })
                        .catch(function (error) {
                            console.error('Error al obtener las coordenadas:', error);
                        });
                    break;
                case 21:
                    console.log("Seleccionar hospital");
                    wfsSelectHospitales();
                    ocultarFrm();
                    limpiarButton();
                    drawControlPoligon.remove();
                    break;
                case 22:
                    console.log("Ingresar dirección");
                    // limpiarButton();
                    if (selectCtrlHospital != null) { // boton seleccion hospitales
                        selectCtrlHospital.remove();
                    }
                    map.removeLayer(geojsonLayere);
                    map.removeLayer(geojsonLayeres);
                    removerLayer();
                    masCercana(seleccionEsq);
                    openFrm();
                    drawControlPoligon.remove();
                    break;
                case 3:
                    console.log("Graficar ");
                    map.removeLayer(geojsonLayer);
                    map.removeLayer(geojsonLayere);
                    map.removeLayer(geojsonLayeres);
                    dibujarPolyline();
                    // ocultarFrm();
                    // selectCtrlHospital.remove();
                    break;
                case 4:
                    console.log("Servicio disponible ");
                    map.removeLayer(geojsonLayer);
                    map.removeLayer(geojsonLayere);
                    map.removeLayer(geojsonLayeres);
                    camasDisponibles();
                    break;
            }
        },
        onGroupOpen: function (groupOpened) {
            console.log(groupOpened)
        },
    }).addTo(map);

}


var selectCtrlHospital;
function wfsSelectHospitales() {
    let listaSelect = [];
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
                //  console.log(idH + " - " + item.nombrehospital);
                listaSelect.push({ label: item.nombrehospital, value: idH });
            }
            let t = listaSelect.length + 1;
            listaSelect.push({ label: "↪ Mostrar Todo", value: t });
            defaultValue = listaSelect[0];
            var defaultValue = listaSelect[0].label;

            this.selectCtrlHospital = L.control.select({
                position: "topleft",
                selectedDefault: defaultValue,
                iconMain: "➥",
                items: listaSelect,
                onSelect: function (newItemValue) {
                    if (newItemValue == t) {
                        map.removeLayer(geojsonLayere);
                        map.removeLayer(geojsonLayeres);
                        map.removeLayer(geojsonLayer);
                        removerLayer();
                        ocultarFrm();
                        initLayers(0);
                        //  selectCtrlHospital.remove();
                        //  selectCtrlInicio();
                    } else {
                        map.removeLayer(geojsonLayere);
                        map.removeLayer(geojsonLayeres);
                        removerLayer();
                        initLayers(newItemValue);
                        //  openFrm();
                        //  masCercana(newItemValue);
                        //  buscarUbicacion; // crear recorrido
                        // var buscarUbicacionBtn = document.getElementById('buscarUbicacion');
                        //    selectCtrlHospital.remove();
                    }
                },
            }).addTo(map);
        })
        .catch(function (error) {
            console.error('Error:', error);
        });
}


var concatenarPoints = "";
let camas;
var geojsonLayeresCamas;
function camasDisponibles() {
    //  var drawLayer = new L.FeatureGroup().addTo(map); // Crear una nueva capa de dibujo
    let cero = 0;
    let filters = "camaslibres>'" + cero + "'";
    let urlCamas =
        'http://localhost:8081/geoserver/wfs?' +
        'service=WFS&' +
        'request=GetFeature&' +
        'typeName=Geo_lab2023_g14PersistenceUnit:vista_se_h&' +
        'srsName=EPSG:32721&' +
        'outputFormat=application/json';

    urlCamas += '&CQL_FILTER=' + filters;

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
    fetch(urlCamas)
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
                puntosArray2.push({
                    laAmb2,
                    loAmb2
                });
            }
            // camas = data.features[i].properties.camaslibres;
            // console.log("camas: ", camas);

            // if (camas > 0) {
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
                        //   '<em>Coordenadas: </em><b>' + coorServicioEmer[0] + " , " + coorServicioEmer[1] + '</b></br>' +
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


/////////////////// AMBULANCIAS QUE CORTAN UN POLIGONO ///////////////////
var concatenarPoints = "";
function dibujarPolyline() {
    var drawLayer = new L.FeatureGroup().addTo(map); // Crear una nueva capa de dibujo
    if (drawControlPoligon != null) {
        drawControlPoligon.remove();
    }

    drawControlPoligon = new L.Control.Draw({ // Activar la herramienta de dibujo de polilíneas
        draw: {
            polygon: true,
        },
        edit: false
    }).addTo(map);

    let wfsURL = 'http://localhost:8081/geoserver/wfs?' +
        'service=WFS&' +
        'request=GetFeature&' +
        'typeName=Geo_lab2023_g14PersistenceUnit:ambulancia&' +
        'srsName=EPSG:32721&' +
        'outputFormat=application/json';
    fetch(wfsURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            geojsonLayer.addData(data);

            let puntosArray2 = [];
            for (let i = 0; i < data.features.length; i++) {
                ambuInter = data.features[i].geometry.coordinates[1];
                ambuInter2 = data.features[i].geometry.coordinates[0];
                puntosArray2.push({
                    ambuInter2,
                    ambuInter
                });
                concatenarPoints = '[' + ambuInter2 + ', ' + ambuInter + '],' + concatenarPoints;
            }
        });

    ////// Evento de dibujo de polilínea completada
    map.on('draw:created', function (e) {
        let layer = e.layer;
        let latlngs = layer.getLatLngs();  // Obtener las coordenadas de la polilínea

        // point
        concatenarPoints = concatenarPoints.slice(0, -1);
        var coordPointText = '[' + concatenarPoints + ']';
        var coordPoint = JSON.parse(coordPointText);
        coordPoint[0].push(coordPoint[0][0]); // Para que la primera y ultima coordenada sean iguales 
        var points = turf.points(coordPoint);

        // polygon
        var polygonCoordinates = latlngs[0].map(function (latlng) {
            return '[' + latlng.lng + ', ' + latlng.lat + ']';
        }).join(',');
        var coordText = '[[' + polygonCoordinates + ']]';
        var coordPolygon = JSON.parse(coordText);

        console.log(coordText);
        coordPolygon[0].push(coordPolygon[0][0]); // Para que la primera y ultima coordenada sean iguales 
        var polygons = turf.polygon(coordPolygon, {
            "fill": "#00F",
            "fill-opacity": 0.1
        });
        L.geoJSON(polygons).addTo(map);


        var ptsWithin = turf.pointsWithinPolygon(points, polygons);

        var diffGeojson = L.geoJSON(ptsWithin).addTo(map);
        //  map.fitBounds(diffGeojson.getBounds());  // efecto zoom

        //   drawLayer.addLayer(layer); // Añadir la polilínea
    });

    // Limpiar la capa de dibujo cuando se haga clic en el mapa
    map.on('click', function () {
        drawLayer.clearLayers();
        // drawControlPoligon.remove(); remover control
    });
}


function limpiarButton() {
    if (selectCtrlHospital != null) {
        selectCtrlHospital.remove();
    }
    // agregar todos lo botones
    ocultarFrm();
}


/////////////////// addLayer WFS BUFFER ///////////////////
let menorDistancia = Infinity;
let geojsonLa;
let loAmb2aux;
let laAmb2aux;
let prop;
function masCercana(seleccionEsq) {
    // console.log("selectEsq: " + seleccionEsq.lat, seleccionEsq.lng);
    let urlss =
        'http://localhost:8081/geoserver/wfs?' +
        'service=WFS&' +
        'request=GetFeature&' +
        'typeName=Geo_lab2023_g14PersistenceUnit:vista_se_h&' +
        'srsName=EPSG:32721&' +
        'outputFormat=application/json';
    // initLayerServicioEm(urlss, 'layerSE'); // point se
    fetch(urlss)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            geojsonLayer.addData(data);
            console.log(data);
            let puntosArray2 = [];
            for (let i = 0; i < data.features.length; i++) {
                closestFeature = data.features[i].geometry.coordinates;
                disaa = addObjLaLng(seleccionEsq.lat, seleccionEsq.lng)
                distancia = euclideanDistanciaMetrosObj(disaa, closestFeature);
                //  Coordenadas: -56.23197147 , -34.86140257  // -56.15258217 , -34.86441034   juanp ii
                if (distancia < menorDistancia) {
                    menorDistancia = distancia;
                    idhosss = data.features[i].properties.idhospital;
                    laAmb2 = data.features[i].geometry.coordinates[1];
                    loAmb2 = data.features[i].geometry.coordinates[0];
                    puntosArray2.push({
                        laAmb2,
                        loAmb2
                    });
                    //      console.log(laAmb2 + " :: " + loAmb2, "distancia: ", distancia, idhosss);
                }
            }
            //  console.log(laAmb2 + " 9a9 " + loAmb2, "distancia: ", menorDistancia, idhosss);
            initLayers(idhosss);
            openFrm();
            ocultarFrm();
        })
        .catch(function (error) {
            console.error('Error:', error);
        });
}


function obtenerCoordenadasGPS() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            this.latitudeGPS = position.coords.latitude;
            this.longitudeGPS = position.coords.longitude;

            // Actualizar las coordenadas del marcador
            marker.setLatLng([latitude, longitude]);

            // Centrar el mapa en las nuevas coordenadas
            map.setView([latitude, longitude], 13);
        }, function (error) {
            console.error("Error al obtener la ubicación: " + error.message);
        });
    } else {
        +
            console.error("Tu navegador no admite la geolocalización.");
    }
}

var iconA = L.icon({
    iconUrl: './resources/marker-icons/ambulance.png',
    iconSize: [22, 22]
});


////////// VER AMBULANCIAS Y SERVICIOSEMERGENCIA CON COBERTURA EN MI ZONA //////////
function intersectpoint(coorUserlat, coorUserlon) {
    let iconoPersonalizado = L.icon({
        iconUrl: 'resources/marker-icons/marker-iconnaranjaf.png',
        iconSize: [22, 36]
    });
    marcador = L.marker([coorUserlat, coorUserlon], { icon: iconoPersonalizado }).addTo(map);
    marcador.display;
    circulo = L.circle([coorUserlat, coorUserlon], { // Circulo verde zona
        radius: 150,
        color: "green"
    }).addTo(map)

    let geojsonLayer = L.geoJSON(null, {
        style: {
            color: 'red',
            weight: 0.8,
            opacity: 0.5
        },
    }).addTo(map);
    let urlIntersect =
        'http://localhost:8081/geoserver/wfs?' +
        'service=WFS&' +
        'request=GetFeature&' +
        'typeName=Geo_lab2023_g14PersistenceUnit:vista_buff_cobertura_user&' +
        'outputFormat=application/json&' +
        'CQL_FILTER=INTERSECTS(buffer_zona_cobertura,POINT(' + coorUserlon + ' ' + coorUserlat + '))';
    fetch(urlIntersect)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            geojsonLayer.addData(data);
            //    console.log("DATOS: ", data);
            data.features.forEach(function (feature) {
                idhos = data.features[0].properties.first_point_recorrido;
                a = idhos.coordinates[0];
                b = idhos.coordinates[1];
                puntose = data.features[0].properties.point_se;
                c = puntose.coordinates[0];
                d = puntose.coordinates[1];
            });
            geojsonLayeres.options.layerName = layerNames;

        })
    // .catch(function (error) {
    //     console.error('Error:', error);
    // });

    var puntos2 = {
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'Point',
                coordinates: [a, b]
            }
        },
        ]
    };
    L.geoJSON(puntos2, {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
                // icon: iconA
            });
        }
    })//.addTo(map);

    var punto = {
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'Point',
                coordinates: [c, d]
            }
        },
        ]
    }; L.geoJSON(puntos2).addTo(map);
    L.geoJSON(punto, {
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
}


/////////////////// addLayer WFS BUFFER ///////////////////
let geojsonLayerBuff;
function addLayerWFSbuf() {
    geojsonLayerBuff = L.geoJSON(null, {
        style: {
            color: 'gray',
            weight: 1.8,
            opacity: 0.6
        },
    }).addTo(map);
    let url =
        'http://localhost:8081/geoserver/wfs?' +
        'service=WFS&' +
        'request=GetFeature&' +
        'typeName=Geo_lab2023_g14PersistenceUnit:vista_buff_cobertura_user&' +
        'srsName=EPSG:32721&' +
        'outputFormat=application/json';
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            geojsonLayerBuff.addData(data);
            //    s = data.features;
            // console.log("VISTADATA:  " + s);
            // console.log("VISTADATA:  " + data);
            // Crear un buffer alrededor de las líneas
            // let bufferedLayer = L.geoJSON(turf.buffer(data, 100, { units: 'meters' }), {
            //     style: {
            //         color: 'blue',
            //         weight: 2,
            //         opacity: 0.7
            //     }
            // }).addTo(this.map);
        })
        .catch(function (error) {
            console.error('Error:', error);
        });

}


function limpiarMapa() {
    map.removeLayer(geojsonLayere);
    map.removeLayer(geojsonLayeres);
    removerLayer();
    //  geojsonLayerBuff.remove();  agergar
    // if (geojsonLayer != null) {
    //     geojsonLayer.remove();
    // }
}







//////////////// ARRIBA SE ESTA USANDO///////////////////

function obtenerCoordenadasGPSs() {// ver repetido
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            this.latitudeGPS = position.coords.latitude;
            this.longitudeGPS = position.coords.longitude;

            // Actualizar las coordenadas del marcador
            marker.setLatLng([latitude, longitude]);

            // Centrar el mapa en las nuevas coordenadas
            map.setView([latitude, longitude], 13);
        }, function (error) {
            console.error("Error al obtener la ubicación: " + error.message);
        });
    } else {
        console.error("Tu navegador no admite la geolocalización.");
    }
}

////////// Ver Ambulancias y ServiciosEmergencia con cobertura en mi zona //////////
function intersectpoint2() {  ///adriana
    obtenerCoordenadasGPS();
    let latiPrueba = this.latitudeGPS;
    let lonPrueba = this.longitudeGPS;
    let geojsonLayer = L.geoJSON(null, {
        style: {
            color: 'red',
            weight: 0.8,
            opacity: 0.5
        },
    }).addTo(map);
    let urlIntersect =
        'http://localhost:8081/geoserver/wfs?' +
        'service=WFS&' +
        'request=GetFeature&' +
        'typeName=Geo_lab2023_g14PersistenceUnit:vista_buff_cobertura_user&' +
        'outputFormat=application/json&' +
        'CQL_FILTER=INTERSECTS(buffer_zona_cobertura,POINT(' + latiPrueba + ' ' + lonPrueba + '))';

    fetch(urlIntersect)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            geojsonLayer.addData(data);
            console.log("DATOS: ", data);
            data.features.forEach(function (feature) {
                idhos = data.features[0].properties.first_point_recorrido;
                a = idhos.coordinates[0];
                b = idhos.coordinates[1];
                puntose = data.features[0].properties.point_se;
                c = puntose.coordinates[0];
                d = puntose.coordinates[1];
                //    console.log("2: ", c, " ", d);
            });
            geojsonLayeres.options.layerName = layerNames;
        })
        .catch(function (error) {
            console.error('Error:', error);
        });

    var puntos2 = {
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'Point',
                coordinates: [a, b]
            }
        },
        ]
    };
    L.geoJSON(puntos2, {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
                icon: iconA
            });
        }
    }).addTo(map);

    var punto = {
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'Point',
                coordinates: [c, d]
            }
        },
        ]
    }; // L.geoJSON(puntos2).addTo(map);
    L.geoJSON(punto, {
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
}
var iconA = L.icon({
    iconUrl: './resources/marker-icons/ambulance.png',
    iconSize: [22, 22]
});

