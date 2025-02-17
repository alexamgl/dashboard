function validarCamposPasoActual(formStep) {
    const inputs = formStep.querySelectorAll("input, select, input[type='file']"); // Incluir archivos en la validación
    let todosValidos = true;

    // Almacenar los grupos de radios ya validados para evitar múltiples validaciones
    let radiosValidados = new Set();

    inputs.forEach((input) => {
        const id = input.id;
        const name = input.name;
        let esValido = true; // Suponer que el campo es válido inicialmente

        if (input.type === "radio") {
            // Validar radio solo si su grupo aún no ha sido validado
            if (!radiosValidados.has(name)) {
                esValido = validarRadioGrupo(name, input.closest("div").id);
                radiosValidados.add(name);
            }
        } else if (input.type === "file") {
            // Validar archivos solo si la fila tiene la clase 'required-file'
            const fila = input.closest("tr"); 
            const esRequerido = fila && fila.classList.contains("required-file");

            if (esRequerido && !input.files.length) {
                esValido = false;
            }
        } else {
            if (id) {
                // Validar con 'oninput' si está presente
                if (input.hasAttribute("oninput")) {
                    const funcionValidar = input.getAttribute("oninput").match(/([a-zA-Z]+)\(/);
                    if (funcionValidar && typeof window[funcionValidar[1]] === "function") {
                        esValido = window[funcionValidar[1]](id);
                    }
                }

                // Validar con 'onchange' si está presente
                if (input.hasAttribute("onchange")) {
                    const funcionValidar = input.getAttribute("onchange").match(/([a-zA-Z]+)\(/);
                    if (funcionValidar && typeof window[funcionValidar[1]] === "function") {
                        esValido = window[funcionValidar[1]](id);
                    }
                }

                // Validar campos requeridos
                if (input.hasAttribute("required") && input.value.trim() === "") {
                    esValido = false;
                }
            }
        }

        // Aplicar clases de validación
        if (!esValido) {
            input.classList.add("invalid");
            todosValidos = false;
        } else {
            input.classList.remove("invalid");
        }
    });

    return todosValidos;
}



// Función para marcar un input como inválido (rojo)
function marcarInvalido(input) {
    input.classList.add("invalid");
    input.style.border = "2px solid red"; // Resalta en rojo
}

// Función para quitar la marca de inválido
function quitarInvalido(input) {
    input.classList.remove("invalid");
    input.style.border = ""; // Regresa al estilo normal
}



function mostrarModalValidarCampos() {
    const modal = document.getElementById("modalValidarCampos");
    modal.style.display = "flex"; // Mostrar el modal

    // Cerrar modal al hacer clic en el botón "Entendido"
    document.getElementById("cerrarModalValidar").addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Cerrar modal al hacer clic en la "X"
    document.querySelector(".close-modal-validar").addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Cerrar modal si el usuario hace clic fuera del contenido
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
}

//####################################################################################################
//########################################VALIDACIONES DE LOS INPUTS#############################################
//####################################################################################################

//funcion que valida el campo de superficie de terreno
// Función que valida solo números
function validarSoloNumeros(inputId) {
    const input = document.getElementById(inputId);
    let esValido = false;

    // Eliminar todo lo que no sea número
    input.value = input.value.replace(/[^0-9]/g, '');

    // Validar que el campo no esté vacío
    if (input.value.trim() !== "") {
        esValido = true; // Si el valor no está vacío y solo contiene números, es válido
        input.classList.remove("invalid"); // Eliminar la clase 'invalid'
    } else {
        input.classList.add("invalid"); // Si está vacío o no tiene solo números, añadir la clase 'invalid'
    }

    return esValido; // Retorna si es válido o no
}


//funcion que valida el campo de clave catastral
function validarClaveCatastral(inputId) {
    const input = document.getElementById(inputId);
    input.value = input.value.toUpperCase().replace(/[^A-Z0-9]/g, ''); // Convertir a mayúsculas y eliminar caracteres no permitidos

    if (input.value.trim() !== "") {
        input.classList.remove("invalid");
        return true; // Validación exitosa
    } else {
        input.classList.add("invalid");
        return false; // No es válido
    }
}

//funcion que valida el campo de razon social
function validarRazonSocial(inputId) {
    const input = document.getElementById(inputId);
    input.value = input.value.toUpperCase().replace(/[^A-Z .]/g, ''); // Convertir a mayúsculas y eliminar caracteres no permitidos

    if (input.value.trim() !== "") {
        input.classList.remove("invalid");
        return true; // Validación exitosa
    } else {
        input.classList.add("invalid");
        return false; // No es válido
    }
}

//funcion que valida los nombres y apellidos
function validarNombreApellido(inputId) {
    const input = document.getElementById(inputId);
    input.value = input.value.toUpperCase().replace(/[^A-Z ]/g, '') // Convertir a mayúsculas y eliminar caracteres no permitidos
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ''); // Eliminar acentos

    if (input.value.trim() !== "") {
        input.classList.remove("invalid");
        return true; // Validación exitosa
    } else {
        input.classList.add("invalid");
        return false; // No es válido
    }
}


//funcion que valida el numero de telefono
function validarTelefono(inputId) {
    const input = document.getElementById(inputId);

    // Eliminar cualquier carácter que no sea número
    input.value = input.value.replace(/[^0-9]/g, '');

    // Limitar a 10 dígitos
    if (input.value.length > 10) {
        input.value = input.value.slice(0, 10); // Si hay más de 10 dígitos, corta a 10
    }

    // Validar que tenga exactamente 10 dígitos
    if (input.value.length === 10) {
        input.classList.remove("invalid"); // Si es válido, eliminar la clase 'invalid'
        return true; // Validación exitosa
    } else {
        input.classList.add("invalid"); // Si no es válido, agregar la clase 'invalid'
        return false; // No es válido
    }
}

//funcion que valida el email
function validarCorreo(inputId) {
    const input = document.getElementById(inputId);
    
    // Convertir el valor del input a mayúsculas y asegurarse de que no escriba en minúsculas
    input.value = input.value.toUpperCase();

    const regexCorreo = /^[A-Z0-9._-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/; // Expresión regular adaptada a mayúsculas

    // Verificar si el correo cumple con el formato
    if (regexCorreo.test(input.value)) {
        input.classList.remove("invalid"); // Si es válido, eliminar la clase 'invalid'
        return true; // Validación exitosa
    } else {
        input.classList.add("invalid"); // Si no es válido, agregar la clase 'invalid'
        return false; // No es válido
    }
}

//funcion que valida el codigo postal 
function validarCodigoPostal(inputId) {
    const input = document.getElementById(inputId);
    let esValido = false;

    // Eliminar cualquier carácter que no sea número
    input.value = input.value.replace(/[^0-9]/g, '');

    // Validar que tenga exactamente 5 dígitos
    if (input.value.length === 5) {
        esValido = true; // Si tiene 5 dígitos, es válido
        input.classList.remove("invalid"); // Eliminar la clase 'invalid' si es válido
    } else {
        input.classList.add("invalid"); // Añadir la clase 'invalid' si no tiene 5 dígitos
    }

    return esValido; // Retorna si es válido o no
}

//funcion que valida las colonias
function validarColonia(inputId) {
    const input = document.getElementById(inputId);
    let esValido = false;

    // Convertir el valor a mayúsculas y eliminar caracteres no permitidos
    input.value = input.value.toUpperCase().replace(/[^A-Z ]/g, '');

    // Verificar que el campo no esté vacío
    if (input.value.trim() !== "") {
        esValido = true; // Si tiene texto válido
        input.classList.remove("invalid"); // Eliminar clase 'invalid' si es válido
    } else {
        input.classList.add("invalid"); // Añadir clase 'invalid' si no tiene texto
    }

    return esValido; // Retorna si es válido o no
}

//funcion que valida las calles
function validarCalle(inputId) {
    const input = document.getElementById(inputId);
    let esValido = false;

    // Convertir el valor a mayúsculas y eliminar caracteres no permitidos
    input.value = input.value.toUpperCase().replace(/[^A-Z0-9\s.-]/g, '');

    // Verificar que el campo no esté vacío
    if (input.value.trim() !== "") {
        esValido = true; // Si tiene texto válido
        input.classList.remove("invalid"); // Eliminar la clase 'invalid' si es válido
    } else {
        input.classList.add("invalid"); // Añadir la clase 'invalid' si no tiene texto
    }

    return esValido; // Retorna si es válido o no
}

//funcion que valida el numero exterior
function validarNumeroExterior(inputId) {
    const input = document.getElementById(inputId);
    let esValido = false;

    // Convertir el valor a mayúsculas y eliminar caracteres no permitidos (números, letras, guiones, barras)
    input.value = input.value.toUpperCase().replace(/[^A-Z0-9\/-]/g, '');

    // Verificar que el campo no esté vacío
    if (input.value.trim() !== "") {
        esValido = true; // Si tiene texto válido
        input.classList.remove("invalid"); // Eliminar la clase 'invalid' si es válido
    } else {
        input.classList.add("invalid"); // Añadir la clase 'invalid' si no tiene texto
    }

    return esValido; // Retorna si es válido o no
}

//funcion que valida el numero interior
function validarNumeroInterior(inputId) {
    const input = document.getElementById(inputId);
    let esValido = true; // Por defecto lo marcamos como válido

    // Convertir el valor a mayúsculas y eliminar caracteres no permitidos (números, letras, guiones, barras)
    input.value = input.value.toUpperCase().replace(/[^A-Z0-9\/-]/g, '');

    // Verificar si el campo tiene valor
    if (input.value.trim() === "") {
        esValido = true; // Si está vacío, lo consideramos válido, ya que no es obligatorio
        input.classList.remove("invalid"); // No agregamos la clase 'invalid' si es vacío
    } else {
        esValido = true; // Si tiene valor, es válido
        input.classList.remove("invalid"); // Aseguramos que se elimine 'invalid'
    }

    return esValido; // Retorna si es válido o no
}

//funcion para validar la descripcion de la atividad
function validarDescripcion (inputId) {
    const input = document.getElementById(inputId);
    let esValido = false;

    // Convertir el valor a mayúsculas y eliminar caracteres no permitidos (letras, números, espacios, puntos y guiones)
    input.value = input.value.toUpperCase().replace(/[^A-Z0-9\s.-]/g, '');

    // Verificar que el campo no esté vacío
    if (input.value.trim() !== "") {
        esValido = true; // Si tiene texto válido
        input.classList.remove("invalid"); // Eliminar la clase 'invalid' si es válido
    } else {
        input.classList.add("invalid"); // Añadir la clase 'invalid' si no tiene texto
    }

    return esValido; // Retorna si es válido o no
}

//funcion que valida que alguna opcion este seleccionada del grupo de radios
function validarRadioGrupo(inputName, containerId) {
    const radios = document.getElementsByName(inputName);
    let esValido = false;

    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            esValido = true;
            break; // Si encuentra uno seleccionado, detiene el bucle
        }
    }

    const container = document.getElementById(containerId);
    if (esValido) {
        container.classList.remove("invalid");
    } else {
        container.classList.add("invalid");
    }

    return esValido;
}




