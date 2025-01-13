const stepsInfo = [
  { title: "Paso 1: Tipo de persona", subtitle: "Siguiente: Datos personales" },
  { title: "Paso 2: Datos personales", subtitle: "Siguiente: Dirección" },
  { title: "Paso 3: Dirección", subtitle: "Siguiente: Contacto" },
  { title: "Paso 4: Contacto", subtitle: "Siguiente: Términos y Condiciones" },
  { title: "Paso 5: Términos y condiciones", subtitle: "Siguiente: Previo de información" },
  { title: "Paso 6: Previo de información", subtitle: "Siguiente: Finalizar" },
  { title: "Paso 7: Documentos", subtitle: "Final" }
];

function updateProgressCircle() {
  const progressCircle = document.getElementById('circle-progress');
  const progressText = document.getElementById('progress-text');
  const stepTitle = document.getElementById('step-title');
  const stepSubtitle = document.getElementById('step-subtitle');

  // Calcula el porcentaje
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  // Define el gradiente dinámico
  const gradientColor1 = '#28a745'; // Color inicial
  const gradientColor2 = '#48b2e7'; // Color final
  progressCircle.style.background = `conic-gradient(
      ${gradientColor1} 0%,
      ${gradientColor2} ${progressPercentage}%,
      #e9ecef ${progressPercentage}%
  )`;

  // Actualiza el texto del progreso
  progressText.textContent = `${currentStep + 1} de ${steps.length}`;
  stepTitle.textContent = stepsInfo[currentStep].title;
  stepSubtitle.textContent =
    currentStep < steps.length - 1 ? stepsInfo[currentStep].subtitle : "Proceso finalizado";
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

// Función para eliminar tildes pero conservar la ñ
function quitarTildes(texto) {
  return texto.replace(/[áàäâ]/g, "a")
    .replace(/[éèëê]/g, "e")
    .replace(/[íìïî]/g, "i")
    .replace(/[óòöô]/g, "o")
    .replace(/[úùüû]/g, "u")
    .replace(/[ÁÀÄÂ]/g, "A")
    .replace(/[ÉÈËÊ]/g, "E")
    .replace(/[ÍÌÏÎ]/g, "I")
    .replace(/[ÓÒÖÔ]/g, "O")
    .replace(/[ÚÙÜÛ]/g, "U");
}

// Función para aplicar la lógica a los inputs
function aplicarQuitarTildesAInputs(selector) {
  const inputs = document.querySelectorAll(selector);
  inputs.forEach(input => {
    input.addEventListener("input", function (event) {
      const valorSinTildes = quitarTildes(event.target.value);
      if (event.target.value !== valorSinTildes) {
        event.target.value = valorSinTildes;
      }
    });
  });
}

// Función para solo letras, incluyendo ñ
function soloLetras(texto) {
  return texto.replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚ\s]/g, ""); // Eliminar todo excepto letras y espacios
}

// Función para letras, incluyendo ñ, tildes, espacios y puntos
function soloLetrasYPuntos(texto) {
  return texto.replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚ\s.]/g, ""); // Eliminar todo excepto letras, espacios y puntos
}

// Función para aplicar solo letras y puntos a inputs
function aplicarSoloLetrasYPuntosAInputs(selector) {
  const inputs = document.querySelectorAll(selector);
  inputs.forEach(input => {
    input.addEventListener("input", function (event) {
      const valorFiltrado = soloLetrasYPuntos(event.target.value);
      if (event.target.value !== valorFiltrado) {
        event.target.value = valorFiltrado;
      }
    });
  });
}



// Función para aplicar solo letras a inputs
function aplicarSoloLetrasAInputs(selector) {
  const inputs = document.querySelectorAll(selector);
  inputs.forEach(input => {
    input.addEventListener("input", function (event) {
      const valorFiltrado = soloLetras(event.target.value);
      if (event.target.value !== valorFiltrado) {
        event.target.value = valorFiltrado;
      }
    });
  });
}

// Función para letras, números, incluyendo ñ y espacios
function soloLetrasYNumeros(texto) {
  return texto.replace(/[^a-zA-Z0-9ñÑ ]/g, ""); // Eliminar todo excepto letras, números, la ñ y espacios
}

// Función para aplicar letras y números a inputs
function aplicarSoloLetrasYNumeros(selector) {
  const inputs = document.querySelectorAll(selector);
  inputs.forEach(input => {
    input.addEventListener("input", function (event) {
      const valorFiltrado = soloLetrasYNumeros(event.target.value);
      if (event.target.value !== valorFiltrado) {
        event.target.value = valorFiltrado;
      }
    });
  });
}

// Función para filtrar solo números
function soloNumeros(texto) {
  return texto.replace(/[^0-9]/g, ""); // Eliminar todo lo que no sea un número
}

// Función para aplicar el filtro de solo números a los inputs
function aplicarSoloNumerosAInputs(selector) {
  const inputs = document.querySelectorAll(selector);
  inputs.forEach(input => {
    input.addEventListener("input", function (event) {
      const valorFiltrado = soloNumeros(event.target.value);
      if (event.target.value !== valorFiltrado) {
        event.target.value = valorFiltrado;
      }
    });
  });
}

// Aplicar la función a los inputs con la clase "solo-letras-puntos"
aplicarSoloLetrasYPuntosAInputs(".solo-letras-puntos");

// Aplicar la función a los inputs con la clase "solo-numeros"
aplicarSoloNumerosAInputs(".solo-numeros");

