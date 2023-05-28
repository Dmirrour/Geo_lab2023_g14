/**
 *
 * Clase uilizada para conecatr al mapa interno
 * https://am-gateway-test-int.pge.red.uy/
 * Autor: Wilson Arriola
 * Solo funciona en intranet
 *
 */
class ubicarDireccionCandidatas {
    domicilio       = {
        "type":"",
        "id":"",
        "address":"",
        "idCalle":0,
        "nomVia":null,
        "postalCode":"",
        "idLocalidad":0,
        "localidad":"",
        "idDepartamento":0,
        "departamento":"",
        "manzana":null,
        "solar":null,
        "inmueble":null,
        "idCalleEsq":0,
        "km":0.0,
        "priority":0,
        "geom":null,
        "tip_via":null,
        "lat":0,
        "lng":0,
        "portalNumber":0,
        "letra":"",
        "stateMsg":"",
        "source":"ide_uy",
        "ranking":0,
        "state":0 };

    divParaMapa;
    idElegirCalle;
    nombreClassNew;

    dato            = [];
    datoEsq         = [];
    seleccion       = [];
    seleccionEsq    = [];

    mostrarpopup    = false;
    mostrarJson;

    lat;
    lng;

    elementoDepartamento;
    elementoLocalidad;
    elementoCalle;
    elementoSelectEsquina;
    idSelectEsquina;
    inputDireccion;
    inputJson;
    form;

    urlBase         = "https://direcciones.ide.uy/api/";

    f_expira        = new Date();

    constructor (nombreClassNew, visorDeListado, idElegirCalle, idDepartamento, idLocalidad, idCalle, selectEsquina, idEsquina, divMapa, inputDireccion, inputjson, form, mostrarJson = "mostrarJson"){
        this.nombreClassNew             = nombreClassNew;
        this.elementoVisorDeListado     = visorDeListado;
        this.elementoListadoDeCalles    = idElegirCalle;
        this.idElegirCalle              = idElegirCalle;
        this.elementoDepartamento       = idDepartamento;
        this.elementoLocalidad          = idLocalidad;
        this.elementoCalle              = idCalle;
        this.elementoSelectEsquina      = selectEsquina;
        this.idSelectEsquina            = idEsquina;
        this.divParaMapa                = divMapa;
        this.inputDireccion             = inputDireccion;
        this.inputJson                  = inputjson;
        this.form                       = form;
        this.mostrarJson                = mostrarJson;
        var domUsu_id                   = document.createElement("input");
        var form1                       = document.getElementById(this.form);

        form1.appendChild(domUsu_id);
        domUsu_id.name = this.inputJson;
        domUsu_id.id = this.inputJson;
        domUsu_id.type = "hidden";

    }

