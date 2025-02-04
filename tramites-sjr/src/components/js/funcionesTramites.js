console.log('ARCHIVO FUNCIONES TRAMITES CARGADO')
function validarCURP(inputId) {
    const input = document.getElementById(inputId);

    // expresión regular progresiva para validar la estructura paso a paso
    const regexEstructura = [
        /^[A-Z]{0,4}$/,                 // las primeras 4 letras
        /^[A-Z]{4}\d{0,6}$/,            // 4 letras + hasta 6 números (fecha de nacimiento)
        /^[A-Z]{4}\d{6}[HM]?$/,         // género después de la fecha
        /^[A-Z]{4}\d{6}[HM][A-Z]{0,2}$/, // código de estado (2 letras)
        /^[A-Z]{4}\d{6}[HM][A-Z]{2}[A-Z]{0,3}$/, // consonantes internas (3 letras)
        /^[A-Z]{4}\d{6}[HM][A-Z]{2}[A-Z]{3}[A-Z]$/, // penúltimo carácter alfanumérico
        /^[A-Z]{4}\d{6}[HM][A-Z]{2}[A-Z]{3}[A-Z]\d$/ // último carácter numérico
    ];

    let esValido = false; // inicializar como no válido

    // verificar si el campo es obligatorio y está vacío
    if (input.hasAttribute("required") && input.value.trim() === "") {
        input.classList.add("invalid"); // resaltar el campo como inválido
        return false; // devolver inválido
    }

    input.addEventListener('input', () => {
        let valor = input.value.toUpperCase().replace(/[^A-Z0-9]/g, ""); // convertir a mayúsculas y eliminar caracteres no válidos
        let longitudValida = false; // controlar la longitud según la regla actual

        // validar progresivamente la estructura
        for (let i = 0; i < regexEstructura.length; i++) {
            const regex = regexEstructura[i];
            if (regex.test(valor)) {
                longitudValida = true; // cumple con la regla actual
                break;
            }
        }

        // si la longitud no es válida, revertir al último estado válido
        if (!longitudValida) {
            valor = valor.slice(0, -1); // eliminar el carácter excedente
        }

        input.value = valor; // actualizar el valor en el campo
        esValido = valor.length === 18 && regexEstructura[regexEstructura.length - 1].test(valor); // válido solo si tiene 18 caracteres completos
        input.classList.toggle("invalid", !esValido); // resaltar si es inválido
    });

    // validar el valor inicial (cuando la función se ejecuta por primera vez)
    const valorInicial = input.value.toUpperCase().replace(/[^A-Z0-9]/g, ""); // limpiar el valor inicial
    esValido = valorInicial.length === 18 && regexEstructura[regexEstructura.length - 1].test(valorInicial); // validar contra la última regla
    input.classList.toggle("invalid", !esValido); // resaltar si es inválido

    return esValido; // devolver true si es válido, false si no lo es
}



function ValidarNombres(inputId) {
    const input = document.getElementById(inputId);

    // expresión regular para letras mayúsculas, espacios y punto
    const regex = /^[A-Z .]*$/;

    let esValido = false; // inicializar como no válido

    // verificar si el campo es obligatorio y está vacío
    if (input.hasAttribute("required") && input.value.trim() === "") {
        input.classList.add("invalid"); // resaltar el campo como inválido
        return false; // devolver inválido
    }

    input.addEventListener('input', () => {
        const valor = input.value
            .toUpperCase() // convertir todo a mayúsculas
            .replace(/[^A-Z .]/g, ""); // remover caracteres no permitidos
        input.value = valor; // actualizar el valor en el campo
        esValido = regex.test(valor); // verificar si el valor cumple con la expresión regular
        input.classList.toggle("invalid", !esValido); // agregar/quitar clase de error
    });

    // validar el valor inicial
    const valor = input.value.toUpperCase().replace(/[^A-Z .]/g, ""); // limpiar el valor inicial
    esValido = regex.test(valor); // validar el valor inicial
    input.classList.toggle("invalid", !esValido); // agregar/quitar clase de error

    return esValido; // devolver si es válido
}


