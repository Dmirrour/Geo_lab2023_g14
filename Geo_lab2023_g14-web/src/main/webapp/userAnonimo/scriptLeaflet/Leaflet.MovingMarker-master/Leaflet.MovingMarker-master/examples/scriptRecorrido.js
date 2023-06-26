// initialize the map on the "map" div with a given center and zoom
// var map = new L.Map('map', {
//     zoom: 6,
//     minZoom: 3,
// });

// // create a new tile layer
// var tileUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
//     layer = new L.TileLayer(tileUrl,
//         {
//             attribution: 'Maps © <a href=\"www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors',
//             maxZoom: 18
//         });

// // add the layer to the map
// map.addLayer(layer);

// var parisKievLL = [[48.8567, 2.3508], [50.45, 30.523333]];
// var londonParisRomeBerlinBucarest = [[51.507222, -0.1275], [48.8567, 2.3508],
// [41.9, 12.5], [52.516667, 13.383333], [44.4166,26.1]];
// moviendoAmbulancia();


/*
//========================================================================
var marker1 = L.Marker.movingMarker(parisKievLL, [10000])//.addTo(map);
L.polyline(parisKievLL)//.addTo(map);
marker1.once('click', function () {
    marker1.start();
    marker1.closePopup();
    marker1.unbindPopup();
    marker1.on('click', function() {
        if (marker1.isRunning()) {
            marker1.pause();
        } else {
            marker1.start();
        }
    });
    setTimeout(function() {
        marker1.bindPopup('<b>Click me to pause !</b>').openPopup();
    }, 2000);
});

marker1.bindPopup('<b>Click me to start !</b>', {closeOnClick: false});
marker1.openPopup();

//========================================================================

var marker2 = L.Marker.movingMarker(londonParisRomeBerlinBucarest,
    [3000, 9000, 9000, 4000], {autostart: true})//.addTo(map);
    L.polyline(londonParisRomeBerlinBucarest, {color: 'red'})//.addTo(map);
    
    
    marker2.on('end', function() {
        marker2.bindPopup('<b>Welcome to Bucarest !</b>', {closeOnClick: false})
        .openPopup();
    });
    */
//=========================================================================

function moviendoAmbulancia() {
    var recorridoInteractivo = [[51.507222, -0.1275], [50.85, 4.35], [50.85, 4.35], [51.507222, -0.1275]];
    var marker3 = L.Marker.movingMarker(recorridoInteractivo,
        [2000, 0, 2000, 0], { autostart: true, loop: true }).addTo(map);
    marker3.loops = 0;
    marker3.bindPopup('', { closeOnClick: false });
    marker3.on('loop', function (e) {
        marker3.loops++;
        if (e.elapsedTime < 50) {
            marker3.getPopup().setContent("<b>Loop: " + marker3.loops + "</b>")
            marker3.openPopup();
            setTimeout(function () {
                marker3.closePopup();
            }, 2000);
        }
    });
    map.fitBounds(recorridoInteractivo);
}
// map.on("click", function (e) {
//     marker4.moveTo(e.latlng, 2000);
// });

//=========================================================================
/*
var marker5 = L.Marker.movingMarker(
    barcelonePerpignanPauBordeauxMarseilleMonaco,
    10000, {autostart: true})//.addTo(map);

marker5.addStation(1, 2000);
marker5.addStation(2, 2000);
marker5.addStation(3, 2000);
marker5.addStation(4, 2000);

L.polyline(barcelonePerpignanPauBordeauxMarseilleMonaco,
    {color: 'green'})//.addTo(map);
*/