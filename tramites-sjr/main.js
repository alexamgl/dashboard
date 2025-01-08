//pasar a Raul mañana
const stepsInfo = [
  { title: "Paso 1: Términos y condiciones", subtitle: "Siguiente: Datos personales" },
  { title: "Paso 2: Datos personales", subtitle: "Siguiente: Dirección" },
  { title: "Paso 3: Dirección", subtitle: "Siguiente: Contacto" },
  { title: "Paso 4: Contacto", subtitle: "Siguiente: Previo de información" },
  { title: "Paso 5: Previo de información", subtitle: "Siguiente: Documentos" },
  { title: "Paso 6: Documentos", subtitle: "Final" }
];

function updateProgressCircle() {
  const progressCircle = document.getElementById('circle-progress');
  const progressText = document.getElementById('progress-text');
  const stepTitle = document.getElementById('step-title');
  const stepSubtitle = document.getElementById('step-subtitle');

  // Calcula el porcentaje
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  // Actualiza el círculo de progreso
  progressCircle.style.background = `conic-gradient(#28a745 ${progressPercentage}%, #e9ecef ${progressPercentage}%)`;

  // Actualiza el texto y títulos
  progressText.textContent = `${currentStep + 1} de ${steps.length}`;
  stepTitle.textContent = stepsInfo[currentStep].title;
  stepSubtitle.textContent = currentStep < steps.length - 1 ? stepsInfo[currentStep].subtitle : "Proceso finalizado";
}
//pasar a Raul mañana

let map;
let marker;
let geocoder;
let colonias = [];

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: { lat: 20.392449657518938, lng: -100.00503243606525 },
  });
  geocoder = new google.maps.Geocoder();
  marker = new google.maps.Marker({ map });

  // Añadir evento para cambiar ubicación al hacer clic en el mapa
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
  alert(direccion)
  console.log(direccion);
}

function validarNumero(element, maxLength = null) {
  element.value = element.value.replace(/[^0-9]/g, ''); // Solo permite números
  if (maxLength && element.value.length > maxLength) {
    element.value = element.value.slice(0, maxLength); // Limita la longitud
  }
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
      document.getElementById("coordinates").textContent = `Lat: ${lat}, Lng: ${lng}`;
    } else {
      alert("No se pudo encontrar la ubicación: " + status);
    }
  });
}

function loadComponent(id, file) {
  fetch(`/tramites-sjr/src/components/${file}`)
    .then(response => {
      if (!response.ok) throw new Error("Error loading component");
      return response.text();
    })
    .then(html => {
      document.getElementById(id).innerHTML = html;
    })
    .catch(error => console.error(error));
}

document.addEventListener("DOMContentLoaded", () => {
  loadComponent("header", "header.html");
  loadComponent("footer", "footer.html");
  updateProgressCircle();
  PreviewData();
});
function PreviewData() {
  document.getElementById("prev_curp").innerHTML = "CURP: " + document.getElementById("curp_usuario").value;
  document.getElementById("prev_nombre").innerHTML = "Nombre: " + document.getElementById("nombre").value;
  console.log(document.getElementById("primer_apellido").value);
  document.getElementById("prev_primer_apellido").innerHTML = "Primer apellido: " + document.getElementById("primer_apellido").value;
}

let currentStep = 0;
const steps = document.querySelectorAll(".step");
function showStep(stepIndex) {
  steps.forEach((step, index) => {
    step.classList.toggle("active", index === stepIndex);
  });
}

function nextStep() {
  const currentInputs = steps[currentStep].querySelectorAll('input, select');
  let allFilled = true;

  currentInputs.forEach(input => {
    if (input.type !== 'checkbox' && input.value.trim() === '') {
      allFilled = false;
    }
  });

  if (!allFilled) {
    showToast(); // Mostrar el toast si hay campos vacíos
    return; // No avanzar si hay campos vacíos
  }

  if (currentStep < steps.length - 1) {
    currentStep++;
    showStep(currentStep);
    updateProgressCircle(); // Actualiza el progreso
  }
}