function ValidarLugarNacimiento(inputId) {
    const input = document.getElementById(inputId);

    // expresión regular para permitir solo letras mayúsculas y espacios
    const regex = /^[A-Z ]*$/;

    let esValido = false; // inicializar como no válido

    // verificar si el campo es obligatorio y está vacío
    if (input.hasAttribute("required") && input.value.trim() === "") {
        input.classList.add("invalid"); // resaltar el campo como inválido
        return false; // devolver inválido
    }

    // limpiar y validar el valor al perder el foco
    const valor = input.value
        .toUpperCase() // convertir todo a mayúsculas
        .replace(/[^A-Z ]/g, ""); // eliminar caracteres no permitidos
    input.value = valor; // actualizar el valor en el campo
    esValido = regex.test(valor); // verificar si cumple con la expresión regular
    input.classList.toggle("invalid", !esValido); // agregar/quitar clase de error

    return esValido; // devolver si es válido
}


function validarFechaNacimiento(inputId) {
    const input = document.getElementById(inputId);

    let esValido = false; // inicializar como no válido

    // detectar cambios mientras se selecciona una fecha
    input.addEventListener('input', () => {
        const valor = input.value; // obtener el valor actual
        esValido = validarFormatoFecha(valor) && validarRangoFechaNacimiento(valor); // validar formato y rango
        input.classList.toggle("invalid", !esValido); // agregar/quitar clase de error
    });

    // validar el valor inicial
    const valorInicial = input.value;
    esValido = validarFormatoFecha(valorInicial) && validarRangoFechaNacimiento(valorInicial); // validar el valor inicial
    input.classList.toggle("invalid", !esValido); // agregar/quitar clase de error

    return esValido; // devolver si es válido
}

////////////////////////Es una misma funcion/////////////////////////////////////////////////////////////
function validarFechaNacimiento(inputId) {
    const input = document.getElementById(inputId);

    let esValido = false; // inicializar como no válido

    // verificar si el campo es obligatorio y está vacío
    if (input.hasAttribute("required") && input.value.trim() === "") {
        input.classList.add("invalid"); // resaltar el campo como inválido
        return false; // devolver inválido
    }

    // verificar el formato de la fecha (yyyy-mm-dd)
    const valor = input.value.trim();
    if (!validarFormatoFecha(valor)) {
        input.classList.add("invalid"); // resaltar el campo como inválido
        return false; // devolver inválido
    }

    // verificar el rango de la fecha de nacimiento
    if (!validarRangoFechaNacimiento(valor)) {
        input.classList.add("invalid"); // resaltar el campo como inválido
        return false; // devolver inválido
    }

    // si todo es válido, quitar cualquier marca de error
    input.classList.remove("invalid");
    esValido = true; // marcar como válido
    return esValido;
}

// función auxiliar para verificar el formato de la fecha (yyyy-mm-dd)
function validarFormatoFecha(fecha) {
    const regexFecha = /^\d{4}-\d{2}-\d{2}$/; // formato yyyy-mm-dd
    return regexFecha.test(fecha); // devolver true si cumple el formato
}

// función auxiliar para verificar el rango de la fecha de nacimiento
function validarRangoFechaNacimiento(fecha) {
    const fechaActual = new Date(); // obtener la fecha actual
    const fechaSeleccionada = new Date(fecha);

    // verificar que no sea una fecha futura
    if (fechaSeleccionada > fechaActual) return false;

    // verificar que la edad sea razonable (0 a 120 años)
    const edadMinima = 0; // recién nacido
    const edadMaxima = 120; // edad máxima permitida
    const diferenciaAnios = fechaActual.getFullYear() - fechaSeleccionada.getFullYear();

    return diferenciaAnios >= edadMinima && diferenciaAnios <= edadMaxima;
}
//////////////////////////////////////////////////////////////////////////////////////////////7


