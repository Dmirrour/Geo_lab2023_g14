function CrearMapaInvitado() {
    ///////////////////////// MAPAS /////////////////////////
    var openst = L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        attribution: '© Grupo 14'
    });

    var google = L.tileLayer('https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
        attribution: '© Grupo 14'
    });
    ///////////////////////// FIN MAPAS /////////////////////////


    ///////////////////////// CAPAS WMS /////////////////////////
    var layerEjes = L.tileLayer.wms('http://localhost:8088/geoserver/Geo_lab2023_g14PersistenceUnit/wms?', {
        title: 'ft_01_ejes',
        layers: 'Geo_lab2023_g14PersistenceUnit:ft_01_ejes',
        srs: 'EPSG:32721',
        format: 'image/png',
        transparent: true,
        VERSION: '1.1.0'
    });

    var layerDepartamento = L.tileLayer.wms('http://localhost:8088/geoserver/Geo_lab2023_g14PersistenceUnit/wms?', {
        title: 'ft_00departamento',
        layers: 'Geo_lab2023_g14PersistenceUnit:ft_00departamento',
        srs: 'EPSG:32721',
        format: 'image/png',
        transparent: true,
        VERSION: '1.1.0'
    });

    var layerRuta = L.tileLayer.wms('http://localhost:8088/geoserver/Geo_lab2023_g14PersistenceUnit/wms?', {
        title: 'Rutas',
        layers: 'Geo_lab2023_g14PersistenceUnit:ft_00cam_dig',
        srs: 'EPSG:32721',
        format: 'image/png',
        transparent: true,
        VERSION: '1.1.0'
    });

    var servicioEH = L.tileLayer.wms('http://localhost:8088/geoserver/Geo_lab2023_g14PersistenceUnit/wms?', {
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
        zoom: 11,
        minZoom: 2,
        maxZoom: 18,
        layers: [openst],
        zoomControl: true
    });

    var baselayers = {
        "Open Street Map": openst,
        "Google Maps": google
    };

    var overlayers = {
        "Ejes": layerEjes,
        "Rutas": layerRuta,
        "Departamentos": layerDepartamento,
        "Serv. Eme.": servicioEH
    };

    marcador = L.marker([-34.8797018070320851, -56.262557241497211]).addTo(map) // Icono del marcador
    marcador.bindPopup("Mi ubicación")

    circulo = L.circle([-34.8797018070320851, -56.262557241497211], { // Circulo verde zona
        radius: 1500,
        color: "green"
    }).addTo(map)
    circulo.bindPopup("Circulo")

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
    // map.addLayer(drawLayers);
    // map.addControl(drawControl);

    map.fitBounds([[-35, -56], [-34, -56]]);
    L.geolet({
        position: 'bottomleft',
    }).addTo(map);

    L.control.layers(baselayers, overlayers, { collapsed: true }).addTo(map);

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
        console.log("Latitud:", latitud.toFixed(2)) // .toFixed(2) muestra 2 decimales(no usar para guardar datos en bd)
        console.log("Longitud:", longitud.toFixed(2))
        console.log(e.layer);
    });
    ///////////////////////// FIN COORDENAS EVENTO CLICK /////////////////////////
}