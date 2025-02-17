
  // Lista de documentos
  const documents = [
      {
        name: "Acta de Nacimiento",
        description: "Documento que compruebe la identidad del solicitante",
      },
      {
        name: "Comprobante de Domicilio",
        description: "Domicilio del solicitante no mayor a dos meses",
      },
      {
        name: "Boleta de Calificaciones",
        description: "Documento que compruebe la calificación aprobatoria en todas sus materias",
      },
      {
        name: "Constancia de Inscripción",
        description: "Documento que compruebe la inscripción vigente en la institución educativa",
      },
      {
        name: "Comprobante de Ingresos",
        description: "Documento que comprueben los ingresos del solicitante y/o tutor",
      },
      // Agrega más documentos aquí
    ];
    
    // Generar filas dinámicamente
    function generateTableRows() {
      const tableBody = document.querySelector("#documentsTable tbody");
      documents.forEach((doc, index) => {
        // Crear fila
        const row = document.createElement("tr");
    
        // Contenido de la fila
        row.innerHTML = `
          <td id="pdf-icon-${index}">
            <span style="font-size: 20px;">📄</span>
          </td>
          <td>${doc.name} </td>
          <td>${doc.description}</td>
          <td id="size-${index}">Bytes</td>
          <td>
            <input type="file" id="file-${index}" style="display: none;" accept=".pdf">
            <button class="btnSubirDoc" onclick="seleccionarDocumento(${index})">Seleccionar documento</button>
            <button class="btnBorrarDoc" onclick="deleteDocument(${index})">X</button>
          </td>
        `;
    
        // Agregar fila a la tabla
        tableBody.appendChild(row);
      });
    }


    
    function seleccionarDocumento(rowIndex) {
        let fileInput = document.getElementById(`file-${rowIndex}`);
    
        // 🔹 Si ya hay un archivo seleccionado, no permitir subir otro
        if (fileInput.files.length > 0) {
            mostrarModalGlobal("⚠️ Ya has seleccionado un archivo para este documento. Elimina el archivo antes de subir uno nuevo.", "warning");
            return;
        }
    
        // 🔹 Clonar y reemplazar el input para eliminar eventos previos
        const newFileInput = fileInput.cloneNode(true);
        fileInput.replaceWith(newFileInput);
        fileInput = newFileInput; // Actualizar referencia
    
        // 🔹 Agregar el evento change asegurando que no se acumule
        fileInput.addEventListener("change", async (event) => {
            const file = event.target.files[0];
    
            if (!file) return;
    
            // 🔹 Validar que sea PDF
            if (file.type !== "application/pdf") {
                mostrarModalGlobal("❌ Por favor, selecciona un archivo PDF válido.", "error");
                fileInput.value = "";
                return;
            }
    
            // 🔹 Validar tamaño menor a 3 MB
            const maxSizeMB = 3;
            const fileSizeMB = file.size / (1024 * 1024);
    
            if (fileSizeMB > maxSizeMB) {
                mostrarModalGlobal(`❌ El archivo seleccionado es demasiado grande (${fileSizeMB.toFixed(2)} MB). Debe ser menor a ${maxSizeMB} MB.`, "error");
                fileInput.value = "";
                return;
            }
    
            // 🔹 Mostrar tamaño del archivo en la tabla
            document.getElementById(`size-${rowIndex}`).textContent = `${fileSizeMB.toFixed(2)} MB`;
    
            // 🔹 Crear una URL para previsualizar el PDF
            const fileURL = URL.createObjectURL(file);
    
            // 🔹 Agregar el "ojito" para visualizar el PDF
            document.querySelector(`#pdf-icon-${rowIndex}`).innerHTML = `
                <a href="${fileURL}" target="_blank" title="Ver documento" style="text-decoration: none; font-size: 20px;">
                    👁️
                </a>
            `;
    
            // 🔹 Mostrar el modal de carga
            mostrarModalCarga("Verificando documento... Esto puede tardar un poco, sea paciente.");
    
            // 🔹 Procesar el documento PDF y validarlo
            procesarPDF(file, rowIndex, async (documentoValido) => {
                cerrarModalCarga();
    
                if (documentoValido.isValid) {
                    mostrarModalGlobal(documentoValido.message, "success");
                } else {
                    deleteDocument(rowIndex);
                    mostrarModalGlobal(documentoValido.message, "error");
                }
            });
        });
    
        // 🔹 Simular el clic para abrir el cuadro de diálogo de archivo
        fileInput.click();
    }
    
    
    // Función para procesar el PDF y realizar la validación específica para cada tipo de documento