// Aplicar funciones a los inputs con sus respectivas clases
aplicarSoloLetrasYNumeros(".solo-letras-numeros");
aplicarSoloLetrasAInputs(".solo-letras");
aplicarQuitarTildesAInputs(".sin-tildes");

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
  // Mostrar u ocultar secciones según el tipo de persona seleccionada
  const previewFisica = document.getElementById('preview-fisica');
  const previewMoral = document.getElementById('preview-moral');
  const contactoFisica = document.getElementById('contacto-fisica');
  const contactoMoral = document.getElementById('contacto-moral');
  const direccionFisica = document.getElementById('direccion-fisica');
  const direccionMoral = document.getElementById('direccion-moral');

  if (tipoPersonaSeleccionada === "fisica") {
      // Mostrar datos de persona física y ocultar los de persona moral
      previewFisica.style.display = "block";
      previewMoral.style.display = "none";
      contactoFisica.style.display = "block";
      contactoMoral.style.display = "none";
      direccionFisica.style.display = "block";
      direccionMoral.style.display = "none";

      // Rellenar campos de Persona Física
      document.getElementById('preview-curp-fisica').textContent = document.getElementById('curp_usuario').value;
      document.getElementById('preview-nombre-fisica').textContent = document.getElementById('nombre').value;
      document.getElementById('preview-primer-apellido-fisica').textContent = document.getElementById('primer_apellido').value;
      document.getElementById('preview-segundo-apellido-fisica').textContent = document.getElementById('segundo_apellido').value;
      document.getElementById('preview-fecha-nacimiento-fisica').textContent = document.getElementById('fecha_nacimiento').value;
      document.getElementById('preview-genero-fisica').textContent = document.getElementById('sexo').value;
      document.getElementById('preview-estado-nacimiento-fisica').textContent = document.getElementById('estado').value;
  } else if (tipoPersonaSeleccionada === "moral") {
      // Mostrar datos de persona moral y ocultar los de persona física
      previewFisica.style.display = "none";
      previewMoral.style.display = "block";
      contactoFisica.style.display = "none";
      contactoMoral.style.display = "block";
      direccionFisica.style.display = "none";
      direccionMoral.style.display = "block";

      // Rellenar campos de Persona Moral
      document.getElementById('preview-razon-social').textContent = document.getElementById('razon_social').value;
      document.getElementById('preview-rfc').textContent = document.getElementById('RFC_organizacion').value;
      document.getElementById('preview-curp-moral').textContent = document.getElementById('curp_representante').value;
      document.getElementById('preview-nombre-moral').textContent = document.getElementById('nombre_representante').value;
      document.getElementById('preview-primer-apellido-moral').textContent = document.getElementById('primer_apellido_representante').value;
      document.getElementById('preview-segundo-apellido-moral').textContent = document.getElementById('segundo_apellido_representante').value;
      document.getElementById('preview-fecha-nacimiento-moral').textContent = document.getElementById('fecha_nacimiento_representante').value;
      document.getElementById('preview-genero-moral').textContent = document.getElementById('sexo_representante').value;
  }

  // Rellenar campos de Dirección y Contacto (comunes)
  document.getElementById('preview-codigo-postal').textContent = document.getElementById('codigo_postal').value;
  document.getElementById('preview-colonia').textContent = document.getElementById('colonia').value;
  document.getElementById('preview-calle').textContent = document.getElementById('calle').value;
  document.getElementById('preview-numero-exterior').textContent = document.getElementById('numero_exterior').value;
  document.getElementById('preview-numero-interior').textContent = document.getElementById('numero_interior').value || " S/N";

  document.getElementById('preview-email').textContent = document.getElementById('email').value;
  document.getElementById('preview-telefono').textContent = document.getElementById('telefono').value;
}


let currentStep = 0;
const steps = document.querySelectorAll(".step");
function showStep(stepIndex) {
  steps.forEach((step, index) => {
    step.classList.toggle("active", index === stepIndex);
  });
  // Si estamos en el paso 2, mostrar/ocultar inputs según el tipo de persona
  if (stepIndex === 1) {
    toggleInputsByTipoPersona();
  }
}

// Alternar los inputs según el tipo de persona seleccionada
function toggleInputsByTipoPersona() {
  const inputsFisica = document.getElementById("inputs-fisica");
  const inputsMoral = document.getElementById("inputs-moral");

  if (tipoPersonaSeleccionada === "fisica") {
    inputsFisica.style.display = "block";
    inputsMoral.style.display = "none";
  } else if (tipoPersonaSeleccionada === "moral") {
    inputsFisica.style.display = "none";
    inputsMoral.style.display = "block";
  }
}

function nextStep() {
  const currentInputs = steps[currentStep].querySelectorAll("input, select");
  let allFilled = true;

  currentInputs.forEach(input => {
    // Ignorar campos ocultos
    if (input.offsetParent === null) {
      return; // Campo está oculto, ignorarlo
    }

    // Ignorar campo de Número Interior
    if (input.id === "numero_interior") {
      return;
    }

    // Validar que el campo no esté vacío
    if (input.type !== "checkbox" && input.value.trim() === "") {
      allFilled = false;
    }
  });

  if (!validarTelefonoCoinciden() || !validarEmailCoinciden()) {
    return; // No avanzar si los teléfonos o correos no coinciden
  }
  // Validar que las contraseñas coincidan
  if (!validarPasswordCoinciden()) {
    showToast("Las contraseñas no coinciden.");
    return; // Detener si las contraseñas no coinciden
  }

  if (!validarPasswordCoincidenOrganizacion()) {
    showToast("Las contraseñas no coinciden.");
    return; // Detener si las contraseñas no coinciden
  }

  if (!validarCurpCoinciden()) {
    showToast("Las contraseñas no coinciden.");
    return; // Detener si las contraseñas no coinciden
  }

  if (!validarCurpCoincidenOrganizacion()) {
    showToast("Las contraseñas no coinciden.");
    return; // Detener si las contraseñas no coinciden
  }

  // Validar que los correos coincidan
  if (!validarEmailCoinciden()) {
    return; // Detener si los correos no coinciden
  }
  if (currentStep === 0) {
    // Validar selección del tipo de persona
    const tipoPersona = document.querySelector('input[name="tipo_persona"]:checked');
    if (!tipoPersona) {
      showToast("Por favor selecciona un tipo de persona (Física o Moral).");
      return;
    }
    tipoPersonaSeleccionada = tipoPersona.value; // Guardar selección
  }

  if (!allFilled) {
    showToast("Completa todos los campos requeridos.");
    return;
  }

  if (currentStep < steps.length - 1) {
    currentStep++;
    showStep(currentStep);
    updateProgressCircle();
  }
}

function validarEmailCoinciden() {
  const email = document.getElementById("email").value.trim();
  const verificaEmail = document.getElementById("verifica_email").value.trim();
  const verificaEmailInput = document.getElementById("verifica_email");

  // Verifica solo si ambos campos tienen contenido
  if (email.length > 0 && verificaEmail.length > 0) {
    if (email !== verificaEmail) {
      verificaEmailInput.classList.add("invalid");
      verificaEmailInput.classList.remove("valid");

      // Mostrar el mensaje debajo del input
      showErrorAlertBelowInput(
        verificaEmailInput,
        "Los correos no coinciden",
        "error",
        5000
      );
      return false;
    } else {
      verificaEmailInput.classList.remove("invalid");
      verificaEmailInput.classList.add("valid");

      removeExistingAlert(verificaEmailInput);
      return true;
    }
  } else {
    // Si el usuario no ha terminado de escribir
    verificaEmailInput.classList.remove("valid", "invalid");
    removeExistingAlert(verificaEmailInput);
  }
  return true;
}

function validarTelefonoCoinciden() {
  const telefono = document.getElementById("telefono").value.trim();
  const verificaTelefono = document.getElementById("verifica_telefono").value.trim();
  const verificaTelefonoInput = document.getElementById("verifica_telefono");

  // Verifica solo si ambos campos tienen contenido
  if (telefono.length > 0 && verificaTelefono.length > 0) {
    if (telefono !== verificaTelefono) {
      verificaTelefonoInput.classList.add("invalid");
      verificaTelefonoInput.classList.remove("valid");

      // Mostrar el mensaje debajo del input
      showErrorAlertBelowInput(
        verificaTelefonoInput,
        "Los números de teléfono no coinciden",
        "error",
        5000
      );
      return false;
    } else {
      verificaTelefonoInput.classList.remove("invalid");
      verificaTelefonoInput.classList.add("valid");

      // Elimina cualquier mensaje de alerta si los números coinciden
      removeExistingAlert(verificaTelefonoInput);
      return true;
    }
  } else {
    // Si el usuario no ha terminado de escribir
    verificaTelefonoInput.classList.remove("valid", "invalid");
    removeExistingAlert(verificaTelefonoInput);
  }
  return true;
}


