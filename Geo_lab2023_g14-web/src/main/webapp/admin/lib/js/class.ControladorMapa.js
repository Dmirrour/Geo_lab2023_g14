class ControladorMapa extends Configuracion {
        openst;
        google;
        layerEjes;
        layerDepartamento;
        layerRuta;
        servicioEH;
        vista_se_h;
        map;
        markerSE;


        constructor() {
            super();
            ///////////////////////// MAPAS /////////////////////////
            // Agregar capa base de OpenStreetMap
            this.openst = L.tileLayer(this.urlOpenStreet, { attribution: '© Grupo 14'});
            // Agregar capa base de Google
            this.google = L.tileLayer(this.urlGoogle, { attribution: '© Grupo 14'});
            ///////////////////////// FIN MAPAS /////////////////////////

            ///////////////////////// CAPAS WMS /////////////////////////
            this.layerRuta = L.tileLayer.wms('http://localhost:'
                +this.puertoGeoServer
                +'/geoserver/'
                +this.baseDatos
                +'/wms?', {
                title: this.rutas,
                layers: this.baseDatos+':'+this.rutas,
                srs: this.srid,
                format: 'image/png',
                transparent: true,
                VERSION: '1.1.0'
            });

            this.layerEjes = L.tileLayer.wms('http://localhost:'
                +this.puertoGeoServer
                +'/geoserver/'
                +this.baseDatos
                +'/wms?', {
                title: this.ejes,
                layers: this.baseDatos+':'+this.ejes,
                srs: this.srid,
                format: 'image/png',
                transparent: true,
                VERSION: '1.1.0'
            });

            this.layerDepartamento = L.tileLayer.wms('http://localhost:'
                +this.puertoGeoServer
                +'/geoserver/'
                +this.baseDatos
                +'/wms?', {
                title: this.deptos,
                layers: +this.baseDatos+':'+this.deptos,
                srs: this.srid,
                format: 'image/png',
                transparent: true,
                VERSION: '1.1.0'
            });

            this.servicioEH = L.tileLayer.wms('http://localhost:'
                +this.puertoGeoServer
                +'/geoserver/'
                +this.baseDatos
                +'/wms?', {
                title: 'servicioemergencia',
                layers: this.baseDatos+':servicioemergencia',
                srs: this.srid,
                format: 'image/png',
                transparent: true,
                VERSION: '1.1.0'
            });

            this.vista_se_h = L.tileLayer.wms('http://localhost:'
                +this.puertoGeoServer
                +'/geoserver/'
                +this.baseDatos
                +'/wms?', {
                title: this.vista_SEH,
                layers: this.baseDatos+':'+this.vista_SEH,
                srs: this.srid,
                format: 'image/png',
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


            let drawLayers = new L.FeatureGroup(); // Agrupa elementos graficos
            let drawControl = new L.Control.DrawPlus({
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
            this.map.addLayer(drawLayers);
            this.map.addControl(drawControl);

            L.control.layers(
                baselayers,
                overlayers, {
                    collapsed: true
                }).addTo(this.map);

            this.map.fitBounds([[-35, -56], [-34, -56]]); // btn Ubicacion
            L.geolet({
                position: 'bottomleft'
            }).addTo(this.map);

            this.map.on(L.Draw.Event.CREATED, function (e) {
                drawLayers.addLayer(e.layer);
            });
        }

        addLayersWFS() {
            let geojsonLayer = L.geoJSON().addTo(this.map); // Crear una capa de GeoJSON
            let url =
                'http://localhost:'
                +this.puertoGeoServer
                +'/geoserver/wfs?service=WFS&' +
                // 'version=1.1.0&' +
                'request=GetFeature&typeName='
                +this.baseDatos
                +':'+this.vista_SEH+'&'+
                'srsName='+this.srid+
                '&outputFormat=application/json';
            console.log(url);

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
                                'Camas libres: ' + properties.camaslibres + '<br>' +
                                'Total de camas: ' + properties.totalcama + '<br>' +
                                'Hospital Nombre: ' + properties.nombrehospital + '<br>' +
                                'Hospital Tipo: ' + properties.tipohospital;
                            layer.bindPopup(popupContent).openPopup();
                        });
                    });
                })
                .catch(function (error) {
                    console.error('Error:', error);
                });
        }

        cargarMapaAltaSE() {

            // Crea un marcador y guarda la posición en los campos de latitud y longitud
            let markerSE = L.marker([0, 0]).addTo(this.map);
            this.map.on('click', function (e) {
                var prefijo = "frmAltaSE";
                var latitud = e.latlng.lat;
                var longitud = e.latlng.lng;

                markerSE.setLatLng(e.latlng);
                markerSE.bindPopup("Agregar Servicio de Emergencia en:<br>Latitud: " + latitud.toFixed(6) + "<br>Longitud: " + longitud.toFixed(6)).openPopup();

                document.getElementById(prefijo + ":latitud").value = e.latlng.lat;
                document.getElementById(prefijo + ":longitud").value = e.latlng.lng;

                this.markerSE = markerSE;
            });
        }

        BorrarMarcadorALtaSE() {
            // Elimina el marcador del mapa
            console.log("borrando marcador");
            this.map.removeLayer(this.markerSE);
        }

        cargarMapaAltaAmbulancia() {
            ///////////////////////// FIN OPCIONES DE MAPA /////////////////////////
            /*
            var recorrido = [];
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
            */
        }
    }
