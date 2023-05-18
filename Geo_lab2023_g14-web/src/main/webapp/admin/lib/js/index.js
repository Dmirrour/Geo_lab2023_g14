function LeafMap() {
    map = null;
    drawControl = null;
    drawLayers = null;
    marcador = null;
    circulo = null;
    // drawControl, drawLayers, marcador, circulo;
}

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

    console.log(Math.floor(Math.random() * (34 + 1)) + 2);


    marcador = L.marker([-(Math.floor(Math.random() * (34 + 1)) + 1), -56.262557241497211]).addTo(map) // establece icono del marcado
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



    //////////////////////trabajando
    //     // Manejador de eventos para el clic en el mapa
    //     function onMapClick(evento) {
    //         var latlng = evento.latlng;    // Enviar las coordenadas al servidor
    //         // Puedes usar una solicitud AJAX aquí para enviar las coordenadas al backend

    //         // Ejemplo de procesamiento de la respuesta del servidor
    //         var response = {
    //             name: 'Nombre del punto',
    //             description: 'Descripción del punto',
    //             coordinates: latlng.toString()
    //         };

    //         // Mostrar la información en una ventana emergente
    //         L.popup()
    //             .setLatLng(latlng)
    //             .setContent('<h3>' + response.name + '</h3><p>' + response.description + '</p><p>Coordenadas: ' + response.coordinates + '</p>')
    //             .openOn(map);
    //     }

    //     map.on('click', onMapClick);// Agregar el manejador de eventos de clic al mapa

    //     console.log(onMapClick.prototype);
    //     console.log("ACAAAAAAAAAAAAAAAAAAAAAAAAAAA");

    //     // ----------------------------------------


    //     const dbConfig = {  // Configuración de conexión a la base de datos
    //         host: 'localhost',
    //         user: 'postgres',
    //         password: 'lapass',
    //         database: 'Geo_lab2023_g14PersistenceUnit',
    //     };

    //     const { Client } = require('pg');
    //     console.log("2 DOS ACAAAAAAAAAAAAAAAAAAAAAAAAAAA");
    //     // Coordenadas de los puntos que definen la línea
    //     const lineCoordinates = [
    //         [-56.262557241497211, -34.8797018070320851]
    //         // [lng3, lat3],
    //         // ... añade más puntos según sea necesario
    //     ];

    //     // Crear una geometría de línea a partir de las coordenadas
    //     const lineGeometry = `ST_SetSRID(ST_MakeLine(ARRAY[
    //   ${lineCoordinates.map(([lng, lat]) => `ST_MakePoint(${lng}, ${lat})`).join(', ')}
    // ]), 32721)`;

    //     console.log("3  NI EN PEDO LLEGAS");
    //     console.log(lineGeometry());
    //     alert("Cli: " + st_asewkt(lineGeometry));

    //     const client = new Client(dbConfig);  // Crear una nueva conexión a la base de datos

    //     // Establecer la conexión y ejecutar la consulta de inserción
    //     client.connect()
    //         .then(() => {
    //             const query = `INSERT INTO ft_recorridos(geom)
    //              VALUES (${st_asewkt(lineGeometry)})`;
    //             return client.query(query);
    //         })
    //         .then(() => {
    //             console.log('Línea guardada en la base de datos.');
    //             client.end();
    //         })
    //         .catch((error) => {
    //             console.error('Error al guardar la línea:', error);
    //             client.end();
    //         });
}

