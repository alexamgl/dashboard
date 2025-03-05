document.addEventListener("DOMContentLoaded", function () {
     // Ocultamos las tablas de riesgo al inicio
     document.getElementById("tablariesgoBajo").style.display = "none";
     document.getElementById("tablariesgoMedio").style.display = "none";
     document.getElementById("tablariesgoAlto").style.display = "none";
  
    
  const riesgoBajo = [
    {
      nombre: 'Identificación oficial (<span style="color: red">*</span>)',
      descripcion: "Identificación de quien realiza el trámite ",
    },
    {
      nombre: "Visto Bueno de Protección Civil",
      descripcion: "Del año anterior (sólo si se tiene)",
    },
    {
      nombre: "Licencia de funcionamiento",
      descripcion: "Del año anterior (sólo si se tiene)",
    },
    {
      nombre: 'Comprobante de domicilio (<span style="color: red">*</span>)',
      descripcion: "Para comprobar el domicilio del establecimiento",
    },
    {
      nombre: 'Uso de suelo (<span style="color: red">*</span>)',
      descripcion: "O en su caso factibilidad de giro si es de nueva apertura",
    },
    {
      nombre:
        'Constancias de capacitación integral en materia de protección civil (<span style="color: red">*</span>)',
      descripcion: "",
    },
    {
      nombre:
        'Serie de fotografías panorámicas (<span style="color: red">*</span>)',
      descripcion: "Del interior y exterior del establecimiento",
    },
    {
      nombre: 'Fotografías de botiquín (<span style="color: red">*</span>)',
      descripcion: "En las que este abierto y cerrado",
    },
    {
      nombre:
        'Fotografías de la instalación eléctrica (<span style="color: red">*</span>)',
      descripcion: "Acometida y centro de carga abierto y cerrado",
    },
    {
      nombre:
        'Fotografías de la instalación de gas y reporte técnico (<span style="color: red">*</span>)',
      descripcion: "Para tanques estacionarios",
    },
    {
      nombre:
        'Fotografías de señalización de emergencia (<span style="color: red">*</span>)',
      descripcion:
        "Ruta de evacuación, salida de emergencia, extintores, qué hacer en caso de contingencia, etc.",
    },
    {
      nombre:
        'Fotografías de sistema de detección de incendios (<span style="color: red">*</span>)',
      descripcion: "Detectores de humo, uno por cada 200 m2",
    },
    {
      nombre: "Fotografías de lámparas de emergencia",
      descripcion: "Si trabaja después de las 18:00 hrs.",
    },
    {
      nombre:
        'Fotografías de los extintores instalados (<span style="color: red">*</span>)',
      descripcion: "Su entorno y en detalle que muestre etiquetas y collarín",
    },
    {
      nombre:
        'Fotografías de barandal y cinta antiderrapante (<span style="color: red">*</span>)',
      descripcion: "Cinta antiderrapante en los escalones",
    },
    {
      nombre:
        'Película protectora en cristales (<span style="color: red">*</span>)',
      descripcion: "Ficha técnica o factura y fotografía",
    },
  ];

  const riesgoMedio = [
    {
      nombre: 'Identificación oficial (<span style="color: red">*</span>)',
      descripcion: "Identificación de quien realiza el trámite ",
    },
    {
      nombre: "Visto Bueno de Protección Civil",
      descripcion: "Del año anterior (sólo si se tiene).",
    },
    {
      nombre: "Licencia de funcionamiento",
      descripcion: "Del año anterior (sólo si se tiene).",
    },
    {
      nombre: "Comprobante de domicilio (<span style='color: red'>*</span>)",
      descripcion: "Documento obligatorio.",
    },
    {
      nombre: "Uso de suelo (<span style='color: red'>*</span>)",
      descripcion: "O factibilidad de giro si es de nueva apertura.",
    },
    {
      nombre: "Constancias de capacitación integral en protección civil (<span style='color: red'>*</span>)",
      descripcion: "En materia de protección civil.",
    },
    {
      nombre: "Serie de fotografías panorámicas (<span style='color: red'>*</span>)",
      descripcion: "Del interior y exterior del establecimiento.",
    },
    {
      nombre: "Fotografías de botiquín (<span style='color: red'>*</span>)",
      descripcion: "Abierto y cerrado.",
    },
    {
      nombre: "Fotografías de la instalación eléctrica (<span style='color: red'>*</span>)",
      descripcion: "Acometida y centro de carga abierto y cerrado.",
    },
    {
      nombre: "Fotografías de la instalación de gas y reporte técnico (<span style='color: red'>*</span>)",
      descripcion: "Para tanques estacionarios.",
    },
    {
      nombre: "Fotografías de señalización de emergencia (<span style='color: red'>*</span>)",
      descripcion: "Ruta de evacuación, salida de emergencia, extintores, etc.",
    },
    {
      nombre: "Fotografías de sistema de detección de incendios (<span style='color: red'>*</span>)",
      descripcion: "Detectores de humo, uno por cada 200 m².",
    },
    {
      nombre: "Fotografías de lámparas de emergencia",
      descripcion: "Si trabaja después de las 18:00 hrs.",
    },
    {
      nombre: "Fotografías de los extintores instalados (<span style='color: red'>*</span>)",
      descripcion: "Su entorno y en detalle que muestre etiquetas y collarín.",
    },
    {
      nombre: "Ficha técnica y evidencia fotográfica de material entumecente",
      descripcion: "Retardante, si aplica.",
    },
    {
      nombre: "Fotografías de barandal y cinta antiderrapante (<span style='color: red'>*</span>)",
      descripcion: "En escalones.",
    },
    {
      nombre: "Película protectora en cristales (<span style='color: red'>*</span>)",
      descripcion: "Ficha técnica o factura y fotografía.",
    },
  ];
  
  const riesgoAlto = [
    {
      nombre: "Identificación oficial (<span style='color: red'>*</span>)",
      descripcion: "De quien realiza el trámite.",
    },
    {
      nombre: "Visto Bueno de Protección Civil",
      descripcion: "Del año anterior (sólo si se tiene).",
    },
    {
      nombre: "Licencia de funcionamiento",
      descripcion: "Del año anterior (sólo si se tiene).",
    },
    {
      nombre: "Comprobante de domicilio (<span style='color: red'>*</span>)",
      descripcion: "Documento obligatorio.",
    },
    {
      nombre: "Uso de suelo (<span style='color: red'>*</span>)",
      descripcion: "O factibilidad de giro si es de nueva apertura.",
    },
    {
      nombre: "Carta de Corresponsabilidad (<span style='color: red'>*</span>)",
      descripcion: "Documento obligatorio.",
    },
    {
      nombre: "Constancias de capacitación en protección civil y primeros auxilios (<span style='color: red'>*</span>)",
      descripcion: "Capacitación en seguridad.",
    },
    {
      nombre: "Póliza de responsabilidad civil (<span style='color: red'>*</span>)",
      descripcion: "Seguro contra daños.",
    },
    {
      nombre: "Dictamen estructural (<span style='color: red'>*</span>)",
      descripcion: "Evaluación de seguridad estructural.",
    },
    {
      nombre: "Dictamen eléctrico (<span style='color: red'>*</span>)",
      descripcion: "Evaluación de la instalación eléctrica.",
    },
    {
      nombre: "Dictamen de gas (<span style='color: red'>*</span>)",
      descripcion: "Evaluación de la instalación de gas.",
    },
    {
      nombre: "Serie de fotografías panorámicas (<span style='color: red'>*</span>)",
      descripcion: "Fotografías del interior y exterior del establecimiento.",
    },
    {
      nombre: "Fotografías de botiquín (<span style='color: red'>*</span>)",
      descripcion: "Abierto y cerrado.",
    },
    {
      nombre: "Fotografías de señalización de emergencia (<span style='color: red'>*</span>)",
      descripcion: "Ruta de evacuación, extintores, salidas de emergencia.",
    },
    {
      nombre: "Fotografías de sistema de detección de incendios (<span style='color: red'>*</span>)",
      descripcion: "Detectores de humo, uno por cada 200 m².",
    },
    {
      nombre: "Fotografías de lámparas de emergencia",
      descripcion: "Si trabaja después de las 18:00 hrs.",
    },
    {
      nombre: "Programa Interno de Protección Civil (<span style='color: red'>*</span>)",
      descripcion: "Incluye carta de corresponsabilidad vigente.",
    },
    {
      nombre: "Evidencia de las brigadas (<span style='color: red'>*</span>)",
      descripcion: "Firmadas y documentadas.",
    },
    {
      nombre: "Capacitación en primeros auxilios, combate de incendios y evacuación (<span style='color: red'>*</span>)",
      descripcion: "Registro vigente de la CEPCQ.",
    },
    {
      nombre: "Última factura de compra y recarga de extintores (<span style='color: red'>*</span>)",
      descripcion: "Fotografías de los equipos instalados.",
    },
    {
      nombre: "Opinión técnica de sistema fijo contra incendios",
      descripcion: "Si aplica.",
    },
    {
      nombre: "Dictamen eléctrico por unidad verificadora o colegiado (<span style='color: red'>*</span>)",
      descripcion: "Vigencia de 2 años.",
    },
    {
      nombre: "Dictamen de gas por unidad verificadora o colegiado (<span style='color: red'>*</span>)",
      descripcion: "Vigencia de 2 años.",
    },
    {
      nombre: "Dictamen estructural por colegiado (<span style='color: red'>*</span>)",
      descripcion: "Vigencia de 5 años.",
    },
    {
      nombre: "Estudio de tierras físicas",
      descripcion: "Si el voltaje utilizado es superior a 220V.",
    },
    {
      nombre: "Última revisión de recipientes sujetos a presión (<span style='color: red'>*</span>)",
      descripcion: "Evaluación de seguridad.",
    },
    {
      nombre: "Estudio de aforo por la CEPCQ (<span style='color: red'>*</span>)",
      descripcion: "Aplica para establecimientos con Licencia de Alcoholes en envase abierto.",
    },
    {
      nombre: "Póliza de seguro de responsabilidad civil (<span style='color: red'>*</span>)",
      descripcion: "Seguro para el establecimiento.",
    },
    {
      nombre: "Evidencia de simulacro (<span style='color: red'>*</span>)",
      descripcion: "Fotografías y bitácora.",
    },
    {
      nombre: "Último manifiesto de entrega de materiales y/o residuos peligrosos (<span style='color: red'>*</span>)",
      descripcion: "Documento obligatorio.",
    },
    {
      nombre: "Ficha técnica y evidencia fotográfica de material entumecente",
      descripcion: "Retardante, si aplica.",
    },
    {
      nombre: "Fotografías de barandal y cinta antiderrapante (<span style='color: red'>*</span>)",
      descripcion: "En escalones.",
    },
    {
      nombre: "Película protectora en cristales (<span style='color: red'>*</span>)",
      descripcion: "Ficha técnica o factura y fotografía.",
    },
    {
      nombre: "PARA GASOLINERAS: Reporte o inspección de la ASEA y estudio de tierras físicas",
      descripcion: "Aplica solo a estaciones de servicio.",
    }
  ];

  // Lista de documentos obligatorios (definidos manualmente en este codigo)
 
 // Documentos requeridos para riesgoBajo
const documentosRequeridosBajo = new Set([
  'Identificación oficial (<span style="color: red">*</span>)',
  'Comprobante de domicilio (<span style="color: red">*</span>)',
  'Uso de suelo (<span style="color: red">*</span>)',
  'Constancias de capacitación integral en materia de protección civil (<span style="color: red">*</span>)',
  'Serie de fotografías panorámicas (<span style="color: red">*</span>)',
  'Fotografías de botiquín (<span style="color: red">*</span>)',
  'Fotografías de la instalación eléctrica (<span style="color: red">*</span>)',
  'Fotografías de la instalación de gas y reporte técnico (<span style="color: red">*</span>)',
  'Fotografías de señalización de emergencia (<span style="color: red">*</span>)',
  'Fotografías de sistema de detección de incendios (<span style="color: red">*</span>)',
  'Fotografías de los extintores instalados (<span style="color: red">*</span>)',
  'Fotografías de barandal y cinta antiderrapante (<span style="color: red">*</span>)',
  'Película protectora en cristales (<span style="color: red">*</span>)'
]);

// Documentos requeridos para riesgoMedio
const documentosRequeridosMedio = new Set([
  'Identificación oficial (<span style="color: red">*</span>)',
  "Comprobante de domicilio (<span style='color: red'>*</span>)",
  "Uso de suelo (<span style='color: red'>*</span>)",
  "Constancias de capacitación integral en protección civil (<span style='color: red'>*</span>)",
  "Serie de fotografías panorámicas (<span style='color: red'>*</span>)",
  "Fotografías de botiquín (<span style='color: red'>*</span>)",
  "Fotografías de la instalación eléctrica (<span style='color: red'>*</span>)",
  "Fotografías de la instalación de gas y reporte técnico (<span style='color: red'>*</span>)",
  "Fotografías de señalización de emergencia (<span style='color: red'>*</span>)",
  "Fotografías de sistema de detección de incendios (<span style='color: red'>*</span>)",
  "Fotografías de los extintores instalados (<span style='color: red'>*</span>)",
  "Fotografías de barandal y cinta antiderrapante (<span style='color: red'>*</span>)",
  "Película protectora en cristales (<span style='color: red'>*</span>)"
]);

// Documentos requeridos para riesgoAlto
const documentosRequeridosAlto = new Set([
  "Identificación oficial (<span style='color: red'>*</span>)",
  "Comprobante de domicilio (<span style='color: red'>*</span>)",
  "Uso de suelo (<span style='color: red'>*</span>)",
  "Carta de Corresponsabilidad (<span style='color: red'>*</span>)",
  "Constancias de capacitación en protección civil y primeros auxilios (<span style='color: red'>*</span>)",
  "Póliza de responsabilidad civil (<span style='color: red'>*</span>)",
  "Dictamen estructural (<span style='color: red'>*</span>)",
  "Dictamen eléctrico (<span style='color: red'>*</span>)",
  "Dictamen de gas (<span style='color: red'>*</span>)",
  "Serie de fotografías panorámicas (<span style='color: red'>*</span>)",
  "Fotografías de botiquín (<span style='color: red'>*</span>)",
  "Fotografías de señalización de emergencia (<span style='color: red'>*</span>)",
  "Fotografías de sistema de detección de incendios (<span style='color: red'>*</span>)",
  "Programa Interno de Protección Civil (<span style='color: red'>*</span>)",
  "Evidencia de las brigadas (<span style='color: red'>*</span>)",
  "Capacitación en primeros auxilios, combate de incendios y evacuación (<span style='color: red'>*</span>)",
  "Última factura de compra y recarga de extintores (<span style='color: red'>*</span>)",
  "Dictamen eléctrico por unidad verificadora o colegiado (<span style='color: red'>*</span>)",
  "Dictamen de gas por unidad verificadora o colegiado (<span style='color: red'>*</span>)",
  "Dictamen estructural por colegiado (<span style='color: red'>*</span>)",
  "Última revisión de recipientes sujetos a presión (<span style='color: red'>*</span>)",
  "Estudio de aforo por la CEPCQ (<span style='color: red'>*</span>)",
  "Póliza de seguro de responsabilidad civil (<span style='color: red'>*</span>)",
  "Evidencia de simulacro (<span style='color: red'>*</span>)",
  "Último manifiesto de entrega de materiales y/o residuos peligrosos (<span style='color: red'>*</span>)",
  "Fotografías de barandal y cinta antiderrapante (<span style='color: red'>*</span>)",
  "Película protectora en cristales (<span style='color: red'>*</span>)"
]);


  //Funcion que sirve para desplegar el documento en la tabla ua vez que el usuario seleccione el pdf
  function cargarDocumentos(tablaId, documentos, documentosRequeridos) {
    const tabla = document.getElementById(tablaId).querySelector("tbody");
    tabla.innerHTML = "";

    documentos.forEach((doc) => {
      const row = document.createElement("tr");

      // Solo marcar como 'required-file' si el documento está en la lista de requeridos para ese riesgo
      if (documentosRequeridos.has(doc.nombre)) {
        row.classList.add("required-file");
      }

      row.innerHTML = `
                <td><span class="view-icon" onclick="verPDF(this)">👁️</span></td>
                <td>${doc.nombre}</td>
                <td>${doc.descripcion}</td>
                <td class="pesoArchivo">Bytes</td>
                <td>
                    <button class="btn-file" onclick="seleccionarArchivo(event, this)">Seleccionar documento</button>
                    <button class="btn-delete" onclick="eliminarArchivo(event, this)">🗑️</button>
                    <input type="file" accept="application/pdf" style="display:none" onchange="cargarArchivo(event, this)">
                </td>
            `;

      tabla.appendChild(row);
    });
  }
  

  // Cargar documentos al inicio (ocultos)
  cargarDocumentos("tablariesgoBajo", riesgoBajo, documentosRequeridosBajo);
  cargarDocumentos("tablariesgoMedio", riesgoMedio, documentosRequeridosMedio);
  cargarDocumentos("tablariesgoAlto", riesgoAlto, documentosRequeridosAlto);

});