function validarCalle(inputId) {
    const input = document.getElementById(inputId);

    // expresión regular para letras mayúsculas, números, espacios, puntos, guiones y diagonales
    const regex = /^[A-Z0-9 .\/-]*$/;

    let esValido = false; // inicializar como no válido

    // verificar si el campo es obligatorio y está vacío
    if (input.hasAttribute("required") && input.value.trim() === "") {
        input.classList.add("invalid"); // resaltar el campo como inválido
        return false; // devolver inválido
    }

    input.addEventListener('input', () => {
        const valor = input.value
            .toUpperCase() // convertir a mayúsculas
            .replace(/[^A-Z0-9 .\/-]/g, ""); // eliminar caracteres no permitidos
        input.value = valor; // actualizar el valor en el campo
        esValido = regex.test(valor); // verificar si cumple con la expresión regular
        input.classList.toggle("invalid", !esValido); // agregar/quitar clase de error
    });

    // validar el valor inicial
    const valor = input.value.toUpperCase().replace(/[^A-Z0-9 .\/-]/g, ""); // limpiar el valor inicial
    esValido = regex.test(valor); // validar el valor inicial
    input.classList.toggle("invalid", !esValido); // agregar/quitar clase de error

    return esValido; // devolver si es válido
}



function validarNumeroCasa(inputId) {
    const input = document.getElementById(inputId);

    // expresión regular para permitir letras mayúsculas, números, guiones y diagonales
    const regex = /^[A-Z0-9\/-]*$/;

    let esValido = false; // inicializar como no válido

    // verificar si el campo es obligatorio y está vacío
    if (input.hasAttribute("required") && input.value.trim() === "") {
        input.classList.add("invalid"); // resaltar el campo como inválido
        return false; // devolver inválido
    }

    input.addEventListener('input', () => {
        const valor = input.value
            .toUpperCase() // convertir a mayúsculas
            .replace(/[^A-Z0-9\/-]/g, ""); // eliminar caracteres no permitidos
        input.value = valor; // actualizar el valor en el campo
        esValido = regex.test(valor); // verificar si cumple con la expresión regular
        input.classList.toggle("invalid", !esValido); // agregar/quitar clase de error
    });

    // validar el valor inicial
    const valor = input.value.toUpperCase().replace(/[^A-Z0-9\/-]/g, ""); // limpiar el valor inicial
    esValido = regex.test(valor); // validar el valor inicial
    input.classList.toggle("invalid", !esValido); // agregar/quitar clase de error

    return esValido; // devolver si es válido
}



function validarColonias(inputId) {
    const input = document.getElementById(inputId);

    // expresión regular para permitir letras mayúsculas, números, espacios, puntos y guiones
    const regex = /^[A-Z0-9 .-]*$/;

    let esValido = false; // inicializar como no válido

    // verificar si el campo es obligatorio y está vacío
    if (input.hasAttribute("required") && input.value.trim() === "") {
        input.classList.add("invalid"); // resaltar el campo como inválido
        return false; // devolver inválido
    }

    input.addEventListener('input', () => {
        const valor = input.value
            .toUpperCase() // convertir a mayúsculas
            .replace(/[^A-Z0-9 .-]/g, ""); // eliminar caracteres no permitidos
        input.value = valor; // actualizar el valor en el campo
        esValido = regex.test(valor); // verificar si cumple con la expresión regular
        input.classList.toggle("invalid", !esValido); // agregar/quitar clase de error
    });

    // validar el valor inicial
    const valor = input.value.toUpperCase().replace(/[^A-Z0-9 .-]/g, ""); // limpiar el valor inicial
    esValido = regex.test(valor); // validar el valor inicial
    input.classList.toggle("invalid", !esValido); // agregar/quitar clase de error

    return esValido; // devolver si es válido
}



