
//*****************************************************************************************************************/
//+++++++++++++++++++++++++++++++++++++FUNCIONES MAPA UBICACIÓN++++++++++++++++++++++++++++++++++++++++++++++++
//*****************************************************************************************************************/

// Esperar que el DOM esté cargado antes de llamar a loadGoogleMapsApi
window.onload = function () {
    loadGoogleMapsApi()
        .then(() => {
            initMap();  // Inicializa el mapa una vez que la API esté cargada
        })
        .catch(error => {
            alert("Error al cargar Google Maps");
        });
}
function loadGoogleMapsApi() {
    return new Promise((resolve, reject) => {

        const script = document.createElement("script");
        script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDCA8ESHOaVPNQId1dIy2wfHEFN2s7Ti1s&libraries=places";
        script.async = true;
        script.defer = true;

        script.onload = () => {
            resolve();
        };
        script.onerror = () => {
            reject(new Error("Error al cargar la API de Google Maps"));
        };

        document.body.appendChild(script);
    });
}

function initMap() {

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: { lat: 20.392449657518938, lng: -100.00503243606525 },
    });

    geocoder = new google.maps.Geocoder();
    marker = new google.maps.Marker({ map });

    map.addListener("click", (event) => {
        actualizarUbicacion(event.latLng);
    });

}

function actualizarUbicacion(location) {
    marker.setPosition(location);
    map.setCenter(location);

    lat = location.lat();
    lng = location.lng();
    document.getElementById("latitud").value = lat;
    document.getElementById("longitud").value = lng;
    document.getElementById("coordinates").textContent = `Lat: ${lat}, Lng: ${lng}`;
}

let colonias = []; // Declaración global de la variable para almacenar las colonias

function buscarColonias() {
    const codigoPostal = document.getElementById("codigoPostal").value;
    fetch(`https://api.zippopotam.us/MX/${codigoPostal}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Código postal no válido o fuera del estado de Querétaro, favor de cambiarlo.");
            }
            return response.json();
        })
        .then(data => {
            const lugaresQuerétaro = data.places.filter(place => place['state abbreviation'] === "QUE");
            if (lugaresQuerétaro.length > 0) {
                colonias = lugaresQuerétaro.map(place => place["place name"].toUpperCase());  // Guardar las colonias
                filtrarColonias(); // Mostrar la lista de colonias completa al cargar
            } else {
                alert("Código postal fuera del estado de Querétaro.");
            }
        })
        .catch(error => {
            alert("Error al obtener colonias: " + error.message);
        });
}

function mostrarAutocomplete() {
    const autocompleteList = document.getElementById("autocomplete-list");
    autocompleteList.classList.remove("hidden"); // Mostrar el cuadro
}

function filtrarColonias() {
    const input = document.getElementById("colonia").value.toLowerCase();
    const autocompleteList = document.getElementById("autocomplete-list");
    autocompleteList.innerHTML = ""; // Limpiar lista

    const filteredColonias = colonias.filter(colonia => colonia.toLowerCase().includes(input));
    //console.log("Colonias filtradas para el autocomplete:", filteredColonias); // Log para depuración

    if (filteredColonias.length === 0) {
        const item = document.createElement("div");
        item.classList.add("autocomplete-item");
        item.textContent = "No se encontraron colonias.";
        autocompleteList.appendChild(item);
        return;
    }

    filteredColonias.forEach(colonia => {
        const item = document.createElement("div");
        item.classList.add("autocomplete-item");
        item.textContent = colonia;
        item.onclick = function () {
            document.getElementById("colonia").value = colonia; // Selecciona la colonia
            autocompleteList.classList.add("hidden"); // Ocultar lista después de selección
            autocompleteList.innerHTML = ""; // Limpiar lista
        };
        autocompleteList.appendChild(item);
    });
}

document.addEventListener("click", function (e) {
    const inputColonia = document.getElementById("colonia");
    const autocompleteList = document.getElementById("autocomplete-list");

    // Si el clic no es en el input ni en el cuadro, lo ocultamos
    if (!inputColonia.contains(e.target) && !autocompleteList.contains(e.target)) {
        autocompleteList.classList.add("hidden");
    }
});

function construirDireccion() {
    const colonia = document.getElementById("colonia").value;
    const calle = document.getElementById("calle").value;
    const numeroExterior = document.getElementById("numeroExterior").value;
    const numeroInterior = document.getElementById("numeroInterior").value;

    let direccion = `${colonia}, ${calle} ${numeroExterior},`;
    if (numeroInterior) direccion += ` Int. ${numeroInterior},`;
    return direccion;
}

function buscarUbicacion() {
    const direccion = construirDireccion();
    geocoder.geocode({ address: direccion + "San Juan del Rio, Querétaro, México" }, (results, status) => {
        if (status === "OK") {
            map.setCenter(results[0].geometry.location);
            map.setZoom(16);
            marker.setPosition(results[0].geometry.location);

            const lat = results[0].geometry.location.lat();
            const lng = results[0].geometry.location.lng();

            // Mostrar el botón "Guardar ubicación"
            const guardarUbicacionContainer = document.getElementById("guardar-ubicacion-container");
            guardarUbicacionContainer.style.display = "block";
            console.log("Ubicación encontrada. Mostrando el botón 'Guardar ubicación'.");

            document.getElementById("latitud").value = lat;
            document.getElementById("longitud").value = lng;
            document.getElementById("coordinates").textContent = `Lat: ${lat}, Lng: ${lng}`;
        } else {
            alert("No se pudo encontrar la ubicación: " + status);
        }
    });
}