    async sugerencia(text) {

        var long = text.length;
        var options = "";
        var buscar = false;

        // buscar calle
        var urlCalle = this.urlBase + "v1.0/api/v1/geocode/candidates?limit=10&q="+text+",%20Montevideos&soloLocalidad=false";
        document.getElementById(this.elementoVisorDeListado).style.display = "none";

        if (long > 2) {
            buscar = true;
            document.getElementById(this.elementoVisorDeListado).style.display = "block";
        }

        if (buscar){
            var item;

            this.dato.pop();

            try {
                const response = await fetch(urlCalle)
                    .then( (response) => response.json())
                    .then( (item)=> {

                        options = '<select class="form-select" id="'+this.idElegirCalle+'" size="6" aria-label="size 6 select" onchange="'+this.nombreClassNew+'.elegirCalle();">';
                        options += '<option class="dropdown-header dropdown-notifications-header" disabled>IDE.uy</option>';
                        options += '<option disabled>---------------------------------</option>';

                        options = '<h6 class="dropdown-header dropdown-notifications-header"><i data-feather="bell"></i>IDE.uy</h6>';


                        /*
                        calle: "MARTIN ARTIGAS"
                        departamento: "ARTIGAS"
                        ​​
                        idCalle: 28087
                        ​​
                        idLocalidad: 135
                        ​​
                        localidad: "ARTIGAS"
                        ​​
                        type: "LOCALIDAD"
                        */
                        item.forEach(function(item) {
                            console.log( "resultado en then: " + item.type );
                            if ( item.idCalle > 0 ){
                                this.dato.push(item);

                                options += '<a class="dropdown-item dropdown-notifications-item" onclick="'+this.nombreClassNew+'.elegirCalle('+item.idCalle+')">';
                                options += '<div class="dropdown-notifications-item-icon';

                                if (item.type == 'CALLEyPORTAL') {
                                    options += ' bg-warning"><i class="fa-solid fa-location-dot"></i></div><div class="dropdown-notifications-item-content"><div class="dropdown-notifications-item-content-details">';
                                    options += item.localidad+' / '+item.departamento + '</div><div class="dropdown-notifications-item-content-text">' + item.nomVia + '</div></div></a>';
                                }else if (item.type == 'POI') {
                                    ////LISTO
                                    options += ' bg-danger"><i class="fa-solid fa-house-flag"></i></div><div class="dropdown-notifications-item-content"><div class="dropdown-notifications-item-content-details">';
                                    options += item.localidad+' / '+item.departamento + '</div><div class="dropdown-notifications-item-content-text"><b>'+ item.inmueble +'</b> ' + item.nomVia + '</div></div></a>';
                                }else if (item.type == 'CALLE'){
                                    ////LISTO
                                    options += ' bg-success"><i class="fa-solid fa-road"></i></div><div class="dropdown-notifications-item-content"><div class="dropdown-notifications-item-content-details">';
                                    options += item.localidad+' / '+item.departamento + '</div><div class="dropdown-notifications-item-content-text">' + item.nomVia + '</div></div></a>';
                                }else if (item.type = 'LOCALIDAD'){
                                    ////LISTO
                                    options += ' bg-info"><i class="fa-solid fa-location-pin"></i></div><div class="dropdown-notifications-item-content"><div class="dropdown-notifications-item-content-details">';
                                    options += item.localidad+' / '+item.departamento + '</div></div></a>';
                                }else if (item.type = 'ESQUINA'){
                                    options += ' bg-warning"><i class="fa-solid fa-arrows-to-circle"></i></div><div class="dropdown-notifications-item-content"><div class="dropdown-notifications-item-content-details">';
                                    options += item.localidad+' / '+item.departamento + '</div><div class="dropdown-notifications-item-content-text">' + item.nomVia + '</div></div></a>';
                                }else if (item.type == 'MANZANAySOLAR'){
                                    options += ' bg-warning"><i class="fa-solid fa-apple-whole"></i></div><div class="dropdown-notifications-item-content"><div class="dropdown-notifications-item-content-details">';
                                    options += item.localidad+' / '+item.departamento + '</div><div class="dropdown-notifications-item-content-text">' + item.nomVia + '</div></div></a>';
                                }else /* if (item.type == 'RUTAyKM') */{
                                    options += ' bg-warning"><i class="fa-solid fa-route"></i></div><div class="dropdown-notifications-item-content"><div class="dropdown-notifications-item-content-details">';
                                    options += item.localidad+' / '+item.departamento + '</div><div class="dropdown-notifications-item-content-text">'+ item.nomVia + '</div></div></a>';
                                }

                            }
                        }, this);

                        options += '</select>';
                        document.getElementById(this.elementoVisorDeListado).innerHTML = options;

                    });
            } catch (error) {
                console.error(error);
            }
        }else{
            document.getElementById(this.elementoVisorDeListado).innerHTML = '<div class="fa-2x">Buscando <i class="fas fa-spinner fa-pulse"></i></div>';
        }
    }

    elegirCalle(selectedValue) {
        this.seleccion = this.dato.find( item => item.idCalle == selectedValue );
        this.agregarCalle();
    }

    actualziarCampos () {
        document.getElementById(this.elementoDepartamento).value = this.seleccion.departamento;
        document.getElementById(this.elementoLocalidad).value = this.seleccion.localidad;
        document.getElementById(this.elementoCalle).value = this.seleccion.nomVia;
        document.getElementById(this.elementoVisorDeListado).style.display = "none";
    }

    agregarCalle() {
        this.actualziarCampos();
        this.buscarEsquinas();
    }

    async buscarEsquinas(){

        var options = "";

        // buscar esquina
        var urlEsq = this.urlBase + "v1.0/api/v1/geocode/cruces?calle="+this.seleccion.nomVia+"&departamento="+this.seleccion.departamento+"&localidad="+this.seleccion.localidad;

        var item;
        this.datoEsq.pop();

        try {
            const response = await fetch(urlEsq)
                .then( (response) => response.json())
                .then( (item)=> {

                    console.log("buscaresquiba: " + item);
                    // console.log(item.data[0].nombre);
                    var idCalleEsq = 0;
                    var idCalleEsqAnt = 0;

                    options = '<label for="esquinaUbi" class="form-label">Esquina</label>';
                    options += '<select class="form-select" id="'+this.idSelectEsquina+'" name="'+this.idSelectEsquina+'" onchange="'+this.nombreClassNew+'.elegirEsquina();">';
                    options += '<option class="dropdown-header dropdown-notifications-header" Seleccionar esquina ...</option>';

                    item.forEach(function(item) {
                        idCalleEsq = item.idCalleEsq;
                        if ( item.idCalle > 0 ){
                            if ( idCalleEsq != idCalleEsqAnt ){
                                // quitar repetidos
                                this.datoEsq.push(item);
                                options += '<option class="dropdown-item dropdown-notifications-item" value="'+ item.idCalleEsq +'"><i>' + item.address + '</i></option>';
                            }
                            idCalleEsqAnt = item.idCalleEsq;
                        }
                    }, this);

                    options += '</select>';

                    document.getElementById(this.elementoSelectEsquina).innerHTML = options;
                });

        } catch (error) {
            console.error(error);
        }
    }

