document.addEventListener("DOMContentLoaded", function () {
    const documentosGenerales = [
        { nombre: "Identificación Oficial", descripcion: "Copia de la identificación oficial del propietario o representantes." },
        { nombre: "Escritura o Título de Propiedad", descripcion: "Documento completo inscrito en el Registro Público." },
        { nombre: "Anteproyecto o Proyecto", descripcion: "Señalar predio, áreas ocupadas y estacionamiento." },
        { nombre: "Recibo de Pago del Impuesto Predial", descripcion: "Comprobante del ejercicio fiscal en curso." },
        { nombre: "Fotografías del Predio", descripcion: "Imágenes desde la vía pública mostrando la fachada." },
        { nombre: "Pago de Ingreso del Trámite", descripcion: "Pago inicial del trámite, tomará en cuenta al monto total." }
    ];

    const documentosCondicionales = [
        { nombre: "Dictamen de Uso de Suelo", descripcion: "Copia en caso de ratificación, modificación o revisión." },
        { nombre: "Acta Constitutiva", descripcion: "(Solo en caso de ser persona Moral) Documento que acredite al representante legal o apoderado." },
        { nombre: "Visto Bueno de la Asociación de Condóminos", descripcion: "Solo en caso de predios bajo régimen de condominio." }
    ];

    const documentosEspecificos = [
        { nombre: "Formulario de Inducción", descripcion: "(Para usos industriales)Formulario de la Secretaría de Desarrollo Sustentable." },
        { nombre: "Autorización ASEA o CRE", descripcion: "Autorización en materia ambiental y social." }
    ];

    // Lista de documentos requeridos
    const documentosRequeridos = [
        "Identificación Oficial",
        "Escritura o Título de Propiedad",
        "Recibo de Pago del Impuesto Predial",
        "Pago de Ingreso del Trámite"
    ];

    function cargarDocumentos(tablaId, documentos) {
        const tabla = document.getElementById(tablaId).querySelector("tbody");
        tabla.innerHTML = "";

        documentos.forEach((doc) => {
            const row = document.createElement("tr");

            // Si el documento está en la lista de requeridos, agregar la clase 'required-file'
            if (documentosRequeridos.includes(doc.nombre)) {
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

    // Cargar documentos
    cargarDocumentos("tablaDocsGenerales", documentosGenerales);
    cargarDocumentos("tablaDocsCondicionales", documentosCondicionales);
    cargarDocumentos("tablaDocsEspecificos", documentosEspecificos);
});

// Seleccionar archivo
function seleccionarArchivo(event, button) {
    event.preventDefault(); // Evita que el formulario se envíe
    const input = button.nextElementSibling.nextElementSibling;
    input.click();
}

// Cargar archivo
function cargarArchivo(event, input) {
    const archivo = event.target.files[0];
    if (archivo && archivo.type === "application/pdf") {
        const tamañoKB = (archivo.size / 1024).toFixed(2) + " KB";
        const fila = input.closest("tr");
        const pesoArchivo = fila.querySelector(".pesoArchivo");
        const viewIcon = fila.querySelector(".view-icon");

        fila.dataset.pdfURL = URL.createObjectURL(archivo);
        pesoArchivo.textContent = tamañoKB;
        viewIcon.style.display = "inline-block";
    } else {
        alert("Sube un archivo PDF válido.");
        input.value = "";
    }
}

// Ver PDF
function verPDF(icon) {
    const fila = icon.closest("tr");
    const pdfURL = fila.dataset.pdfURL;
    if (pdfURL) {
        window.open(pdfURL, "_blank");
    } else {
        alert("No hay archivo disponible.");
    }
}

// Eliminar archivo
function eliminarArchivo(event, button) {
    event.preventDefault(); // Evita que el formulario se envíe
    const fila = button.closest("tr");
    const inputArchivo = fila.querySelector("input[type='file']");
    fila.dataset.pdfURL = "";
    fila.querySelector(".pesoArchivo").textContent = "Bytes";
    fila.querySelector(".view-icon").style.display = "none";
    inputArchivo.value = "";
}
