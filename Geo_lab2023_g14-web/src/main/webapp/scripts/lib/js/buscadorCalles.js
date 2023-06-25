var urlBase = "https://direcciones.ide.uy/api/v1/geocode/";
var dato = [];
var datoEsq = [];
var datoNumero = [];
var seleccion = [];
var seleccionEsq = [];
var map;
var marcador;
var circulo = null;
var frmBuscar = document.getElementById('contenedorFrmBuscar');
var btnMostrarBuscador = document.getElementById('mostrarBuscador');

map = CrearMapaInvitado();
async function sugerencia(text) {

    var long = text.length;
    var options = "";
    var buscar = false;

    // buscar calle
    var urlCalle = urlBase + "candidates?limit=10&q=" + text + ",%20Montevideo&soloLocalidad=false";
    document.getElementById('visorDeListado').style.display = "none";

    if (long > 2) {
        buscar = true;
        document.getElementById('visorDeListado').style.display = "block";
    }

    if (buscar) {
        try {
            const response = await axios.get(urlCalle);
            if (response.status == 200) {
                options = '<select class="form-select" id="idElegirCalle" size="6" aria-label="size 6 select" onchange="elegirCalle();">';
                options += '<option class="dropdown-header dropdown-notifications-header" disabled>IDE.uy</option>';
                options += '<option disabled>---------------------------------</option>';
                options = '<h6 class="dropdown-header dropdown-notifications-header"><i data-feather="bell"></i>IDE.uy</h6>';
                response.data.forEach(function (item, index) {
                    if (item.idCalle > 0) {
                        dato.push(item);

                        options += '<a class="dropdown-item dropdown-notifications-item" onclick="elegirCalle(' + item.idCalle + ')">';
                        options += '<div class="dropdown-notifications-item-icon';

                        if (item.type == 'CALLEyPORTAL') {
                            options += ' bg-warning"><i class="fa-solid fa-location-dot"></i></div><div class="dropdown-notifications-item-content"><div class="dropdown-notifications-item-content-details">';
                            options += item.localidad + ' / ' + item.departamento + '</div><div class="dropdown-notifications-item-content-text">' + item.nomVia + '</div></div></a>';
                        } else if (item.type == 'POI') {
                            ////LISTO
                            options += ' bg-danger"><i class="fa-solid fa-house-flag"></i></div><div class="dropdown-notifications-item-content"><div class="dropdown-notifications-item-content-details">';
                            options += item.localidad + ' / ' + item.departamento + '</div><div class="dropdown-notifications-item-content-text"><b>' + item.inmueble + '</b> ' + item.nomVia + '</div></div></a>';
                        } else if (item.type == 'CALLE') {
                            ////LISTO
                            options += ' bg-success"><i class="fa-solid fa-road"></i></div><div class="dropdown-notifications-item-content"><div class="dropdown-notifications-item-content-details">';
                            options += item.localidad + ' / ' + item.departamento + '</div><div class="dropdown-notifications-item-content-text">' + item.nomVia + '</div></div></a>';
                        } else if (item.type = 'LOCALIDAD') {
                            ////LISTO
                            options += ' bg-info"><i class="fa-solid fa-location-pin"></i></div><div class="dropdown-notifications-item-content"><div class="dropdown-notifications-item-content-details">';
                            options += item.localidad + ' / ' + item.departamento + '</div></div></a>';
                        } else if (item.type = 'ESQUINA') {
                            options += ' bg-warning"><i class="fa-solid fa-arrows-to-circle"></i></div><div class="dropdown-notifications-item-content"><div class="dropdown-notifications-item-content-details">';
                            options += item.localidad + ' / ' + item.departamento + '</div><div class="dropdown-notifications-item-content-text">' + item.nomVia + '</div></div></a>';
                        } else if (item.type == 'MANZANAySOLAR') {
                            options += ' bg-warning"><i class="fa-solid fa-apple-whole"></i></div><div class="dropdown-notifications-item-content"><div class="dropdown-notifications-item-content-details">';
                            options += item.localidad + ' / ' + item.departamento + '</div><div class="dropdown-notifications-item-content-text">' + item.nomVia + '</div></div></a>';
                        } else /* if (item.type == 'RUTAyKM') */ {
                            options += ' bg-warning"><i class="fa-solid fa-route"></i></div><div class="dropdown-notifications-item-content"><div class="dropdown-notifications-item-content-details">';
                            options += item.localidad + ' / ' + item.departamento + '</div><div class="dropdown-notifications-item-content-text">' + item.nomVia + '</div></div></a>';
                        }

                    }
                });
                options += '</select>';
                document.getElementById('visorDeListado').innerHTML = options;
            }
        } catch (error) {
            console.error(error);
        }
    } else {
        document.getElementById('visorDeListado').innerHTML = '<div class="fa-2x">Buscando <i class="fas fa-spinner fa-pulse"></i></div>';
    }
}
async function buscarEsquinas() {
    var options = "";
    var urlEsq = urlBase + "/cruces?calle=" + seleccion.nomVia + "&departamento=" + seleccion.departamento + "&localidad=" + seleccion.localidad;

    datoEsq.pop();
    try {
        const response = await fetch(urlEsq)
            .then((response) => response.json())
            .then((item) => {
                var idCalleEsq = 0;
                var idCalleEsqAnt = 0;
                options = '<label for="esquinaUbi" class="form-label">Esquina</label>';
                options += '<select class="form-select" id="idSelectEsquina" name="idSelectEsquina" onchange="elegirEsquina();">';
                options += '<option class="dropdown-header dropdown-notifications-header" Seleccionar esquina ...</option>';
                item.forEach(function (item) {
                    idCalleEsq = item.idCalleEsq;
                    if (item.idCalle > 0) {
                        if (seleccion.nomVia == item.nomVia) {
                            if (idCalleEsq != idCalleEsqAnt) {
                                // quitar repetidos
                                this.datoEsq.push(item);
                                options += '<option class="dropdown-item dropdown-notifications-item" value="' + item.idCalleEsq + '"><i>' + item.address + '</i></option>';
                            }
                            idCalleEsqAnt = item.idCalleEsq;
                        }
                    }
                }, this);
                options += '</select>';
                document.getElementById('esquinaDiv').innerHTML = options;
            });
    } catch (error) {
        console.error(error);
    }
}
async function buscarCalleNumeroAsync(portal) {
    var urlEsq = urlBase + "/find?idcalle=" + seleccion.idCalle + "&portal=" + portal + "&type=CALLEyPORTAL";
    console.log("buscar calle numero: " + urlEsq);
    var item;
    if (seleccionEsq.length > 0) {
        seleccionEsq.pop();
    }
    try {
        const response = await fetch(urlEsq)
            .then((response) => response.json())
            .then((item) => {
                //     console.log("buscarCalleNumero: " + item[0].nomVia);
                seleccionEsq = item[0];
                document.getElementById('direccion').value = item[0].address;
                actualizarMapa();
            }, seleccionEsq);
    } catch (error) {
        console.error(error);
    }
}
function elegirCalle(selectedValue) {
    seleccion = dato.find(item => item.idCalle == selectedValue);
    document.getElementById("departamento").value = seleccion.departamento;
    document.getElementById("barrio").value = seleccion.localidad;
    document.getElementById("calle").value = seleccion.nomVia;
    document.getElementById("visorDeListado").style.display = "none";
    buscarEsquinas();
}
let diasa;
function elegirEsquina() {
    var selectedValue = document.getElementById('idSelectEsquina').options[document.getElementById('idSelectEsquina').selectedIndex].value;

    seleccionEsq = datoEsq.find(item => item.idCalleEsq == selectedValue);
    document.getElementById('direccion').value = seleccion.address;
    // console.log("aca " + seleccionEsq.lat + seleccionEsq.lng);
    //actualizarMapa();
    masCercana(seleccionEsq);
    actualizarMapa(seleccionEsq.lat, seleccionEsq.lng);

}