function validarMunicipio(inputId) {
    const input = document.getElementById(inputId);

    // expresión regular para permitir letras mayúsculas, números, espacios, puntos y guiones
    const regex = /^[A-Z0-9 .-]*$/;

    let esValido = false; // inicializar como no válido

    // verificar si el campo es obligatorio y está vacío
    if (input.hasAttribute("required") && input.value.trim() === "") {
        input.classList.add("invalid"); // resaltar el campo como inválido
        return false; // devolver inválido
    }

    // detectar cambios mientras se escribe
    input.addEventListener('input', () => {
        const valor = input.value
            .toUpperCase() // convertir a mayúsculas
            .replace(/[^A-Z0-9 .-]/g, ""); // eliminar caracteres no permitidos
        input.value = valor; // actualizar el valor en el campo
        esValido = regex.test(valor); // verificar si cumple con la expresión regular
        input.classList.toggle("invalid", !esValido); // agregar/quitar clase de error
    });

    // validar el valor inicial
    const valor = input.value.toUpperCase().replace(/[^A-Z0-9 .-]/g, ""); // limpiar el valor inicial
    esValido = regex.test(valor); // validar el valor inicial
    input.classList.toggle("invalid", !esValido); // agregar/quitar clase de error

    return esValido; // devolver si es válido
}



function validarTelefono(inputId) {
    const input = document.getElementById(inputId);

    let esValido = false; // inicializar como no válido

    // verificar si el campo es obligatorio y está vacío
    if (input.hasAttribute("required") && input.value.trim() === "") {
        input.classList.add("invalid"); // resaltar el campo como inválido
        return false; // devolver inválido
    }

    // detectar cambios mientras se escribe
    input.addEventListener('input', () => {
        const valor = input.value
            .replace(/[^0-9]/g, "") // eliminar caracteres no numéricos
            .slice(0, 10); // limitar a 10 caracteres
        input.value = valor; // actualizar el valor en el campo
        esValido = valor.length === 10; // verificar si el número tiene exactamente 10 dígitos
        input.classList.toggle("invalid", !esValido); // agregar/quitar clase de error
    });

    // validar el valor inicial
    const valor = input.value.replace(/[^0-9]/g, "").slice(0, 10); // limpiar el valor inicial
    esValido = valor.length === 10; // validar si el número tiene exactamente 10 dígitos
    input.classList.toggle("invalid", !esValido); // agregar/quitar clase de error

    return esValido; // devolver si es válido
}



function validarSelect(inputId) {
    const select = document.getElementById(inputId);

    let esValido = true; // inicializar como válido

    // verificar si el valor seleccionado es inválido (vacío o "hide")
    if (select.value === "" || select.value === "hide") {
        esValido = false; // marcar como inválido
        select.classList.add("invalid"); // resaltar el campo como inválido
    } else {
        select.classList.remove("invalid"); // quitar el resaltado de error si es válido
    }

    return esValido; // devolver si es válido
}




function validarNombreInstitucion(inputId) {
    const input = document.getElementById(inputId);

    // expresión regular para permitir letras mayúsculas, números, espacios, puntos y caracteres especiales específicos
    const regex = /^[A-Z0-9 .&\/-]*$/;

    let esValido = false; // inicializar como no válido

    // verificar si el campo es obligatorio y está vacío
    if (input.hasAttribute("required") && input.value.trim() === "") {
        input.classList.add("invalid"); // resaltar el campo como inválido
        return false; // devolver inválido
    }

    // detectar cambios mientras se escribe
    input.addEventListener('input', () => {
        const valor = input.value
            .toUpperCase() // convertir todo a mayúsculas
            .replace(/[^A-Z0-9 .&\/-]/g, ""); // eliminar caracteres no permitidos
        input.value = valor; // actualizar el valor en el campo
        esValido = regex.test(valor); // verificar si cumple con la expresión regular
        input.classList.toggle("invalid", !esValido); // agregar/quitar clase de error
    });

    // validar el valor inicial
    const valor = input.value.toUpperCase().replace(/[^A-Z0-9 .&\/-]/g, ""); // limpiar el valor inicial
    esValido = regex.test(valor); // validar si cumple con la expresión regular
    input.classList.toggle("invalid", !esValido); // agregar/quitar clase de error

    return esValido; // devolver si es válido
}



