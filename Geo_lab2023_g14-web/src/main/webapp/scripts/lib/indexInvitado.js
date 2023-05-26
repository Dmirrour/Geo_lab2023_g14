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
    var layerDepartamento = L.tileLayer.wms('http://localhost:8081/geoserver/Geo_lab2023_g14PersistenceUnit/wms?', {
        title: 'Montevideo',
        layers: 'Geo_lab2023_g14PersistenceUnit:ft00_departamento',
        format: 'image/png',
        transparent: true,
        VERSION: '1.1.0',
    });

    var layerRuta = L.tileLayer.wms('http://localhost:8081/geoserver/Geo_lab2023_g14PersistenceUnit/wms?', {
        title: 'Ruta',
        layers: 'Geo_lab2023_g14PersistenceUnit:ft00_cam_dig',
        format: 'image/png',
        transparent: true,
        VERSION: '1.1.0',
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

    let baselayers = {
        "Open Street Map": openst,
        "Google Maps": google
    };

    var overlayers = {
        //  "Ejes": layerRuta,
        //  "Departamentos": layerDepartamento
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