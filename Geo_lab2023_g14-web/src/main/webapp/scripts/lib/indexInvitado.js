function CrearMapaInvitado() {
    var map;
    ///////////////////////// MAPAS /////////////////////////
    var openst = L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        attribution: '© Grupo 14'
    });

    var google = L.tileLayer('https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
        attribution: '© Grupo 14'
    });
    ///////////////////////// FIN MAPAS /////////////////////////


    ///////////////////////// CAPAS WMS /////////////////////////
    var layerEjes = L.tileLayer.wms('http://localhost:8081/geoserver/Geo_lab2023_g14PersistenceUnit/wms?', {
        title: 'ft_01_ejes',
        layers: 'Geo_lab2023_g14PersistenceUnit:ft_01_ejes',
        srs: 'EPSG:32721',
        format: 'image/png',
        transparent: true,
        VERSION: '1.1.0'
    });

    var layerDepartamento = L.tileLayer.wms('http://localhost:8081/geoserver/Geo_lab2023_g14PersistenceUnit/wms?', {
        title: 'ft_00departamento',
        layers: 'Geo_lab2023_g14PersistenceUnit:ft_00departamento',
        srs: 'EPSG:32721',
        format: 'image/png',
        transparent: true,
        VERSION: '1.1.0'
    });

    var layerRuta = L.tileLayer.wms('http://localhost:8081/geoserver/Geo_lab2023_g14PersistenceUnit/wms?', {
        title: 'Rutas',
        layers: 'Geo_lab2023_g14PersistenceUnit:ft_00cam_dig',
        srs: 'EPSG:32721',
        format: 'image/png',
        transparent: true,
        VERSION: '1.1.0'
    });

    var layerServicio = L.tileLayer.wms('http://localhost:8081/geoserver/Geo_lab2023_g14PersistenceUnit/wms?', {
        title: 'servicioemergencia',
        layers: 'Geo_lab2023_g14PersistenceUnit:servicioemergencia',
        srs: 'EPSG:32721',
        format: 'image/png',
        transparent: true,
        VERSION: '1.1.0'
    });

    // de anonimoIndex.js
    var layerAmbulancia = L.tileLayer.wms('http://localhost:8081/geoserver/Geo_lab2023_g14PersistenceUnit/wms?', {
        title: 'ambulancia',
        layers: 'Geo_lab2023_g14PersistenceUnit:ambulancia',
        srs: 'EPSG:32721',
        format: 'image/png',
        transparent: true,
        VERSION: '1.1.0'
    });

    // var layerAll = L.tileLayer.wms('http://localhost:8081/geoserver/Geo_lab2023_g14PersistenceUnit/wms?', {
    //     title: 'layerAll',
    //     layers: 'Geo_lab2023_g14PersistenceUnit:ft01_ejes,ft_depto,servicioemergencia,ambulancia',
    //     srs: 'EPSG:32721',
    //     format: 'image/png',
    //     transparent: true,
    //     VERSION: '1.1.0'
    // });
    ///////////////////////// FIN CAPAS WMS  /////////////////////////


    ///////////////////////// OPCIONES DE MAPA /////////////////////////
    map = L.map('map', {
        center: [-34.88219465245854, -56.17280777776989],
        zoom: 13,
        minZoom: 3,
        maxZoom: 18,
        layers: [openst],
        zoomControl: true
    });

    let baselayers = {
        "Open Street Map": openst,
        "Google Maps": google
    };

    var overlayers = {
        //"Mostrar ": layerAll,
        "Ambulancia": layerAmbulancia,
        "Servicio Emergencia": layerServicio,
        "Ejes": layerEjes,
        "Rutas": layerRuta,
        "Departamentos": layerDepartamento
    };

    L.control.layers(baselayers, overlayers, { collapsed: true, position: 'bottomright' }).addTo(map);

    drawLayers = new L.FeatureGroup(); // Agrupa elementos graficos
    drawControl = new L.Control.DrawPlus({
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
    map.addLayer(drawLayers);
    // map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, function (e) {
        drawLayers.addLayer(e.layer);
    });
    ///////////////////////// FIN OPCIONES DE MAPA /////////////////////////


    ///////////////////////// COORDENAS EVENTO CLICK /////////////////////////
    drawLayers.on('click', function (e) {
        let latitud = e.latlng.lat;
        let longitud = e.latlng.lng;
        alert("Click en coordenadas: " + "\n" + "[" + latitud + "] [" + longitud + "]")
        console.log("Click en coordenadas: ")
        console.log("Latitud:", latitud) // .toFixed(2) muestra 2 decimales(no usar para guardar datos en bd)
        console.log("Longitud:", longitud)
    });

    map.on('click', function (e) {
        let latitud = e.latlng.lat;
        let longitud = e.latlng.lng;
        let userLat = -56.185222811229534;
        let userLon = -34.8503303549236;
        // alert("Click en coordenadas: " + "\n" + "[" + latitud + "] [" + longitud + "]")
        // console.log("Latitud:", latitud)//.toFixed(5)) // .toFixed(2) muestra 2 decimales(no usar para guardar datos en bd)
        console.log("Evento Click" + "\n" + "Coordenadas: " + "[" + latitud + "], [" + longitud + "]")

        // Distancia entre puntos
        let punto1 = { x: userLat, y: userLon };
        let punto2 = { x: longitud, y: latitud };
        console.log("Distancia euclidiana: " + euclideanDistancia(punto1, punto2));
        console.log("Distancia en metros: " + euclideanDistanciaMetros(punto1, punto2));
        // console.log(addObjLatLng(longitud, latitud));
    });

    return map;
}

