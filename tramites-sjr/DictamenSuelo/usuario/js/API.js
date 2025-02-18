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


async function subirDocumentosSuelo(id_usuario) {
    const tablas = ["tablaDocsGenerales", "tablaDocsCondicionales", "tablaDocsEspecificos"];
    const documentos = [];

    // Recorrer todas las tablas para recolectar los documentos a subir
    tablas.forEach(tablaId => {
        const filas = document.querySelectorAll(`#${tablaId} tbody tr`);

        filas.forEach(fila => {
            const inputFile = fila.querySelector("input[type='file']");
            const nombreDocumento = fila.querySelector("td:nth-child(2)").textContent.trim();
            const esRequerido = fila.classList.contains("required-file"); // Verifica si el documento es obligatorio

            if (inputFile && inputFile.files.length > 0) {
                documentos.push({
                    file: inputFile.files[0],
                    nombre: nombreDocumento
                });
            } else if (esRequerido) {
                return false; // Detiene la subida si falta un documento requerido
            }
        });
    });

    if (documentos.length === 0) {
        return false;
    }

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
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }

    return resultados.length === documentos.length;
}

async function obtenerDatosSuelo(id_usuario = 1) {
    try {
        const response = await fetch("http://localhost/tramites/dashboard/tramites-sjr/Api/principal/get_datos_suelo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_usuario }) // enviar el id en el body
        });

        const result = await response.json();
        
        if (result.success && result.dictamen) { // Cambio de "suelo" a "dictamen"
            console.log("Datos del dictamen obtenidos:", result.dictamen);
            return result.dictamen; // Devuelve los datos del dictamen
        }

        return null; // Si no hay datos, devuelve null
    } catch (error) {
        console.error("Error al obtener los datos del dictamen:", error);
        return null;
    }
}


