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
        { label: "Graficar busqueda", value: 3 }
    ];

    selectCtrlInicio = L.control.select({
        position: "topleft",
        selectedDefault: false,
        items: listaSelect,
        onSelect: function (newItemValue) {
            switch (newItemValue) {
                case 1:
                    console.log("Cobertura en mi ubicación");
                    map.removeLayer(geojsonLayer);
                    obtenerCoordenadas()
                        .then(function (coor) {
                            console.log('Long obtener Coordenadas: ', coor.longitud);
                            console.log('Lat obtener Coordenadas: ', coor.latitud);
                            coorUserlon = coor.longitud;
                            coorUserlat = coor.latitud;
                            console.log('Lat obtener Coordenadas: ', coorUserlat);
                            intersectpoint(coorUserlat, coorUserlon);
                        })
                        .catch(function (error) {
                            console.error('Error al obtener las coordenadas:', error);
                        });
                    break;
                case 21:
                    console.log("Seleccionar hospital");
                    wfsSelectHospitales();
                    limpiarButton();
                    break;
                case 22:
                    console.log("Ingresar dirección");
                    // masCercana();
                    // limpiarButton();
                    // initLayers(0);
                    map.removeLayer(geojsonLayere);
                    map.removeLayer(geojsonLayeres);
                    removerLayer();
                    masCercana(seleccionEsq);
                    openFrm();
                    break;
                case 3:
                    console.log("Graficar ");
                    // limpiarButton();
                    map.removeLayer(geojsonLayer);
                    //  removerLayer();
                    //  limpiarMapa();
                    obtenerCoordenadas()
                        .then(function (coor) {
                            console.log('Long obtener Coordenadas: ', coor.longitud);
                            console.log('Lat obtener Coordenadas: ', coor.latitud);
                            coorUserlon = coor.longitud;
                            coorUserlat = coor.latitud;
                            console.log('Lat obtener Coordenadas: ', coorUserlat);
                            intersectpoint(coorUserlat, coorUserlon);
                        })
                        .catch(function (error) {
                            console.error('Error al obtener las coordenadas:', error);
                        });
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
                        //  selectCtrlInicio();
                    }
                },
            }).addTo(map);
        })
        .catch(function (error) {
            console.error('Error:', error);
        });
}

function limpiarButton() {
    if (selectCtrlHospital != null) {
        selectCtrlHospital.remove();
    }
    ocultarFrm();
}


/////////////////// addLayer WFS BUFFER ///////////////////
let menorDistancia = Infinity;
let geojsonLa;
let loAmb2aux;
let laAmb2aux;
let prop;

