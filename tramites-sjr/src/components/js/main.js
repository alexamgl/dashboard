
console.log("Archivo JavaScript cargado");
// Llamar a la función al cargar la página

let userData = {}; // Objeto global para almacenar los datos del usuario

document.addEventListener('DOMContentLoaded', () => {

});

document.addEventListener('DOMContentLoaded', loadCiudadanos);
document.addEventListener('DOMContentLoaded', loadTrabajadores);

function getRoleFromToken() {
    const token = localStorage.getItem('token');
    if (!token) {
        return null;
    }
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || 'user';
}

function displaySectionsBasedOnRole() {
    const role = getRoleFromToken();
    if (role === 'admin') {
        document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'block');
    } else if (role === 'trabajador' || role === 'ciudadano') {
        document.getElementById('mis-datos-section').style.display = 'block';
        document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
    } else {
        console.error("Rol desconocido o no permitido");
    }
}

document.addEventListener('DOMContentLoaded', displaySectionsBasedOnRole);

function logout() {
    localStorage.removeItem('token');
    window.location.href = '../../public/login.html';
}

function VerificaToken() {
    const Token = localStorage.getItem("token");
    if (Token) {
        const TokenSplit = Token.split(".");
        if (TokenSplit.length === 3) {
            //window.location.href = "login.html"
            const payload = JSON.parse(atob(TokenSplit[1]));
            console.log("Payload", payload);
        } else {
            console.error("Token invalido");
        }
    } else {
        console.error("Token no encontrado");
        window.location.href = "https://sanjuandelrio.gob.mx/tramites-sjr/public/login.html"
    }
}


function checkAuth() {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'https://sanjuandelrio.gob.mx/tramites-sjr/public/login.html';;
        return;
    }

    try {
        const payload = parseJwt(token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (payload.exp && payload.exp < currentTime) {
            alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
            localStorage.removeItem('token');
            window.location.href = 'https://sanjuandelrio.gob.mx/tramites-sjr/public/login.html';
        }
    } catch (e) {
        alert('Token inválido. Por favor, inicia sesión nuevamente.');
        localStorage.removeItem('token');
        window.location.href = 'https://sanjuandelrio.gob.mx/tramites-sjr/public/login.html';
    }
}

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}


function loadUserData() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'https://sanjuandelrio.gob.mx/tramites-sjr/public/login.html'; // Si no hay token, redirige al login
        return;
    }

    // Decodificar el token para obtener el id_usuario y el rol
    const decoded = JSON.parse(atob(token.split('.')[1]));
    const id_usuario = decoded.sub;
    const rol = decoded.role;

    // URL para obtener los datos del usuario
    const url = `/tramites-sjr/Api/principal/usuario_datos/${id_usuario}`;

    // Realizar la solicitud para obtener los datos del usuario
    fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                userData = data.data; // Guardar los datos del usuario en el objeto global
                userData.id_usuario = id_usuario; // Agregar ID del usuario desde el token
                userData.rol = rol; // Agregar rol del usuario desde el token

                // Mostrar los datos del usuario en la interfaz
                document.getElementById('user-info').innerHTML = `
                    <p><strong>Nombre Completo:</strong> ${userData.nombre_completo}</p>
                    <p><strong>Correo:</strong> ${userData.email || "No disponible"}</p>
                    <p><strong>Teléfono:</strong> ${userData.telefono || "No disponible"}</p>
                    <p><strong>Calle:</strong> ${userData.calle || "No disponible"}</p>
                    <p><strong>Asentamiento:</strong> ${userData.asentamiento || "No disponible"}</p>
                    <p><strong>Código Postal:</strong> ${userData.codigo_postal || "No disponible"}</p>
                `;

                // Llenar el formulario con los mismos datos
                document.getElementById('editNombre').value = userData.nombre || '';
                document.getElementById('editPrimApellido').value = userData.primer_apellido || '';
                document.getElementById('editSegApellido').value = userData.segundo_apellido || '';
                document.getElementById('editEmail').value = userData.email || '';
                document.getElementById('editTelefono').value = userData.telefono || '';
                document.getElementById('editCalle').value = userData.calle || '';
                document.getElementById('editAsentamiento').value = userData.asentamiento || '';
                document.getElementById('editNumExterior').value = userData.numero_exterior || '';
                document.getElementById('editNumInterior').value = userData.numero_interior || 'N/A';
                document.getElementById('editCP').value = userData.codigo_postal || '';

                // Mostrar campos adicionales si el usuario es un trabajador
                if (rol === 'trabajador') {
                    document.getElementById('trabajadorFields').style.display = 'block';
                    document.getElementById('editNoNomina').value = userData.no_nomina || '';
                    document.getElementById('editPuesto').value = userData.puesto || '';

                    // Establecer la opción seleccionada en el select
                    const departamentoSelect = document.getElementById('editDepartamento');
                    Array.from(departamentoSelect.options).forEach(option => {
                        if (option.value === userData.departamento) {
                            option.selected = true;
                        }
                    });
                    document.getElementById('editButton').style.display = 'block';
                } else {
                    document.getElementById('editButton').style.display = 'none';
                }
            } else {
                alert("Error al cargar los datos del usuario");
            }
        })
        .catch(error => console.error('Error:', error));
}