function procesarPDF(file, rowIndex, callback) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const pdfData = new Uint8Array(event.target.result);
        pdfjsLib.getDocument({ data: pdfData }).promise.then(pdf => {
            let textoCompleto = "";

            let promises = [];
            for (let i = 1; i <= pdf.numPages; i++) {
                promises.push(
                    pdf.getPage(i).then(page => {
                        return page.getTextContent().then(textContent => {
                            let textoPagina = textContent.items.map(item => item.str).join(" ");
                            textoCompleto += textoPagina + " ";
                        });
                    })
                );
            }

            // Una vez obtenemos todo el texto, verificamos si hay más imágenes para OCR.
            Promise.all(promises).then(() => {
                // Si el texto extraído está vacío, usamos la función de OCR (extraerTextoDeImagenes)
                if (textoCompleto.trim() === "") {
                    extraerTextoDeImagenes(pdf, (ocrTexto) => {
                        textoCompleto = ocrTexto;
                        realizarValidacion(rowIndex, textoCompleto, callback);
                    });
                } else {
                    realizarValidacion(rowIndex, textoCompleto, callback);
                }
            });
        }).catch(error => {
           // console.error("Error al procesar el PDF:", error);
            callback({ isValid: false, message: "Hubo un error al procesar el PDF." });
        });
    };
    reader.readAsArrayBuffer(file);
}

// Función para extraer texto de las imágenes generadas a partir del PDF
function extraerTextoDeImagenes(pdf, callback) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    // Procesar la primera página como imagen
    pdf.getPage(1).then(page => {
        const viewport = page.getViewport({ scale: 2 }); // Mantener una escala moderada para mejor calidad
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        page.render({ canvasContext: context, viewport: viewport }).promise.then(() => {
            const imageData = canvas.toDataURL("image/png");

            // Procesar la imagen con Tesseract.js
            Tesseract.recognize(
                imageData,
                'spa', 
                {
                   // logger: (m) => console.log(m)
                }
            ).then(({ data: { text } }) => {
                //console.log("Texto extraído de imagen:", text);
                callback(text);
            });
        });
    });
}


async function realizarValidacion(rowIndex, textoCompleto, callback) {
    let documentoValido;

    if (documents[rowIndex].name === "Acta de Nacimiento") {
        // 🔹 Ahora `await` espera a que se complete `validarActaNacimiento`
        documentoValido = await validarActaNacimiento(textoCompleto);
    } else if (documents[rowIndex].name === "Comprobante de Domicilio") {
        documentoValido = validarComprobanteDomicilio(textoCompleto);
    } else if (documents[rowIndex].name === "Constancia de Inscripción") {
        documentoValido = validarConstanciaInscripcion(textoCompleto);
    } else {
        // Si no es un documento con validación específica, se aprueba automáticamente
        callback({ isValid: true, message: "✅ El documento se ha validado correctamente." });
        return;
    }

    // 🔹 Asegurar que `documentoValido` tiene un valor antes de continuar
    if (!documentoValido) {
        documentoValido = { isValid: false, message: "❌ Error inesperado en la validación del documento, intente de nuevo"};
    }

    // 🔹 Mostrar el resultado de la validación
    if (documentoValido.isValid) {
        cerrarModalCarga();
        mostrarModalGlobal(documentoValido.message, "success");
    } else {
        cerrarModalCarga();
        mostrarModalGlobal(documentoValido.message, "error");
        deleteDocument(rowIndex);
    }
}