LeafMap.prototype.Menu = function () {
    var map = L.map("map-multiple").setView(mapPosition, 9);
    tileLayer().addTo(map);

    var colors = ["blue", "red", "green"];
    var styleFeature = function (f) {
        return {
            color: f.properties.color,
        };
    };
    var items = [
        {
            label: "🍺",
            value: "beer",
            items: [],
        },
        {
            label: "🍷",
            value: "wine",
            items: [],
        },
    ];
    colors.map(function (color) {
        items[0].items.push({
            label: color,
            value: "beer-" + color,
        });
        items[1].items.push({
            label: color,
            value: "wine-" + color,
        });
    });

    const randomCoordinate = () => {
        return [Math.random() + 17.6, Math.random() + 48.5];
    };
    var beers = {
        features: [...Array(15).keys()].map((i) => {
            const color = colors[Math.floor(Math.random() * colors.length)];
            return {
                type: "Feature",
                properties: {
                    type: "wine-" + color,
                    color: color,
                },
                geometry: {
                    type: "Point",
                    coordinates: randomCoordinate(),
                },
            };
        }),
    };
    var wines = {
        features: [...Array(15).keys()].map((i) => {
            const color = colors[Math.floor(Math.random() * colors.length)];
            return {
                type: "Feature",
                properties: {
                    type: "beer-" + color,
                    color: color,
                },
                geometry: {
                    type: "Point",
                    coordinates: randomCoordinate(),
                },
            };
        }),
    };

    var actualSelection = [];
    var beerLayer = false;
    var wineLayer = false;

    var redrawMap = function () {
        beerLayer && beerLayer.clearLayers();
        wineLayer && wineLayer.clearLayers();
        beerLayer = L.geoJSON(beers, {
            style: styleFeature,
            pointToLayer: function (f, ll) {
                return featureToLayer(f, ll, "🍺");
            },
            filter: filterFeatures,
        }).addTo(map);
        wineLayer = L.geoJSON(wines, {
            style: styleFeature,
            pointToLayer: function (f, ll) {
                return featureToLayer(f, ll, "🍷");
            },
            filter: filterFeatures,
        }).addTo(map);
    };

    var filterFeatures = function (f) {
        return actualSelection.indexOf(f.properties.type) > -1;
    };

    var featureToLayer = function (f, ll, icon) {
        return L.marker(ll, {
            icon: L.divIcon({
                className: "beer-wine-icon",
                html: '' + icon + "", iconSize: [20, 20],
            }),
        });
    };

    L.control
        .select({
            position: "topleft",
            id: "image-selector",
            selectedDefault: false,
            items: items,
            multi: true,
            iconChecked: "☑",
            iconUnchecked: "❒",
            onSelect: function (selection) {
                console.log(`selected ${selection}`);
                actualSelection = selection;
                redrawMap(selection);
            },
            onGroupOpen: function (groupOpened) {
                console.log(`group openend ${groupOpened}`);
            },
        })
        .addTo(map);
}

LeafMap.prototype.MapCalor = function () {
    // don't forget to include leaflet-heatmap.js
    var testData = {
        max: 8,
        data: [{ lat: 24.6408, lng: 46.7728, count: 3 }, { lat: -34.8797018070320851, lng: -56.262557241497211, count: 1 }]
    };

    var baseLayer = L.tileLayer(
        'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '...',
        maxZoom: 18
    }
    );

    var cfg = {
        // radius should be small ONLY if scaleRadius is true (or small radius is intended)
        // if scaleRadius is false it will be the constant radius used in pixels
        "radius": 2,
        "maxOpacity": .8,
        // scales the radius based on map zoom
        "scaleRadius": true,
        // if set to false the heatmap uses the global maximum for colorization
        // if activated: uses the data maximum within the current map boundaries
        //   (there will always be a red spot with useLocalExtremas true)
        "useLocalExtrema": true,
        // which field name in your data represents the latitude - default "lat"
        latField: 'lat',
        // which field name in your data represents the longitude - default "lng"
        lngField: 'lng',
        // which field name in your data represents the data value - default "value"
        valueField: 'count'
    };


    var heatmapLayer = new HeatmapOverlay(cfg);

    var map = new L.Map('map-canvas', {
        center: new L.LatLng(-34, -56.3568),
        zoom: 4,
        layers: [baseLayer, heatmapLayer]
    });

    heatmapLayer.setData(testData);
}