// Función para cargar ciudadanos y habilitar filtros
function loadCiudadanos() {
    fetch('https://sanjuandelrio.gob.mx/tramites-sjr/Api/principal/ciudadanos')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector("#ciudadanos-table tbody");
            const filterNombre = document.getElementById("filter-nombre-ciudadanos");
            const filterColonia = document.getElementById("filter-colonia-ciudadanos");
            const filterCP = document.getElementById("filter-cp-ciudadanos");
            const resultsCount = document.getElementById("results-ciudadanos");

            function applyFilter() {
                const nombreValue = filterNombre.value.toLowerCase();
                const coloniaValue = filterColonia.value.toLowerCase();
                const cpValue = filterCP.value.toLowerCase();

                tableBody.innerHTML = "";
                let count = 0;
                data.forEach(ciudadano => {
                    if (
                        (ciudadano.nombre_completo.toLowerCase().includes(nombreValue)) &&
                        (ciudadano.asentamiento.toLowerCase().includes(coloniaValue)) &&
                        (ciudadano.codigo_postal.toLowerCase().includes(cpValue))
                    ) {
                        const row = document.createElement("tr");
                        row.innerHTML = `
                <td>${ciudadano.nombre_completo}</td>
                <td>${ciudadano.curp_ciudadano}</td>
                <td>${ciudadano.fecha_nacimiento}</td>
                <td>${ciudadano.email}</td>
                <td>${ciudadano.telefono}</td>
                <td>${ciudadano.calle}</td>
                <td>${ciudadano.asentamiento}</td>
                <td>${ciudadano.numero_exterior}</td>
                <td>${ciudadano.codigo_postal}</td>`;
                        tableBody.appendChild(row);
                        count++;
                    }
                });
                resultsCount.textContent = `Registros encontrados: ${count}`;
            }

            filterNombre.addEventListener("input", applyFilter);
            filterColonia.addEventListener("input", applyFilter);
            filterCP.addEventListener("input", applyFilter);
            applyFilter();
        })
        .catch(error => console.error('Error al cargar los ciudadanos:', error));
}

// Función para cargar trabajadores y habilitar filtros
function loadTrabajadores() {
    fetch('https://sanjuandelrio.gob.mx/tramites-sjr/Api/principal/trabajadores')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector("#trabajadores-table tbody");
            const filters = {
                filterNombre: document.getElementById("filter-nombre-trabajadores"),
                filterColonia: document.getElementById("filter-colonia-trabajadores"),
                filterCP: document.getElementById("filter-cp-trabajadores"),
                filterGenero: document.getElementById("filter-genero-trabajadores"),
                filterDepartamento: document.getElementById("filter-departamento-trabajadores"),
                filterPuesto: document.getElementById("filter-puesto-trabajadores")
            };
            const resultsCount = document.getElementById("results-trabajadores");

            function applyFilter() {
                const values = {
                    nombre: filters.filterNombre.value.toLowerCase(),
                    colonia: filters.filterColonia.value.toLowerCase(),
                    cp: filters.filterCP.value.toLowerCase(),
                    genero: filters.filterGenero.value.toLowerCase(),
                    departamento: filters.filterDepartamento.value.toLowerCase(),
                    puesto: filters.filterPuesto.value.toLowerCase()
                };

                tableBody.innerHTML = "";
                let count = 0;
                data.forEach(trabajador => {
                    if (
                        (trabajador.nombre_completo.toLowerCase().includes(values.nombre)) &&
                        (trabajador.asentamiento.toLowerCase().includes(values.colonia)) &&
                        (trabajador.codigo_postal.toLowerCase().includes(values.cp)) &&
                        (trabajador.sexo.toLowerCase().includes(values.genero)) &&
                        (trabajador.departamento.toLowerCase().includes(values.departamento)) &&
                        (trabajador.puesto.toLowerCase().includes(values.puesto))
                    ) {
                        const row = document.createElement("tr");
                        row.innerHTML = `
                <td>${trabajador.no_nomina}</td>
                <td>${trabajador.nombre_completo}</td>
                <td>${trabajador.curp_trabajador}</td>
                <td>${trabajador.departamento}</td>
                <td>${trabajador.puesto}</td>
                <td>${trabajador.fecha_nacimiento}</td>
                <td>${trabajador.email}</td>
                <td>${trabajador.telefono}</td>
                <td>${trabajador.calle}</td>
                <td>${trabajador.asentamiento}</td>
                <td>${trabajador.numero_exterior}</td>
                <td>${trabajador.codigo_postal}</td>
                <td>${trabajador.sexo}</td>`;
                        tableBody.appendChild(row);
                        count++;
                    }
                });
                resultsCount.textContent = `Registros encontrados: ${count}`;
            }

            Object.values(filters).forEach(filter => filter.addEventListener("input", applyFilter));
            applyFilter();
        })
        .catch(error => console.error('Error al cargar los trabajadores:', error));
}