//function actualizarMapa(Lat = null, Lng = null) {
function actualizarMapa(Lat, Lng) {
    let iconoPersonalizado = L.icon({
        iconUrl: 'resources/marker-icons/marker-iconnaranjaf.png',
        iconSize: [22, 36], // especifica el tamaño del icono en píxeles
        iconAnchor: [12, 35], // especifica el punto de anclaje del icono relativo a su posición
        popupAnchor: [0, -32] // especifica el punto de anclaje del popup relativo al icono
    });

    if (Lat != null && Lng != null) {
        seleccionEsq.lat = Lat;
        seleccionEsq.lng = Lng;
        seleccionEsq.address = "Ubicacion del usuario";
    }

    if (marcador != null) {
        map.removeLayer(marcador);
    }
    if (circulo != null) {
        map.removeLayer(circulo);
    }
    // if (ambulanciaMarcador != null) {
    //     map.removeLayer(ambulanciaMarcador);
    // }

    marcador = L.marker([seleccionEsq.lat, seleccionEsq.lng], { icon: iconoPersonalizado }).addTo(map);
    marcador.bindPopup("<h4>Mi ubicación</h4><br>" + seleccionEsq.address + "<br>" + seleccionEsq.lat + " , " + seleccionEsq.lng);
    marcador.display;
    circulo = L.circle([seleccionEsq.lat, seleccionEsq.lng], { // Circulo verde zona
        radius: 600,
        weight: 0.9,
        opacity: 1,
        fillOpacity: 0.09,
        color: '#035'
    }).addTo(map)
    //circulo.bindPopup("Circulo")
    //frmBuscar.style.display = 'none';
    //btnMostrarBuscador.style.backgroundColor = '#f4f4f4';
    //map.setView([seleccionEsq.lat, seleccionEsq.lng], 13);


    ///////////////// USUARIO
    var Usuario = {
        lat: seleccionEsq.lat,
        lon: seleccionEsq.lng
    };

    var Ambulancia = {
        lat: loAmb,
        lon: laAmb
    };

    var SerEme = {
        lat: laAmb2,
        lon: loAmb2
    };
    // let diasa;
    // diasa = masCercana(seleccionEsq).lat;
    // diasaa = masCercana(seleccionEsq).lng;
    // // loAmb2 = diasa.Lng;
    // // laAmb2 = diasa.Lat;
    // console.log("Ser " + diasa, diasa);
    // var Usuario = {
    //     lat: -56.2194844,
    //     lon: -34.8588634
    // }; //-34.86860943844723], [-56.19680643081666]

    var ambulanciaMarcador = L.icon({
        iconUrl: 'resources/marker-icons/ambulance_color.png',
        iconSize: [28, 28],
        iconAnchor: [12, 35],
        popupAnchor: [0, -32]
    });

    var markerAmbulancia = L.marker([SerEme.lat, SerEme.lon], { icon: ambulanciaMarcador }).addTo(map);
    crearRecorrido(Ambulancia, SerEme, Usuario, markerAmbulancia);
}

