// Función actualizada para guardar datos en la base de datos
async function RegistroFormDicSueloAPI() {
    const apiUrl = 'http://localhost/tramites/dashboard/tramites-sjr/Api/principal/insert_full_suelo_data';
    let data = {};

    try {
        // Recolectar datos del formulario
        data = {
            id_usuario: 1, // Asegúrate de modificar esto dinámicamente si es necesario
            superficie: document.getElementById("superficie").value,
            claveCatastral: document.getElementById("claveCatastral").value,
            razonSocial: document.getElementById("razonSocial").value,
            apellidoPaterno: document.getElementById("apellidoPaterno").value,
            apellidoMaterno: document.getElementById("apellidoMaterno").value,
            nombre: document.getElementById("nombre").value,
            telefono: document.getElementById("telefono").value,
            correo: document.getElementById("correo").value,
            personaAutorizada: document.getElementById("personaAutorizada").value,
            codigoPostal: document.getElementById("codigoPostal").value,
            colonia: document.getElementById("colonia").value,
            calle: document.getElementById("calle").value,
            numeroExterior: document.getElementById("numeroExterior").value,
            numeroInterior: document.getElementById("numeroInterior").value,
            latitud: document.getElementById("latitud").value,
            longitud: document.getElementById("longitud").value,
            descAct: document.getElementById("descAct").value,
            tipoSolicitud: document.querySelector('input[name="tipoSolicitud"]:checked')?.value || "",
            usoSolicitado: document.querySelector('input[name="UsoSolicitado"]:checked')?.value || "",
            cantidad: document.getElementById("cantidad").value,
            descUso: document.getElementById("descUso").value,
        };

        console.log(data);

        // Enviar datos a la API
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


async function guardarDocumentosSuelo() {
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
            const response = await fetch("http://localhost/tramites/dashboard/tramites-sjr/Api/principal/upload_documents_suelo_data", {
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
  