function finalStep() {
  // Obtener los botones de estado de los archivos
  const fileStatusButtons = [
    document.getElementById("status-btn-ine"),
    document.getElementById("status-btn-acta"),
    document.getElementById("status-btn-curp"),
    document.getElementById("status-btn-domicilio")
  ];

  // Validar si todos los archivos han sido enviados correctamente
  let allFilesUploaded = true;
  fileStatusButtons.forEach(button => {
    if (!button.classList.contains("success")) {
      allFilesUploaded = false;
    }
  });

  if (!allFilesUploaded) {
    alert("Por favor, sube todos los documentos requeridos antes de continuar.");
    return; // Detener la ejecución si no están todos enviados
  }

  // Si todos los archivos están completos, redirigir a la nueva página
  localStorage.removeItem('user_id');
  window.location.href = "https://www.sanjuandelrio.gob.mx/";
}



function showToast() {
  const toast = document.getElementById('toast');
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.display = 'none';
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

function calcularEdad(fechaNacimiento) {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();

  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }

  return edad;
}

function showAlert(message) {
  const alertContainer = document.getElementById("alert-container");
  const alertMessage = document.getElementById("alert-message");

  alertMessage.textContent = message;
  alertContainer.style.display = "block";

  // Cierra automáticamente después de 5 segundos
  setTimeout(() => {
    alertContainer.style.display = "none";
  }, 5000);
}

function closeAlert() {
  document.getElementById("alert-container").style.display = "none";
}

function showErrorAlertBelowInput(input, message, type = "error", duration = 5000) {
  const existingAlert = input.parentElement.querySelector(".error");
  if (existingAlert) {
    existingAlert.remove();
  }

  const alertContainer = document.createElement("div");
  alertContainer.className = type;
  alertContainer.innerHTML = `
      <div class="${type}__icon">
          <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
              <path d="m13 13h-2v-6h2zm0 4h-2v-2h2zm-1-15c-1.3132 0-2.61358.25866-3.82683.7612-1.21326.50255-2.31565 1.23915-3.24424 2.16773-1.87536 1.87537-2.92893 4.41891-2.92893 7.07107 0 2.6522 1.05357 5.1957 2.92893 7.0711.92859.9286 2.03098 1.6651 3.24424 2.1677 1.21325.5025 2.51363.7612 3.82683.7612 2.6522 0 5.1957-1.0536 7.0711-2.9289 1.8753-1.8754 2.9289-4.4189 2.9289-7.0711 0-1.3132-.2587-2.61358-.7612-3.82683-.5026-1.21326-1.2391-2.31565-2.1677-3.24424-.9286-.92858-2.031-1.66518-3.2443-2.16773-1.2132-.50254-2.5136-.7612-3.8268-.7612z" fill="#fff"></path>
          </svg>
      </div>
      <div class="${type}__title">${message}</div>
      <div class="${type}__close">
          <svg height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
              <path d="m15.8333 5.34166-1.175-1.175-4.6583 4.65834-4.65833-4.65834-1.175 1.175 4.65833 4.65834-4.65833 4.6583 1.175 1.175 4.65833-4.6583 4.6583 4.6583 1.175-1.175-4.6583-4.6583z" fill="#fff"></path>
          </svg>
      </div>
  `;

  input.parentElement.appendChild(alertContainer);

  const closeButton = alertContainer.querySelector(`.${type}__close`);
  closeButton.addEventListener("click", () => alertContainer.remove());

  if (duration > 0) {
    setTimeout(() => {
      if (alertContainer.parentElement) {
        alertContainer.remove();
      }
    }, duration);
  }
}

function removeExistingAlert(input) {
  const existingAlert = input.parentElement.querySelector(".error, .success");
  if (existingAlert) {
    existingAlert.remove();
  }
}

function removeAlerts() {
  const alerts = document.querySelectorAll(".error");
  alerts.forEach(alert => alert.remove());
}

// Validar CURP principal
function validarInputCurp(input) {
  const curp = input.value.toUpperCase();
  const verificaCurpInput = document.getElementById("verifica_curp");

  // Valida cuando la longitud sea 18 caracteres
  if (curp.length === 18) {
    if (curpValida(curp)) {
      const datos = extraerDatosDeCURP(curp);

      if (datos) {
        const edad = calcularEdad(datos.fechaNacimiento);
        
        if (edad < 18) {
          input.classList.add("invalid");
          input.classList.remove("valid");
          verificaCurpInput.disabled = true;
          verificaCurpInput.value = ""; // Limpia Verificar CURP

          // Muestra alerta de menor de edad
          showErrorAlertBelowInput(
            input,
            "El registro solo es para mayores de edad.",
            "error",
            5000
          );
          return;
        }
      }

      verificarCurpEnAPI(curp).then((response) => {
        if (response.success) {
          input.classList.add("valid");
          input.classList.remove("invalid");
          verificaCurpInput.disabled = false;
          removeExistingAlert(input); // Elimina cualquier alerta previa
        } else {
          input.classList.add("invalid");
          input.classList.remove("valid");
          verificaCurpInput.disabled = true;
          verificaCurpInput.value = ""; // Limpia Verificar CURP

          // Muestra alerta de CURP ya registrada
          showErrorAlertBelowInput(
            input,
            "La CURP ya está registrada.",
            "error",
            5000
          );
        }
      });
    } else {
      input.classList.add("invalid");
      input.classList.remove("valid");
      verificaCurpInput.disabled = true;
      verificaCurpInput.value = ""; // Limpia Verificar CURP

      // Muestra alerta de CURP no válida
      showErrorAlertBelowInput(input, "La CURP no es válida.", "error", 5000);
    }
  } else {
    input.classList.remove("valid", "invalid");
    verificaCurpInput.disabled = true;
    verificaCurpInput.value = "";
    removeExistingAlert(input); // Cierra cualquier alerta si existe
  }
}

function validarInputCurpRepresentante(input) {
  const curp = input.value.toUpperCase();
  const verificaCurpInput = document.getElementById("verifica_curp_representante");

  // Valida cuando la longitud sea 18 caracteres
  if (curp.length === 18) {
    if (curpValida(curp)) {
      const datos = extraerDatosDeCURP(curp);

      if (datos) {
        const edad = calcularEdad(datos.fechaNacimiento);

        if (edad < 18) {
          input.classList.add("invalid");
          input.classList.remove("valid");
          verificaCurpInput.disabled = true;
          verificaCurpInput.value = ""; // Limpia Verificar CURP

          // Muestra alerta de menor de edad
          showErrorAlertBelowInput(
            input,
            "El registro solo es para mayores de edad.",
            "error",
            5000
          );
          return;
        }
      }

      input.classList.add("valid");
      input.classList.remove("invalid");
      verificaCurpInput.disabled = false;
      removeExistingAlert(input); // Elimina cualquier alerta previa
    } else {
      input.classList.add("invalid");
      input.classList.remove("valid");
      verificaCurpInput.disabled = true;
      verificaCurpInput.value = ""; // Limpia Verificar CURP

      // Muestra alerta de CURP no válida
      showErrorAlertBelowInput(input, "La CURP no es válida.", "error", 5000);
    }
  } else {
    input.classList.remove("valid", "invalid");
    verificaCurpInput.disabled = true;
    verificaCurpInput.value = "";
    removeExistingAlert(input); // Cierra cualquier alerta si existe
  }
}