function validarPromedioEstudiante(inputId) {
    const input = document.getElementById(inputId);

    let esValido = false; // inicializar como no válido

    // verificar si el campo es obligatorio y está vacío
    if (input.hasAttribute("required") && input.value.trim() === "") {
        input.classList.add("invalid"); // resaltar el campo como inválido
        return false; // devolver inválido
    }

    // detectar cambios mientras se escribe
    input.addEventListener('input', () => {
        input.value = input.value
            .replace(/[^0-9.]/g, "") // eliminar caracteres no válidos
            .replace(/(\..*?)\./g, ".") // permitir solo un punto
            .replace(/^(\d?\.\d?).*/, "$1"); // limitar a un dígito, punto y otro dígito

        // validar que el número esté en el rango 0.0 a 10.0
        const valor = parseFloat(input.value);

        if (valor > 10) {
            input.value = "10"; // forzar al máximo permitido
        } else if (valor < 0) {
            input.value = "0"; // forzar al mínimo permitido
        }

        esValido = /^([0-9](\.[0-9])?|10)$/.test(input.value); // verificar si el valor cumple con el formato
        input.classList.toggle("invalid", !esValido); // agregar/quitar clase de error
    });

    // detectar cuando pierde el foco para limpiar entradas incompletas
    input.addEventListener('blur', () => {
        if (!/^([0-9](\.[0-9])?|10)$/.test(input.value)) {
            input.value = ""; // limpiar si el formato no es válido
            esValido = false; // marcar como inválido
        } else {
            esValido = true; // marcar como válido si cumple el formato
        }
        input.classList.toggle("invalid", !esValido); // agregar/quitar clase de error
    });

    // validar el valor inicial
    const valorInicial = parseFloat(input.value);
    esValido = /^([0-9](\.[0-9])?|10)$/.test(input.value) && valorInicial >= 0 && valorInicial <= 10; // validar el valor inicial
    input.classList.toggle("invalid", !esValido); // agregar/quitar clase de error

    return esValido; // devolver si es válido
}




function validarOcupacionTutor(inputId) {
    const input = document.getElementById(inputId);

    // expresión regular para letras mayúsculas, espacios, puntos y guiones
    const regex = /^[A-Z .-]*$/;

    let esValido = false; // inicializar como no válido

    // verificar si el campo es obligatorio y está vacío
    if (input.hasAttribute("required") && input.value.trim() === "") {
        input.classList.add("invalid"); // resaltar el campo como inválido
        return false; // devolver inválido
    }

    // detectar cambios mientras se escribe
    input.addEventListener('input', () => {
        const valor = input.value
            .toUpperCase() // convertir todo a mayúsculas
            .replace(/[^A-Z .-]/g, ""); // eliminar caracteres no permitidos
        input.value = valor; // actualizar el valor en el campo
        esValido = regex.test(valor); // verificar si cumple con la expresión regular
        input.classList.toggle("invalid", !esValido); // agregar/quitar clase de error
    });

    // validar el valor inicial
    const valorInicial = input.value.toUpperCase().replace(/[^A-Z .-]/g, ""); // limpiar el valor inicial
    esValido = regex.test(valorInicial); // validar el valor inicial
    input.classList.toggle("invalid", !esValido); // agregar/quitar clase de error

    return esValido; // devolver si es válido
}



function validarNumeroPersonasHabitan(inputId) {
    const input = document.getElementById(inputId);

    let esValido = false; // inicializar como no válido

    // verificar si el campo es obligatorio y está vacío
    if (input.hasAttribute("required") && input.value.trim() === "") {
        input.classList.add("invalid"); // resaltar el campo como inválido
        return false; // devolver inválido
    }

    // detectar cambios mientras se escribe
    input.addEventListener('input', () => {
        const valor = input.value
            .replace(/[^0-9]/g, "") // eliminar caracteres no numéricos
            .slice(0, 2); // limitar a 2 caracteres
        input.value = valor; // actualizar el valor en el campo
        esValido = /^[0-9]{1,2}$/.test(valor); // verificar si cumple con la expresión regular
        input.classList.toggle("invalid", !esValido); // agregar/quitar clase de error
    });

    // validar el valor inicial
    const valorInicial = input.value.replace(/[^0-9]/g, "").slice(0, 2); // limpiar el valor inicial
    esValido = /^[0-9]{1,2}$/.test(valorInicial); // validar si cumple con la expresión regular
    input.classList.toggle("invalid", !esValido); // agregar/quitar clase de error

    return esValido; // devolver si es válido
}



