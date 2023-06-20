/////////////////// SELECCIONAR HOSPITAL ////////////////////
let existeLayer = false;
let exisateLayer = false;
let wfs;
let wfse;
let urlHospi;
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
            var selectCtrlHospital = L.control.select({
                position: "topleft",
                selectedDefault: defaultValue,
                iconMain: "✚",
                items: listaSelect,
                onSelect: function (newItemValue) {
                    if (newItemValue == t) {
                        map.removeLayer(geojsonLayere);
                        map.removeLayer(geojsonLayeres);
                        map.removeLayer(geojsonLayer);
                        removerLayer();
                        initLayers(0);
                        selectCtrlHospital.remove();
                        selectCtrlInicio();
                    } else {
                        map.removeLayer(geojsonLayere);
                        map.removeLayer(geojsonLayeres);
                        removerLayer();
                        initLayers(newItemValue);
                        selectCtrlHospital.remove();
                        selectCtrlInicio();
                    }
                },
            }).addTo(map);
        })
        .catch(function (error) {
            console.error('Error:', error);
        });
}


/////////////////// SELECT CONTROL ///////////////////
function selectCtrlInicio() {

    let listaSelect;
    /* listaSelect.push({label: "Solicitar ambulancia", value: 2}).push({label: "Ambulancia", value: 1});
   /* items: [ {label: "Bifurcación", value: "2a"},  {label: "Completa", value: "2b"},],*/
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
    ];

    var selectCtrlInicio = L.control.select({
        position: "topleft",
        selectedDefault: true,
        items: listaSelect,
        onSelect: function (newItemValue) {
            switch (newItemValue) {
                case 1:
                    intersectpoint();
                    limpiarMapa();
                    break;
                case 21:
                    selectCtrlInicio.remove();
                    wfsSelectHospitales();
                    // obtenerPuntosInicioFin();
                    // buscarUbicacionBtn();
                    break;
                case 22:
                    //  mostrarBuscador.remove();
                    break;
                case 3:
                    //    mostrarBuscador.hide();

                    break;
            }
        },
        onGroupOpen: function (groupOpened) {
            console.log(groupOpened)
        },
    }).addTo(map);

}


////////// Ver Ambulancias y ServiciosEmergencia con cobertura en mi zona //////////
let coorUserlon;
let coorUserlat;
let a, b, c, d;
let puntose;
function intersectpoint() {
    obtenerCoordenadas()
        .then(function (coor) {
            console.log('Long obtener Coordenadas: ', coor.longitud);
            console.log('Lat obtener Coordenadas: ', coor.latitud);
            coorUserlon = coor.longitud;
            coorUserlat = coor.latitud;
        })
        .catch(function (error) {
            console.error('Error al obtener las coordenadas:', error);
        });

    let geojsonLayer = L.geoJSON(null, {
        style: {
            color: 'red',
            weight: 1,
            opacity: 0.8
        },
    }).addTo(map);
    let urlIntersect = 'http://localhost:8081/geoserver/wfs?' +
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


/////////////////// addLayer WFS BUFFER ///////////////////
function addLayerWFSbuf() {
    let geojsonLayer = L.geoJSON(null, {
        style: {
            color: 'gray',
            weight: 1.4,
            opacity: 1
        },
    }).addTo(this.map);
    let url =
        'http://localhost:8081/geoserver/wfs?' +
        'service=WFS&' +
        'request=GetFeature&' +
        'typeName=Geo_lab2023_g14PersistenceUnit:vista_buff_cobertura&' +
        'srsName=EPSG:32721&' +
        'outputFormat=application/json';
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            geojsonLayer.addData(data);
            var s = data.features.properties;
            console.log("VISTADATA:  " + s);
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
}



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