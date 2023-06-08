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

    var servicioEH = L.tileLayer.wms('http://localhost:8081/geoserver/Geo_lab2023_g14PersistenceUnit/wms?', {
        title: 'servicioemergencia',
        layers: 'Geo_lab2023_g14PersistenceUnit:servicioemergencia',
        srs: 'EPSG:32721',
        format: 'image/png',
        transparent: true,
        VERSION: '1.1.0'
    });

    ///////////////////////// FIN CAPAS WMS  /////////////////////////

    ///////////////////////// OPCIONES DE MAPA /////////////////////////
    map = L.map('map', {
        center: [-34.8797018070320851, -56.262557241497211],
        zoom: 13,
        minZoom: 8,
        maxZoom: 18,
        layers: [openst],
        zoomControl: true
    });

    let baselayers = {
        "Open Street Map": openst,
        "Google Maps": google
    };

    var overlayers = {
        "Ejes": layerEjes,
        "Rutas": layerRuta,
        "Departamentos": layerDepartamento
    };

    /*
    marcador = L.marker([-34.8797018070320851, -56.262557241497211]).addTo(map) // Icono del marcador
    marcador.bindPopup("Mi ubicación")

    circulo = L.circle([-34.8797018070320851, -56.262557241497211], { // Circulo verde zona
        radius: 1500,
        color: "green"
    }).addTo(map)
    circulo.bindPopup("Circulo")
    */

    drawLayers = new L.FeatureGroup(); // Agrupa elementos graficos
    drawControl = new L.Control.DrawPlus({
        position: 'topright',
        draw: {
            circle: true,
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

    //map.fitBounds([[-35, -56], [-34, -56]]);
    //L.geolet({
    //    position: 'bottomleft',
    //}).addTo(map);

    L.control.layers(baselayers, overlayers, { collapsed: false }).addTo(map);

    map.on(L.Draw.Event.CREATED, function (e) {
        drawLayers.addLayer(e.layer);
    });
    ///////////////////////// FIN OPCIONES DE MAPA /////////////////////////
    function generarColor(numero) {
        // Calcula los componentes de color
        var rojo = (numero * 17) % 256;   // Rango de 0 a 255
        var verde = (numero * 13) % 256;  // Rango de 0 a 255
        var azul = (numero * 19) % 256;   // Rango de 0 a 255

        // Retorna el color hexadecimal en el formato "#RRGGBB"
        return "#" + rojo.toString(16).padStart(2, '0') +
            verde.toString(16).padStart(2, '0') +
            azul.toString(16).padStart(2, '0');
    }

    let geojsonLayer = L.geoJSON(null, {
        pointToLayer: function (feature, latlng) {
            let idh = feature.properties.idhospital;

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
    let url =
        'http://localhost:8081/geoserver/wfs?' +
        'service=WFS&' +
        // 'version=1.1.0&' +
        'request=GetFeature&' +
        'typeName=Geo_lab2023_g14PersistenceUnit:vista_se_h&' +
        'srsName=EPSG:32721&' +
        'outputFormat=application/json';

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
                })
            });
        })
        .catch(function (error) {
            console.error('Error:', error);
        });

    return map;
    ///////////////////////// COORDENAS EVENTO CLICK /////////////////////////
    drawLayers.on('click', function (e) {
        let latitud = e.latlng.lat;
        let longitud = e.latlng.lng;
        alert("Click en coordenadas: " + "\n" + "[" + latitud + "] [" + longitud + "]")
        console.log("Click en coordenadas: ")
        console.log("Latitud:", latitud.toFixed(2)) // .toFixed(2) muestra 2 decimales(no usar para guardar datos en bd)
        console.log("Longitud:", longitud.toFixed(2))
        console.log(e.layer);
    });
    ///////////////////////// FIN COORDENAS EVENTO CLICK /////////////////////////
}