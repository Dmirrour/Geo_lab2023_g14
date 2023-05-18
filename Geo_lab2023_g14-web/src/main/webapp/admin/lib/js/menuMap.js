function LeafMenu() {
    map = null;
      drawControl = null;
     Layers = null;
        marcador = null;
      circulo = null;
    // drawControl, drawLayers, marcador, circulo;
}

LeafMenu.prototype.Menu = function () {
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