function verificarTexto(texto, nombreUsuario) {
    return new Promise((resolve) => {
        //console.log("texto extraído:", texto);
        //console.log("nombre esperado:", nombreUsuario);

        let textoNormalizado = normalizarTexto(texto);
        const nombreNormalizado = normalizarTexto(nombreUsuario);

        // separar el nombre en partes
        const nombreFragmentos = nombreUsuario.split(" ").map(fragment => normalizarTexto(fragment));

        // verificar si al menos un fragmento del nombre aparece en el texto
        let nombreValido = nombreFragmentos.some(fragmento => textoNormalizado.includes(fragmento));

        resolve(nombreValido);
    });
}



// Normalización de texto (quitar acentos, pasar a minúsculas, etc.)
function normalizarTexto(texto) {
    if (!texto || typeof texto !== "string") return "";

    return texto
        .toLowerCase() // Hace todo minúsculas
        .normalize("NFD") // Normaliza caracteres acentuados
        .replace(/[\u0300-\u036f]/g, "") // Elimina acentos
        .replace(/\s+/g, " ") // Elimina espacios extras
        .trim(); // Quita espacios al principio y al final
}


// función para validar el acta de nacimiento usando el nombre desde la base de datos
async function validarActaNacimiento(texto) {
    const id_usuario = 1; // ⚠️ Cambiar esto para obtener el ID del usuario dinámicamente

    try {
        const beca = await obtenerDatosEstudiante(id_usuario);

        if (!beca) {
            return { isValid: false, message: "❌ No se encontraron datos del estudiante para validar el acta de nacimiento, en caso de ser correctos suba un Archivo PDF con mayor calidad" };
        }

        // 🔹 Verificar si los datos clave existen antes de continuar
        if (!beca.nombre_estudiante || !beca.primer_apellido_estudiante || !beca.segundo_apellido_estudiante) {
            return { isValid: false, message: "❌ Los datos del estudiante están incompletos en la base de datos." };
        }

        // 🔹 Obtener el nombre completo del estudiante
        const nombreCompleto = `${beca.nombre_estudiante} ${beca.primer_apellido_estudiante} ${beca.segundo_apellido_estudiante}`.trim();
        //console.log("🔍 Nombre del estudiante obtenido:", nombreCompleto);

        // 🔹 Normalizar el texto del acta y el nombre del estudiante
        let textoNormalizado = normalizarTexto(texto);
        let nombreNormalizado = normalizarTexto(nombreCompleto);

       // console.log("📜 Texto extraído del PDF:", textoNormalizado);
        //console.log("🎯 Nombre a buscar en el PDF:", nombreNormalizado);

        // 🔹 Comparar si el nombre está en el texto del acta
        const nombreFragmentos = nombreCompleto.split(" ").map(fragmento => normalizarTexto(fragmento));
        let nombreValido = nombreFragmentos.every(fragmento => textoNormalizado.includes(fragmento));

        if (nombreValido) {
            //console.log("✅ Acta de nacimiento válida.");
            return { isValid: true, message: "✅ El acta de nacimiento es válida." };
        } else {
            //console.log("❌ Error: El nombre del acta de nacimiento no coincide.");
            return { isValid: false, message: `❌ El nombre del acta de nacimiento no coincide con el estudiante (${nombreCompleto}).` };
        }

    } catch (error) {
        //console.error("❌ Error inesperado al validar el acta de nacimiento:", error);
        return { isValid: false, message: "❌ Error inesperado al obtener los datos del estudiante." };
    }
}



// Validación para Comprobante de Domicilio
function validarComprobanteDomicilio(texto) {
    const palabrasClave = /domicilio|recibo|dirección|comprobante|cfe|japam|pago|factura|agua|luz/i; // Palabras clave asociadas con un comprobante de domicilio
    if (palabrasClave.test(texto)) {
        return { isValid: true, message: "✅El comprobante de domicilio es válido." };
    } else {
        return { isValid: false, message: "❌ El comprobante de domicilio no contiene los datos necesarios, en caso de ser correctos suba un Archivo PDF con mayor calidad" };
    }
}