function habilitarVerificarCurp() {
  var verificaCurp = document.getElementById("verifica_curp");
  verificaCurp.disabled = false;
}

async function verificarCurpEnAPI(curp) {
  console.log(JSON.stringify({ curp }));
  const verificaCurpInput = document.getElementById("verifica_curp");
  const curpInput = document.getElementById("curp_usuario");
  try {
    const response = await fetch('/tramites-sjr/Api/principal/validar_curp', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ curp }),
    });

    const data = await response.json();

    if (!data.success) {
      // Mostrar alerta de error y cambiar borde del input a rojo
      curpInput.style.borderColor = "red";
      showErrorAlertBelowInput(curpInput, data.message || "Error al verificar la CURP", "error");

      // Deshabilitar el input de verificar CURP y borrar su valor
      verificaCurpInput.value = "";
      verificaCurpInput.disabled = true;
    } else {
      // Si la CURP no está registrada, habilitar el campo de verificar CURP, cambiar borde a verde y eliminar alert
      curpInput.style.borderColor = "green";
      verificaCurpInput.disabled = false;
      removeAlerts(); // Elimina cualquier alerta existente
    }
  } catch (error) {
    // Manejo de errores del servidor
    curpInput.style.borderColor = "red";
    showErrorAlertBelowInput(curpInput, "Error de conexión con el servidor", "error");
  }
}


function validarPasswordCoinciden() {
  const password = document.getElementById("password").value.trim();
  const verificaPassword = document.getElementById("verifica_password").value.trim();
  const verificaPasswordInput = document.getElementById("verifica_password");

  // Realiza la validación solo si se está escribiendo en el campo de Verificar Contraseña
  if (verificaPassword.length > 0) {
    if (password !== verificaPassword) {
      verificaPasswordInput.classList.add("invalid");
      verificaPasswordInput.classList.remove("valid");

      // Muestra el alert debajo del input
      showErrorAlertBelowInput(
        verificaPasswordInput,
        "Las contraseñas no coinciden",
        "error",
        5000
      );
      return false;
    } else {
      verificaPasswordInput.classList.remove("invalid");
      verificaPasswordInput.classList.add("valid");

      // Elimina cualquier alerta si las contraseñas coinciden
      removeExistingAlert(verificaPasswordInput);
      return true;
    }
  } else {
    // Limpia validaciones si no hay texto en el campo de verificar contraseña
    verificaPasswordInput.classList.remove("valid", "invalid");
    removeExistingAlert(verificaPasswordInput);
    return true;
  }
}

function validarPasswordCoincidenOrganizacion() {
  const password = document.getElementById("password-organizacion").value.trim();
  const verificaPassword = document.getElementById("verifica_password_representante").value.trim();
  const verificaPasswordInput = document.getElementById("verifica_password_representante");

  // Realiza la validación solo si se está escribiendo en el campo de Verificar Contraseña
  if (verificaPassword.length > 0) {
    if (password !== verificaPassword) {
      verificaPasswordInput.classList.add("invalid");
      verificaPasswordInput.classList.remove("valid");

      // Muestra el alert debajo del input
      showErrorAlertBelowInput(
        verificaPasswordInput,
        "Las contraseñas no coinciden",
        "error",
        5000
      );
      return false;
    } else {
      verificaPasswordInput.classList.remove("invalid");
      verificaPasswordInput.classList.add("valid");

      // Elimina cualquier alerta si las contraseñas coinciden
      removeExistingAlert(verificaPasswordInput);
      return true;
    }
  } else {
    // Limpia validaciones si no hay texto en el campo de verificar contraseña
    verificaPasswordInput.classList.remove("valid", "invalid");
    removeExistingAlert(verificaPasswordInput);
    return true;
  }
}

// Validar si las CURPs coinciden (Solo después de que el usuario comience a escribir en el campo "Verificar CURP")
function validarCurpCoinciden() {
  const curp = document.getElementById("curp_usuario").value.trim();
  const verificaCurp = document.getElementById("verifica_curp").value.trim();
  const verificaCurpInput = document.getElementById("verifica_curp");

  // Verifica solo si la CURP principal es válida y se ha comenzado a escribir en verificar CURP
  if (curp.length === 18 && verificaCurp.length > 0) {
    if (curp !== verificaCurp) {
      verificaCurpInput.classList.add("invalid");
      verificaCurpInput.classList.remove("valid");

      // Mostrar el mensaje debajo del input
      showErrorAlertBelowInput(
        verificaCurpInput,
        "La CURP no coincide",
        "error",
        5000
      );
      return false;
    } else {
      verificaCurpInput.classList.remove("invalid");
      verificaCurpInput.classList.add("valid");

      // Elimina cualquier mensaje de alerta si las CURPs coinciden
      removeExistingAlert(verificaCurpInput);
      llenarCamposDesdeCURP();
      return true;
    }
  } else {
    // Si el usuario no ha terminado de escribir o el campo CURP principal no es válido
    verificaCurpInput.classList.remove("valid", "invalid");
    removeExistingAlert(verificaCurpInput);
  }
  return true;
}

// Validar si las CURPs coinciden (Solo después de que el usuario comience a escribir en el campo "Verificar CURP")
function validarCurpCoincidenOrganizacion() {
  const curp = document.getElementById("curp_representante").value.trim();
  const verificaCurp = document.getElementById("verifica_curp_representante").value.trim();
  const verificaCurpInput = document.getElementById("verifica_curp_representante");

  // Verifica solo si la CURP principal es válida y se ha comenzado a escribir en verificar CURP
  if (curp.length === 18 && verificaCurp.length > 0) {
    if (curp !== verificaCurp) {
      verificaCurpInput.classList.add("invalid");
      verificaCurpInput.classList.remove("valid");

      // Mostrar el mensaje debajo del input
      showErrorAlertBelowInput(
        verificaCurpInput,
        "La CURP no coincide",
        "error",
        5000
      );
      return false;
    } else {
      verificaCurpInput.classList.remove("invalid");
      verificaCurpInput.classList.add("valid");

      // Elimina cualquier mensaje de alerta si las CURPs coinciden
      removeExistingAlert(verificaCurpInput);
      llenarCamposDesdeCURPRepresentante();
      return true;
    }
  } else {
    // Si el usuario no ha terminado de escribir o el campo CURP principal no es válido
    verificaCurpInput.classList.remove("valid", "invalid");
    removeExistingAlert(verificaCurpInput);
  }
  return true;
}