    elegirEsquina() {
        var selectedValue = document.getElementById(this.idSelectEsquina).options[document.getElementById(this.idSelectEsquina).selectedIndex].value;
        this.seleccionEsq = this.datoEsq.find( item => item.idCalleEsq == selectedValue );
        this.seleccion = this.seleccionEsq;
        this.seleccion.idCalleEsq = this.seleccionEsq.idCalleEsq;
        this.seleccion.address = this.seleccionEsq.address;
        this.seleccion.lat = this.seleccionEsq.lat;
        this.seleccion.lng = this.seleccionEsq.lng;
        this.seleccionarDireccion();
        this.actualizarMapa();
    }

    seleccionarDireccion(){
        document.getElementById(this.inputDireccion).value = this.seleccion.address;
        // guardo el json en input oculto
        document.getElementById(this.inputJson).value = JSON.stringify(this.seleccion);
        // TODO motrar campos para escribir complemento de la direccion( nro, tipo casa, apto, manz., sol., ruta, km, etc)
        document.getElementById(this.mostrarJson).innerHTML = this.syntaxHighlight(this.seleccion);
    }

    actualizarMapa() {
        require(
            [
                "esri/Map",
                "esri/views/MapView",
                "esri/widgets/BasemapToggle",
                "esri/rest/locator"
            ],
            (Map, MapView, BasemapToggle, locator) => {
                const map = new Map({
                    basemap: "streets-navigation-vector"
                });
                const view = new MapView({
                    container: this.divParaMapa,
                    map: map,
                    zoom: 15,
                    center: [this.seleccionEsq.lng, this.seleccionEsq.lat]
                });
                // cambiar el tipo de mapa
                const toggle = new BasemapToggle({
                    view: view,
                    nextBasemap: "hybrid"
                    // nextBasemap: "topo-vector"
                });
                view.ui.add(toggle, "top-right");
                // mostrar mensaje al hacer clic
                view.popup.autoOpenEnabled = true;
                view.on("click", (event) => {
                    // Get the coordinates of the click on the view
                    // around the decimals to 3 decimals
                    const lat = Math.round(event.mapPoint.latitude *  10000000000000) / 10000000000000;
                    const lon = Math.round(event.mapPoint.longitude * 10000000000000) / 10000000000000;
                    this.lat = lat;
                    this.lng = lon;
                    this.clicEnMapa ();

                    //const locatorUrl = "https://direcciones.ide.uy/api/v0/geocode/";
                    console.log(this.mostrarpopup);
                    //if (this.mostrarpopup){
                    view.popup.open({
                        // Set the popup's title to the coordinates of the clicked location
                        title: "Reverse geocode: [" + lon + ", " + lat + "]", // titulo del popup
                        location: event.mapPoint
                    });
                    //}
                });
            }
        );
    }

    syntaxHighlight(json) {
        if (typeof json != 'string') {
            json = JSON.stringify(json, undefined, 2);
        }
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }

    resetMap(){
        this.clicEnMapa ();
        this.seleccion.idCalleEsq = this.seleccionEsq.idCalleEsq;
        this.seleccion.address = this.seleccionEsq.address;
        this.seleccion.lat = this.seleccionEsq.lat;
        this.seleccion.lng = this.seleccionEsq.lng;
        this.mostrarpopup = true;
        this.seleccionarDireccion();
        this.actualizarMapa();
    }

    async clicEnMapa () {
        console.log (this.lat+' - '+this.lng);
        // var urlEsq = "https://direcciones.ide.uy/api/v1/geocode/reverse?latitud="+this.lat+"&limit=1&longitud="+this.lng;
        var urlEsq = this.urlBase + "v1.0/api/v1/geocode/reverse?latitud="+this.lat+"&limit=1&longitud="+this.lng;

        try {
            const response = await axios.get(urlEsq);

            if ( response.status == 200){
                // console.log('responde %0', response);
                this.seleccionEsq = response.data[0];
                // completo los datos
                this.seleccion = this.seleccionEsq;
                // this.seleccion.idCalleEsq = this.seleccionEsq.idCalleEsq;
                // this.seleccion.address = this.seleccionEsq.address;
                // this.seleccion.lat = this.seleccionEsq.lat;
                // this.seleccion.lng = this.seleccionEsq.lng;
                this.mostrarpopup = true;
                this.seleccionarDireccion();
                this.actualziarCampos();
                this.buscarEsquinas();
                this.actualizarMapa();
            }

        } catch (error) {
            console.error(error);
        }
    }
}