function showToast() {
  const toast = document.getElementById('toast');
  toast.style.display = 'block'; // Mostrar el toast
  setTimeout(() => {
    toast.style.display = 'none'; // Ocultar el toast después de 3 segundos
  }, 3000);
}

function hideToast() {
  const toast = document.getElementById('toast');
  toast.style.display = 'none'; // Ocultar el toast manualmente
}

function prevStep() {
  if (currentStep > 0) {
    currentStep--;
    showStep(currentStep);
    updateProgressCircle();
  }
}

function curpValida(curp) {
  var re = /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/,
    validado = curp.match(re);

  if (!validado)  //Coincide con el formato general?
    return false;

  //Validar que coincida el dígito verificador
  function digitoVerificador(curp17) {
    //Fuente https://consultas.curp.gob.mx/CurpSP/
    var diccionario = "0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ",
      lngSuma = 0.0,
      lngDigito = 0.0;
    for (var i = 0; i < 17; i++)
      lngSuma = lngSuma + diccionario.indexOf(curp17.charAt(i)) * (18 - i);
    lngDigito = 10 - lngSuma % 10;
    if (lngDigito == 10) return 0;
    return lngDigito;
  }

  if (validado[2] != digitoVerificador(validado[1]))
    return false;

  return true; //Validado
}

function validarInputCurp(input) {
  var curp = input.value.toUpperCase(),
    errorCurp = document.getElementById("error-curp");
  if (curpValida(curp)) {
    errorCurp.style.display = "none";
    errorCurp.innerHTML = "La CURP no es válida";

  } else {
    console.log("La CURP no es válida");
    errorCurp.style.display = "block";
    errorCurp.innerHTML = "La CURP no es válida";
  }
}

function validateTerminosCondiciones() {
  const terminos = document.getElementById("terminos");
  errorDiv = document.getElementById("error-valid");
  if (terminos.checked) {
    errorDiv.style.display = "none";
    nextStep();
  } else {
    errorDiv.style.display = "block";
    errorDiv.innerHTML = "Debes aceptar los términos y condiciones";
  }
}

function comprobarPassword(input) {
  var password = input.value,
    errorPassword = document.getElementById("error-password");
  if (password.length < 8) {
    errorPassword.style.display = "block";
    errorPassword.innerHTML = "La contraseña debe tener al menos 8 caracteres";
  } else {
    errorPassword.style.display = "none";
  }
}

/*function uploadFile(inputId) {
  const fileInput = document.getElementById(inputId);
  const file = fileInput.files[0];

  if (!file) {
    alert("Por favor, selecciona un archivo antes de enviar.");
    return;
  }

  let descripcionArchivo;
  switch (inputId) {
    case 'ine':
      descripcionArchivo = 'Esta es la INE';
      break;
    case 'curp_docu':
      descripcionArchivo = 'Este es el CURP';
      break;
    case 'comprobanteDomicilio':
      descripcionArchivo = 'Este es el comprobante de domicilio';
      break;
    case 'actaNacimiento':
      descripcionArchivo = 'Esta es el acta de nacimiento';
      break;
    default:
      descripcionArchivo = 'Documento sin descripción específica';
  }

  const formData = new FormData();
  const progressBar = document.getElementById(`progress-bar-${inputId}`);
  const statusButton = document.getElementById(`status-btn-${inputId}`);
  const statusIcon = document.querySelector(`#status-btn-${inputId} .button-box`);

  formData.append('id_usuario', '35');
  formData.append('nombre_archivo', file);
  formData.append('descripcion_archivo', descripcionArchivo);

  fetch('http://localhost/Api/public/usuario_exp', {
    method: 'POST',
    body: formData
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }
      return response.json();
    })
    .then(data => {
      console.log("Respuesta de la API:", data);
      if (data.success) {
        alert("Archivo subido exitosamente.");
        // Actualizar barra de progreso al éxito
        progressBar.style.width = "100%";

        // Cambiar la "X" a la palomita
        statusIcon.classList.add('success');
      } else {
        alert("Error al subir el archivo: " + (data.message || "Error desconocido"));
      }
    })
    .catch(error => {
      console.error("Error al subir el archivo:", error);
      alert("Error al subir el archivo.");
    });
}*/

