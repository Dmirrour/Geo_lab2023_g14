
class ControladorMapa extends Configuracion {
    openst;
    google;

    layerEjes;
    layerDepartamento;
    layerRuta;

    servicioEH;
    vista_se_h;

    map;
    drawLayers;
    // heatmap;
    markerSE;

    constructor() {
        super();
        ///////////////////////// MAPAS /////////////////////////
        // Agregar capa base de OpenStreetMap
        this.openst = L.tileLayer(this.urlOpenStreet, { attribution: '© Grupo 14' });
        // Agregar capa base de Google
        this.google = L.tileLayer(this.urlGoogle, { attribution: '© Grupo 14' });
        ///////////////////////// FIN MAPAS /////////////////////////

        ///////////////////////// CAPAS WMS /////////////////////////
        this.layerRuta = L.tileLayer.wms('http://localhost:'
            + this.puertoGeoServer
            + '/geoserver/'
            + this.baseDatos
            + '/wms?', {
            title: this.rutas,
            layers: this.baseDatos + ':' + this.rutas,
            srs: this.srid,
            format: 'image/png',
            transparent: true,
            VERSION: '1.1.0'
        });

        this.layerEjes = L.tileLayer.wms('http://localhost:'
            + this.puertoGeoServer
            + '/geoserver/'
            + this.baseDatos
            + '/wms?', {
            title: this.ejes,
            layers: this.baseDatos + ':' + this.ejes,
            srs: this.srid,
            format: 'image/png',
            transparent: true,
            VERSION: '1.1.0'
        });

        this.layerDepartamento = L.tileLayer.wms('http://localhost:'
            + this.puertoGeoServer
            + '/geoserver/'
            + this.baseDatos
            + '/wms?', {
            title: this.deptos,
            layers: +this.baseDatos + ':' + this.deptos,
            srs: this.srid,
            format: 'image/png',
            transparent: true,
            VERSION: '1.1.0'
        });

        this.servicioEH = L.tileLayer.wms('http://localhost:'
            + this.puertoGeoServer
            + '/geoserver/'
            + this.baseDatos
            + '/wms?', {
            title: 'servicioemergencia',
            layers: this.baseDatos + ':servicioemergencia',
            srs: this.srid,
            format: 'image/png',
            transparent: true,
            VERSION: '1.1.0'
        });

        this.vista_se_h = L.tileLayer.wms('http://localhost:'
            + this.puertoGeoServer
            + '/geoserver/'
            + this.baseDatos
            + '/wms?', {
            title: this.vista_SEH,
            layers: this.baseDatos + ':' + this.vista_SEH,
            srs: this.srid,
            format: '   image/png',
            transparent: true,
            VERSION: '1.1.0'
        });
        ///////////////////////// FIN CAPAS WMS  /////////////////////////

        ///////////////////////// OPCIONES DE MAPA /////////////////////////
        this.map = L.map('map', {
            center: [-34.8797018070320851, -56.262557241497211],
            zoom: 11,
            minZoom: 2,
            maxZoom: 18,
            layers: [this.openst],
            zoomControl: true
        });


    }
    crearMapaAdmin() {

        let baselayers = {
            "Open Street Map": this.openst,
            "Google Maps": this.google
        };

        let overlayers = {
            "Departamentos": this.layerDepartamento,
            "Ejes": this.layerEjes,
            "Rutas": this.layerRuta

        };


        // this.heatmap = L.webGLHeatmap({
        //     size: 50,
        //     units: 'px',
        //     alphaRange: 0.4
        // });

        // var dataPoints = [
        //     [50.880509986, -114.081560859],
        //     [50.880509986, -114.081560859],
        //     [50.880509986, -114.081560859],
        //     [44.53666687, -64.243164062],
        //     [44.639999389, -63.613998413],
        //     [44.676998138, -63.612499237],
        //     [44.679332733, -63.610500335],
        //     [50.970165252, -114.06916809],
        //     [34.104833333, -118.323],
        //     [50.579812463, -113.872800754],
        //     [51.055080414, -114.056716919],
        //     [44.648111204, -63.577139396],
        //     [44.642322778, -63.579243422],
        //     [44.643284609, -63.568868637],
        //     [44.718542104, -63.683588477],
        //     [44.718418471, -63.683593422],
        //     [44.718461344, -63.683637427],
        //     [44.718412771, -63.683782686],
        //     [44.718390978, -63.683674224],
        //     [44.718426894, -63.683400638],
        //     [44.718389102, -63.683563615],
        //     [44.643199507, -63.568366686],
        //     [-34.849593, -56.148720],
        //     [-34.881988, -56.175156],
        //     [-34.859172, -56.137047],
        //     [-34.871003, -56.126404],
        //     [44.718385449, -63.683592853]
        // ];
        // this.heatmap.setData(dataPoints);
        // this.heatmap.multiply(2);
        // this.map.addLayer(this.heatmap);

        this.drawLayers = new L.FeatureGroup(); // Agrupa elementos graficos
        let drawControl = new L.Control.DrawPlus({
            position: 'topright',
            draw: {
                polyline: true
            },
            edit: {
                featureGroup: this.drawLayers,
                edit: true
            }
        });

        this.map.addLayer(this.drawLayers);
        this.map.addControl(drawControl);

        L.control.layers(
            baselayers,
            overlayers, {
            collapsed: true
        }).addTo(this.map);

        //this.map.fitBounds([[-35, -56], [-34, -56]]); // btn Ubicacion
        //L.geolet({
        //    position: 'bottomleft'
        //}).addTo(this.map);

        this.map.on(L.Draw.Event.CREATED, function (e) {
            this.drawLayers.addLayer(e.layer);
        }, this);
    }