function saveChanges() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("No estás autenticado");
        return;
    }

    const id_trabajador = JSON.parse(atob(token.split('.')[1])).sub; // Obtener el ID del usuario desde el token
    const url = `https://sanjuandelrio.gob.mx/tramites-sjr/Api/principal/update_trabajador_data`;

    // Crear un objeto para los datos del formulario y valores predeterminados
    const data = {
        id_trabajador: id_trabajador,
        nombre: document.getElementById('editNombre').value || userData.nombre,
        primer_apellido: document.getElementById('editPrimApellido').value || userData.primer_apellido,
        segundo_apellido: document.getElementById('editSegApellido').value || userData.segundo_apellido,
        email: document.getElementById('editEmail').value || userData.email,
        telefono: document.getElementById('editTelefono').value || userData.telefono,
        calle: document.getElementById('editCalle').value || userData.calle,
        asentamiento: document.getElementById('editAsentamiento').value || userData.asentamiento,
        numero_exterior: document.getElementById('editNumExterior').value || userData.numero_exterior,
        numero_interior: document.getElementById('editNumInterior').value || userData.numero_interior,
        codigo_postal: document.getElementById('editCP').value || userData.codigo_postal,
        // Mantener valores actuales de campos no editables
        sexo: userData.sexo || null,
        estado: userData.estado || null,
        curp_trabajador: userData.curp_trabajador || null,
        fecha_nacimiento: userData.fecha_nacimiento || null,
        password: userData.password || null,
        carpeta_raiz: userData.carpeta_raiz || null,
        acepto_terminos_condiciones: userData.acepto_terminos_condiciones || 0,
        tipo_asentamiento: userData.tipo_asentamiento || null,
        latitud: userData.latitud || null,
        longitud: userData.longitud || null,
        tipo_telefono: userData.tipo_telefono || null
    };

    // Calcular el nombre completo concatenando los campos de nombre y apellidos
    data.nombre_completo = `${data.nombre} ${data.primer_apellido} ${data.segundo_apellido}`.trim();

    // Solo agregar estos campos si el usuario es un trabajador
    const rol = JSON.parse(atob(token.split('.')[1])).role;
    if (rol === 'trabajador') {
        data.no_nomina = document.getElementById('editNoNomina').value || userData.no_nomina;
        data.departamento = document.getElementById('editDepartamento').value || userData.departamento;
        data.puesto = document.getElementById('editPuesto').value || userData.puesto;
    }

    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            if (result.mensaje) {
                alert('Datos actualizados correctamente');
                location.reload(); // Recargar la página para mostrar los datos actualizados
            } else {
                alert('Error al actualizar los datos');
            }
        })
        .catch(error => console.error('Error:', error));
}


// **************************************** cards y formularios ************************************************************
// Manejo de apertura y cierre de modales VBUENO
function openVBuenoInfoModal() {
    document.getElementById('buenoInfoModal').style.display = 'flex';
}

function closeVBuenoInfoModal() {
    document.getElementById('buenoInfoModal').style.display = 'none';
}

// Manejo de apertura y cierre de modales BECAS
function openBecaInfoModal() {
    document.getElementById('becaInfoModal').style.display = 'flex';
}

function closeBecaInfoModal() {
    document.getElementById('becaInfoModal').style.display = 'none';
}

// Manejo de apertura y cierre de modales GENERICO
function openModal(type) {
    if (type === 'vistoBueno') {
        document.getElementById('modal').style.display = 'flex';
        closeVBuenoInfoModal(); // Cierra el modal de información
    } else if (type === 'becas') {
        document.getElementById('modalBecas').style.display = 'flex';
        closeVBuenoInfoModal(); // Cierra el modal de información
    }
}
function closeModal(type) {
    if (type === 'vistoBueno') {
        document.getElementById('modal').style.display = 'none';
    } else if (type === 'becas') {
        document.getElementById('modalBecas').style.display = 'none';
    }
}

