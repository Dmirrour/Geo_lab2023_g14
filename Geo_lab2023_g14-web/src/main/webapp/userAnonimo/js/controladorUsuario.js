/////////////////// SELECCIONAR HOSPITAL ////////////////////
let existeLayer = false;
let exisateLayer = false;
let wfs;
let wfse;
let urlHospi;
function wfsSelectHospitales() {
    //  console.log("wfs Select Hospitales");
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
                //  console.log(idH + " - " + item.nombrehospital);
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
                        map.removeLayer(geojsonLayere);
                        map.removeLayer(geojsonLayeres);
                        removerLayer();
                        initLayers(0);
                    } else {
                        map.removeLayer(geojsonLayere);
                        map.removeLayer(geojsonLayeres);
                        removerLayer();
                        initLayers(newItemValue);

                        obtenerCoordenadas()
                            .then(function (coor) {
                                intersectpoint(coor.latitud, coor.longitud, newItemValue);
                                console.log('Long obtener Coordenadas: ', coor.longitud);
                                console.log('Lat obtener Coordenadas: ', coor.latitud);
                            })
                            .catch(function (error) {
                                console.error('Error al obtener las coordenadas:', error);
                            });
                    }
                },
            }).addTo(map);
        })
        .catch(function (error) {
            console.error('Error:', error);
        });
}


/////////////////// Intersect POINT ///////////////////
function intersectpoint(la, lo, newItemValue) {
    console.log("Intersect point:  ", lo, "  ", la, "  ", newItemValue);

    let geojsonLayer = L.geoJSON(null, {
        style: {
            color: 'red',
            weight: 1,
            opacity: 1
        },
    }).addTo(map);

    let urlIntersect = 'http://localhost:8081/geoserver/wfs?' +
        'service=WFS&' +
        'request=GetFeature&' +
        'typeName=Geo_lab2023_g14PersistenceUnit:vista_buff_cobertura&' +
        'outputFormat=application/json&' +
        'CQL_FILTER=INTERSECTS(buffer_zona_cobertura,POINT(' + lo + ' ' + la + ')';

    fetch(urlIntersect)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            geojsonLayer.addData(data);
            data.features.forEach(function (feature) {
                idhos = feature.properties.hospital_idhospital;
                //       console.log("newItemValue: ", newItemValue);
                // console.log("idhos", idhos);
            });
        })
        .catch(function (error) {
            console.error('Error:', error);
        });
}



/////////////////// addLayerWFSbuf ///////////////////
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
            // Crear un buffer alrededor de las líneas
            /*
            let bufferedLayer = L.geoJSON(turf.buffer(data, 100, { units: 'meters' }), {
                style: {
                    color: 'blue',
                    weight: 2,
                    opacity: 0.7
                }
            }).addTo(this.map);
            */
        })
        .catch(function (error) {
            console.error('Error:', error);
        });
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