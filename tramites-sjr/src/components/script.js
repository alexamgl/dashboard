/*const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

allSideMenu.forEach(item=> {
    const li = item.parentElement;

    item.addEventListener('click', function () {
        allSideMenu.forEach(i=> {
            i.parentElement.classList.remove('active');
        })
        li.classList.add('active');
    })
});*/

console.log("Archivo JavaScript cargado");

function showPaymentOptions(packageName, cost, selectedCard) {
    const paymentOptionsDiv = document.getElementById("paymentOptions");
    paymentOptionsDiv.style.display = "block";
    document.getElementById("packageName").innerText = packageName;

    // Remueve la clase 'selected-card' de todas las tarjetas
    const cards = document.querySelectorAll(".card");
    cards.forEach(card => card.classList.remove("selected-card"));

    // Agrega la clase 'selected-card' a la tarjeta seleccionada
    selectedCard.classList.add("selected-card");
}

function pay() {
    const paymentMethod = document.getElementById("paymentMethod").value;
    alert(`Pagando con método: ${paymentMethod}`);
}

function getRoleFromToken() {
    const token = localStorage.getItem('token');
    if (!token) {
        return null;
    }
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || 'user';
}


function logout() {
    localStorage.removeItem('token');
    window.location.href = '../../public/login.html';
}


// Inicializar sidebar y activar enlaces de menú
document.addEventListener('DOMContentLoaded', () => {
    const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');
    allSideMenu.forEach(item => {
        const li = item.parentElement;
        item.addEventListener('click', function () {
            allSideMenu.forEach(i => i.parentElement.classList.remove('active'));
            li.classList.add('active');
        });
    });

    // Inicializar enlaces de secciones
    const links = document.querySelectorAll("a[data-section]");
    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelectorAll("main > div").forEach(div => div.style.display = "none");
            document.getElementById(this.getAttribute("data-section")).style.display = "block";
            links.forEach(l => l.parentElement.classList.remove("active"));
            this.parentElement.classList.add("active");
        });
    });


    

    initializeAccordions();
});

function initializeAccordions() {
    const accordions = document.querySelectorAll('.accordion');
    console.log('Accordions encontrados:', accordions.length);

    accordions.forEach(accordion => {
        accordion.addEventListener('click', function () {
            console.log('Acordeón clickeado');
            this.classList.toggle('active');
            const panel = this.nextElementSibling;
            panel.style.maxHeight = panel.style.maxHeight ? null : panel.scrollHeight + 'px';
        });
    });
}

/*document.addEventListener('DOMContentLoaded', function () {
    const links = document.querySelectorAll("a[data-section]");

    links.forEach(link =>{
        link.addEventListener('click', function (e){
            e.preventDefault();
            document.querySelectorAll("main > div").forEach(div=>{
                div.style.display = "none";
            });

            const sectionId = this.getAttribute("data-section");
            document.getElementById(sectionId).style.display = "block";

            link.forEach(l => l.parentElement.classList.remove("active"));
            this.parentElement.classList.add("active");
        });
    });
});*/

function VerificaToken() {
    const Token = localStorage.getItem("token");
    if (Token) {
        const TokenSplit = Token.split(".");
        if (TokenSplit.length === 3) {
            //window.location.href = "login.html"
            const payload = JSON.parse(atob(TokenSplit[1]));
            console.log("Payload", payload);
        } else {
            console.error("Token invalido");
        }
    } else {
        console.error("Token no encontrado");
        window.location.href = "../../public/login.html"
    }
}

function toggleComponent(selectedId) {
    const components = document.querySelectorAll('.component');
    components.forEach(component => {
        component.style.display = component.id === selectedId ? 'block' : 'none';
    });
}

function mostrarGenerales(selectedId) {
    generales = document.getElementById(selectedId);
    generales.style.display = 'block';
}

async function CreateCashCharge(customerId, data) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const apiKey = "sk_229558ae860f49d19fe7476d68e9db36";
    const encodedKey = btoa(`${apiKey}:`);
    myHeaders.append("Authorization", `Basic ${encodedKey}`);

    const uniqueOrderId = `oid-${new Date().getTime()}`;
    const chargeData = JSON.stringify({
        method: "store",
        amount: data.amount,
        description: data.description,
        order_id: uniqueOrderId,
        due_date: data.due_date
    });

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: chargeData,
        redirect: 'follow'
    };

    const url = `https://sandbox-api.openpay.mx/v1/maeuhuem814uvym5du2x/customers/${customerId}/charges`;

    return fetch(url, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la creación del cargo');
            }
            return response.json();
        })
        .then(result => {
            alert("Cargo creado con éxito. Generando recibo en PDF...");

            const barcodeUrl = result.payment_method.barcode_url;
            const reference = result.payment_method.reference;

            generatePDF(barcodeUrl, reference);
            console.log("Detalles del cargo:", result);
            return result;
        })
        .catch(error => {
            alert("Error al crear el cargo. Intenta nuevamente.");
            console.error("Error:", error);
        });
}

function generatePDF(barcodeUrl, reference) {
    if (typeof window.jspdf !== "undefined") {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Recibo de Pago en Efectivo", 20, 20);

        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = barcodeUrl;

        img.onload = function () {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            const imgData = canvas.toDataURL('image/png');

            doc.addImage(imgData, 'PNG', 20, 30, 170, 30);

            doc.setFontSize(12);
            doc.text(`Referencia: ${reference}`, 20, 70);

            const pdfUrl = doc.output('dataurlstring');
            const pdfWindow = window.open();
            pdfWindow.document.write(`<iframe src="${pdfUrl}" width="100%" height="100%"></iframe>`);
        };
    } else {
        console.error("jsPDF no está disponible. Verifica que el script jsPDF se haya cargado correctamente.");
    }
}