/*
// corrección de la validación para boleta de calificaciones
function validarBoletaCalificaciones(texto) {
    const calificacionesEncontradas = texto.match(/\b\d+\b/g); // buscar solo números enteros

    // si no se encuentran números, devolver error
    if (!calificacionesEncontradas) {
        return { isValid: false, message: "❌ No se encontraron calificaciones en el documento." };
    }

    // convertir a enteros y verificar si alguna calificación es menor a 6
    const algunaReprobada = calificacionesEncontradas.some(num => parseInt(num, 10) < 6);

    if (algunaReprobada) {
        return { isValid: false, message: "❌ La boleta de calificaciones tiene calificaciones menores a 6." };
    } else {
        return { isValid: true, message: "La boleta de calificaciones es válida." };
    }
}
    */

// Validación para Constancia de Inscripción
function validarConstanciaInscripcion(texto) {
    const palabrasClaveInscripcion = /inscripción|número de inscripción|matrícula|alumno|código de alumno|matricula/i;
    const palabrasClaveInstitucion = /escuela|primaria1|escuela||institución|colegio|primaria/i;

    if (palabrasClaveInscripcion.test(texto) && palabrasClaveInstitucion.test(texto)) {
        return { isValid: true, message: "✅La constancia de inscripción es válida." };
    } else {
        return { isValid: false, message: "❌ La constancia de inscripción no contiene los datos necesarios,en caso de ser correctos suba un Archivo PDF con mayor calidad" };
    }
}
    
    // Llamar a la función para generar las filas al cargar la página
    document.addEventListener("DOMContentLoaded", generateTableRows);
    
    // Función para subir documento
   
    // Función para eliminar documento
    function deleteDocument(rowIndex) {
      // Restablecer input de archivo
      const fileInput = document.getElementById(`file-${rowIndex}`);
      fileInput.value = ""; // Limpia el input
    
      // Restablecer tamaño a "Bytes"
      document.getElementById(`size-${rowIndex}`).textContent = "Bytes";
    
      // Restablecer el emoji de PDF
      const iconCell = document.querySelector(`#pdf-icon-${rowIndex}`);
      iconCell.innerHTML = `<span style="font-size: 20px;">📄</span>`;
    }


    function resetFormFields() {
      //console.log("Ejecutando resetFormFields...");

      // Seleccionar los inputs tipo "file" dentro de la tabla
      const fileInputs = document.querySelectorAll("#documentsTable input[type='file']");
      //console.log("File inputs encontrados:", fileInputs);

      // Seleccionar las celdas de tamaño (id que empieza con 'size-') dentro de la tabla
      const sizeCells = document.querySelectorAll("#documentsTable [id^='size-']");
      //console.log("Celdas de tamaño encontradas:", sizeCells);

      // Seleccionar los íconos de PDF (id que empieza con 'pdf-icon-') dentro de la tabla
      const pdfIcons = document.querySelectorAll("#documentsTable [id^='pdf-icon-']");
      // console.log("Íconos de PDF encontrados:", pdfIcons);

      // Limpiar inputs de archivo
      fileInputs.forEach((input) => {
          input.value = ""; // Resetea el valor del input
      });

      // Restablecer tamaños
      sizeCells.forEach((cell) => {
          cell.textContent = "Bytes"; // Reinicia el texto del tamaño
      });

      // Restablecer íconos
      pdfIcons.forEach((icon) => {
          icon.innerHTML = `<span style="font-size: 20px;">📄</span>`;
      });

      //console.log("Campos de PDF reiniciados.");
  }

  ///******************************FUNCION PARA GUARDADO DE DATOS EN LA BD************************************* */