function extraerDatosDeCURP(curp) {
  if (curp.length !== 18) return null; // Validar longitud de la CURP

  const sexo = curp[10] === "H" ? "H" : "M";

  // Determinar el año de nacimiento
  const anioPrefijo = parseInt(curp.slice(4, 6), 10);
  const anio = anioPrefijo >= 0 && anioPrefijo <= 23 ? 2000 + anioPrefijo : 1900 + anioPrefijo;

  const mes = parseInt(curp.slice(6, 8));
  const dia = parseInt(curp.slice(8, 10));
  const fechaNacimiento = `${anio}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;

  const estados = {
    AS: "AGUASCALIENTES",
    BC: "BAJA CALIFORNIA",
    BS: "BAJA CALIFORNIA SUR",
    CC: "CAMPECHE",
    CL: "COAHUILA",
    CM: "COLIMA",
    CS: "CHIAPAS",
    CH: "CHIHUAHUA",
    DF: "CIUDAD DE MEXICO",
    DG: "DURANGO",
    GT: "GUANAJUATO",
    GR: "GUERRERO",
    HG: "HIDALGO",
    JC: "JALISCO",
    MC: "ESTADO DE MEXICO",
    MN: "MICHOACAN",
    MS: "MORELOS",
    NT: "NAYARIT",
    NL: "NUEVO LEON",
    OC: "OAXACA",
    PL: "PUEBLA",
    QT: "QUERETARO",
    QR: "QUINTANA ROO",
    SP: "SAN LUIS POTOSÍ",
    SL: "SINALOA",
    SR: "SONORA",
    TC: "TABASCO",
    TS: "TAMAULIPAS",
    TL: "TLAXCALA",
    VZ: "VERACRUZ",
    YN: "YUCATAN",
    ZS: "ZACATECAS",
    NE: "NACIDO EN EL EXTRANJERO",
  };

  const estado = estados[curp.slice(11, 13)] || "ESTADO DESCONOCIDO";

  return { sexo, fechaNacimiento, estado };
}


function llenarCamposDesdeCURP() {
  const curp = document.getElementById("curp_usuario").value.trim();
  const verificaCurp = document.getElementById("verifica_curp").value.trim();

  if (curp.length === 18 && curp === verificaCurp) {
    const datos = extraerDatosDeCURP(curp);
    if (datos) {
      document.getElementById("fecha_nacimiento").value = datos.fechaNacimiento;
      document.getElementById("sexo").value = datos.sexo;
      document.getElementById("estado").value = datos.estado;
    }
  }
}

function llenarCamposDesdeCURPRepresentante() {
  const curp = document.getElementById("curp_representante").value.trim();
  const verificaCurp = document.getElementById("verifica_curp_representante").value.trim();

  if (curp.length === 18 && curp === verificaCurp) {
    const datos = extraerDatosDeCURP(curp);
    if (datos) {
      document.getElementById("fecha_nacimiento_representante").value = datos.fechaNacimiento;
      document.getElementById("sexo_representante").value = datos.sexo;
    }
  }
}


function convertirMayusculas(input) {
  input.value = input.value.toUpperCase();
}

function evaluatePasswordStrength() {
  const password = document.getElementById("password").value.trim();
  const strengthBar = document.getElementById("strength-bar");
  const strengthText = document.getElementById("password-strength-text");
  const verificaPasswordInput = document.getElementById("verifica_password");

  // Si el campo está vacío, reinicia todo
  if (password === "") {
    strengthBar.style.width = "0%";
    strengthBar.style.backgroundColor = "#e9ecef"; // Barra vacía
    strengthText.textContent = ""; // Limpia texto
    verificaPasswordInput.disabled = true;
    verificaPasswordInput.value = ""; // Limpia el campo de Verificar Contraseña
    return;
  }

  // Criterios de validación
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[@$!%*?&]/.test(password);

  // Evaluar la fortaleza de la contraseña
  let strength = 0;
  if (hasMinLength) strength++;
  if (hasUppercase) strength++;
  if (hasLowercase) strength++;
  if (hasNumber) strength++;
  if (hasSpecialChar) strength++;

  if (strength === 5) {
    strengthBar.style.width = "100%";
    strengthBar.style.backgroundColor = "green";
    strengthText.textContent = "Fuerte";
    verificaPasswordInput.disabled = false; // Habilita el campo si la contraseña es fuerte
  } else if (strength >= 3) {
    strengthBar.style.width = "60%";
    strengthBar.style.backgroundColor = "orange";
    strengthText.textContent = "Media";
    verificaPasswordInput.disabled = true; // Deshabilita si no es fuerte
    verificaPasswordInput.value = ""; // Limpia el campo de Verificar Contraseña
  } else {
    strengthBar.style.width = "30%";
    strengthBar.style.backgroundColor = "red";
    strengthText.textContent = "Débil";
    verificaPasswordInput.disabled = true; // Deshabilita si no es fuerte
    verificaPasswordInput.value = ""; // Limpia el campo de Verificar Contraseña
  }
}

function evaluatePasswordStrengthOrganizacion() {
  const password = document.getElementById("password-organizacion").value.trim();
  const strengthBar = document.getElementById("strength-bar-organizacion");
  const strengthText = document.getElementById("password-strength-text-organizacion");
  const verificaPasswordInput = document.getElementById("verifica_password_representante");

  // Si el campo está vacío, reinicia todo
  if (password === "") {
    strengthBar.style.width = "0%";
    strengthBar.style.backgroundColor = "#e9ecef"; // Barra vacía
    strengthText.textContent = ""; // Limpia texto
    verificaPasswordInput.disabled = true;
    verificaPasswordInput.value = ""; // Limpia el campo de Verificar Contraseña
    return;
  }

  // Criterios de validación
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[@$!%*?&]/.test(password);

  // Evaluar la fortaleza de la contraseña
  let strength = 0;
  if (hasMinLength) strength++;
  if (hasUppercase) strength++;
  if (hasLowercase) strength++;
  if (hasNumber) strength++;
  if (hasSpecialChar) strength++;

  if (strength === 5) {
    strengthBar.style.width = "100%";
    strengthBar.style.backgroundColor = "green";
    strengthText.textContent = "Fuerte";
    verificaPasswordInput.disabled = false; // Habilita el campo si la contraseña es fuerte
  } else if (strength >= 3) {
    strengthBar.style.width = "60%";
    strengthBar.style.backgroundColor = "orange";
    strengthText.textContent = "Media";
    verificaPasswordInput.disabled = true; // Deshabilita si no es fuerte
    verificaPasswordInput.value = ""; // Limpia el campo de Verificar Contraseña
  } else {
    strengthBar.style.width = "30%";
    strengthBar.style.backgroundColor = "red";
    strengthText.textContent = "Débil";
    verificaPasswordInput.disabled = true; // Deshabilita si no es fuerte
    verificaPasswordInput.value = ""; // Limpia el campo de Verificar Contraseña
  }
}


function togglePasswordVisibility() {
  const passwordField = document.getElementById("password");
  const toggleIcon = document.getElementById("toggle-icon");

  if (passwordField.type === "password") {
    passwordField.type = "text";
    toggleIcon.classList.remove("fa-eye");
    toggleIcon.classList.add("fa-eye-slash");
  } else {
    passwordField.type = "password";
    toggleIcon.classList.remove("fa-eye-slash");
    toggleIcon.classList.add("fa-eye");
  }
}

function togglePasswordVisibilityOrganizacion() {
  const passwordField = document.getElementById("password-organizacion");
  const toggleIcon = document.getElementById("toggle-icon-organizacion");

  if (passwordField.type === "password") {
    passwordField.type = "text";
    toggleIcon.classList.remove("fa-eye");
    toggleIcon.classList.add("fa-eye-slash");
  } else {
    passwordField.type = "password";
    toggleIcon.classList.remove("fa-eye-slash");
    toggleIcon.classList.add("fa-eye");
  }
}

function showTooltip() {
  const tooltip = document.getElementById("tooltip");
  tooltip.classList.add("visible");
}

function hideTooltip() {
  const tooltip = document.getElementById("tooltip");
  tooltip.classList.remove("visible");
}

function showTooltipOrganizacion() {
  const tooltip = document.getElementById("tooltip-organizacion");
  tooltip.classList.add("visible");
}

function hideTooltipOrganizacion() {
  const tooltip = document.getElementById("tooltip-organizacion");
  tooltip.classList.remove("visible");
}


// Alternar tooltip al hacer clic en el ícono
function toggleTooltip() {
  const tooltip = document.getElementById("tooltip");
  tooltip.classList.toggle("visible");
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

// Validar RFC principal
function validarInputRFC(input) {
  const rfc = input.value.toUpperCase();
  const razonSocialInput = document.getElementById("razon_social");

  // Valida cuando la longitud sea entre 12 y 13 caracteres (RFC válido)
  if (rfc.length >= 12 && rfc.length <= 13) {
    if (rfcValido(rfc)) {
      verificarRFCEnAPI(rfc).then((response) => {
        if (response.success) {
          input.classList.add("valid");
          input.classList.remove("invalid");
          razonSocialInput.disabled = false; // Habilita Razón Social si RFC no está registrado
          removeExistingAlert(input); // Elimina cualquier alerta previa
        } else {
          input.classList.add("invalid");
          input.classList.remove("valid");
          razonSocialInput.disabled = true; // Deshabilita Razón Social si RFC está registrado
          razonSocialInput.value = ""; // Limpia el campo Razón Social

          // Muestra alerta de RFC ya registrado
          showErrorAlertBelowInput(
            input,
            "El RFC ya está registrado. No puedes continuar.",
            "error",
            5000
          );
        }
      });
    } else {
      input.classList.add("invalid");
      input.classList.remove("valid");
      razonSocialInput.disabled = true; // Deshabilita Razón Social si RFC no es válido
      razonSocialInput.value = ""; // Limpia el campo Razón Social

      // Muestra alerta de RFC no válido
      showErrorAlertBelowInput(input, "El RFC no es válido", "error", 5000);
    }
  } else {
    input.classList.remove("valid", "invalid");
    razonSocialInput.disabled = true; // Deshabilita Razón Social
    razonSocialInput.value = ""; // Limpia el campo Razón Social
    removeExistingAlert(input); // Cierra cualquier alerta si existe
  }
}

// Función para verificar si un RFC tiene el formato correcto
function rfcValido(rfc) {
  const regexRFC = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{2}[A0-9]{1}$/;
  return regexRFC.test(rfc);
}

// Función para verificar el RFC en la API
async function verificarRFCEnAPI(rfc) {
  console.log(JSON.stringify({ rfc }));
  const rfcInput = document.getElementById("RFC_organizacion");
  try {
    const response = await fetch('/tramites-sjr/Api/principal/validar_rfc', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rfc }),
    });

    const data = await response.json();

    if (!data.success) {
      // Mostrar alerta de error y cambiar borde del input a rojo
      rfcInput.style.borderColor = "red";
      showErrorAlertBelowInput(rfcInput, data.message || "Error al verificar el RFC", "error");
    } else {
      // Si el RFC no está registrado, cambiar borde a verde y eliminar alert
      rfcInput.style.borderColor = "green";
      removeAlerts(); // Elimina cualquier alerta existente
    }
    return data;
  } catch (error) {
    // Manejo de errores del servidor
    rfcInput.style.borderColor = "red";
    showErrorAlertBelowInput(rfcInput, "Error de conexión con el servidor", "error");
    return { success: false };
  }
}


function simulateProgress(inputId) {
  const fileInput = document.getElementById(inputId);
  const file = fileInput.files[0];
  const fileName = document.getElementById(`file-name-${inputId}`);
  const fileSize = document.getElementById(`file-size-${inputId}`);
  const progressBar = document.getElementById(`progress-bar-${inputId}`);
  const statusButton = document.getElementById(`status-btn-${inputId}`);
  const sendButton = document.getElementById(`send-btn-${inputId}`);
  const previewButton = document.getElementById(`preview-btn-${inputId}`);
  const selectButton = document.getElementById(`select-btn-${inputId}`);

  if (file) {
    fileName.textContent = file.name;
    fileSize.textContent = `${(file.size / 1024 / 1024).toFixed(2)} MB`;
    selectButton.style.display = "none";

    let progress = 0;
    progressBar.style.width = "0%";
    statusButton.classList.add("disabled");

    const interval = setInterval(() => {
      progress += 10;
      progressBar.style.width = `${progress}%`;

      if (progress >= 100) {
        clearInterval(interval);

        // Actualiza los botones y el estado del botón dinámico
        sendButton.style.display = "inline-block";
        previewButton.style.display = "inline-block";
        sendButton.disabled = false;
        previewButton.disabled = false;
        statusButton.classList.remove("disabled");
        statusButton.classList.add("enabled");
      }
    }, 300);
  }
}

// Reset o eliminar
function handleStatusClick(inputId) {
  const fileInput = document.getElementById(inputId);
  const progressBar = document.getElementById(`progress-bar-${inputId}`);
  const statusButton = document.getElementById(`status-btn-${inputId}`);
  const sendButton = document.getElementById(`send-btn-${inputId}`);
  const previewButton = document.getElementById(`preview-btn-${inputId}`);
  const fileName = document.getElementById(`file-name-${inputId}`);
  const fileSize = document.getElementById(`file-size-${inputId}`);
  const selectButton = document.getElementById(`select-btn-${inputId}`);

  if (!statusButton.classList.contains("success")) {
    progressBar.style.width = "0%";
    fileName.textContent = "No seleccionado";
    fileSize.textContent = "";
    sendButton.style.display = "none";
    previewButton.style.display = "none";
    sendButton.disabled = true;
    selectButton.style.display = "inline-block";
    fileInput.value = "";
    statusButton.classList.add("disabled");
    statusButton.classList.remove("enabled");
  }
}

function previewFile(inputId) {
  const fileInput = document.getElementById(inputId);
  const file = fileInput.files[0];
  const modal = document.getElementById('modalPreview');
  const previewFrame = document.getElementById('previewFrame');

  if (!file) {
    alert("Por favor, selecciona un archivo antes de previsualizar.");
    return;
  }

  const reader = new FileReader();

  reader.onload = function (e) {
    if (file.type.startsWith('image/')) {
      previewFrame.src = e.target.result;
    } else if (file.type === "application/pdf") {
      previewFrame.src = e.target.result;
    } else {
      alert("Vista previa no disponible para este tipo de archivo.");
      return;
    }

    modal.style.display = "flex";
  };

  reader.readAsDataURL(file);
}

function uploadFile(inputId) {
  const progressBar = document.getElementById(`progress-bar-${inputId}`);
  const statusButton = document.getElementById(`status-btn-${inputId}`);
  const sendButton = document.getElementById(`send-btn-${inputId}`);
  const previewButton = document.getElementById(`preview-btn-${inputId}`);
  const fileInput = document.getElementById(inputId);
  const file = fileInput.files[0];

  if (!file) {
    alert("Por favor, selecciona un archivo antes de enviar.");
    return;
  }

  // Recuperar el ID del usuario desde el localStorage
  const userId = localStorage.getItem('user_id');
  if (!userId) {
    alert("No se encontró el ID del usuario en el almacenamiento local. Por favor, verifica el registro del usuario.");
    return;
  }

  let descripcionArchivo;
  switch (inputId) {
    case 'ine':
      descripcionArchivo = 'Esta es la INE';
      break;
    case 'acta':
      descripcionArchivo = 'Este es la Acta';
      break;
    case 'curp':
      descripcionArchivo = 'Este es el CURP';
      break;
    case 'domicilio':
      descripcionArchivo = 'Este es el comprobante de domicilio';
      break;
    default:
      descripcionArchivo = 'Documento sin descripción específica';
  }

  const formData = new FormData();
  formData.append('id_usuario', userId);
  formData.append('nombre_archivo', file);
  formData.append('descripcion_archivo', descripcionArchivo);

  fetch('../../../Api/public/usuario_exp', {
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
      if (data.success) {
        alert("Archivo subido exitosamente.");
        progressBar.style.width = "100%";
        progressBar.classList.add("success");
        sendButton.style.display = "none";
        statusButton.classList.remove("enabled");
        statusButton.classList.add("success");
        statusButton.innerHTML = '<i class="fas fa-check"></i>';
      } else {
        alert("Error al subir el archivo: " + (data.message || "Error desconocido"));
      }
    })
    .catch(error => {
      console.error("Error al subir el archivo:", error);
      alert("Error al subir el archivo.");
    });
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
    alert('Por favor, complete todos los campos.');
    return;
  }

  try {
    const response = await fetch('/tramites-sjr/Api/principal/login', {
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

function toggleTipoPersona() {
  const isPersonaMoral = document.getElementById("tipoPersonaSwitch").checked;
  const label = document.getElementById("tipoPersonaLabel");
  const personaFisicaFields = document.getElementById("personaFisicaFields");
  const personaMoralFields = document.getElementById("personaMoralFields");

  if (isPersonaMoral) {
    label.textContent = "Persona Moral";
    personaFisicaFields.style.display = "none";
    personaMoralFields.style.display = "block";
  } else {
    label.textContent = "Persona Física";
    personaFisicaFields.style.display = "block";
    personaMoralFields.style.display = "none";
  }
}

async function RegistroUsuarioAPI() {
  let data = {}; // Inicializamos los datos vacíos
  let apiUrl = ""; // URL de la API que usaremos
  try {
    if (tipoPersonaSeleccionada === "fisica") {
      // Recolectar datos para Persona Física
      data = {
        nombre: document.getElementById("nombre").value,
        primer_apellido: document.getElementById("primer_apellido").value,
        segundo_apellido: document.getElementById("segundo_apellido").value,
        curp_ciudadano: document.getElementById("curp_usuario").value,
        nombre_completo: `${document.getElementById("nombre").value} ${document.getElementById("primer_apellido").value} ${document.getElementById("segundo_apellido").value}`,
        sexo: document.getElementById("sexo").value,
        estado: document.getElementById("estado").value,
        fecha_nacimiento: document.getElementById("fecha_nacimiento").value,
        password: document.getElementById("password").value,
        acepto_terminos_condiciones: document.getElementById("terminos").checked ? 1 : 0,
        tipo_telefono: 1,
        codigo_postal: document.getElementById("codigo_postal").value,
        asentamiento: document.getElementById("colonia").value,
        calle: document.getElementById("calle").value,
        numero_exterior: document.getElementById("numero_exterior").value,
        numero_interior: document.getElementById("numero_interior").value || 0,
        latitud: document.getElementById("latitud").value,
        longitud: document.getElementById("longitud").value,
        telefono: document.getElementById("telefono").value,
        email: document.getElementById("email").value,
      };
      // Endpoint específico para Persona Física
      apiUrl = '/tramites-sjr/Api/principal/insert_full_data';
    } else if (tipoPersonaSeleccionada === "moral") {
      // Recolectar datos para Persona Moral
      data = {
        rfc_organizacion: document.getElementById("RFC_organizacion").value,
        razon_social: document.getElementById("razon_social").value,
        nombre_representante: document.getElementById("nombre_representante").value,
        primer_apellido_representante: document.getElementById("primer_apellido_representante").value,
        segundo_apellido_representante: document.getElementById("segundo_apellido_representante").value,
        curp_representante: document.getElementById("curp_representante").value,
        nombre_completo_representante: `${document.getElementById("nombre_representante").value} ${document.getElementById("primer_apellido_representante").value} ${document.getElementById("segundo_apellido_representante").value}`,
        sexo_representante: document.getElementById("sexo_representante").value,
        estado_representante: "Sin estado",
        fecha_nacimiento_representante: document.getElementById("fecha_nacimiento_representante").value,
        password: document.getElementById("password-organizacion").value,
        email: document.getElementById("email").value,
        telefono: document.getElementById("telefono").value,
        acepto_terminos_condiciones: document.getElementById("terminos").checked ? 1 : 0,
        codigo_postal: document.getElementById("codigo_postal").value,
        asentamiento: document.getElementById("colonia").value,
        calle: document.getElementById("calle").value,
        numero_exterior: document.getElementById("numero_exterior").value,
        numero_interior: document.getElementById("numero_interior").value || 0,
        latitud: document.getElementById("latitud").value,
        longitud: document.getElementById("longitud").value,
      };
      // Endpoint específico para Persona Moral
      apiUrl = '/tramites-sjr/Api/principal/insert_organizacion';
    }

    // Mostrar los datos en consola para verificación
    console.log(data);

    // Llamar a la API con los datos recolectados
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Error en el registro del usuario");
    }

    const result = await response.json();

    if (result && result.mensaje) {
      showModal("¡Registro exitoso!", "success");
      // Redirigir después de un breve retraso
      setTimeout(() => {
        window.location.href = "https://www.sanjuandelrio.gob.mx/";
      }, 2000);
    } else {
      showModal("Registro exitoso, pero hubo un problema en la respuesta de la API.", "error");
    }
  } catch (error) {
    console.error("Error:", error);
    showModal("Ocurrió un error durante el registro. Inténtalo de nuevo más tarde.", "error");
  }
}


function showModal(message, type) {
  // Mostrar el mensaje en el modal
  document.getElementById("modal-message").textContent = message;

  // Obtener el icono y cambiarlo dependiendo del tipo
  const icon = document.getElementById("modal-icon").querySelector("i");

  // Limpiar clases anteriores
  const modal = document.getElementById("custom-modal");
  modal.classList.remove("error", "success");  // Limpiamos las clases en el modal

  // Asignar icono dependiendo del tipo
  if (type === "success") {
    icon.className = "fas fa-check-circle";  // Icono de éxito
    icon.style.color = "#28a745";  // Verde para éxito
  } else if (type === "error") {
    icon.className = "fas fa-times-circle";  // Icono de error
    icon.style.color = "#dc3545";  // Rojo para error
  }

  // Mostrar el modal con un efecto de fade-in
  modal.style.display = "flex";  // Cambiar de 'none' a 'flex' para mostrarlo
  setTimeout(() => modal.style.opacity = 1, 10);  // Establecer la opacidad después de un pequeño retraso para que la animación funcione

  // Agregar funcionalidad al botón de aceptar
  document.getElementById("modal-accept-btn").onclick = function (event) {
    event.preventDefault();  // Evitar recargar la página si el botón está dentro de un formulario
    modal.style.opacity = 0;  // Animar el cierre (fade-out)
    setTimeout(() => modal.style.display = "none", 300);  // Esperar que termine la animación antes de ocultarlo
  };
}

function showCustomAlert(title, message, icon) {
  const modal = document.getElementById("custom-alert");
  const titleElem = document.getElementById("modal-title");
  const textElem = document.getElementById("modal-text");
  const iconElem = document.getElementById("modal-icon");
  const button = document.getElementById("modal-btn");

  // Establecer título y mensaje
  titleElem.textContent = title;
  textElem.textContent = message;

  // Cambiar el icono dependiendo del tipo
  if (icon === "question") {
    iconElem.innerHTML = "&#10068;";  // Icono de pregunta (puedes cambiar por cualquier icono HTML o usar una librería como FontAwesome)
  } else if (icon === "success") {
    iconElem.innerHTML = "&#10004;";  // Icono de éxito (check)
  } else if (icon === "error") {
    iconElem.innerHTML = "&#10060;";  // Icono de error (cross)
  }

  // Mostrar el modal con fade-in
  modal.style.display = "flex";
  setTimeout(() => modal.style.opacity = 1, 10);

  // Agregar funcionalidad al botón
  button.onclick = function () {
    modal.style.opacity = 0;
    setTimeout(() => modal.style.display = "none", 300); // Esperar a que la animación termine antes de ocultar
  };
}



// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDUD_2GS_ENSw_YRUQLY2lgrQMqF_wz49w",
  authDomain: "sms-proyect-beb37.firebaseapp.com",
  projectId: "sms-proyect-beb37",
  storageBucket: "sms-proyect-beb37.firebasestorage.app",
  messagingSenderId: "955644995935",
  appId: "1:955644995935:web:f7f8eafd8e0bba4aca6eea"
};

// Inicializar Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

let confirmationResult; // Almacenará la referencia para verificar el código

// Inicializar el reCAPTCHA
const recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
  size: 'invisible', // Invisible
  callback: (response) => {
    console.log("reCAPTCHA verificado.");
  },
  'expired-callback': () => {
    console.log("reCAPTCHA expirado, por favor intenta nuevamente.");
  }
});

// Verifica la reCAPTCHA antes de enviar el código
recaptchaVerifier.render().then(function (widgetId) {
  window.recaptchaWidgetId = widgetId; // Guardamos el ID del widget de reCAPTCHA
  console.log("reCAPTCHA renderizado.");
});

function sendVerificationCode() {
  const phoneNumber = '+52' + document.getElementById('verifica_telefono').value;
  if (!phoneNumber) {
    alert('Por favor ingresa un número de teléfono válido.');
    return;
  }

  // Asegúrate de que la reCAPTCHA esté lista
  recaptchaVerifier.verify().then(function (response) {
    if (response) {
      auth.signInWithPhoneNumber(phoneNumber, recaptchaVerifier)
        .then((result) => {
          confirmationResult = result; // Guardamos el resultado de la verificación

          alert('Código enviado al número proporcionado.');

          // Mostrar sección para ingresar código y ocultar botón de enviar código
          document.getElementById('code-section').classList.remove('hidden');
          document.getElementById('send-code-button').classList.add('hidden');
        })
        .catch((error) => {
          console.error('Error al enviar el código:', error);
          alert('Error al enviar el código. Revisa el número e intenta nuevamente.');
        });
    } else {
      console.error('El reCAPTCHA no fue completado correctamente.');
      alert('Por favor verifica que no eres un robot.');
    }
  }).catch((error) => {
    console.error('Error al verificar el reCAPTCHA:', error);
    alert('Error al verificar el reCAPTCHA. Por favor intenta nuevamente.');
  });
}


// Verificar el código ingresado por el usuario
function verifyCode() {
  const code = document.getElementById('verificationCode').value;
  if (!code) {
    alert('Por favor ingresa el código recibido.');
    return;
  }

  confirmationResult.confirm(code)
    .then((result) => {
      alert('verificacion exitosa');
      document.getElementById('verify-code-button').classList.add('hidden');
      document.getElementById('previo-btn').classList.remove('hidden');
    })
    .catch((error) => {
      console.error('Error al verificar el código:', error);
      alert('El código ingresado no es válido. Intenta nuevamente.');
    });
}

function sendOtp() {
  const phoneNumber = document.getElementById('phoneNumber').value;
  const message = `Tu código de verificación es: ${Math.floor(Math.random() * 900000) + 100000}`;

  const data = {
    phone_number: phoneNumber,
    message: message
  };

  fetch('../../../Api/public/send_otp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer tu_token_aqui'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert("Código OTP enviado correctamente.");
      } else {
        alert("Error: " + data.message);
      }
    })
    .catch(error => {
      alert("Hubo un error al enviar el OTP.");
    });
}


function validateOtp() {
  const phoneNumber = document.getElementById('phoneNumber').value;
  const otpCode = document.getElementById('otpCode').value;

  const data = {
    phone_number: phoneNumber,
    otp_code: otpCode
  };

  fetch('../../../Api/public/validate_otp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer tu_token_aqui'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert("OTP verificado correctamente.");
      } else {
        alert("Error: " + data.message);
      }
    })
    .catch(error => {
      alert("Hubo un error al verificar el OTP.");
    });
}

function validateTipoPersona() {
  // Obtiene los botones de opción seleccionados
  const tipoPersona = document.querySelector('input[name="tipo_persona"]:checked');
  const errorDiv = document.getElementById("error-valid-tipo-persona");

  if (tipoPersona) {
    // Si hay una opción seleccionada, oculta el error y avanza al siguiente paso
    errorDiv.style.display = "none";
    nextStep();
  } else {
    // Si no hay ninguna opción seleccionada, muestra el mensaje de error
    errorDiv.style.display = "block";
    errorDiv.innerHTML = "Por favor selecciona un tipo de persona (Física o Moral)";
  }
}

