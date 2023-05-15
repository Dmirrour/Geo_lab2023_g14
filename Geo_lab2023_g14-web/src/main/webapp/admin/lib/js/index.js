var mapa = L.map("contenedor-mapa").setView([-34.8797018070320851, -56.262557241497211], 12) // establece la vista del mapa (coordenadas y zoom) 
//L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png?", {}).addTo(mapa)
L.tileLayer("http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {}).addTo(mapa)

var marcador = L.marker([-34.8797018070320851, -56.262557241497211]).addTo(mapa) // establece icono del marcado
marcador.bindPopup("Casa Sebastián")

const circulo = L.circle([-34.8797018070320851, -56.262557241497211], {
    radius: 1500,
    color: "green"
}).addTo(mapa)
circulo.bindPopup("Villa del Cerro")

function clicSobreMapa(evento) {
    alert("Click en coordenadas: " + "\n" + "[" + evento.latlng.lat + "] [" + evento.latlng.lng + "]")

    let latitud = evento.latlng.lat;
    let longitud = evento.latlng.lng;
    console.log("Click en coordenadas: ")
    console.log("Latitud:", latitud.toFixed(2)) // .toFixed(2) muestra 2 decimales(no usar para guardar datos en bd)
    console.log("Longitud:", longitud.toFixed(2))
}
mapa.on("click", clicSobreMapa);

console.log("Mapa: ", mapa)
console.log("Marcador: ", marcador)
console.log("Zona circulo: ", circulo)
console.log("--------------------------------------------------------")