function previewFile(inputId) {
  const fileInput = document.getElementById(inputId);
  const file = fileInput.files[0];

  if (!file) {
    alert("Por favor, selecciona un archivo para previsualizar.");
    return;
  }

  // Verifica si el archivo es un PDF o una imagen
  if (!file.type.match("application/pdf") && !file.type.match("image.*")) {
    alert("Solo se pueden previsualizar archivos PDF o imágenes.");
    return;
  }

  // Muestra el modal
  const modal = document.getElementById("modalPreview");
  const previewFrame = document.getElementById("previewFrame");

  const fileURL = URL.createObjectURL(file);
  previewFrame.src = fileURL;
  modal.style.display = "flex";
}

// Función para cerrar el modal
function closeModal() {
  const modal = document.getElementById("modalPreview");
  const previewFrame = document.getElementById("previewFrame");

  modal.style.display = "none";
  previewFrame.src = "";
}

async function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (username === '' || password === '') {
    showToast();
    return;
  }

  try {
    const response = await fetch('http://localhost/Api/public/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      throw new Error("Error en la solicitud: " + response.status);
    }

    const data = await response.json();

    if (data.success && data.token) {
      // Guarda el token JWT en localStorage
      localStorage.setItem('token', data.token);
      window.location.href = "../src/components/dashboard.html";
    } else {
      alert(data.message || "Credenciales incorrectas");
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    alert("Hubo un problema con el inicio de sesión.");
  }
}

