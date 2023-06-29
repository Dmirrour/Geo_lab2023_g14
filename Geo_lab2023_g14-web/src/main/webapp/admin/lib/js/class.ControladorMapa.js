
class ControladorMapa extends Configuracion {
    openst;
    servicioEH;
    map;
    drawLayers;
    // heatmap;
    markerSE;
    marcador;
    marcadorMiUbicacion;

    urlBase = "https://direcciones.ide.uy/api/v1/geocode/";
    dato = [];
    datoEsq = [];
    seleccion = [];
    seleccionEsq = [];
    coordenadasA = [];
    coordenadasSE = [];
    circulo = null;
    controlEnrutamiento;
    capaAddLayerWFSbufferNoIntersect;
    capaCoberturaEnMiUbicacionSE;
    capaCoberturaEnMiUbicacionA;
    capaAddLayerWFSbuf;
    capaAddLayerWFSSE;
    capaAddLayerWFSLine;
    capaAddLayerWFSZonaSCobertura;
    formularioContainer = document.getElementById("contenedorFrmBuscar");
    btnMostrarBuscador = document.getElementById('mostrarBuscador');

    constructor() {
        super();
        // Agregar capa base de OpenStreetMap
        this.openst = L.tileLayer(this.urlOpenStreet, { attribution: '© Grupo 14' });


        ///////////////////////// CAPAS WMS ///////////////////////////////
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

        ///////////////////////// OPCIONES DE MAPA /////////////////////////
        this.map = L.map('map', {
            center: [-34.870046767198566, -56.16937894760009],
            zoom: 13,
            minZoom: 11,
            maxZoom: 20,
            layers: [this.openst],
            zoomControl: true
        });
    }
    getMap() {
        return this.map;
    }
    crearMapaAdmin() {
        this.drawLayers = new L.FeatureGroup(); // Agrupa elementos graficos
        let drawControl = new L.Control.DrawPlus({
            position: 'topright',
            draw: {
                polyline: true,
                polygon: false,
                rectangle: false,
                circle: false
            },
            edit: {
                featureGroup: this.drawLayers,
                edit: true
            }
        });

        this.map.addLayer(this.drawLayers);
        this.map.addControl(drawControl);

        //this.map.fitBounds([[-35, -56], [-34, -56]]); // btn Ubicacion

        this.map.on(L.Draw.Event.CREATED, function (e) {
            this.drawLayers.addLayer(e.layer);
        }, this);

        this.agregarBotonFormularioGPS();
        this.agregarBotonFormualrioDireccion();
        this.agregarBotonZonaSinCobertura();
        this.agregarBotonServicioMasAmbulancia();
        this.agregarBotonMostrarBuffer();
        this.agregarBotonMostrarOcultarSEs();
        this.agregarBotonMostrarOcultarRecorridos();
        this.agregarBotonLimpiar();
    }
    capaAddLayerWFSZonaSCobertura (geo) {
        this.capaAddLayerWFSZonaSCobertura = geo;
    }
    agregarBotonFormualrioDireccion() {
        // Crear el botón
        let botonFormulario = L.control({ position: 'topright' });

        botonFormulario.onAdd = function (map) {
            let button = L.DomUtil.create('button', 'leaflet-touch');
            button.id = "mostrarBuscador";
            button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-signpost-2" viewBox="0 0 16 16">' +
                '<path d="M7 1.414V2H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h5v1H2.5a1 1 0 0 0-.8.4L.725 8.7a.5.5 0 0 0 0 .6l.975 1.3a1 1 0 0 0 .8.4H7v5h2v-5h5a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H9V6h4.5a1 1 0 0 0 .8-.4l.975-1.3a.5.5 0 0 0 0-.6L14.3 2.4a1 1 0 0 0-.8-.4H9v-.586a1 1 0 0 0-2 0zM13.5 3l.75 1-.75 1H2V3h11.5zm.5 5v2H2.5l-.75-1 .75-1H14z"/></svg>';
            // Crear el tooltip
            let tooltip = L.tooltip({
                permanent: true,
                direction: 'top',
                className: 'tooltip-custom',
                offset: [0, -10],
                sticky: true
            }).setContent('Servicios en una direccion.');

            // Asignar el tooltip al botón
            //tooltip.addTo(this.map);
            // Agregar evento clic para mostrar el formulario
            L.DomEvent.on(button, 'click', function () {
                console.log("controladorMapa::agregarBotonFormularioDireccion: AAGREGAR CODIGO PARA MOSTARR FORMULARIO DE DIRECCION");
                let formularioContainer = document.getElementById("contenedorFrmBuscar");
                let btnMostrarBuscador = document.getElementById('mostrarBuscador');
                if (formularioContainer.style.display == "none") {
                    formularioContainer.style.display = "block";
                    btnMostrarBuscador.style.backgroundColor = 'rgba(38,71,191,1)';
                } else {
                    formularioContainer.style.display = 'none';
                    btnMostrarBuscador.style.backgroundColor = '#f4f4f4';
                }
            }, this);
            return button;
        }
        botonFormulario.addTo(this.map);
    }
    agregarBotonServicioMasAmbulancia(mapaAdmin) {
        // Crear el botón
        let btnCobertura = L.control({ position: 'topright' });

        btnCobertura.onAdd = function (map) {
            let button = L.DomUtil.create('button', 'leaflet-touch');
            button.id = "btnServMasAmb";
            button.innerHTML = 'SA';
            // Crear el tooltip
            let tooltip = L.tooltip({
                permanent: true,
                direction: 'left',
                className: 'tooltip-custom',
                offset: [0, -10],
                sticky: true
            }).setContent('Servicios con mas ambulancias');

            // Asignar el tooltip al botón
            //tooltip.addTo(this.map);

            L.DomEvent.on(button, 'click', function () {
                let btn = document.getElementById('btnServMasAmb');
                let color = '#f60707';
                if (btn.style.backgroundColor == color) {
                    btn.style.backgroundColor = 'rgba(38,71,191,1)';
                } else {
                    btn.style.backgroundColor = color;
                }
            }, this);
            return button;
        };

        btnCobertura.addTo(this.map);
    }
    agregarBotonMostrarOcultarSEs(mapaAdmin) {
        // Crear el botón
        let btnMBuffer = L.control({ position: 'topright' });

        btnMBuffer.onAdd = function (map) {
            let button = L.DomUtil.create('button', 'leaflet-touch');
            button.id = "btnMOSerEme";
            // Crear el tooltip
            let tooltip = L.tooltip({
                permanent: true,
                direction: 'top',
                className: 'tooltip-custom',
                offset: [0, -10],
                sticky: true
            }).setContent('Mostrar ocultar recorridos.');

            // Asignar el tooltip al botón
            //tooltip.addTo(this.map);
            button.innerHTML = 'SE';
            return button;
        };

        btnMBuffer.addTo(this.map);
    }
    agregarBotonMostrarOcultarRecorridos(mapaAdmin) {
        // Crear el botón
        let btnMBuffer = L.control({ position: 'topright' });

        btnMBuffer.onAdd = function (map) {
            let button = L.DomUtil.create('button', 'leaflet-touch');
            button.id = "btnMORecorridos";
            // Crear el tooltip
            let tooltip = L.tooltip({
                permanent: true,
                direction: 'top',
                className: 'tooltip-custom',
                offset: [0, -10],
                sticky: true
            }).setContent('Mostrar ocultar recorrido.');

            // Asignar el tooltip al botón
            //tooltip.addTo(this.map);
            button.innerHTML = 'R';
            return button;
        };

        btnMBuffer.addTo(this.map);
    }
    agregarBotonMostrarBuffer(mapaAdmin) {
        // Crear el botón
        let btnMBuffer = L.control({ position: 'topright' });

        btnMBuffer.onAdd = function (map) {
            let button = L.DomUtil.create('button', 'leaflet-touch');
            button.id = "btnMBuffer";
            // Crear el tooltip
            let tooltip = L.tooltip({
                permanent: true,
                direction: 'top',
                className: 'tooltip-custom',
                offset: [0, -10],
                sticky: true
            }).setContent('Ver Zonas CON Cobertura.');

            // Asignar el tooltip al botón
            //tooltip.addTo(this.map);
            button.innerHTML = 'Buff';
            return button;
        };

        btnMBuffer.addTo(this.map);
    }
    agregarBotonFormularioGPS() {
        // Crear el botón
        let btnGPS = L.control({ position: 'topright' });

        btnGPS.onAdd = function (map) {
            let button = L.DomUtil.create('button', 'leaflet-touch');
            button.id = "btnGPS";
            button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-geo" viewBox="0 0 16 16">\n' +
                '<path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm0-15a7 7 0 1 1 0 14A7 7 0 0 1 8 1zm0 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm0 1a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />\n' +
                '</svg>';
            // Crear el tooltip
            let tooltip = L.tooltip({
                permanent: false,
                direction: 'top',
                className: 'tooltip-custom',
                offset: [0, -10],
                sticky: true
            }).setContent('Servicios en mi ubicación.');

            L.DomEvent.on(button, 'click', function () {
                if (navigator.geolocation) {
                    // Obtener la ubicación del usuario
                    navigator.geolocation.getCurrentPosition(function (position) {
                        var lat = position.coords.latitude;
                        var lng = position.coords.longitude;
                        //mapaAdmin.actualizarMapa(lat, lng);
                        mapaAdmin.coberturaEnMiUbicacion(lat, lng);
                        //console.log("controladorMapa::crarMapa::lat: "+lat);
                    });
                } else {
                    alert('Tu navegador no es compatible con la geolocalización.');
                }
            }, this);

            return button;
        };

        btnGPS.addTo(this.map);
    }
    agregarBotonZonaSinCobertura() {
        // Crear el botón
        let btnZsC = L.control({ position: 'topright' });

        btnZsC.onAdd = function (map) {
            let button = L.DomUtil.create('button', 'leaflet-touch');
            button.id = "btnZsC";
            button.innerHTML = 'ZsC';
            // Crear el tooltip
            let tooltip = L.tooltip({
                permanent: false,
                direction: 'top',
                className: 'tooltip-custom',
                offset: [0, -10],
                sticky: true
            }).setContent('Zona SIN cobertura.');

            L.DomEvent.on(button, 'click', function () {
                zonasSinCobertura();
            }, this);

            return button;
        };

        btnZsC.addTo(this.map);
    }
    agregarBotonOcultarRecorrido() {
        // Crear el botón
        let btnGPS = L.control({ position: 'topright' });

        btnGPS.onAdd = function (map) {
            let button = L.DomUtil.create('button', 'btn btn-primary');
            button.id = "ocultarRecorrido";
            button.innerHTML = 'X';

            // Agregar evento clic para mostrar el formulario
            L.DomEvent.on(button, 'click', function () {
                let divs = document.getElementsByClassName('leaflet-routing-container');
                let btn = document.getElementById('ocultarRecorrido');
                //div.item(0).style.display = 'none';
                // btnGPS.removeFrom(this.map);
                Array.from(divs).forEach(function (div) {
                    div.style.display = 'none';
                });
                btn.style.display = 'none';
            }, this);

            return button;
        };

        btnGPS.addTo(this.map);
    }
    agregarBotonLimpiar() {
        // Crear el botón
        let btnGPS = L.control({ position: 'topright' });

        btnGPS.onAdd = function (map) {
            let button = L.DomUtil.create('button', 'leaflet-touch');
            button.id = "btnGPS";
            button.innerHTML = 'L';
            // Crear el tooltip
            let tooltip = L.tooltip({
                permanent: false,
                direction: 'top',
                className: 'tooltip-custom',
                offset: [0, -10],
                sticky: true
            }).setContent('Limpiar.');

            L.DomEvent.on(button, 'click', function () {
                if (navigator.geolocation) {
                    // ocultar todo

                    if (mapaAdmin.capaCoberturaEnMiUbicacionA) {
                        mapaAdmin.capaCoberturaEnMiUbicacionA.remove();
                        mapaAdmin.marcadorMiUbicacion.remove();
                        mapaAdmin.capaCoberturaEnMiUbicacionA = null;
                    }

                    if (mapaAdmin.capaCoberturaEnMiUbicacionSE) {
                        mapaAdmin.capaCoberturaEnMiUbicacionSE.remove();
                        mapaAdmin.capaCoberturaEnMiUbicacionSE = null;
                    }

                    if (mapaAdmin.capaAddLayerWFSbufferNoIntersect) {
                        btnCobertura.style.backgroundColor = '#f4f4f4';
                        mapaAdmin.capaAddLayerWFSbufferNoIntersect.remove();
                        mapaAdmin.capaAddLayerWFSbufferNoIntersect = null;
                    }

                    if (mapaAdmin.capaAddLayerWFSbuf) {
                        btnMOBuffer.style.backgroundColor = '#f4f4f4';
                        mapaAdmin.capaAddLayerWFSbuf.remove();
                        mapaAdmin.capaAddLayerWFSbuf = null;
                    }

                    if (mapaAdmin.capaAddLayerWFSLine) {
                        btnMORecorridos.style.backgroundColor = '#f4f4f4';
                        mapaAdmin.capaAddLayerWFSLine.remove();
                        mapaAdmin.capaAddLayerWFSLine = null;
                    }

                    if (mapaAdmin.capaAddLayerWFSSE) {
                        btnMOSE.style.backgroundColor = '#f4f4f4';
                        mapaAdmin.capaAddLayerWFSSE.remove();
                        mapaAdmin.capaAddLayerWFSSE = null;
                    }

                } else {
                    alert('Tu navegador no es compatible con la geolocalización.');
                }
            }, this);

            return button;
        };

        btnGPS.addTo(this.map);
    }
    addLayersWFS() {
        let geojsonLayer = L.geoJSON(null, {
            pointToLayer: function (feature, latlng) {
                let idh = feature.properties.idhospital;
                // Calcula los componentes de color
                var rojo = (idh * 170) % 256;   // Rango de 0 a 255
                var verde = (idh * 130) % 256;  // Rango de 0 a 255
                var azul = (idh * 210) % 256;   // Rango de 0 a 255

                // Retorna el color hexadecimal en el formato "#RRGGBB"
                let color = "#" + rojo.toString(16).padStart(2, '0') +
                    verde.toString(16).padStart(2, '0') +
                    azul.toString(16).padStart(2, '0');

                let markerColor = color || 'blue';

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
            'http://localhost:' +
            this.puertoGeoServer +
            '/geoserver/wfs?service=WFS&' +
            'request=GetFeature&typeName=' +
            this.baseDatos + ':' +
            this.vista_SEH +
            '&srsName=' + this.srid +
            '&outputFormat=application/json';
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
                console.error('Error addLayersWFS: ', error);
            });
        this.capaAddLayerWFSSE = geojsonLayer;
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
            '/geoserver/wfs?service=WFS&' +
            'request=GetFeature&typeName=' +
            this.baseDatos + ':' +
            this.vista_LineString +
            '&srsName=' + this.srid +
            '&outputFormat=application/json';
        fetch(url)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                geojsonLayer.addData(data);
            })
            .catch(function (error) {
                console.error('Error addLayerWFSLine: ', error);
            });
        this.capaAddLayerWFSLine = geojsonLayer;
    }
    addLayerWFSbuf() {
        let geojsonLayer = L.geoJSON(null, {
            style: {
                color: 'blue',
                weight: 0,
                opacity: 1,
                fillOpacity: 0.2
            },
        }).addTo(this.map);
        let url =
            'http://localhost:' +
            this.puertoGeoServer +
            '/geoserver/wfs?service=WFS&' +
            'request=GetFeature&typeName=' +
            this.baseDatos + ':' +
            this.vista_buf +
            '&srsName=' + this.srid +
            '&outputFormat=application/json';
        fetch(url)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                geojsonLayer.addData(data);
            })
            .catch(function (error) {
                console.error('Error addLayerWFSbuf: ', error);
            });
        console.log('asignar capa de buffer');
        this.capaAddLayerWFSbuf = geojsonLayer;
    }
    addLayerWFSbufferNoIntersect() {
        // Servicio con mas ambulancias
        let geojsonLayer = L.geoJSON(null, {
            style: {
                color: 'green',
                weight: 3,
                opacity: 1
            },
        }).addTo(this.map);
        let url =
            'http://localhost:' +
            this.puertoGeoServer +
            '/geoserver/wfs?service=WFS&' +
            'request=GetFeature&typeName=' +
            this.baseDatos + ':' +
            this.vista_bufNoIntersec +
            '&srsName=' + this.srid +
            '&outputFormat=application/json';
        fetch(url)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                geojsonLayer.addData(data);
                console.log(data);

                geojsonLayer.eachLayer(function (layer) {
                    layer.on('click', function (e) {
                        let properties = e.target.feature.properties;
                        let popupContent =
                            '<div class="popup-content">' +
                            '<h4>Servicio con mas ambulancias.</h4>' +
                            '<p><em>Nombre: </em><b>' + properties.nombre + '</b></p>' +
                            '<p><em>Cant. de Ambulancias: </em><b>' + properties.cantidad_buffers + '</b></p>' +
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
                console.error('Error en addLayerWFSbufferNoIntersec: ', error);
            });
        console.log('asigna capa buff no intersctado....');
        this.capaAddLayerWFSbufferNoIntersect = geojsonLayer;
    }

    coberturaEnMiUbicacion (coorUserlat, coorUserlon) {
        let iconoPersonalizado = L.icon({
            iconUrl: '../resources/marker-icons/mapbox-marker-icon-20px-yellow.png',
            conSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30]
        });
        let marcador = L.marker([coorUserlat, coorUserlon], { icon: iconoPersonalizado }).addTo(this.map);
        marcador.display;
        marcador.bindPopup('<b>Estas aqui</b><br>Marcador -VERDE- indican <em>Servicio de Emergencia</em>.').openPopup();
        if (this.marcadorMiUbicacion) {
            this.map.removeLayer(this.marcadorMiUbicacion);
        }
        this.marcadorMiUbicacion = marcador;
        let geojsonLayer = L.geoJSON(null, {
            style: {
                color: 'red',
                weight: 0.8,
                opacity: 0.5
            },
        })//.addTo(this.map);
        let urlIntersect =
            'http://localhost:' +
            this.puertoGeoServer +
            '/geoserver/wfs?service=WFS&' +
            'request=GetFeature&typeName=' +
            this.baseDatos + ':' +
            this.vista_CoberturaEnPutno +
            '&outputFormat=application/json&' +
            'CQL_FILTER=INTERSECTS(buffer_zona_cobertura,POINT(' + coorUserlon + ' ' + coorUserlat + '))';
        // let a, b, c, d;
        fetch(urlIntersect)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                geojsonLayer.addData(data);
                console.log("DATOS buscar cobertura en direccion: ", data);
                this.coordenadasA.splice(0, this.coordenadasA.length);
                this.coordenadasSE.splice(0, this.coordenadasSE.length);
                data.features.forEach(function (feature) {
                    console.log("feature: ", feature);
                    let idh = feature.properties.first_point_recorrido.coordinates; // Coordenadas de la geometría del feature
                    //console.log("idh: ", idh);
                    this.coordenadasA.push({ idh });

                    let idse = feature.properties.point_se.coordinates; // Coordenadas del punto "first_point_recorrido"
                    //console.log("idse: ", idse);
                    this.coordenadasSE.push({ idse });
                }.bind(this));
                this.ubicarPuntosDeCobertura(geojsonLayer);
            }.bind(this))
            .catch(function (error) {
                console.error('Error coberturaEnMiUbicacion:', error);
            });
    }
    ubicarPuntosDeCobertura (geojsonLayer) {
        //console.log("ubicarPuntosDeCobertura: ", this.coordenadasA);
        //console.log("ubicarPuntosDeCobertura: ", this.coordenadasSE);

        if (mapaAdmin.capaCoberturaEnMiUbicacionA) {
            mapaAdmin.capaCoberturaEnMiUbicacionA.remove();
            mapaAdmin.marcadorMiUbicacion.remove();
            mapaAdmin.capaCoberturaEnMiUbicacionA = null;
        }

        if (mapaAdmin.capaCoberturaEnMiUbicacionSE) {
            mapaAdmin.capaCoberturaEnMiUbicacionSE.remove();
            mapaAdmin.capaCoberturaEnMiUbicacionSE = null;
        }

        // ambulancias
        let ambus = this.coordenadasA;
        let marcadores = [];

        for (const item of ambus) {
            const idh = item.idh;
            console.log("idh:", idh);

            const latitud = idh[1];
            const longitud = idh[0];

            if (latitud !== 0) {
                var ptoA = {
                    type: 'FeatureCollection',
                    features: [{
                        type: 'Feature',
                        properties: {},
                        geometry: {
                            type: 'Point',
                            coordinates: [longitud, latitud] // Intercambia latitud y longitud
                        }
                    }]
                };

                let icono = L.icon({
                    iconUrl: '../resources/marker-icons/ambulance.png',
                    iconSize: [25, 30],
                    iconAnchor: [15, 30],
                    popupAnchor: [0, -30]
                });

                let marcador = L.marker([latitud, longitud], {icon: icono});
                marcador.bindPopup('<b>Ambulancia cercana...</b>').openPopup();
                marcadores.push(marcador);
            }
        }

        this.capaCoberturaEnMiUbicacionA = L.layerGroup(marcadores);
        this.capaCoberturaEnMiUbicacionA.addTo(this.map); // Asegúrate de que el mapa se llame 'map' o reemplázalo con el nombre correcto si es diferente

        // servicio de emergencia
        let ses = this.coordenadasSE;
        marcadores = [];

        for (const item of ses) {
            const idse = item.idse;
            console.log("idse:", idse);

            const latitud = idse[1];
            const longitud = idse[0];

            if (latitud !== 0) {
                var ptoSE = {
                    type: 'FeatureCollection',
                    features: [{
                        type: 'Feature',
                        properties: {},
                        geometry: {
                            type: 'Point',
                            coordinates: [longitud, latitud] // Intercambia latitud y longitud
                        }
                    }]
                };

                let icono = L.icon({
                    iconUrl: '../resources/marker-icons/mapbox-marker-icon-20px-green.png',
                    iconSize: [25, 42],
                    iconAnchor: [15, 30],
                    popupAnchor: [0, -30]
                });

                let marcador = L.marker([latitud, longitud], {icon: icono}); // Intercambia latitud y longitud
                marcador.bindPopup('<b>Servicio de emergencia cercano...</b>').openPopup();
                marcadores.push(marcador);
            }
        }

        this.capaCoberturaEnMiUbicacionSE = L.layerGroup(marcadores);
        this.capaCoberturaEnMiUbicacionSE.addTo(this.map); // Asegúrate de que el mapa se llame 'map' o reemplázalo con el nombre correcto si es diferente

        if ( ambus.length == 0 && ses.length == 0 ) {
            alert("No hay cobertura en tu ubicación");
        }
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
    cargarMapaModSE(date) {
        // Crea un marcador y guarda la posición en los campos de latitud y longitud
        let markerSE = L.marker([0, 0]).addTo(this.map);
        this.map.on('click', function (e) {
            /*let prefijo = "dialogMODSE";
            let pref2 = "mod";*/
            let latitud = e.latlng.lat;
            let longitud = e.latlng.lng;

            //let row = data.closest('tr');
            //let id = row.getAttibute('data-ri');
/*
            console.log("Lat antes de act: " + document.getElementById(prefijo + ":" + id + ":frmMODSElatitud").value);
*/
            console.log('Número recibido:', date);

            markerSE.setLatLng(e.latlng);
            markerSE.bindPopup("Modificar Servicio de Emergencia en:<br>Latitud: " + latitud.toFixed(6) + "<br>Longitud: " + longitud.toFixed(6)).openPopup();

            document.getElementById("mods:" + date + ":frmMODSElatitud").value = latitud;
            document.getElementById("mods:" + date + ":frmMODSElongitud").value = longitud;
            /*console.log("Lat despues de act: " + document.getElementById(prefijo + ":" + id + ":frmMODSElatitud").value);*/

            this.markerSE = markerSE;
        }, this);
    }
    borrarMarcadorALtaSE() {
        // Elimina el marcador del mapa
        console.log("borrando marcador");
        this.map.removeLayer(this.markerSE);
    }
    generarColor(numero) {
        console.log("generarColor ");
        // Calcula los componentes de color
        var rojo = (numero * 17) % 256;   // Rango de 0 a 255
        var verde = (numero * 13) % 256;  // Rango de 0 a 255
        var azul = (numero * 21) % 256;   // Rango de 0 a 255

        // Retorna el color hexadecimal en el formato "#RRGGBB"
        return "#" + rojo.toString(16).padStart(2, '0') +
            verde.toString(16).padStart(2, '0') +
            azul.toString(16).padStart(2, '0');
    }
    cargarMapaAltaAmbulancia(date2) {
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
        /*
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
            this.savePolyline2(formattedPolyline, date2);
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
    savePolyline2(polyline, date2) {
        console.log(polyline);
        document.getElementById("modsA:"+date2+":rec").value = polyline;
    }
    async sugerencia(text) {

        var long = text.length;
        var options = "";
        var buscar = false;

        // buscar calle
        var urlCalle = this.urlBase + "candidates?limit=10&q=" + text + "&soloLocalidad=false"; // ",%20Montevideo&soloLocalidad=false";
        document.getElementById('visorDeListado').style.display = "none";

        if (long > 2) {
            buscar = true;
            document.getElementById('visorDeListado').style.display = "block";
        }

        if (buscar) {
            try {
                const response = await axios.get(urlCalle);
                if (response.status == 200) {
                    options = '<h6 class="dropdown-header dropdown-notifications-header"><i data-feather="bell"></i>Resultado autocumpletar...</h6>';
                    response.data.forEach(function (item) {
                        if (item.idCalle > 0) {
                            //console.log(item);
                            this.dato.push(item);

                            options += '<a class="dropdown-item dropdown-notifications-item" onclick="mapaAdmin.elegirCalle(' + item.idCalle + ')">';
                            options += '<div class="dropdown-notifications-item-icon';

                            if (item.type == 'CALLEyPORTAL') {
                                options += ' bg-warning"><i class="fa-solid fa-location-dot"></i></div><div class="dropdown-notifications-item-content"><div class="dropdown-notifications-item-content-details">';
                                options += item.localidad + ' / ' + item.departamento + '</div><div class="dropdown-notifications-item-content-text">' + item.nomVia + '</div></div></a>';
                            } else if (item.type == 'POI') {
                                options += ' bg-danger"><i class="fa-solid fa-house-flag"></i></div><div class="dropdown-notifications-item-content"><div class="dropdown-notifications-item-content-details">';
                                options += item.localidad + ' / ' + item.departamento + '</div><div class="dropdown-notifications-item-content-text"><b>' + item.inmueble + '</b> ' + item.nomVia + '</div></div></a>';
                            } else if (item.type == 'CALLE') {
                                options += ' bg-success"><i class="fa-solid fa-road"></i></div><div class="dropdown-notifications-item-content"><div class="dropdown-notifications-item-content-details">';
                                options += item.localidad + ' / ' + item.departamento + '</div><div class="dropdown-notifications-item-content-text">' + item.nomVia + '</div></div></a>';
                            } else if (item.type = 'LOCALIDAD') {
                                options += ' bg-info"><i class="fa-solid fa-location-pin"></i></div><div class="dropdown-notifications-item-content"><div class="dropdown-notifications-item-content-details">';
                                options += item.localidad + ' / ' + item.departamento + '</div></div></a>';
                            } else if (item.type = 'ESQUINA') {
                                options += ' bg-warning"><i class="fa-solid fa-arrows-to-circle"></i></div><div class="dropdown-notifications-item-content"><div class="dropdown-notifications-item-content-details">';
                                options += item.localidad + ' / ' + item.departamento + '</div><div class="dropdown-notifications-item-content-text">' + item.nomVia + '</div></div></a>';
                            } else if (item.type == 'MANZANAySOLAR') {
                                options += ' bg-warning"><i class="fa-solid fa-apple-whole"></i></div><div class="dropdown-notifications-item-content"><div class="dropdown-notifications-item-content-details">';
                                options += item.localidad + ' / ' + item.departamento + '</div><div class="dropdown-notifications-item-content-text">' + item.nomVia + '</div></div></a>';
                            } else {
                                options += ' bg-warning"><i class="fa-solid fa-route"></i></div><div class="dropdown-notifications-item-content"><div class="dropdown-notifications-item-content-details">';
                                options += item.localidad + ' / ' + item.departamento + '</div><div class="dropdown-notifications-item-content-text">' + item.nomVia + '</div></div></a>';
                            }
                        }
                    }, this);
                    options += '</select>';
                    document.getElementById('visorDeListado').innerHTML = options;
                } else {
                    console.warn("Ocurrio un error en la respuesta axios:\n" + response.status);
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            document.getElementById('visorDeListado').innerHTML = '<div class="fa-2x">Buscando <i class="fas fa-spinner fa-pulse"></i></div>';
        }
    }
    async buscarEsquinas() {
        var options = "";
        var urlEsq = this.urlBase + "/cruces?calle=" + this.seleccion.nomVia + "&departamento=" + this.seleccion.departamento + "&localidad=" + this.seleccion.localidad;
        //var item;
        this.datoEsq.pop();
        try {
            const response = await fetch(urlEsq)
                .then((response) => response.json())
                .then((item) => {
                    var idCalleEsq = 0;
                    var idCalleEsqAnt = 0;
                    options = '<label for="esquinaUbi" class="form-label">Esquina</label>';
                    options += '<select class="form-select" id="idSelectEsquina" name="idSelectEsquina" onchange="mapaAdmin.elegirEsquina();">';
                    options += '<option class="dropdown-header dropdown-notifications-header" Seleccionar esquina ...</option>';
                    item.forEach(function (item) {
                        idCalleEsq = item.idCalleEsq;
                        if (item.idCalle > 0) {
                            if (this.seleccion.nomVia == item.nomVia) {
                                if (idCalleEsq != idCalleEsqAnt) {
                                    // quitar repetidos
                                    this.datoEsq.push(item);
                                    options += '<option class="dropdown-item dropdown-notifications-item" value="' + item.idCalleEsq + '"><i>' + item.address + '</i></option>';
                                }
                                idCalleEsqAnt = item.idCalleEsq;
                            }
                        }
                    }, this);
                    options += '</select>';
                    document.getElementById('esquinaDiv').innerHTML = options;
                });
        } catch (error) {
            console.error(error);
        }
    }
    async buscarCalleNumeroAsync(portal) {
        var urlEsq = this.urlBase + "/find?idcalle=" + this.seleccion.idCalle + "&portal=" + portal + "&type=CALLEyPORTAL";
        //console.log("buscar calle numero: " + urlEsq);
        var item;
        if (this.seleccionEsq.length > 0) {
            this.seleccionEsq.pop();
        }
        try {
            const response = await fetch(urlEsq)
                .then((response) => response.json())
                .then((item) => {
                    console.log("buscarCalleNumero: " + item[0].nomVia);
                    this.seleccionEsq = item[0];
                    document.getElementById('direccion').value = item[0].address;
                    // this.actualizarMapa();
                    this.coberturaEnMiUbicacion(this.seleccionEsq.lat, this.seleccionEsq.lng);
                }, this.seleccionEsq);
        } catch (error) {
            console.error(error);
        }
    }
    elegirCalle(selectedValue) {
        this.seleccion = this.dato.find(item => item.idCalle == selectedValue);
        document.getElementById("departamento").value = this.seleccion.departamento;
        document.getElementById("barrio").value = this.seleccion.localidad;
        document.getElementById("calle").value = this.seleccion.nomVia;
        document.getElementById("visorDeListado").style.display = "none";
        this.buscarEsquinas();
    }
    elegirEsquina() {
        var selectedValue = document.getElementById('idSelectEsquina').options[document.getElementById('idSelectEsquina').selectedIndex].value;
        this.seleccionEsq = this.datoEsq.find(item => item.idCalleEsq == selectedValue);
        document.getElementById('direccion').value = this.seleccion.address;
        // this.actualizarMapa();
        this.coberturaEnMiUbicacion(this.seleccionEsq.lat, this.seleccionEsq.lng);
    }
    actualizarMapa(Lat = null, Lng = null) {
        var iconoPersonalizado = L.icon({
            iconUrl: '../resources/iconos/regroup.png',
            iconSize: [32, 32], // especifica el tamaño del icono en píxeles
            iconAnchor: [16, 32], // especifica el punto de anclaje del icono relativo a su posición
            popupAnchor: [0, -32] // especifica el punto de anclaje del popup relativo al icono
        });
        if (Lat != null && Lng != null) {
            this.seleccionEsq.lat = Lat;
            this.seleccionEsq.lng = Lng;
            this.seleccionEsq.address = "Ubicacion del usuario";
        }
        if (this.marcador != null) {
            this.map.removeLayer(this.marcador);
        }
        if (this.circulo != null) {
            this.map.removeLayer(this.circulo);
        }
        this.marcador = L.marker([this.seleccionEsq.lat, this.seleccionEsq.lng], { icon: iconoPersonalizado }).addTo(this.map);
        this.marcador.bindPopup("<h4>Mi ubicación</h4><br>" + this.seleccionEsq.address + "<br>" + this.seleccionEsq.lat + " , " + this.seleccionEsq.lng);
        this.marcador.display;
        this.circulo = L.circle([this.seleccionEsq.lat, this.seleccionEsq.lng], { // Circulo verde zona
            radius: 150,
            color: "green"
        }).addTo(this.map)
        this.circulo.bindPopup("Circulo");

        ///////////////// USUARIO
        var Usuario = {
            lat: this.seleccionEsq.lat,
            lon: this.seleccionEsq.lng
        };
        var Hospital = {
            lat: -34.87966454502086, // Latitud del punto de inicio
            lon: -56.18897438049317  // Longitud del punto de inicio
        };
        var SerEme = {
            lat: -34.880720712610824, // Latitud del punto de fin
            lon: -56.14906311035157  // Longitud del punto de fin
        };
        var ambulanciaMarcador = L.icon({
            iconUrl: '../resources/marker-icons/ambulance.svg',
            iconSize: [32, 32], // especifica el tamaño del icono en píxeles
            iconAnchor: [16, 32], // especifica el punto de anclaje del icono relativo a su posición
            popupAnchor: [0, -32] // especifica el punto de anclaje del popup relativo al icono
        });
        var hospitalMarcador = L.icon({
            iconUrl: '../resources/marker-icons/hospital_marker_gps.svg',
            iconSize: [32, 32], // especifica el tamaño del icono en píxeles
            iconAnchor: [16, 32], // especifica el punto de anclaje del icono relativo a su posición
            popupAnchor: [0, -32] // especifica el punto de anclaje del popup relativo al icono
        });
        var markerAmbulancia = L.marker([SerEme.lat, SerEme.lon], { icon: ambulanciaMarcador }).addTo(this.map);
        this.crearRecorrido(Hospital, SerEme, Usuario, markerAmbulancia);
    }
    crearRecorrido(Hospital, SerEme, Usuario, markerAmbulancia) {
        this.controlEnrutamiento = L.Routing.control({
            waypoints: [
                L.latLng(Hospital.lat, Hospital.lon),
                L.latLng(Usuario.lat, Usuario.lon),
                L.latLng(SerEme.lat, SerEme.lon)
            ]
        })
            .on('routesfound', function (e) {
                console.log(e);
                var routes = e.routes;
                var summary = routes[0].summary;
                console.log('Tiempo: ' + summary.totalTime / 60 + ' minutos; Distancia: ' + summary.totalDistance / 1000 + ' km');
                routes[0].coordinates.forEach(function (coord, index) {
                    setTimeout(() => {
                        markerAmbulancia.setLatLng(coord);
                    }, 500 * index);
                });
            })
            .addTo(this.map);
        this.agregarBotonOcultarRecorrido();
    }
    buscarCalleNumero() {
        let portal = document.getElementById('numeroCalle').value;
        // verificar que ya se haya llenado campo calle
        if (this.seleccion.id != null) {
            // verificar que se haya cargado un numero
            if (portal.length > 0) {
                // enviar las busqueda
                this.buscarCalleNumeroAsync(portal);
            } else {
                alert('Debe ingresar un número');
            }
        } else {
            alert('Debe seleccionar una calle');
        }
    }

    polygonMontevideo() {
        var poligono = turf.polygon([[
            // [-56.211776719428606, -34.90862548679357], [-56.18954248493538, -34.912915584600256], [-56.169924011919655, -34.91345187616928], [-56.17057794705035, -34.92256757516544], [-56.16011475445704, -34.934362899552], [-56.149651582818485, -34.92149517636705], [-56.139842388220146, -34.909698002189984], [-56.122185783460736, -34.89897182250856], [-56.099297613836825, -34.895753710879966], [-56.08098705299199, -34.897362808234334], [-56.06071466580034, -34.89629009735393], [-56.028671194799244, -34.87697882023446], [-56.03848036844284, -34.86571182010802], [-56.05613701511176, -34.86678494735823], [-56.055483017116785, -34.85229671993839], [-56.055483017116785, -34.824386273581055], [-56.04698175564409, -34.80613202977699], [-56.04044227860869, -34.79324424340208], [-56.031286935322, -34.77766881583348], [-56.037172540090985, -34.76370214149499], [-56.05025149416179, -34.75832972558535], [-56.0600607097149, -34.76692545248796], [-56.075755488127484, -34.77122297598994], [-56.086218659766025, -34.77552025849953], [-56.09733574558051, -34.77176012272247], [-56.09537391923369, -34.75779244841118], [-56.106491046957686, -34.74812114555186], [-56.11957000102849, -34.7465091387161], [-56.12480158684777, -34.73307462551597], [-56.12545552197844, -34.7158752476152], [-56.139842388220146, -34.71211240458171], [-56.15488316863777, -34.718025356923555], [-56.167308208532646, -34.730387443530546], [-56.17580953286962, -34.718025356923555], [-56.1928121605888, -34.71910039922509], [-56.206545070745065, -34.734149463513816], [-56.214392480906106, -34.74919577921076], [-56.22420169645921, -34.76370214149499], [-56.23270302079619, -34.767999832825105], [-56.24578199582176, -34.75940422640649],
            // [-56.26082279719413, -34.75188233231648], [-56.273247816134244, -34.747046480693214],
            // [-56.27651755465195, -34.73576170290936], [-56.282403054647155, -34.72178792230063], [-56.29613599623555, -34.71264996160757],
            // [-56.309214960783734, -34.70189811422023], [-56.328179456759244, -34.7035109911818], [-56.3386426283978, -34.713725065177655],
            // [-56.350413691252484, -34.72447538385315], [-56.34648998617195, -34.742747698659784], [-56.343874193262316, -34.753494225675276],
            // [-56.34125841083005, -34.77176012272247], [-56.35564527707176, -34.7841141865537], [-56.37787951156497, -34.791096108946554], [-56.39095847611317, -34.80022537563531],
            // [-56.4033834898146, -34.807205916726176], [-56.40926901600324, -34.81579654297345], [-56.4210400893353, -34.821165225266654], [-56.42954141629162, -34.827607195931755],
            // [-56.42692562338199, -34.835658933483415], [-56.41450060706121, -34.83941613811229], [-56.40142164775172, -34.8410263210871], [-56.387688727118075, -34.84907678067922],
            // [-56.37853346241174, -34.85873622042811], [-56.3661084487103, -34.86463869604757], [-56.35368342977018, -34.867321488538956], [-56.34125841083005, -34.87000417631503],
            // [-56.333411042578525, -34.88073415528141], [-56.33079524966889, -34.89146271644209], [-56.3196781219449, -34.89468099617331], [-56.31313864490949, -34.90379881369167],
            // [-56.304637320572525, -34.895217372464735], [-56.2922123016324, -34.893071863473175], [-56.27586359856651, -34.897362808234334], [-56.26540042692796, -34.90058087400675],
            // [-56.254283320158734, -34.904335096071655], [-56.24970564851538, -34.89629009735393], [-56.2451280397363, -34.88395287242176], [-56.2451280397363, -34.8705407136827],
            // [-56.23335697688163, -34.87590584321877], [-56.22158591402695, -34.8705407136827], [-56.20981480926276, -34.8737598299806], [-56.19869772344828, -34.882343512419055],
            // [-56.211776719428606, -34.90862548679357],

            [-56.214752127416446, -34.90832714998487], [-56.20984747773037, -34.911544803303855], [-56.202981022652246, -34.909935983815366],
            [-56.19774943683297, -34.912081035093614], [-56.19219091488049, -34.91261729774769], [-56.18695932906122, -34.91503040197456],
            [-56.1804198101163, -34.91422606469151], [-56.17355335503817, -34.91395792187381], [-56.169629702344544, -34.9169072213209],
            [-56.172572462819524, -34.91985643197939], [-56.17191848577932, -34.92280551948081], [-56.16701387800278, -34.9257545010037],
            [-56.16276324726642, -34.928971419646764], [-56.161455314140774, -34.933260488384555], [-56.15753166144715, -34.9270949105533],
            [-56.15230007562788, -34.92307359903211], [-56.145106642507024, -34.919052090441504], [-56.146741511765875, -34.91395792187381],
            [-56.139548078645035, -34.91020413977007], [-56.134316492825754, -34.911008516460214], [-56.131373732350774, -34.90510938774951],
            [-56.125161212403334, -34.90484123234053], [-56.120256583672024, -34.898941694920595], [-56.1117552802898, -34.897332645682894],
            [-56.10456184716896, -34.896259900034856], [-56.09998421743513, -34.899209835220866], [-56.09409869648516, -34.89545536168227],
            [-56.08690526336432, -34.89545536168227], [-56.08200063463301, -34.90028254234232], [-56.07578813564033, -34.89760080842264],
            [-56.06467100791633, -34.899209835220866], [-56.0558427264914, -34.89250529166141], [-56.027722950093455, -34.87936278527107],
            [-56.033608471043415, -34.87748514224789], [-56.03687816765161, -34.87158358871885], [-56.044071642681956, -34.86809611186621],
            [-56.051919031888254, -34.86916922519426], [-56.06042033527047, -34.86594991196926], [-56.05649668257684, -34.859242671976304],
            [-56.05355388019235, -34.84958322290614], [-56.05486179236323, -34.827845398061626], [-56.051919031888254, -34.82059817519852],
            [-56.05355388019235, -34.81522945595037], [-56.04864929337056, -34.80798112312848], [-56.04178283829243, -34.8047594334002],
            [-56.04178283829243, -34.798047198280976], [-56.04276377242059, -34.79079734571374], [-56.03622425347567, -34.784352505811455],
            [-56.030011712573476, -34.78059278115292], [-56.032300600782044, -34.77414714391641], [-56.03655118960888, -34.76662660171414],
            [-56.04243679437786, -34.762597467451876], [-56.04995720554143, -34.760448509120884], [-56.05551574844868, -34.760717117984015],
            [-56.057150554843254, -34.7663579948652], [-56.06205522548408, -34.769044006805835], [-56.0672867903486, -34.765552177680824],
            [-56.06990261469038, -34.77038697139001], [-56.07611511368305, -34.77146131527397], [-56.08363552484661, -34.77737002978084],
            [-56.0914828721434, -34.77951854755178], [-56.09671447891743, -34.77495287718412], [-56.099003283306956, -34.76931258770021],
            [-56.095733544789255, -34.76340330487295], [-56.09377171844245, -34.75641904749514], [-56.100965130608536, -34.75400128990254],
            [-56.106850672513254, -34.74970286983019], [-56.113063171505935, -34.74970286983019], [-56.11992962658406, -34.7467475751799],
            [-56.120256583672024, -34.74003060671929], [-56.1254881694913, -34.735731459610854], [-56.12352632218972, -34.729282319558294],
            [-56.12385330023245, -34.7193389104729], [-56.13464347086848, -34.71557622934771], [-56.142163882032044, -34.7136948224288],
            [-56.14903033711017, -34.7193389104729], [-56.15589679218829, -34.720682687665644], [-56.16668689996005, -34.73250695249099],
            [-56.172572462819524, -34.72605756081806], [-56.174534310121096, -34.718801396925684], [-56.18172774324194, -34.720682687665644],
            [-56.19120998075233, -34.72014517854806], [-56.19480669731274, -34.72310142899401], [-56.20265408651904, -34.72874487496295],
            [-56.20559684699401, -34.736000161782016], [-56.21180932503194, -34.74244877759144], [-56.21442514937372, -34.74889689008409],
            [-56.21867578011007, -34.755613141901975], [-56.21867578011007, -34.75991124573445], [-56.22227251762525, -34.764746369844076],
            [-56.23011990683154, -34.76984977268677], [-56.23535149265082, -34.76367191272949], [-56.24352583894507, -34.75883674290401],
            [-56.252354141324766, -34.75641904749514], [-56.25954757444561, -34.751852107831844], [-56.265760073438294, -34.7513148143356],
            [-56.27393441973255, -34.74352351087466], [-56.270664681214846, -34.73734366814181], [-56.27720416872762, -34.73626887168959],
            [-56.27981996163727, -34.72471387528994], [-56.28635943867267, -34.720682687665644],
            [-56.2945337954443, -34.71692006338202], [-56.29845747957007, -34.710738248595206], [-56.30597786977888, -34.70563117191504],
            [-56.311863422160975, -34.70348073177804], [-56.32167263771408, -34.701867864993744], [-56.32788514718414, -34.70563117191504],
            [-56.33148186374457, -34.709931884495994], [-56.33573252591305, -34.7136948224288], [-56.342925959033906, -34.71208215693683],
            [-56.34456082829275, -34.71692006338202], [-56.350119381677374, -34.72283267627559], [-56.35338910971769, -34.72632630305288],
            [-56.350119381677374, -34.73465663788377], [-56.34586871950888, -34.74352351087466], [-56.34227199247107, -34.749165562351735],
            [-56.343906861729934, -34.75480722844326], [-56.345541751943536, -34.75803085230031], [-56.34586871950888, -34.76528357594262],
            [-56.343906861729934, -34.77387857875584], [-56.34619569755161, -34.78005566610082], [-56.353062152629725, -34.78300976851996],
            [-56.365814139135196, -34.7989637737566], [-56.374315458233475, -34.79884352219744], [-56.38837535167114, -34.79697317480026],
            [-56.394260883098475, -34.8026115731534], [-56.40570497838781, -34.807444177850755], [-56.407993793254725, -34.814961007363266],
            [-56.416168147407014, -34.819256028186835], [-56.42434249893996, -34.82435606705443], [-56.43120895401808, -34.827845398061626],
            [-56.42859316110844, -34.83294490507298], [-56.42303460248514, -34.83670225076231], [-56.41649511759171, -34.83938597149642],
            [-56.40995564055629, -34.84045940777468], [-56.40145431098063, -34.842069570341636], [-56.39099114458077, -34.843411345553406],
            [-56.38902929204052, -34.848778227656865], [-56.38150889659301, -34.85172986706364], [-56.3811819133116, -34.85736451787367],
            [-56.375623354688294, -34.85897434967816], [-56.37169966532384, -34.86219391877146], [-56.364833215484396, -34.865413344646214],
            [-56.35633189114743, -34.86648647579135], [-56.354697021888576, -34.869705733625445], [-56.34815753437579, -34.867827870029785],
            [-56.34259898099118, -34.869705733625445], [-56.33605950395578, -34.8729248826152], [-56.3340976566542, -34.88070395224478],
            [-56.33148186374457, -34.88740949321568], [-56.329846994485706, -34.891432517348484], [-56.32330749649556, -34.89250529166141],
            [-56.31905684480444, -34.89545536168227], [-56.315460117766634, -34.90028254234232], [-56.31382524850779, -34.90457311042613],
            [-56.30826670560055, -34.902427828625896], [-56.3095745863393, -34.897064447694284], [-56.30434300052003, -34.89465083263711],
            [-56.29584168666043, -34.89330989328137], [-56.289629166712984, -34.89465083263711], [-56.28668641671539, -34.898941694920595],
            [-56.28080088528805, -34.894114435459166], [-56.27720416872762, -34.898405325761786], [-56.27426139777528, -34.90162336787404],
            [-56.268702833913274, -34.898137148462155], [-56.266087051481016, -34.90162336787404], [-56.26118244370447, -34.90269599191572],
            [-56.25660477206112, -34.90457311042613], [-56.255950857885196, -34.898405325761786], [-56.25039229402319, -34.89545536168227],
            [-56.24450673116372, -34.892773487347775], [-56.24516070820392, -34.88740949321568], [-56.2438528169878, -34.88204511452384],
            [-56.2490843818523, -34.87963102385463], [-56.244179753120996, -34.87560740476055], [-56.238294253125794, -34.87587565559909],
            [-56.23437055852265, -34.87909458019305], [-56.229465950746096, -34.87694863300882], [-56.22685012640432, -34.872120115780014],
            [-56.2199836713262, -34.8729248826152], [-56.21180934598671, -34.873193142206944], [-56.2078856304288, -34.87694863300882],
            [-56.20363499969245, -34.87989926156279], [-56.19840341387317, -34.88392267056798], [-56.197095522657044, -34.89062791453004],
            [-56.19742245879026, -34.897332645682894], [-56.20428891386837, -34.899746181939825], [-56.214752127416446, -34.90832714998487],
        ]], {
            "fill": "#00f"
        });
        return poligono;
    }
}