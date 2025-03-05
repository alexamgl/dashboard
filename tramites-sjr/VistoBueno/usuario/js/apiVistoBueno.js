async function RegistroFormVistoAPI() {
    const apiUrl = 'http://localhost/tramites/dashboard/tramites-sjr/Api/principal/insert_full_visto_data';
    let data = {};

    try {
        // Obtener el riesgo determinado
        const nivelRiesgo = determinarNivelRiesgo();

        // Recolectar datos del formulario
        data = {
            id_usuario: 1, // Asegúrate de modificar esto dinámicamente si es necesario
            denomComer: document.getElementById("denomComer").value,
            giro: document.getElementById("giro").value,
            apertura: document.getElementById("apertura").value,
            cierre: document.getElementById("cierre").value,
            domicilio: document.getElementById("domicilio").value,
            telefono: document.getElementById("telefono").value,
            correo: document.getElementById("correo").value,
            codigoPostal: document.getElementById("codigoPostal").value,
            colonia: document.getElementById("colonia").value,
            calle: document.getElementById("calle").value,
            numeroExterior: document.getElementById("numeroExterior").value,
            numeroInterior: document.getElementById("numeroInterior").value,
            latitud: document.getElementById("latitud").value,
            longitud: document.getElementById("longitud").value,
            tipoRiesgo: nivelRiesgo  // Asigna el valor del riesgo determinado
        };
        

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


async function subirDocumentosVistoBueno(id_usuario) {
    // Determinar el nivel de riesgo
    const tipoRiesgo = determinarNivelRiesgo();
    let tablaId = "";

    // Seleccionar la tabla según el tipo de riesgo
    if (tipoRiesgo === "Bajo") {
        tablaId = "tablariesgoBajo";
    } else if (tipoRiesgo === "Medio") {
        tablaId = "tablariesgoMedio";
    } else {
        tablaId = "tablariesgoAlto";
    }

    const filas = document.querySelectorAll(`#${tablaId} tbody tr`);
    const formData = new FormData();
    formData.append("id_usuario", id_usuario);
    formData.append("tipoRiesgo", tipoRiesgo);

    let documentos = [];
    let nombres = [];

    filas.forEach(fila => {
        const inputFile = fila.querySelector("input[type='file']");
        const nombreDocumento = fila.querySelector("td:nth-child(2)").textContent.trim();

        if (inputFile && inputFile.files.length > 0) {
            documentos.push(inputFile.files[0]);
            nombres.push(nombreDocumento);
        }
    });

    if (documentos.length === 0) {
        console.error("No se seleccionaron documentos.");
        return false;
    }

    // Agregar los archivos al FormData
    documentos.forEach((doc, index) => {
        formData.append("files[]", doc);
        formData.append("nombres[]", nombres[index]);
    });

    try {
        const response = await fetch("http://localhost/tramites/dashboard/tramites-sjr/Api/principal/insert_full_visto_docs", {
            method: "POST",
            body: formData,
        });

        const result = await response.json();
        if (result.mensaje) {
            console.log("Archivos subidos correctamente:", result);
            return true;
        } else {
            console.error("Error al subir documentos:", result);
            return false;
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        return false;
    }
}