// Configuración para formularios
document.addEventListener("DOMContentLoaded", () => {
    /**
     * Función para inicializar la navegación de un formulario por pasos
     * @param {string} modalId - ID del modal contenedor
     * @param {string} formId - ID del formulario
     * @param {string} stepClass - Clase de los pasos del formulario
     * @param {string} stepperClass - Clase del stepper
     */
    function initFormNavigation(modalId, formId, stepClass, stepperClass) {
        const modal = document.getElementById(modalId);
        const formSteps = modal.querySelectorAll(`.${stepClass}`);
        const steps = modal.querySelectorAll(`.${stepperClass} .step`);
        const nextButtons = modal.querySelectorAll(".btn.next");
        const backButtons = modal.querySelectorAll(".btn.prev");
        const form = document.getElementById(formId);
        const confirmationModal = modal.querySelector(".modal2");
        let currentStep = 0;

        // Función para actualizar visibilidad de pasos y stepper
        function updateFormSteps() {
            formSteps.forEach((step, index) => {
                step.style.display = index === currentStep ? "block" : "none";
                step.classList.toggle("active", index === currentStep);
            });

            steps.forEach((step, index) => {
                step.classList.toggle("active", index <= currentStep);
            });
        }

        // Manejadores para botones "Next"
        nextButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                if (currentStep < formSteps.length - 1) {
                    currentStep++;
                    updateFormSteps();
                }
            });
        });

        // Manejadores para botones "Back"
        backButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                if (currentStep > 0) {
                    currentStep--;
                    updateFormSteps();
                }
            });
        });

        // Manejo del envío del formulario
        if (form) {
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                if (confirmationModal) {
                    confirmationModal.classList.add("show");
                }
            });
        }

        // Cerrar modal de confirmación
        if (confirmationModal) {
            const closeModalButton = confirmationModal.querySelector(".btn");
            if (closeModalButton) {
                closeModalButton.addEventListener("click", () => {
                    confirmationModal.classList.remove("show");
                });
            }
        }

        // Inicialización: mostrar el primer paso
        updateFormSteps();
    }

    // Inicializar ambos formularios
    initFormNavigation("modal", "stepForm", "form-step", "stepper"); // Visto Bueno
    initFormNavigation("modalBecas", "stepFormBecas", "form-step", "stepper"); // Becas
});

// Modales de confirmación

document.addEventListener("DOMContentLoaded", function () {
    // Visto Bueno
    const confirmationButton = document.querySelector(".form-step[data-step='4'] .btn.submit");
    const confirmationModal = document.getElementById("confirmationModalVistoBueno");
    const closeModalButton = document.getElementById("closeConfirmationVistoBueno");
    const formContainer = document.getElementById("modal"); // Contenedor del formulario
    const form = document.getElementById("stepForm"); // El formulario principal
    // Mostrar el modal al hacer clic en "Confirmar"
    confirmationButton.addEventListener("click", (e) => {
        e.preventDefault(); // Evita el envío del formulario
        confirmationModal.classList.add("show");
    });
    // Cerrar el modal y el trámite al hacer clic en "Cerrar"
    closeModalButton.addEventListener("click", () => {
        confirmationModal.classList.remove("show"); // Ocultar el modal
        form.reset(); // Reiniciar el formulario
        formContainer.style.display = "none"; // Ocultar el contenedor del formulario
    });

    // Becas
    const confirmButtonBecas = document.querySelector("#stepFormBecas .form-step[data-step='6'] .btn.next");
    const confirmationModalBecas = document.getElementById("confirmationModalBecas");
    const closeModalButtonBecas = document.getElementById("closeConfirmationBecas");
    const formContainerBecas = document.getElementById("modalBecas"); // Contenedor del formulario
    const formBecas = document.getElementById("stepFormBecas"); // Formulario de becas
    const becaInfoModal = document.getElementById("becaInfoModal"); // Modal de información de becas

    // Mostrar el modal al hacer clic en "Confirmar"
    confirmButtonBecas.addEventListener("click", (e) => {
        e.preventDefault(); // Evitar envío del formulario
        confirmationModalBecas.classList.add("show"); // Mostrar el modal de confirmación
    });

    // Cerrar el modal y finalizar el trámite al hacer clic en "Cerrar"
    closeModalButtonBecas.addEventListener("click", () => {
        confirmationModalBecas.classList.remove("show"); // Ocultar el modal de confirmación
        formBecas.reset(); // Reiniciar el formulario
        formContainerBecas.style.display = "none"; // Ocultar el contenedor del formulario

        // Asegurarse de que el modal de información también esté cerrado
        if (becaInfoModal) {
            becaInfoModal.style.display = "none"; // Ocultar el modal de información
        }
    });

});

