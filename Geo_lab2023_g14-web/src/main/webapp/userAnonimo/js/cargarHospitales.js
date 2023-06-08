function addLayersAnonimoWFS() {
    var geojsonLayer = L.geoJSON().addTo(map); // Crear una capa de GeoJSON
    var url =
        'http://localhost:8081/geoserver/wfs?' +
        'service=WFS&' +
        // 'version=1.1.0&' +
        'request=GetFeature&' +
        'typeName=Geo_lab2023_g14PersistenceUnit:servicioemergencia&' +
        'srsName=EPSG:32721&' +
        'outputFormat=application/json';

    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            geojsonLayer.addData(data);      // Agregar los datos a la capa de GeoJSON
            geojsonLayer.eachLayer(function (layer) {
                layer.on('click', function (e) {
                    let properties = e.target.feature.properties;
                    let popupContent =
                        '<div class="popup-content">' +
                        properties.nombrehospital +
                        '</div>';
                    let popupOptions = {
                        className: 'custom-popup'
                    };
                    layer.bindPopup(popupContent, popupOptions);
                    //  layer.closePopup(); // Cerrar el popup anterior si existe
                    //   layer.bindPopup(popupContent, popupOptions).openPopup();
                })
            })
            //   layer.bindPopup(popupContent, popupOptions).openPopup();
        })
        .catch(function (error) {
            console.error('Error:', error);
        });

    // var geojsonLayer = L.geoJSON().addTo(map); // Crear una capa de GeoJSON
    // var url =
    //     'http://localhost:8081/geoserver/wfs?' +
    //     'service=WFS&' + 
    //     // 'version=1.1.0&' +
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
}


function addLayersAnonimoWFSTrabajabdo() {
    ////////////////// HASTA AQUI TODO OK //////////////////
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
            // Aquí puedes utilizar el arreglo 'columna' para realizar las operaciones necesarias
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
                // Aquí debes implementar la lógica para obtener la capa correspondiente según el nombre
                // Puedes utilizar un switch, if-else u otras estructuras de control según tus necesidades. Retorna la capa deseada
            }

        })
        .catch(function (error) {
            console.error('Error:', error);
        });


    /////////////////////////////////////////////////////////////////////
    // let geojsonLayer = L.geoJSON(null, {
    //     style: {
    //         color: 'red',
    //         weight: 3,
    //         opacity: 1
    //     },
    //     onEachFeature: function (feature, layer) {
    //         let properties = feature.properties;
    //         let popupContent =
    //             '<div class="popup-content">' +
    //             '<h4>Hospital: <em>' + properties.nombrehospital + '</em></h4>' +
    //             '</div>';
    //         let popupOptions = {
    //             className: 'custom-popup'
    //         };
    //         layer.bindPopup(popupContent, popupOptions);
    //     }
    // }).addTo(this.map);

    // let url =
    //     'http://localhost:' +
    //     this.puertoGeoServer +
    //     '/geoserver/wfs?' +
    //     'service=WFS&' +
    //     'request=GetFeature&' +
    //     'typeName=' +
    //     this.baseDatos +
    //     ':' + this.Rutas + '&' +
    //     'srsName=' + this.srid + '&' +
    //     'outputFormat=application/json';

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
            }).addTo(this.map);
        })
        .catch(function (error) {
            console.error('Error:', error);
        });
    //  }

    // };
    ///////////////////////// FIN OPCIONES DE MAPA /////////////////////////

    // let geojsonLayers = L.geoJSON(null, {
    //     pointToLayer: function (feature, latlng) {
    //         let idh = feature.properties.idhospital;
    //         let colors = [
    //             'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'cyan',
    //             'magenta', 'lime', 'pink', 'teal', 'maroon', 'navy', 'olive',
    //         ];
    //         let markerColor = colors[idh - 1] || 'blue'
    //         return L.circleMarker(latlng, {
    //             radius: 8,
    //             fillColor: markerColor,
    //             color: '#000',
    //             weight: 1,
    //             opacity: 1,
    //             fillOpacity: 0.8
    //         });
    //     }
    // }).addTo(map); // Crear una capa de GeoJSON
    var geojsonLayer = L.geoJSON().addTo(map);
    let urls =
        'http://localhost:8081/geoserver/wfs?' +
        'service=WFS&' +
        // 'version=1.1.0&' +
        'request=GetFeature&' +
        'typeName=Geo_lab2023_g14PersistenceUnit:ambulancia&' +
        'srsName=EPSG:32721&' +
        'outputFormat=application/json';

    fetch(urls)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            geojsonLayer.addData(data);  // Agregar los datos a la capa de GeoJSON


            // Configurar el evento de clic en los marcadores
            geojsonLayer.eachLayer(function (layer) {
                layer.on('click', function (e) {
                    let properties = e.target.feature.properties;
                    let popupContent =
                        '<div class="popup-content">' +
                        properties.nombrehospital
                    '</div>';
                    let popupOptions = {
                        className: 'custom-popup'
                    };
                    layer.closePopup(); // Cerrar el popup anterior si existe
                    layer.bindPopup(popupContent, popupOptions).openPopup();
                })
            })
        })
        .catch(function (error) {
            console.error('Error:', error);
        });
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
