// Función actualizada para guardar datos en la base de datos
async function RegistroFormGiroAPI() {

    const apiUrl = 'http://localhost/tramites/dashboard/tramites-sjr/Api/principal/insert_full_giro_data';
    let data = {};

    try {
        // Recolectar datos del formulario
        data = {
            id_usuario: 1, // Asegúrate de modificar esto dinámicamente si es necesario
            superficie: document.getElementById("superficie").value,
            claveCatastral: document.getElementById("claveCatastral").value,
            razonSocial: document.getElementById("razonSocial").value,
            apellidoPaterno: document.getElementById("apellidoPaterno").value,
            apellidoMaterno : document.getElementById("apellidoMaterno").value,
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
            arrendatario: document.getElementById("arrendatario").value,
            superficieLocal: document.getElementById("superficieLocal").value,
            descAct: document.getElementById("descAct").value,
            tipoSolicitud: document.querySelector('input[name="tipoSolicitud"]:checked')?.value || "",
            tipoFactibilidad: document.querySelector('input[name="tipoFactibilidad"]:checked')?.value || "",
        };  


        // Enviar datos a la API
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });


        const result = await response.json();

        if (result && result.mensaje) {
          //  console.log("Registro exitoso:", result);
            return true; // Éxito
        } else {
           // console.error("Error en el registro:", result);
            return false; // Fallo
        }
    } catch (error) {
      //  console.error("Error durante la llamada a la API:", error);
        return false; // Error
    }
}

/*async function subirDocumentosGiro(id_usuario) {
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
            const response = await fetch("http://localhost/tramites/dashboard/tramites-sjr/Api/principal/upload_documents_giro_data", {
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
}*/

async function subirDocumentosGiro(id_usuario) {
    const tablas = ["tablaDocsGenerales", "tablaDocsCondicionales", "tablaDocsEspecificos"];
    const documentos = [];

    // Recolectar documentos
    tablas.forEach(tablaId => {
        const filas = document.querySelectorAll(`#${tablaId} tbody tr`);
        filas.forEach(fila => {
            const inputFile = fila.querySelector("input[type='file']");
            const nombreDocumento = fila.querySelector("td:nth-child(2)").textContent.trim();
            const esRequerido = fila.classList.contains("required-file");
            if (inputFile && inputFile.files.length > 0) {
                documentos.push({
                    file: inputFile.files[0],
                    nombre: nombreDocumento
                });
            } else if (esRequerido) {
                // Nota: "return false" aquí solo finaliza la iteración actual,
                // si necesitas detener todo, utiliza otro mecanismo.
                return false;
            }
        });
    });

    if (documentos.length === 0) {
        return false;
    }

    const formData = new FormData();
    formData.append("id_usuario", id_usuario);
    // Agregar todos los documentos en arrays
    documentos.forEach(doc => {
        formData.append("files[]", doc.file);
        formData.append("nombres[]", doc.nombre);
    });

    //console.log("Documentos recolectados:", documentos);

    try {
        const response = await fetch("http://localhost/tramites/dashboard/tramites-sjr/Api/principal/insert_full_giro_docs", {
            method: "POST",
            body: formData,
        });

        const result = await response.json();
        //console.log("Respuesta del servidor:", result);
        if (result.success) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
       // console.error("Error en la subida:", error);
        return false;
    }
}


async function obtenerDatosGiro(id_usuario = 1) {
    try {
        const response = await fetch("http://localhost/tramites/dashboard/tramites-sjr/Api/principal/get_datos_giro", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_usuario }) // enviar el id en el body
        });

        const result = await response.json();
        
        if (result.success && result.dictamen) { // Cambio de "suelo" a "dictamen"
           // console.log("Datos del dictamen obtenidos:", result.dictamen);
            return result.dictamen; // Devuelve los datos del dictamen
        }

        return null; // Si no hay datos, devuelve null
    } catch (error) {
       // console.error("Error al obtener los datos del dictamen:", error);
        return null;
    }
}


