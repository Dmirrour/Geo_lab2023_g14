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
            L.control.select({
                position: "topleft",
                selectedDefault: defaultValue,
                items: listaSelect,
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


/////////////////// SELECT CONTROL ///////////////////
function selectControl() {
    let listaSelect;
    /* listaSelect.push({label: "Solicitar ambulancia", value: 2}).push({label: "Ambulancia", value: 1});
   /* items: [ {label: "Bifurcación", value: "2a"},  {label: "Completa", value: "2b"},],*/
    listaSelect = [
        { label: "Cobertura en mi ubicacion", value: 1 },
        {
            label: "Solicitar ambulancia", value: 2,
            items: [
                { label: "Hospital", value: 21 },
                { label: "Dirección", value: 22 },
            ],
        },
        { label: "Graficar busqueda", value: 3 },
    ];

    var selectControl = L.control.select({
        position: "topleft",
        selectedDefault: 21,
        items: listaSelect,
        onSelect: function (newItemValue) {
            switch (newItemValue) {
                case 1:
                    crearRecorridoBtn.remove();
                    break;
                case 21:

                    break;
                case 22:
                    break;
                case 3:
                    crearRecorridoBtn.addTo(map);
                    break;
            }
        },
        onGroupOpen: function (groupOpened) {
            console.log(groupOpened)
        },
    }).addTo(map);

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
                // console.log("newItemValue: ", newItemValue);
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


    //  let filter = "idambulancia='" + newItemValue + "'";
   // let urlIntersect =
    //     'http://localhost:8081/geoserver/wfs?' +
    //     'service=WFS&' +
    //     'request=GetFeature&' +
    //     'typeName=Geo_lab2023_g14PersistenceUnit:vista_buff_cobertura&' +
    //     'srsName=EPSG:32721&' +
    //     'outputFormat=application/json';
    // urlIntersect += '&CQL_FILTER=' + filter;