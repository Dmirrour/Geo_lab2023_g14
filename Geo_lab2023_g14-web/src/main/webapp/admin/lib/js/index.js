function CrearMapaAdmin() {
    ///////////////////////// MAPAS /////////////////////////
    var openst = L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', { // Agregar capa base de OpenStreetMap
        attribution: '© Grupo 14'
    });

    var google = L.tileLayer('https://mt1.googles.com/vt/lyrs=r&x={x}&y={y}&z={z}', { // Agregar capa base de Google
        attribution: '© Grupo 14'
    });
    ///////////////////////// FIN MAPAS /////////////////////////


    ///////////////////////// CAPAS WMS /////////////////////////
    var layerEjes = L.tileLayer.wms('http://localhost:8081/geoserver/Geo_lab2023_g14PersistenceUnit/wms?', {
        title: 'Ejes',
        layers: 'Geo_lab2023_g14PersistenceUnit:ft01_ejes',
        srs: 'EPSG:32721',
        format: 'image/png',
        transparent: true,
        VERSION: '1.1.0'
    });

    var layerDepartamento = L.tileLayer.wms('http://localhost:8081/geoserver/Geo_lab2023_g14PersistenceUnit/wms?', {
        title: 'Montevideo',
        layers: 'Geo_lab2023_g14PersistenceUnit:ft_depto',
        srs: 'EPSG:32721',
        format: 'image/png',
        transparent: true,
        VERSION: '1.1.0'
    });

    var layerRuta = L.tileLayer.wms('http://localhost:8081/geoserver/Geo_lab2023_g14PersistenceUnit/wms?', {
        title: 'Rutas',
        layers: 'Geo_lab2023_g14PersistenceUnit:ft00_cam_dig',
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
        "Departamentos": layerDepartamento
    };
    //marcador = L.marker([-54, -56]).addTo(map); // Icono del marcador
    //marcador.bindPopup("Mi ubicación");

    // circulo = L.circle([-34.8797018070320851, -56.262557241497211], { // Circulo verde zona
    //     radius: 1500,
    //     color: "green"
    // }).addTo(map);
    //circulo.bindPopup("Circulo");

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
    map.addControl(drawControl);

    L.control.layers(
        baselayers,
        overlayers, {
        collapsed: true
    }).addTo(map);

    map.fitBounds([[-35, -56], [-34, -56]]); // btn Ubicacion
    L.geolet({
        position: 'bottomleft'
    }).addTo(map);

    map.on(L.Draw.Event.CREATED,
        function (e) {
            drawLayers.addLayer(e.layer);
        });
    ///////////////////////// FIN OPCIONES DE MAPA /////////////////////////

    ///////////////////////// COORDENAS EVENTO CLICK /////////////////////////
    var recorrido = [];
    map.on('click', function (e) {
        let latitud = e.latlng.lat;
        let longitud = e.latlng.lng;
        //   alert("Click en coordenadas: " + "\n" + "[" + latitud + "] [" + longitud + "]")
        console.log("Click en coordenadas: ");
        console.log("Latitud:", latitud.toFixed(2)); // .toFixed(2) muestra 2 decimales(no usar para guardar datos en bd)
        console.log("Longitud:", longitud.toFixed(2));
        console.log(e.featureGroup);

        recorrido.push({
            latitud,
            longitud
        });
        // L.marker([lat, lot]).addTo(map);
        // console.log("Latitud:", lat) // .toFixed(2) muestra 2 decimales(no usar para guardar datos en bd)
        console.log("rec:", recorrido.toString);
        console.log("Longitud:", recorrido.values);
        console.log("rec:", recorrido.forEach);
    });
    ///////////////////////// FIN COORDENAS EVENTO CLICK /////////////////////////

}

function cargarMapaAltaSE() {
    ///////////////////////// MAPAS /////////////////////////
    let openst = L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', { // Agregar capa base de OpenStreetMap
        attribution: '© Grupo 14'
    });
    ///////////////////////// FIN MAPAS /////////////////////////

    ///////////////////////// OPCIONES DE MAPA /////////////////////////
    let mapSE = L.map('mapSE', {
        center: [-34.8797018070320851, -56.262557241497211],
        zoom: 11,
        minZoom: 2,
        maxZoom: 18,
        layers: [openst],
        zoomControl: true
    });

    let baselayers = {
        "Open Street Map": openst
    };

    let overlayers = {

    };

    L.control.layers(
        baselayers,
        overlayers, {
            collapsed: true
        }).addTo(mapSE);

    ///////////////////////// FIN OPCIONES DE MAPA /////////////////////////


    // Crea un marcador y guarda la posición en los campos de latitud y longitud
    let marker = L.marker([0, 0]).addTo(mapSE);
    mapSE.on('click', function(e) {
        marker.setLatLng(e.latlng);
        document.getElementById("j_idt61:latitud").value = e.latlng.lat;
        document.getElementById("j_idt61:longitud").value = e.latlng.lng;
    });
}