function masCercana(seleccionEsq) {
    console.log("selectEsq: " + seleccionEsq.lat, seleccionEsq.lng);
    //  openFrm();
    // openFrm();
    //console.log("openFrm: " + seleccionEsq.lat);

    // 'CQL_FILTER=DWITHIN(point_se, POINT(' + seleccionEsq.lng + ' ' + seleccionEsq.lat + '), 50000, feet)&' +
    //   'sortBy=point asc&' +
    // 'maxFeatures=1&' +
    //  'CQL_FILTER=DWITHIN(point, POINT(-56.18581498973073 -34.86255776861203), 5000000, meters)&' +
    //  'CQL_FILTER=INTERSECTS(buffer_zona_cobertura,POINT(' + coorUserlon + ' ' + coorUserlat + '))';
    //  var geojsonLayer = L.geoJSON().addTo(map);
    //  geojsonLa = L.geoJSON(null, {
    // style: {     color: 'red',  weight: 0.8, opacity: 0.5  }, }).addTo(map);
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
                // = data.features[i].properties.hospital_idhospital;
                //  let disaa = addObjLatLng(seleccionEsq.lng, seleccionEsq.lat);
                //   console.log("c", closestFeature);  console.log("c", disaa);
                disaa = addObjLaLng(seleccionEsq.lat, seleccionEsq.lng)
                distancia = euclideanDistanciaMetrosObj(disaa, closestFeature);
                //  Coordenadas: -56.23197147 , -34.86140257
                // -56.15258217 , -34.86441034   juan pablo ii
                if (distancia < menorDistancia) {
                    menorDistancia = distancia;
                    idhosss = data.features[i].properties.idhospital;
                    laAmb2 = data.features[i].geometry.coordinates[1];
                    loAmb2 = data.features[i].geometry.coordinates[0];
                    puntosArray2.push({
                        laAmb2,
                        loAmb2
                    });
                    console.log(laAmb2 + " :: " + loAmb2, "distancia: ", distancia, idhosss);
                }
            }
            console.log(laAmb2 + " 9a9 " + loAmb2, "distancia: ", menorDistancia, idhosss);
            console.log(idhosss + " id ");
            initLayers(idhosss);
            openFrm();
            ocultarFrm();
            // openFrm();
        })
        .catch(function (error) {
            console.error('Error:', error);
        });

    /*  fetch(urlss)
          .then(function (response) {
              return response.json();
          })
          .then(function (data) {
              geojsonLa.addData(data);
              console.log("asdas");
              //    if (data.features.length > 0) {
              console.log("data ", data);
              let puntosArray3 = [];
              for (let i = 0; i < data.features.length; i++) {
                  prop = data.features[i].properties;
                  console.log("data ", prop);
                  closestFeature = data.features[i].geometry.coordinates;
  
                  //  let closestFeature = data.feature.geometry.coordinates[0];
                  let disa = addObjLatLng(seleccionEsq.lng, seleccionEsq.lat);
                  let disb = addObjLatLng(closestFeature[0], closestFeature[1]);
  
                  let distancia = euclideanDistanciaMetrosObj(disa, disb);
  
                  if (distancia < menorDistancia) {
                      menorDistancia = distancia;
                      laAmb2 = data.features[i].geometry.coordinates[1];
                      loAmb2 = data.features[i].geometry.coordinates[0];
                      //  entidadMasCercana = entidad;
                  }
  
                  console.log(distancia, " ", loAmb2, laAmb2);
                  // console.log(seleccionEsq);
                  // console.log(closestFeature);
                  // puntosArray3.push({
                  //     laAmb3,
                  //     loAmb3
                  // });
              }
              console.log(loAmb2 + " 99 " + laAmb2);
  
              //     console.log("menor: ", menorDistancia);
              //    // var diasa = addObjLatLng(loAmb2, laAmb2);
              //     console.log("menor: ", diasa.lat);
              //     // return diasa;
  
              // if (data.features.length > 0) {
              //     let feature = data.features[0];
              //     // Hacer algo con el resultado obtenido
              //     console.log('-34.881743689093234 , -56.25985917951554: RESULTADO: ', feature);
              // } else {
              //     console.log('No se encontraron resultados.');
              // }
              // let puntosArray2 = [];
              // for (let i = 0; i < data.features.length; i++) {
              //     laAmb2 = data.features[i].geometry.coordinates[1];
              //     loAmb2 = data.features[i].geometry.coordinates[0];
              //     // console.log(loAmb2+ " 99 " + laAmb2);
              //     puntosArray2.push({
              //         laAmb2,
              //         loAmb2
              //     });
              // }
              // console.log(laAmb2[0])
              // geojsonLayer.eachLayer(function (layer) {  // Evento clic marcadores
              //     layer.on('click', function (e) {
              //         let properties = e.target.feature.properties;
              //         let popupContent = '<div class="popup-content">' + properties.idcodigo + '</div>';
              //         let popupOptions = {
              //             className: 'custom-popup'
              //         };
              //         layer.closePopup();
              //         layer.bindPopup(popupContent, popupOptions);
              //         //    layer.bindPopup(popupContent, popupOptions).openPopup();
              //     })
              // })
          })
          .catch(function (error) {
              console.error('Error:', error);
          });*/

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
    //     pointToLayer: function (feature, latlng) {
    //         return L.marker(latlng, {
    //             icon: iconAmbulancia
    //         });
    //     }
    // }).addTo(map);

}


var iconA = L.icon({
    iconUrl: './resources/marker-icons/ambulance.png',
    iconSize: [22, 22]
});
////////// Ver Ambulancias y ServiciosEmergencia con cobertura en mi zona //////////
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
    })//.addTo(map);
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
            console.log("DATOS: ", data);
            data.features.forEach(function (feature) {
                idhos = data.features[0].properties.first_point_recorrido;
                a = idhos.coordinates[0];
                b = idhos.coordinates[1];
                puntose = data.features[0].properties.point_se;
                c = puntose.coordinates[0];
                d = puntose.coordinates[1];
                //   console.log("2: ", c, " ", d);
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


let geojsonLayerBuff;
/////////////////// addLayer WFS BUFFER ///////////////////
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




function solicitaAmbHospital() {
    //   console.log("function init Layer Servicio Em: " + itemValue);
    console.log('---------- aaGPSaa ------------');
    let consultaLat = coor.latitud;
    let consultaLon = coor.longitud;

    let puntoICoords = euclideanDistanciaMetros(consultaLat, consultaLon);

    console.log('ACA ANDA INDEX INVITADO LAT: ', consultaLat);
    console.log('ACA ANDA INDEX INVITADO LON: ', consultaLon);

    console.log('---------- aaPSaa ------------ ');


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
        console.error("Tu navegador no admite la geolocalización.");
    }
}




////////// Ver Ambulancias y ServiciosEmergencia con cobertura en mi zona //////////
function intersectpoint2() {
    obtenerCoordenadasGPS();
    let latiPrueba = this.latitudeGPS;
    let lonPrueba = this.longitudeGPS;
    console.log(latiPrueba + " " + lonPrueba + "Putito salio");
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
                console.log("2: ", c, " ", d);
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











    //  let filter = "idambulancia='" + newItemValue + "'";
   // let urlIntersect =
    //     'http://localhost:8081/geoserver/wfs?' +
    //     'service=WFS&' +
    //     'request=GetFeature&' +
    //     'typeName=Geo_lab2023_g14PersistenceUnit:vista_buff_cobertura&' +
    //     'srsName=EPSG:32721&' +
    //     'outputFormat=application/json';
    // urlIntersect += '&CQL_FILTER=' + filter;

     // [-34.85875015620534], [-56.22253417968751] [-34.86903379735205], [-56.20038986206055]
