function inicializarMapAnonimo() {

    ///////////////////////// MAPAS /////////////////////////
    var openst = L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        attribution: '© Grupo 14'
    });

    var google = L.tileLayer('https://mt1.googles.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
        attribution: '© Grupo 14'
    });
    ///////////////////////// FIN MAPAS /////////////////////////


    ///////////////////////// LAYER WMS /////////////////////////
    var layerEjes = L.tileLayer.wms('http://localhost:8081/geoserver/Geo_lab2023_g14PersistenceUnit/wms?', {
        title: 'hospital',
        layers: 'Geo_lab2023_g14PersistenceUnit:ft01_ejes',
        srs: 'EPSG:32721',
        format: 'image/png',
        transparent: true,
        VERSION: '1.1.0'
    });

    var layerDepartamento = L.tileLayer.wms('http://localhost:8081/geoserver/Geo_lab2023_g14PersistenceUnit/wms?', {
        title: 'ft_depto',
        layers: 'Geo_lab2023_g14PersistenceUnit:ft_depto',
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

    var layerAmbulancia = L.tileLayer.wms('http://localhost:8081/geoserver/Geo_lab2023_g14PersistenceUnit/wms?', {
        title: 'ambulancia',
        layers: 'Geo_lab2023_g14PersistenceUnit:ambulancia',
        srs: 'EPSG:32721',
        format: 'image/png',
        transparent: true,
        VERSION: '1.1.0'
    });

    var layerAll = L.tileLayer.wms('http://localhost:8081/geoserver/Geo_lab2023_g14PersistenceUnit/wms?', {
        title: 'layerAll',
        layers: 'Geo_lab2023_g14PersistenceUnit:ft01_ejes,ft_depto,servicioemergencia,ambulancia',
        srs: 'EPSG:32721',
        format: 'image/png',
        transparent: true,
        VERSION: '1.1.0'
    });
    ///////////////////////// FIN CAPAS WMS  /////////////////////////


    ///////////////////////// OPCIONES DE MAPA /////////////////////////
    map = L.map('map', {
        center: [-34.8597018070320851, -56.180557241497211],
        zoom: 12,
        minZoom: 4,
        maxZoom: 18,
        layers: [openst],
        zoomControl: true
    });

    let baselayers = {
        "Open Street Map": openst,
        "Google Maps": google
    };

    var overlayers = {
        "Mostrar ": layerAll,
        "Ambulancia": layerAmbulancia,
        "Servicio Emergencia": layerServicio,
        "Ejes": layerEjes,
        "Departamentos": layerDepartamento
    };
    L.control.layers(baselayers, overlayers, { collapsed: true, position: 'bottomright' }).addTo(map);


    ///////////////////////// GRUPO ELEMENTOS GRAFICOS /////////////////////////
    drawLayers = new L.FeatureGroup();
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

    map.on(L.Draw.Event.CREATED, function (e) { // Se llama al finalizar dibujo de geometria
        drawLayers.addLayer(e.layer);

    });

    /////////////////////// UBICACION GEOLET ///////////////////////
    //fitBounds([[-35, -56], [-34, -56]]); // ir a ubicacion
    L.geolet({
        position: 'bottomleft',
    }).addTo(map);


    /////////////////// SELECCIONAR HOSPITAL ////////////////////
    let drawMarker;
    let hospitalesItems = [];
    let serviciosE = []; // arreglo de servicios
    let ambulancias = []; // arreglo de ambulancias
    let urlHospi =
        'http://localhost:8081/geoserver/wfs?' +
        'service=WFS&' +
        'request=GetFeature&' +
        'typeName=Geo_lab2023_g14PersistenceUnit:hospital&' +
        'srsName=EPSG:32721&' +
        'outputFormat=application/json';

    fetch(urlHospi)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            var features = data.features;
            for (var i = 0; i < features.length; i++) {
                var item = features[i].properties.nombrehospital;
                if (i < features.length - 1) {
                    hospitalesItems.push({ label: item });
                    console.log(features[i].properties.nombrehospital);
                    console.log(hospitalesItems[i]);
                }
                //hospitalesItems.push({label:item, servicioEH: " ", ambulancias: " "});
            }
            var defaultValue = hospitalesItems[0];

            L.control.select({
                position: "topleft",
                //    selectedDefault: defaultValue,
                selectedDefault: defaultValue,
                items: hospitalesItems,
                multi: true,
                iconChecked: "☑",
                iconUnchecked: "❒",
                onSelect: function () {
                    console.log("Item seleccionado: ", hospitalesItems[0].label);
                    // actualSelection = selection;
                    // redrawMap(newItemValue);
                },
                onGroupOpen: function (groupOpened) {
                    //     console.log(`group openend ${groupOpened}`);
                },
            }).addTo(map);

            var marker = L.marker([49, 18]).addTo(map);
            drawMarker = (newItemValue) => {
                marker.setIcon(
                    L.divIcon({
                        html: '<div class="icon">' + newItemValue.label + "</div>",
                        className: "marker-icon",
                        iconSize: [50, 50],
                    })
                );
            };
            drawMarker(defaultValue);
        })
        .catch(function (error) {
            console.error('Error:', error);
        });

    ///////////////////////// COORDENAS EVENTO CLICK /////////////////////////
    drawLayers.on('click', function (e) {
        let latitud = e.latlng.lat;
        let longitud = e.latlng.lng;
        alert("Click en coordenadas: " + "\n" + "[" + latitud + "] [" + longitud + "]")
        console.log("Click en coordenadas: ")
        console.log("Latitud:", latitud) // .toFixed(2) muestra 2 decimales(no usar para guardar datos en bd)
        console.log("Longitud:", longitud)
        console.log(e.layer);
    });

    map.on('click', function (e) {
        let latitud = e.latlng.lat;
        let longitud = e.latlng.lng;
        // alert("Click en coordenadas: " + "\n" + "[" + latitud + "] [" + longitud + "]")
        console.log("Click en coordenadas: ")
        console.log("Latitud:", latitud)//.toFixed(5)) // .toFixed(2) muestra 2 decimales(no usar para guardar datos en bd)
        console.log("Longitud:", longitud)//.toFixed(5))
        console.log(e.layer);
    });

}