/*
//funcion para verificar token de acceso
function VerificaToken() {
  const Token = localStorage.getItem("Token");
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
    window.location.href = "login.html"
  }
}

//funcion para inciar sesion
function login() {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
  localStorage.setItem("Token", token);
  window.location.href = "/tramites-sjr/src/components/dashboard.html";
}

let currentStep = 0;
const steps = document.querySelectorAll(".step");

function showStep(stepIndex) {
  steps.forEach((step, index) => {
    step.classList.toggle("active", index === stepIndex);
  });
}

function nextStep() {
  const currentInputs = steps[currentStep].querySelectorAll('input, select');
  let allFilled = true;

  currentInputs.forEach(input => {
    if (input.type !== 'checkbox' && input.value.trim() === '') {
      allFilled = false;
    }
  });

  if (!allFilled) {
    showToast(); // Mostrar el toast si hay campos vacíos
    return; // No avanzar si hay campos vacíos
  }

  if (currentStep < steps.length - 1) {
    currentStep++;
    showStep(currentStep);
  }
}

function showToast() {
  const toast = document.getElementById('toast');
  toast.style.display = 'block'; // Mostrar el toast
  setTimeout(() => {
    toast.style.display = 'none'; // Ocultar el toast después de 3 segundos
  }, 3000);
}

function hideToast() {
  const toast = document.getElementById('toast');
  toast.style.display = 'none'; // Ocultar el toast manualmente
}

function prevStep() {
  if (currentStep > 0) {
    currentStep--;
    showStep(currentStep);
  }
}


function previewFile(fileId) {
  const fileInput = document.getElementById(fileId);
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      sessionStorage.setItem(fileId, event.target.result); // Guardar en sesión temporalmente
    };
    reader.readAsDataURL(file);
  }
}

//Realizar alta de usuarios en OpenPay
async function RegisterUser(data) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");  // Corregido "Congtent-Type"
  myHeaders.append("Authorization", "Bearer " + PRIVATE_KEY);  // Asume que PRIVATE_KEY está definido

  const raw = JSON.stringify(data);
  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  return fetch(`${API_OPENPAY}/${MERCHANT_ID}/customers`, requestOptions)  // Asume que API_OPENPAY y MERCHANT_ID están definidos
    .then(response => {
      if (!response.ok) {
        throw new Error('Error en la creación del usuario');
      }
      return response.json();
    })
    .then(result => {
      return result.id;
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Hubo un problema al crear el usuario');
    });
}


async function RegisitroUsuarioAPI() {
  const data = {
    user_id: '',
    nombre: document.getElementById("nombre").value,
    primer_apellido: document.getElementById("primer_apellido").value,
    segundo_apellido: document.getElementById("segundo_apellido").value,
    curp_usuario: document.getElementById("curp_usuario").value,
    nombre_completo: document.getElementById("nombre").value + " " + document.getElementById("primer_apellido").value + " " + document.getElementById("segundo_apellido").value,
    fecha_nacimiento: document.getElementById("fecha_nacimiento").value,
    password: document.getElementById("password").value,
    terminos: document.getElementById("terminos").checked,
    tipo_asentamiento: document.getElementById("tipo_asentamiento").value,
    asentamiento: document.getElementById("asentamiento").value,
    calle: document.getElementById("calle").value,
    numero_exterior: document.getElementById("numero_exterior").value,
    numero_interior: document.getElementById("numero_interior").value,
    codigo_postal: document.getElementById("codigo_postal").value,
    telefono: document.getElementById("telefono").value,
    email: document.getElementById("email").value,
    tipo_telefono: document.getElementById("tipo_telefono").value,
  };
  try {
    const userId = await RegisterUser({ name: data.nombre_completo, email: data.email });
    data.user_id = userId;
    console.log(API_URL + ENDPOINTS.REGISTER);
    const phpApi = await fetch(API_URL + ENDPOINTS.REGISTER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!phpApi.ok) throw new Error("Error en el registro del usuario");

    const phpRespose = await phpApi.json();
    console.log(phpRespose);
  } catch (error) {
    console.error(error);
  }

}

function sendFile(fileId) {
  const fileInput = document.getElementById(fileId);

  if (fileInput.files.length === 0) {
    alert("Por favor selecciona un archivo para " + fileId.toUpperCase());
    return;
  }

  const formData = new FormData();
  formData.append(fileId, fileInput.files[0]);

  console.log(fileId)
}

function sendFile(fileId) {
  const fileInput = document.getElementById(fileId);
  if (fileInput.files.length === 0) {
    alert("Por favor selecciona un archivo para " + fileId.toUpperCase());
    return;
  }
  const formData = new FormData();
  formData.append(fileId, fileInput.files[0]);
  console.log("Enviando archivo");
  console.log(fileId);
  console.log(formData);
  /*fetch("/upload", {
    method: "POST",
    body: formData,
  })
  .then(response => {
    if (!response.ok) throw new Error("Error uploading file");
    return response.text();
  })
  .then(data => {
    console.log(data);
    sessionStorage.setItem(fileId, data);
  })
  .catch(error => console.error(error));
}
function openModal(fileId) {
  const modal = document.getElementById('modal');
  const modalPreview = document.getElementById('modal-preview');
  const fileData = sessionStorage.getItem(fileId);

  if (fileData) {
    modalPreview.innerHTML = ''; // Limpiar el contenido del modal

    const fileInput = document.getElementById(fileId);
    const fileType = fileInput.files[0].type;

    if (fileType.startsWith("image/")) {
      const img = document.createElement("img");
      img.src = fileData;
      img.style.maxWidth = "50%";
      img.style.height = "auto";
      modalPreview.appendChild(img);
    } else if (fileType === "application/pdf") {
      const iframe = document.createElement("iframe");
      iframe.src = fileData;
      iframe.width = "100%";
      iframe.height = "500px";
      modalPreview.appendChild(iframe);
    } else if (fileType.startsWith("text/")) {
      const textArea = document.createElement("textarea");
      textArea.value = atob(fileData.split(',')[1]);
      textArea.rows = 10;
      textArea.cols = 50;
      textArea.readOnly = true;
      modalPreview.appendChild(textArea);
    } else {
      modalPreview.textContent = "Vista previa no disponible para este tipo de archivo.";
    }

    modal.style.display = "flex";
  }
}

function closeModal() {
  document.getElementById('modal').style.display = "none";
}

function showToast() {
  const toast = document.getElementById('toast');
  toast.style.display = 'block'; // Mostrar el toast
  setTimeout(() => {
    toast.style.display = 'none'; // Ocultar el toast después de 3 segundos
  }, 3000);
}

function hideToast() {
  const toast = document.getElementById('toast');
  toast.style.display = 'none'; // Ocultar el toast manualmente
}*/