function crearRecorrido(Ambulancia, SerEme, Usuario, markerAmbulancia) {
    console.log("A " + Ambulancia.lat, Ambulancia.lon);
    console.log("U " + Usuario.lat, Usuario.lon);
    console.log("S " + SerEme.lat, SerEme.lon);
    L.Routing.control({
        waypoints: [
            L.latLng(Ambulancia.lat, Ambulancia.lon),
            L.latLng(Usuario.lat, Usuario.lon),
            L.latLng(SerEme.lat, SerEme.lon)
        ]
    })
        .on('routesfound', function (e) {
            console.log(e);
            var routes = e.routes;
            var summary = routes[0].summary;
            console.log('Tiempo: ' + summary.totalTime / 40 + ' minutos; Distancia: ' + summary.totalDistance / 1000 + ' km');
            routes[0].coordinates.forEach(function (coord, index) {
                setTimeout(() => {
                    markerAmbulancia.setLatLng(coord);
                }, 80 * index);
            });
        }).addTo(map);
}

function buscarCalleNumero() {
    let portal = document.getElementById('numeroCalle').value;
    // verificar que ya se haya llenado campo calle
    if (seleccion.id != null) {      // verificar que se haya cargado un numero
        if (portal.length > 0) {
            // enviar las busqueda
            buscarCalleNumeroAsync(portal);
        } else {
            alert('Debe ingresar un número');
        }
    } else {
        alert('Debe seleccionar una calle');
    }
}

// Obtener referencia a los botones
var mostrarBuscadorBtn = document.getElementById('mostrarBuscador');
var buscarUbicacionBtn = document.getElementById('buscarUbicacion');

// Manejar evento de clic en el botón "buscarUbicacion"
buscarUbicacionBtn.addEventListener('click', function () {
    obtenerCoordenadas()
        .then(function (coor) {
            console.log('---------- GPS ------------');
            console.log('Latitud: ', coor.latitud);
            console.log('Longitud: ', coor.longitud);
            coor.longitud = -56.16586446762086;
            coor.latitud = -34.91755507267872;
            actualizarMapa(coor.latitud, coor.longitud);
        })
        .catch(function (error) {
            //      console.error('Error al obtener las coordenadas:', error);
        });
});


document.getElementById('mostrarBuscador').addEventListener('click', function () {
    if (frmBuscar.style.display === 'none') {
        btnMostrarBuscador.style.backgroundColor = 'rgba(38,71,191,1)';
        frmBuscar.style.display = 'block';
    } else {
        frmBuscar.style.display = 'none';
        btnMostrarBuscador.style.backgroundColor = '#f4f4f4';
    }
});


/// Para obtener coordenadas GSP 
function obtenerCoordenadas() { //SYA
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                let latitud = position.coords.latitude;
                let longitud = position.coords.longitude;
                let coor = {
                    latitud,
                    longitud
                };
                resolve(coor);
            }, function (error) {
                reject(error);
            });
        } else {
            reject('Tu navegador no es compatible con la geolocalización.');
        }
    });
}