///////////////////////// GENERA COLOR 
function generarColor(numero) {
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


///////////////////////// INITLAYERS /////////////////////////
function initLayers() {
    let url =
        'http://localhost:8081/geoserver/wfs?' +
        'service=WFS&' +
        'request=GetFeature&' +
        'typeName=Geo_lab2023_g14PersistenceUnit:vista_se_h&' +
        'srsName=EPSG:32721&' +
        'outputFormat=application/json';
    let urlAmbulancia =
        'http://localhost:8081/geoserver/wfs?' +
        'service=WFS&' +
        'request=GetFeature&' +
        'typeName=Geo_lab2023_g14PersistenceUnit:ambulancia&' +
        'srsName=EPSG:32721&' +
        'outputFormat=application/json';

    initializeLayers(url, 'layerSE');
    initializeLayers(urlAmbulancia, 'layerAmulancia');
}

///////////////////////// INITIALIZELAYERS /////////////////////////
let geojsonLayer;
function initializeLayers(url, layerName) {
    console.log("initializeLayers");
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
    }).addTo(map); // Crear una capa de GeoJSON
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
                        '<h5><b>' + properties.nombre + '</b></h5>' +
                        '<em>Camas libres: </em><b>' + properties.camaslibres + '</b></br>' +
                        '<em>Total de camas: </em><b>' + properties.totalcama + '</b></br>' +
                        '<em>Hospital Nombre: </em><b>' + properties.nombrehospital + '</b></br>' +
                        '<em>Hospital Tipo: </em><b>' + properties.tipohospital + '</b></br>' + '</div>';
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


///////////////////////// DISTANCIA /////////////////////////
function euclideanDistancia(punto1, punto2) { // Distancia euclidiana entre dos puntos 
    let dx = punto2.x - punto1.x;
    let dy = punto2.y - punto1.y;
    return Math.sqrt(dx * dx + dy * dy);
} // L.CRS.Simple.distance(latlng1, latlng2) --> Distancia euclidiana entre dos puntos 

function euclideanDistanciaMetros(punto1, punto2) { // Distancia euclidiana a metros (a partir de dos punto(x,y))
    let latlng1 = L.latLng(punto1.y, punto1.x);
    let latlng2 = L.latLng(punto2.y, punto2.x);
    let distanciaEnMetros = latlng1.distanceTo(latlng2);
    return distanciaEnMetros;
}

function addObjLatLng(latitud, longitud) { // Crea objeto latlng
    let addObjLatLng = L.GeoJSON.coordsToLatLng([latitud, longitud]);
    return addObjLatLng
}

function euclideanDistanciaMetrosObj(latlng1, latlng2) { // Distancia euclidiana a metros (a partir de dos obj latlng)
    return latlng1.distanceTo(latlng2);
}
// Elimina el marcador del mapa
function BorrarMarcadorALtaSE() {
    console.log("borrando marcador");
    this.map.removeLayer(this.markerSE);
}

function removerLayer() {
    map.removeLayer(geojsonLayer);
}