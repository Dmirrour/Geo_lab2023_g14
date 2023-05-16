function LeafMap() {
    map = null;
    drawControl = null;
    drawLayers = null;
    marcador = null;
    circulo = null;
    // drawControl, drawLayers, marcador, circulo;
}

// https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
// http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png
// http://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png
// http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png

LeafMap.prototype.Crear = function () {
    var topo = L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        attribution: '© Grupo 14'
    });

    map = L.map('map', {
        center: [-34.8797018070320851, -56.262557241497211],
        zoom: 13,
        minZoom: 2,
        maxZoom: 18,
        layers: [topo],
        zoomControl: true
    });
    
    console.log(Math.floor(Math.random() * (56 - 34 + 1)) + 25);


    marcador = L.marker([Math.floor(Math.random() * (56 - 34 + 1)) + 25, -56.262557241497211]).addTo(map) // establece icono del marcado
    marcador.bindPopup("Casa Sebastián")

    circulo = L.circle([-34.8797018070320851, -56.262557241497211], {
        radius: 1500,
        color: "green"
    }).addTo(map)
    circulo.bindPopup("Villa del Cerro")

    drawLayers = new L.FeatureGroup();
    drawControl = new L.Control.DrawPlus({
        position: 'topright',
        draw: {
            circle: true,
            polyline: true,
        },
        edit: {
            featureGroup: drawLayers,
            edit: true
        }
    });
    map.addLayer(drawLayers);
    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, function (e) {
        drawLayers.addLayer(e.layer);
    });

    drawLayers.on('click', function (e) {
        let latitud = e.latlng.lat;
        let longitud = e.latlng.lng;
        alert("Click en coordenadas: " + "\n" + "[" + latitud + "] [" + longitud + "]")
        console.log("Click en coordenadas: ")
        console.log("Latitud:", latitud.toFixed(2)) // .toFixed(2) muestra 2 decimales(no usar para guardar datos en bd)
        console.log("Longitud:", longitud.toFixed(2))
        console.log(e.layer);
    });
}
