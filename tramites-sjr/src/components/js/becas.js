  console.log("Archivo becas.js cargado");

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
          <td>${doc.name} <span style="color: red;">*</span></td>
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
      const fileInput = document.getElementById(`file-${rowIndex}`);
      fileInput.click(); // Simula el clic para abrir el cuadro de diálogo de archivo
    
      // Manejar el evento de cambio (cuando el usuario selecciona un archivo)
      fileInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
          if (file.type !== "application/pdf") {
            alert("Por favor, selecciona un archivo PDF válido.");
            fileInput.value = ""; // Restablecer input si el archivo no es válido
            return;
          }
    
          // Mostrar tamaño del archivo en la tabla
          const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2); // Convertir tamaño a MB
          document.getElementById(`size-${rowIndex}`).textContent = `${fileSizeMB} MB`;
    
          // Crear una URL para previsualizar el PDF
          const fileURL = URL.createObjectURL(file);
    
          // Agregar el "ojito" para visualizar el PDF
          const iconCell = document.querySelector(`#pdf-icon-${rowIndex}`);
          iconCell.innerHTML = `
            <a href="${fileURL}" target="_blank" title="Ver documento" style="text-decoration: none; font-size: 20px;">
              👁️
            </a>
          `;
        }
      });
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
      console.log("Ejecutando resetFormFields...");

      // Seleccionar los inputs tipo "file" dentro de la tabla
      const fileInputs = document.querySelectorAll("#documentsTable input[type='file']");
      console.log("File inputs encontrados:", fileInputs);

      // Seleccionar las celdas de tamaño (id que empieza con 'size-') dentro de la tabla
      const sizeCells = document.querySelectorAll("#documentsTable [id^='size-']");
      console.log("Celdas de tamaño encontradas:", sizeCells);

      // Seleccionar los íconos de PDF (id que empieza con 'pdf-icon-') dentro de la tabla
      const pdfIcons = document.querySelectorAll("#documentsTable [id^='pdf-icon-']");
      console.log("Íconos de PDF encontrados:", pdfIcons);

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

      console.log("Campos de PDF reiniciados.");
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

      console.log("Datos recolectados para envío:", data);

        // Llamada a la API
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result && result.mensaje) {
          console.log("Registro exitoso:", result);
          return true; // Éxito
      } else {
          console.error("Error en el registro:", result);
          return false; // Fallo
      }
  } catch (error) {
      console.error("Error durante la llamada a la API:", error);
      return false; // Error
  }
}

 ///******************************FUNCION PARA GUARDADO DE DOCUMENTOS EN LA BD************************************* */
 async function guardarDocumentosBeca() {
  const tableBody = document.querySelector("#documentsTable tbody");
  const rows = tableBody.querySelectorAll("tr");
  const documentos = [];
  const id_usuario = 1; // ⚠️ Cambiar dinámicamente al ID del usuario logueado

  for (let i = 0; i < rows.length; i++) {
    const fileInput = document.getElementById(`file-${i}`);
    const file = fileInput.files[0];

    if (!file) {
      alert(`Por favor selecciona un archivo para el documento ${i + 1}.`);
      return;
    }

    // Verificar que el archivo sea un PDF
    if (file.type !== "application/pdf") {
      alert(`El archivo seleccionado para el documento ${i + 1} no es un PDF.`);
      return;
    }

    documentos.push({
      file: file,
      nombre: rows[i].querySelector("td:nth-child(2)").textContent.trim(), // Nombre del documento
    });
  }

  const resultados = [];
  for (const documento of documentos) {
    const formData = new FormData();
    formData.append("file", documento.file);
    formData.append("nombre", documento.nombre);
    formData.append("id_usuario", id_usuario); // Ahora se envía el ID de usuario dinámico

    try {
      const response = await fetch("http://localhost/tramites/dashboard/tramites-sjr/Api/principal/upload_documents_beca_data", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        resultados.push(result.url);
        console.log(`Documento ${documento.nombre} subido con éxito. URL: ${result.url}`);
      } else {
        alert(`Error al subir el documento ${documento.nombre}: ${result.message}`);
        return;
      }
    } catch (error) {
      console.error(`Error al subir el documento ${documento.nombre}:`, error);
      alert(`Error al subir el documento ${documento.nombre}.`);
      return;
    }
  }

  if (resultados.length === documentos.length) {
    alert("Todos los documentos se subieron con éxito.");
    console.log("URLs de los documentos:", resultados);
  }
}
