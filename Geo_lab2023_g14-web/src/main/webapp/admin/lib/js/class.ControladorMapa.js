
class ControladorMapa extends Configuracion {
    openst;
    servicioEH;
    map;
    drawLayers;
    // heatmap;
    markerSE;

    urlBase = "https://direcciones.ide.uy/api/v1/geocode/";
    dato = [];
    datoEsq = [];
    seleccion = [];
    seleccionEsq = [];
    marcador;
    circulo = null;
    controlEnrutamiento;
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
            center: [-34.8797018070320851, -56.262557241497211],
            zoom: 13,
            minZoom: 2,
            maxZoom: 18,
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
                polyline: true
            },
            edit: {
                featureGroup: this.drawLayers,
                edit: true
            }
        });

        this.map.addLayer(this.drawLayers);
        this.map.addControl(drawControl);

        this.map.fitBounds([[-35, -56], [-34, -56]]); // btn Ubicacion

        this.map.on(L.Draw.Event.CREATED, function (e) {
            this.drawLayers.addLayer(e.layer);
        }, this);
        this.agregarBotonFormularioGPS();
        this.agregarBotonZonasSinCobertura();
        this.agregarBotonFormualrioDireccion();
    }
    agregarBotonFormualrioDireccion () {
        // Crear el botón
        let botonFormulario = L.control({ position: 'topright' });

        botonFormulario.onAdd = function (map) {
            let button = L.DomUtil.create('button', 'btn btn-primary');
            button.id = "mostrarBuscador";
            button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-signpost-2" viewBox="0 0 16 16">'+
                '<path d="M7 1.414V2H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h5v1H2.5a1 1 0 0 0-.8.4L.725 8.7a.5.5 0 0 0 0 .6l.975 1.3a1 1 0 0 0 .8.4H7v5h2v-5h5a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H9V6h4.5a1 1 0 0 0 .8-.4l.975-1.3a.5.5 0 0 0 0-.6L14.3 2.4a1 1 0 0 0-.8-.4H9v-.586a1 1 0 0 0-2 0zM13.5 3l.75 1-.75 1H2V3h11.5zm.5 5v2H2.5l-.75-1 .75-1H14z"/></svg>';

            // Agregar evento clic para mostrar el formulario
            L.DomEvent.on(button, 'click', function () {
                console.log("controladorMapa::agregarBotonZonasSinCobertura: AAGREGAR CODIGO PARA MOSTARR FORMULARIO DE DIRECCION");
                let formularioContainer = document.getElementById("contenedorFrmBuscar");
                let btnMostrarBuscador = document.getElementById('mostrarBuscador');
                if (formularioContainer.style.display == "none") {
                    formularioContainer.style.display = "block";
                    btnMostrarBuscador.style.backgroundColor = 'rgba(38,71,191,1)';
                }else {
                    formularioContainer.style.display = 'none';
                    btnMostrarBuscador.style.backgroundColor = '#f4f4f4';
                }

            }, this);
            return button;
        };

        botonFormulario.addTo(this.map);
    }
    agregarBotonZonasSinCobertura () {
        // Crear el botón
        let btnCobertura = L.control({ position: 'topright' });

        btnCobertura.onAdd = function (map) {
            let button = L.DomUtil.create('button', 'btn btn-primary');
            button.id = "btnCobertura";
            button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">'+
                '<path d="M7.5 19c-3.866 0-7-3.134-7-7V8c0-3.866 3.134-7 7-7s7 3.134 7 7v4c0 3.866-3.134 7-7 7zm0-16C4.462 3 2 5.462 2 8v4c0 2.538 2.462 5 5.5 5S13 14.538 13 12V8c0-2.538-2.462-5-5.5-5zm0 1c2.481 0 4.5 2.019 4.5 4.5v4c0 2.481-2.019 4.5-4.5 4.5S3 14.481 3 12V8c0-2.481 2.019-4.5 4.5-4.5zm2.5 4H5v2h5v-2z" fill="currentColor" />'+
                '</svg>';

            // Agregar evento clic para mostrar el formulario
            L.DomEvent.on(button, 'click', function () {
                console.log("controladorMapa::agregarBotonZonasSinCobertura: AGREGAR CODIGO APRA QUE MUESTRE U OCULTE LA CAPA CON LAS ZONAS SIN COBERTURA");
            });
            return button;
        };

        btnCobertura.addTo(this.map);
    }
    agregarBotonFormularioGPS () {
        // Crear el botón
        let btnGPS = L.control({ position: 'topright' });

        btnGPS.onAdd = function (map) {
            let button = L.DomUtil.create('button', 'btn btn-primary');
            button.id = "btnGPS";
            button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-geo" viewBox="0 0 16 16">\n' +
                '<path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm0-15a7 7 0 1 1 0 14A7 7 0 0 1 8 1zm0 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm0 1a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />\n' +
                '</svg>';

            // Agregar evento clic para mostrar el formulario
            L.DomEvent.on(button, 'click', function () {
                if (navigator.geolocation) {
                    // Obtener la ubicación del usuario
                    navigator.geolocation.getCurrentPosition(function (position) {
                        var lat = position.coords.latitude;
                        var lng = position.coords.longitude;
                        mapaAdmin.actualizarMapa(lat, lng);
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
    agregarBotonOcultarRecorrido () {
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
                Array.from(divs).forEach(function(div) {
                    div.style.display = 'none';
                });
                btn.style.display = 'none';
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
    addLayerWFSbuf() {
        let geojsonLayer = L.geoJSON(null, {
            style: {
                color: 'blue',
                weight: 3,
                opacity: 1
            },
        }).addTo(this.map);

        let url =
            'http://localhost:' +
            this.puertoGeoServer +
            '/geoserver/wfs?' +
            'service=WFS&' +
            'request=GetFeature&' +
            'typeName=' +
            this.baseDatos +
            ':' +  'vista_buf &' +
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
    BorrarMarcadorALtaSE() {
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
                    options = '<select class="form-select" id="idElegirCalle" size="6" aria-label="size 6 select" onchange="mapaAdmin.elegirCalle();">';
                    options += '<option class="dropdown-header dropdown-notifications-header" disabled>lab tsig 2023 G14</option>';
                    options += '<option disabled>---------------------------------</option>';
                    options = '<h6 class="dropdown-header dropdown-notifications-header"><i data-feather="bell"></i>IDE.uy</h6>';
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
                }else{
                    console.warn("Ocurrio un error en la respuesta axios:\n"+response.status);
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
                    this.actualizarMapa();
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
        this.actualizarMapa();
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
}