function validarIngresoMensualFamiliar(inputId) {
    const input = document.getElementById(inputId);

    let esValido = false; // inicializar como no válido

    // verificar si el campo es obligatorio y está vacío
    if (input.hasAttribute("required") && input.value.trim() === "") {
        input.classList.add("invalid"); // resaltar el campo como inválido
        return false; // devolver inválido
    }

    // detectar cambios mientras se escribe
    input.addEventListener('input', () => {
        const valor = input.value.replace(/[^0-9]/g, ""); // eliminar cualquier carácter no numérico
        input.value = valor; // actualizar el valor en el campo
        esValido = /^[0-9]+$/.test(valor) && valor.length > 0; // verificar si el valor es numérico y no está vacío
        input.classList.toggle("invalid", !esValido); // agregar/quitar clase de error
    });

    // validar el valor inicial
    const valorInicial = input.value.replace(/[^0-9]/g, ""); // limpiar el valor inicial
    esValido = /^[0-9]+$/.test(valorInicial) && valorInicial.length > 0; // validar si cumple con la expresión regular
    input.classList.toggle("invalid", !esValido); // agregar/quitar clase de error

    return esValido; // devolver si es válido
}

function validarUnRadio(inputId) {
    const radio = document.getElementById(inputId);
    let esValido = false; // inicializar como no válido

    // verificar si el radio está seleccionado
    if (radio.checked) {
        esValido = true; // marcar como válido
        radio.classList.remove("invalid"); // quitar resaltado de error
    } else {
        radio.classList.add("invalid"); // resaltar el campo como inválido
    }

    return esValido; // devolver true si está seleccionado, false si no
}

//******************************************************************************************************************************** */
//***************************************FUNCION PARA VALIDACIONES DE LOS CAMPOS EN EL PASO ACTUAL********************************** */
//*********************************************************************************************************************************** */
function validarCamposPasoActual(formStep) {
    const inputs = formStep.querySelectorAll("input, select"); // seleccionar todos los inputs y selects visibles
    let todosValidos = true; // inicializar como válidos

    inputs.forEach((input) => {
        const id = input.id;

        if (id) {
            let esValido = true; // suponer que el campo es válido inicialmente

            // validar inputs con oninput
            if (input.hasAttribute("oninput")) {
                const funcionValidar = input.getAttribute("oninput").match(/([a-zA-Z]+)\(/);
                if (funcionValidar && typeof window[funcionValidar[1]] === "function") {
                    esValido = window[funcionValidar[1]](id); // llamar la función de validación
                }
            }

            // validar selects con onchange
            if (input.hasAttribute("onchange")) {
                const funcionValidar = input.getAttribute("onchange").match(/([a-zA-Z]+)\(/);
                if (funcionValidar && typeof window[funcionValidar[1]] === "function") {
                    esValido = window[funcionValidar[1]](id); // llamar la función de validación
                }
            }

            // verificar campos requeridos y vacíos
            if (input.hasAttribute("required") && input.value.trim() === "") {
                esValido = false;
                input.classList.add("invalid");
            }

            if (!esValido) {
                todosValidos = false;
            } else {
                input.classList.remove("invalid");
            }
        }
    });

    // validar documentos en la tabla si existe
    const documentsTable = formStep.querySelector("#documentsTable");
    if (documentsTable) {
        const fileInputs = documentsTable.querySelectorAll("input[type='file']");
        fileInputs.forEach((input) => {
            if (!input.files || input.files.length === 0) {
                todosValidos = false;
                input.parentElement.classList.add("invalid"); // resaltar la celda como inválida
            } else {
                input.parentElement.classList.remove("invalid"); // quitar el resaltado si es válido
            }
        });
    }

    return todosValidos; // devolver true si todo es válido
}