// Funcion de el boton seleccionar que permite al usuario seleccionar el archivo solicitado
function seleccionarArchivo(event, button) {
  event.preventDefault(); // Evita que el formulario se envíe
  const input = button.nextElementSibling.nextElementSibling;
  input.click();
}

// Función para determinar el nivel de riesgo basado en los radios seleccionados
function determinarNivelRiesgo() {
    const radiosSeleccionados = document.querySelectorAll("form input[type='radio']:checked");
    console.log(radiosSeleccionados); // Para verificar si está seleccionando los radios correctamente

    let riesgo = "Bajo"; // Por defecto es bajo

    radiosSeleccionados.forEach((radio) => {
        if (radio.value === "C") {
            riesgo = "Alto"; // Si hay una "C", es riesgo alto
        } else if (radio.value === "B" && riesgo !== "Alto") {
            riesgo = "Medio"; // Si hay una "B" pero no "C", es riesgo medio
        }
    });

    console.log("Riesgo determinado:", riesgo); // Para depuración

    return riesgo;
}


// Función para mostrar la tabla correcta
function mostrarTablaCorrespondiente() {
    const nivelRiesgo = determinarNivelRiesgo();

    // Ocultar todas las tablas
    document.getElementById("tablariesgoBajo").style.display = "none";
    document.getElementById("tablariesgoMedio").style.display = "none";
    document.getElementById("tablariesgoAlto").style.display = "none";

    // Mostrar la tabla correspondiente
    if (nivelRiesgo === "Bajo") {
        document.getElementById("tablariesgoBajo").style.display = "block";
    } else if (nivelRiesgo === "Medio") {
        document.getElementById("tablariesgoMedio").style.display = "block";
    } else if (nivelRiesgo === "Alto") {
        document.getElementById("tablariesgoAlto").style.display = "block";
    }
}