// Función actualizada para guardar datos en la base de datos
async function RegistroFormBecaAPI() {
  const apiUrl = 'http://localhost/tramites/dashboard/tramites-sjr/Api/principal/insert_full_beca_data';
  let data = {}; // Aquí debes recolectar los datos necesarios

  try {
      // Validar protesta
      const protestaSeleccionada = document.querySelector("input[name='protesta_beca']:checked");
      if (!protestaSeleccionada) {
          mostrarModalGlobal("Por favor, selecciona la protesta de decir verdad.", "warning");
          return false; // Salir si no está seleccionada
      }
      // Recolectar datos del formulario
      data = {
          id_usuario: 1,
          ubicacion_tramite_beca: document.getElementById("ubicacion_tramite_beca").value,
          primer_apellido_estudiante: document.getElementById("primer_apellido_est").value,
          segundo_apellido_estudiante: document.getElementById("segundo_apellido_est").value,
          nombre_estudiante: document.getElementById("nombre_est").value,
          lugar_nac_estudiante: document.getElementById("lugar_nac_est").value,
          fec_nac_estudiante: document.getElementById("fecha_nac_est").value,
          calle_dom_estudiante: document.getElementById("calle_dom_est").value,
          num_dom_estudiante: document.getElementById("num_dom_est").value,
          col_dom_estudiante: document.getElementById("col_dom_est").value,
          mun_dom_estudiante: document.getElementById("mun_dom_est").value,
          tel_dom_estudiante: document.getElementById("tel_dom_est").value,
          curp_estudiante: document.getElementById("curp_estudiante").value,
          calle_inst: document.getElementById("calle_inst").value,
          num_inst: document.getElementById("num_inst").value,
          colonia_inst: document.getElementById("col_inst").value,
          municipio_inst: document.getElementById("mun_inst").value,
          nombre_inst: document.getElementById("nombre_inst").value,
          promedio_estudiante: document.getElementById("promedio_est").value,
          ape_paterno_tutor: document.getElementById("ape_paterno_tutor").value,
          ape_materno_tutor: document.getElementById("ape_materno_tutor").value,
          nombre_tutor_estudiante: document.getElementById("nombre_tutor_est").value,
          ocupacion_tutor_estudiante: document.getElementById("ocupacion_tutor_est").value,
          num_habitan_beca: document.getElementById("num_habitan_beca").value,
          num_personas_aportan: document.getElementById("num_personas_apor").value,
          ingreso_mensual_familiar: document.getElementById("ingreso_mensual").value,
          protesta_ingreso_beca: document.getElementById("protesta_beca").checked ? 1 : 0,
      };

      //console.log("Datos recolectados para envío:", data);

        // Llamada a la API
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result && result.mensaje) {
          //console.log("Registro exitoso:", result);
          return true; // Éxito
      } else {
          //console.error("Error en el registro:", result);
          return false; // Fallo
      }
  } catch (error) {
      //console.error("Error durante la llamada a la API:", error);
      return false; // Error
  }
}

 ///******************************FUNCION PARA GUARDADO DE DOCUMENTOS EN LA BD************************************* */
 // Función para subir documentos al servidor
async function guardarDocumentosBeca() {
  const tableBody = document.querySelector("#documentsTable tbody");
  const rows = tableBody.querySelectorAll("tr");
  const documentos = [];
  const id_usuario = 1; // ⚠️ Cambiar dinámicamente con sesión cuando esté disponible

  for (let i = 0; i < rows.length; i++) {
      const fileInput = document.getElementById(`file-${i}`);
      const file = fileInput.files[0];

      if (file) {
          documentos.push({
              file: file,
              nombre: rows[i].querySelector("td:nth-child(2)").textContent.trim()
          });
      }
  }


  mostrarModalCarga("Espere, se están guardando los documentos...");


  const resultados = [];
  for (const documento of documentos) {
      const formData = new FormData();
      formData.append("file", documento.file);
      formData.append("nombre", documento.nombre);
      formData.append("id_usuario", id_usuario);

      try {
          const response = await fetch("http://localhost/tramites/dashboard/tramites-sjr/Api/principal/upload_documents_beca_data", {
              method: "POST",
              body: formData,
          });

          const result = await response.json();
          if (result.success) {
              resultados.push(result.url);
             // console.log(`Documento ${documento.nombre} subido con éxito. URL: ${result.url}`);
          } else {
              cerrarModalCarga();
              mostrarModalGlobal(`Error al subir el documento ${documento.nombre}: ${result.message}`, "error");
              return false;
          }
      } catch (error) {
          cerrarModalCarga();
          //console.error(`Error al subir el documento ${documento.nombre}:`, error);
          mostrarModalGlobal(`Error al subir el documento ${documento.nombre}.`, "error");
          return false;
      }
  }

  cerrarModalCarga();

  if (resultados.length === documentos.length) {
      mostrarModalGlobal("Los documentos fueron guardados correctamente.", "success");
      return true;
  }

  return false;
}


