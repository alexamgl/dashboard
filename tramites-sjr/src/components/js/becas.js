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
          <button class="btnSubirDoc" onclick="uploadDocument(${index})">Subir documento</button>
          <button class="btnBorrarDoc" onclick="deleteDocument(${index})">X</button>
        </td>
      `;
  
      // Agregar fila a la tabla
      tableBody.appendChild(row);
    });
  }
  
  // Llamar a la función para generar las filas al cargar la página
  document.addEventListener("DOMContentLoaded", generateTableRows);
  
  // Función para subir documento
  function uploadDocument(rowIndex) {
    const fileInput = document.getElementById(`file-${rowIndex}`);
    fileInput.click(); // Abrir cuadro de diálogo
  
    // Evento de cambio para procesar el archivo seleccionado
    fileInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file && file.type === "application/pdf") {
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2); // Convertir tamaño a MB
        document.getElementById(`size-${rowIndex}`).textContent = `${fileSizeMB} MB`; // Actualizar tamaño en la tabla
  
        // Crear URL para mostrar el PDF
        const fileURL = URL.createObjectURL(file);
  
        // Agregar el emoji de ojito que permita abrir el PDF
        const iconCell = document.querySelector(`#pdf-icon-${rowIndex}`);
        iconCell.innerHTML = `
          <a href="${fileURL}" target="_blank" title="Ver documento" style="text-decoration: none; font-size: 20px;">
            👁️
          </a>
        `;
      } else {
        alert("Por favor, selecciona un archivo PDF válido.");
      }
    });
  }
  
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

// función actualizada para guardar datos en la base de datos
async function RegistroFormBecaAPI() {
  console.log('función de registro iniciada');
  let data = {};
  let apiUrl = 'http://localhost/tramites/dashboard/tramites-sjr/Api/principal/insert_full_beca_data';

  try {
      // recolectar datos del formulario
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

     // llamada a la api
     const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
  });

  const result = await response.json();

  if (result && result.mensaje) {
      console.log('registro exitoso:', result);
      // mostrar el modal de éxito y avanzar al cerrar
      mostrarModalGlobal('registro exitoso. pasando al siguiente paso.', 'success', () => {
          avanzarPaso(); // avanzar al siguiente paso
      });
  } else {
      mostrarModalGlobal('error en el registro. verifica los datos e inténtalo de nuevo.', 'error');
  }
} catch (error) {
  console.error('error durante el registro:', error);
  mostrarModalGlobal('ocurrió un error inesperado. inténtalo más tarde.', 'error');
}
}