    addLayersWFS() {
        let geojsonLayer = L.geoJSON(null, {
            pointToLayer: function (feature, latlng) {
                let idh = feature.properties.idhospital;
                let colors = [
                    'red',
                    'blue',
                    'green',
                    'yellow',
                    'orange',
                    'purple',
                    'cyan',
                    'magenta',
                    'lime',
                    'pink',
                    'teal',
                    'maroon',
                    'navy',
                    'olive',
                    'silver',
                    'aqua',
                    'fuchsia',
                    'gray',
                    'black',
                    'white'
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
        let url =
            'http://localhost:'
            + this.puertoGeoServer
            + '/geoserver/wfs?service=WFS&' +
            // 'version=1.1.0&' +
            'request=GetFeature&typeName='
            + this.baseDatos
            + ':' + this.vista_SEH + '&' +
            'srsName=' + this.srid +
            '&outputFormat=application/json';
        //console.log(url);

        fetch(url)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                geojsonLayer.addData(data);      // Agregar los datos a la capa de GeoJSON
                // Configurar el evento de clic en los marcadores
                geojsonLayer.eachLayer(function (layer) {
                    layer.on('click', function (e) {
                        let properties = e.target.feature.properties;
                        let popupContent =
                            '<div class="popup-content">' +
                            '<h4>S. E.: <em>' + properties.nombre + '</em></h4>' +
                            '<p><em>Camas libres: </em><b>' + properties.camaslibres + '</b></p>' +
                            '<p><em>Total de camas: </em><b>' + properties.totalcama + '</b></p>' +
                            '<p><em>Hospital Nombre: </em><b>' + properties.nombrehospital + '</b></p>' +
                            '<p><em>Hospital Tipo: </em><b>' + properties.tipohospital + '</b></p>' +
                            '</div>';
                        let popupOptions = {
                            className: 'custom-popup'
                        };

                        layer.closePopup(); // Cerrar el popup anterior si existe
                        layer.bindPopup(popupContent, popupOptions).openPopup();
                    });
                });
            })
            .catch(function (error) {
                console.error('Error:', error);
            });
    }

    addLayerWFSLine() {
        let geojsonLayer = L.geoJSON(null, {
            style: {
                color: 'red',
                weight: 3,
                opacity: 1
            },
            onEachFeature: function (feature, layer) {
                let properties = feature.properties;
                let popupContent =
                    '<div class="popup-content">' +
                    '<h4>Hospital: <em>' + properties.nombrehospital + '</em></h4>' +
                    '<p><em>Ambulancia ID: </em><b>' + properties.idambulancia + '</b></p>' +
                    '<p><em>Ambulancia codigo: </em><b>' + properties.idcodigo + '</b></p>' +
                    '<p><em>Desvio Max.: </em><b>' + properties.distanciamaxdesvio + '</b></p>' +
                    '</div>';
                let popupOptions = {
                    className: 'custom-popup'
                };

                layer.bindPopup(popupContent, popupOptions);
            }
        }).addTo(this.map);

        let url =
            'http://localhost:' +
            this.puertoGeoServer +
            '/geoserver/wfs?' +
            'service=WFS&' +
            'request=GetFeature&' +
            'typeName=' +
            this.baseDatos +
            ':' + this.vista_LineString + '&' +
            'srsName=' + this.srid + '&' +
            'outputFormat=application/json';

        fetch(url)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                geojsonLayer.addData(data);
            })
            .catch(function (error) {
                console.error('Error:', error);
            });
    }

    cargarMapaAltaSE() {
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

    BorrarMarcadorALtaSE() {
        // Elimina el marcador del mapa
        console.log("borrando marcador");
        this.map.removeLayer(this.markerSE);
    }

    cargarMapaAltaAmbulancia() {
        ///////////////////////// FIN OPCIONES DE MAPA /////////////////////////
        /*     var recorrido = [];
 let marker = L.marker([0, 0]).addTo(mapAmbulancia);
 mapAmbulancia.on('click', function (e) {
     let latitud = e.latlng.lat;
     let longitud = e.latlng.lng;
     let punto;

     recorrido.push({
         latitud,
         longitud
     });
     for (var i = 0; i < recorrido.length; i++) {
         punto = recorrido[i];
     }
     console.log('Latitud:', punto.latitud, 'Longitud:', punto.longitud);

     var data = 'LINESTRING(' + punto + ')';
     console.log('Punto:', data);
     marker.setLatLng(e.latlng);
     document.getElementById("j_idt61:rec").value = data;;
 });
 *//*
                                                                                                                                                                                              // Configuración del mapa Leaflet
                                                                                                                                                                                              var map = L.map('map').setView([51.505, -0.09], 13);
                                                                                                                                                                                      
                                                                                                                                                                                              // Crear una capa de dibujo
                                                                                                                                                                                              var drawnItems = new L.FeatureGroup().addTo(this.map);
                                                                                                                                                                                      
                                                                                                                                                                                              // Configurar la herramienta de dibujo
                                                                                                                                                                                              var drawControl = new L.Control.Draw({
                                                                                                                                                                                                  draw: {
                                                                                                                                                                                                      polyline: true,
                                                                                                                                                                                                      // Otras opciones de dibujo
                                                                                                                                                                                                  },
                                                                                                                                                                                                  edit: {
                                                                                                                                                                                                      featureGroup: drawnItems,
                                                                                                                                                                                                      // Opciones de edición
                                                                                                                                                                                                  }
                                                                                                                                                                                              }).addTo(this.map);
                                                                                                                                                                                              */
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
    }

}