// Función para validar si todos los documentos están seleccionados antes de mostrar el modal de carga
async function validarDocumentosAntesDeGuardar() {
  const tableBody = document.querySelector("#documentsTable tbody");
  const rows = tableBody.querySelectorAll("tr");

  for (let i = 0; i < rows.length; i++) {
      const fileInput = document.getElementById(`file-${i}`);
      if (!fileInput.files[0]) {
          mostrarModalGlobal("Aún faltan documentos por seleccionar. Por favor, suba todos los documentos antes de continuar.", "warning");
          return false;
      }
  }

  return true;
}


/**
 * Muestra un modal de carga con un GIF animado
 */
//
function mostrarModalCarga(mensaje) {
  const modal = document.createElement("div");
  modal.classList.add("modal-global");
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.display = "flex";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";
  modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  modal.style.zIndex = "10000";

  const modalContent = `
      <div style="
          background: white; 
          padding: 20px; 
          border-radius: 12px; 
          max-width: 400px; 
          text-align: center;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          align-items: center;
      ">
          <h2 style="color: #333; font-size: 18px; margin-bottom: 10px;">${mensaje}</h2>
          <img src="./images/Spinner.gif" alt="Cargando..." style="width: 80px; height: 80px;">
          <p style="font-size: 14px; color: #666;">Por favor...</p>
      </div>
  `;
  modal.innerHTML = modalContent;
  document.body.appendChild(modal);
}

// Función para cerrar el modal de carga
function cerrarModalCarga() {
  const modal = document.querySelector(".modal-global");
  if (modal) {
      modal.remove();
  }
}



async function verificarDatosBecaYDocumentos(id_usuario=1) {  
  try {
      const response = await fetch("http://localhost/tramites/dashboard/tramites-sjr/Api/principal/get_datos_becas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_usuario }) // Enviar el ID en el body
      });

      const result = await response.json();
      
      if (result.success) {
        //.log("Datos de beca:", result.beca);
         // console.log("Documentos encontrados:", result.documentos);

          // Si tiene datos en becas_estudiantes pero NO tiene documentos, lo deja avanzar
          if (result.beca && (!result.documentos || result.documentos.length === 0)) {
              return "solo_beca"; // El usuario solo tiene el registro de beca, aún puede subir documentos
          } 
          
          // Si tiene registros en ambas tablas, ya no debe poder hacer nada
          if (result.beca && result.documentos.length > 0) {
              return "beca_y_documentos"; // Tiene todo registrado, bloquear trámite
          }
      }

      // Si no tiene ningún registro en `becas_estudiantes`, puede hacer el trámite desde cero
      return "sin_registro";

  } catch (error) {
     // console.error("Error al verificar los datos de beca y documentos:", error);
      return "error";
  }
}


async function obtenerDatosEstudiante(id_usuario = 1) {
    try {
        const response = await fetch("http://localhost/tramites/dashboard/tramites-sjr/Api/principal/get_datos_becas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_usuario }) // enviar el id en el body
        });

        const result = await response.json();
        
        if (result.success && result.beca) {
           // console.log("datos del estudiante obtenidos:", result.beca);
            return result.beca; // devuelve solo los datos del estudiante
        }

        return null; // si no hay datos de beca, devuelve null
    } catch (error) {
        //console.error("error al obtener los datos del estudiante:", error);
        return null;
    }
}





