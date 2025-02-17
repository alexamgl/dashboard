
function procesarDocumento() {
    const input = document.getElementById("fileInput");
    const archivo = input.files[0];

    if (!archivo) {
        alert("Por favor, selecciona un archivo.");
        return;
    }

    const fileType = archivo.type;
    
    if (fileType === "application/pdf") {
        // Si es un PDF, lo convertimos en imagen usando pdf.js
        const reader = new FileReader();
        reader.onload = function(event) {
            const pdfData = new Uint8Array(event.target.result);
            pdfjsLib.getDocument({ data: pdfData }).promise.then(pdf => {
                pdf.getPage(1).then(page => {
                    const scale = 2;
                    const viewport = page.getViewport({ scale });
                    const canvas = document.getElementById("pdfCanvas");
                    const context = canvas.getContext("2d");

                    canvas.width = viewport.width;
                    canvas.height = viewport.height;

                    const renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    };

                    page.render(renderContext).promise.then(() => {
                        const imageData = canvas.toDataURL("image/png");
                        extraerTexto(imageData);
                    });
                });
            });
        };
        reader.readAsArrayBuffer(archivo);
    } else {
        // Si es una imagen, la convertimos en base64 y la procesamos con Tesseract.js
        const reader = new FileReader();
        reader.onload = function(event) {
            extraerTexto(event.target.result);
        };
        reader.readAsDataURL(archivo);
    }
}

function extraerTexto(imageData) {
    Tesseract.recognize(
        imageData,
        'spa', // Idioma español
        {
            logger: (m) => console.log(m) // Muestra el progreso en la consola
        }
    ).then(({ data: { text } }) => {
        console.log("Texto extraído:", text);

        const nombreUsuario = "Eduardo Gómez Luna Zavala"; // Nombre del usuario a comparar
        if (text.toLowerCase().includes(nombreUsuario.toLowerCase())) {
            document.getElementById("resultado").innerText = "✅ Nombre verificado correctamente.";
        } else {
            document.getElementById("resultado").innerText = "❌ El nombre no coincide con el acta.";
        }
    });
}