document.getElementById("payButton").addEventListener("click", async function () {
    const customerId = "athbmoiyics6ziycgllv";
    const amount = document.getElementsByClassName("costo").item(0);
    console.log(amount.innerText);
    /*const chargeData = {
        amount: 100.00,
        description: "Cargo con tienda",
        order_id: "TR-001-001-001", 
        due_date: "2024-11-10T13:45:00"
    };
    
    CreateCashCharge(customerId, chargeData);*/
});

// TOGGLE SIDEBAR
/*const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');

menuBar.addEventListener('click', function () {
    sidebar.classList.toggle('hide');
})*/

const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');
if (menuBar && sidebar) {
    menuBar.addEventListener('click', function () {
        sidebar.classList.toggle('hide');
    });
}

const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');

searchButton.addEventListener('click', function (e) {
    if (window.innerWidth < 576) {
        e.preventDefault();
        searchForm.classList.toggle('show');
        if (searchForm.classList.contains('show')) {
            searchButtonIcon.classList.replace('bx-search', 'bx-x');
        } else {
            searchButtonIcon.classList.replace('bx-x', 'bx-search');
        }
    }
})

if (window.innerWidth < 768) {
    sidebar.classList.add('hide');
} else if (window.innerWidth > 576) {
    searchButtonIcon.classList.replace('bx-x', 'bx-search');
    searchForm.classList.remove('show');
}

window.addEventListener('resize', function () {
    if (this.innerWidth > 576) {
        searchButtonIcon.classList.replace('bx-x', 'bx-search');
        searchForm.classList.remove('show');
    }
})

const switchMode = document.getElementById('switch-mode');

switchMode.addEventListener('change', function () {
    if (this.checked) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
})

//ENVIA INFORMACION A LA API
function enviarInformacion() {
    fetch('http://localhost/Api/public/pagos', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => {
            if (!response.ok) throw new Error('Error en la petición');
            return response.json();
        })
        .then(data => {
            console.log('Respuesta del servidor:', data);
            alert('Información enviada exitosamente');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un problema al enviar la información');
        });
}

window.onload = () => {
    // Observador para detectar cuando los elementos .accordion se agregan al DOM
    const observer = new MutationObserver((mutations, observer) => {
        const accordions = document.querySelectorAll('.accordion');
        if (accordions.length > 0) {
            initializeAccordions();
            observer.disconnect(); // Detiene la observación una vez que los acordeones se han inicializado
        }
    });

    // Configura el observador para observar cambios en el cuerpo del documento
    observer.observe(document.body, { childList: true, subtree: true });
};

function checkAuth() {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = '../../public/login.html';;
        return;
    }

    try {
        const payload = parseJwt(token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (payload.exp && payload.exp < currentTime) {
            alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
            localStorage.removeItem('token');
            window.location.href = '../../public/login.html';
        }
    } catch (e) {
        alert('Token inválido. Por favor, inicia sesión nuevamente.');
        localStorage.removeItem('token');
        window.location.href = '../../public/login.html';
    }
}

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
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
}

function buscarColonias() {
    const codigoPostal = document.getElementById("codigo_postal").value;
    fetch(`https://api.zippopotam.us/MX/${codigoPostal}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Código postal no válido o fuera del estado de Querétaro");
            }
            return response.json();
        })
        .then(data => {
            const lugaresQuerétaro = data.places.filter(place => place['state abbreviation'] === "QUE");
            if (lugaresQuerétaro.length > 0) {
                colonias = lugaresQuerétaro.map(place => place["place name"]); // Guardar las colonias
                filtrarColonias(); // Mostrar la lista de colonias completa al cargar
            } else {
                alert("Código postal fuera del estado de Querétaro.");
            }
        })
        .catch(error => {
            alert("Error al obtener colonias: " + error.message);
        });
}

function filtrarColonias() {
    const input = document.getElementById("colonia").value.toLowerCase();
    const autocompleteList = document.getElementById("autocomplete-list");
    autocompleteList.innerHTML = ""; // Limpiar lista

    const filteredColonias = colonias.filter(colonia => colonia.toLowerCase().includes(input));
    filteredColonias.forEach(colonia => {
        const item = document.createElement("div");
        item.classList.add("autocomplete-item");
        item.textContent = colonia;
        item.onclick = function () {
            document.getElementById("colonia").value = colonia; // Selecciona la colonia
            autocompleteList.innerHTML = ""; // Limpiar lista después de selección
        };
        autocompleteList.appendChild(item);
    });
}

function construirDireccion() {
    const colonia = document.getElementById("colonia").value;
    const calle = document.getElementById("calle").value;
    const numeroExterior = document.getElementById("numero_exterior").value;
    const numeroInterior = document.getElementById("numero_interior").value;

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

            lat = results[0].geometry.location.lat();
            lng = results[0].geometry.location.lng();
            document.getElementById("latitud").value = lat;
            document.getElementById("longitud").value = lng;
        } else {
            alert("No se pudo encontrar la ubicación: " + status);
        }
    });
}