// Cargar archivo
function cargarArchivo(event, input) {
  const archivo = event.target.files[0];

  if (archivo) {
    if (archivo.type !== "application/pdf") {
      alert("Sube un archivo PDF válido.");
      input.value = "";
      return;
    }

    const tamañoMB = archivo.size / (1024 * 1024); // Convertir bytes a MB
    if (tamañoMB > 3) {
      alert("El archivo no debe superar los 3 MB.");
      input.value = "";
      return;
    }

    const tamañoKB = (archivo.size / 1024).toFixed(2) + " KB";
    const fila = input.closest("tr");
    const pesoArchivo = fila.querySelector(".pesoArchivo");
    const viewIcon = fila.querySelector(".view-icon");

    fila.dataset.pdfURL = URL.createObjectURL(archivo);
    pesoArchivo.textContent = tamañoKB;
    viewIcon.style.display = "inline-block";
  }
}


// Funcion en la que el usuario puede ver el documento que selecciono dando clic en el ojito
function verPDF(icon) {
  const fila = icon.closest("tr");
  const pdfURL = fila.dataset.pdfURL;
  if (pdfURL) {
    window.open(pdfURL, "_blank");
  } else {
    alert("No hay archivo disponible.");
  }
}

// Funcion que ayuda al usuario a eliminar el archivo seleccionado en caso de equivocarse
function eliminarArchivo(event, button) {
  event.preventDefault(); // Evita que el formulario se envíe
  const fila = button.closest("tr");
  const inputArchivo = fila.querySelector("input[type='file']");
  fila.dataset.pdfURL = "";
  fila.querySelector(".pesoArchivo").textContent = "Bytes";
  fila.querySelector(".view-icon").style.display = "none";
  inputArchivo.value = "";
}

function validarDocumentosRequeridos() {
  // Determinar el nivel de riesgo actual
  const nivelRiesgo = determinarNivelRiesgo();
  let tableId;
  if (nivelRiesgo === "Bajo") {
    tableId = "tablariesgoBajo";
  } else if (nivelRiesgo === "Medio") {
    tableId = "tablariesgoMedio";
  } else if (nivelRiesgo === "Alto") {
    tableId = "tablariesgoAlto";
  }

  // Seleccionar la tabla y sus filas
  const tabla = document.getElementById(tableId);
  const filas = tabla.querySelectorAll("tbody tr");

  // Verificar cada fila que sea requerida
  let faltan = false;
  filas.forEach((fila) => {
    if (fila.classList.contains("required-file")) {
      // Si no hay archivo subido, dataset.pdfURL no estará definido o estará vacío
      if (!fila.dataset.pdfURL || fila.dataset.pdfURL === "") {
        faltan = true;
      }
    }
  });

  return !faltan; // Retorna true si no faltan documentos, false en caso contrario
}
