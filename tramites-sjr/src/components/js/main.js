console.log("Archivo JavaScript cargado");
// Llamar a la función al cargar la página

let userData = {}; // Objeto global para almacenar los datos del usuario

document.addEventListener('DOMContentLoaded', () => {
   loadUserData();
});

document.addEventListener('DOMContentLoaded', () => {
    const decodedToken = validateToken(); // Validar el token y obtener datos decodificados

    if (decodedToken) {
        configureDashboard(decodedToken); // Configurar el Dashboard según el rol
        resetActivityTimer(); // Iniciar el seguimiento de actividad
    }
});

window.addEventListener('pageshow', () => {
    validateToken(); // Revalidar el token si el usuario regresa con el botón Atrás
});

document.addEventListener('DOMContentLoaded', loadCiudadanos);
document.addEventListener('DOMContentLoaded', loadTrabajadores);

function validateToken() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        window.location.href = 'https://sanjuandelrio.gob.mx/tramites-sjr/public/login.html';
        return;
    }

    try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos

        if (decoded.exp < currentTime) {
            alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
            localStorage.removeItem('token');
            window.location.href = 'https://sanjuandelrio.gob.mx/tramites-sjr/public/login.html';
            return;
        }

        return decoded; // Retorna el token decodificado para usar el ID y rol
    } catch (error) {
        console.error('Error al validar el token:', error);
        alert('Hubo un problema con tu sesión. Por favor, inicia sesión nuevamente.');
        localStorage.removeItem('token');
        window.location.href = 'https://sanjuandelrio.gob.mx/tramites-sjr/public/login.html';
    }
}

let lastActivityTime = Date.now();

function resetActivityTimer() {
    lastActivityTime = Date.now();
}

document.addEventListener('mousemove', resetActivityTimer);
document.addEventListener('keydown', resetActivityTimer);
document.addEventListener('click', resetActivityTimer);

function checkInactivity() {
    const currentTime = Date.now();
    const timeElapsed = currentTime - lastActivityTime;

    if (timeElapsed > 3600000) { // 1 hora de inactividad (en milisegundos)
        alert('Tu sesión ha expirado por inactividad. Por favor, inicia sesión nuevamente.');
        localStorage.removeItem('token');
        window.location.href = 'https://sanjuandelrio.gob.mx/tramites-sjr/public/login.html';
    }
}

// Comprobar inactividad cada 1 minuto
setInterval(checkInactivity, 60000);

function configureDashboard(decodedToken) {
    const userRole = decodedToken.role;

    // Ejemplo de control de visibilidad
    if (userRole === 'admin') {
        document.querySelector('#admin-section').style.display = 'block';
    } else {
        document.querySelector('#admin-section').style.display = 'none';
    }

    if (userRole === 'user') {
        document.querySelector('#user-section').style.display = 'block';
    } else {
        document.querySelector('#user-section').style.display = 'none';
    }

    // Muestra el nombre y el rol en el top-bar
    document.getElementById('user-name').textContent = decodedToken.sub || 'Usuario';
    document.getElementById('user-role').textContent = `Rol: ${userRole}`;
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = '../../public/login.html';
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
    const url = `https://sanjuandelrio.gob.mx/tramites-sjr/Api/principal/usuario_datos/${id_usuario}`;

    // Realizar la solicitud para obtener los datos del usuario
    fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                userData = data.data;
                userData.id_usuario = id_usuario; // Agregar ID del usuario desde el token
                userData.rol = rol; // Agregar rol del usuario desde el token

                // Actualizar nombre y rol en el top-bar
                document.getElementById('user-name').textContent = userData.nombre_completo || 'Usuario';
                document.getElementById('user-role').textContent = `Rol: ${rol || 'Invitado'}`;

                // Mostrar los datos del usuario en la interfaz
                document.getElementById('user-info').innerHTML = `
                    <p><strong>Nombre Completo:</strong> ${userData.nombre_completo}</p>
                    <p><strong>Correo:</strong> ${userData.email || "No disponible"}</p>
                    <p><strong>Teléfono:</strong> ${userData.telefono || "No disponible"}</p>
                    <p><strong>Calle:</strong> ${userData.calle || "No disponible"}</p>
                    <p><strong>Asentamiento:</strong> ${userData.asentamiento || "No disponible"}</p>
                    <p><strong>Código Postal:</strong> ${userData.codigo_postal || "No disponible"}</p>
                `;
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

function fillEditForm() {
    // Asegúrate de que userData está inicializado
    if (!userData || Object.keys(userData).length === 0) {
        alert("No se pueden cargar los datos del usuario. Por favor, intenta nuevamente.");
        return;
    }

    // Llenar los campos del formulario con los datos del usuario
    document.getElementById('editNombre').value = userData.nombre || '';
    document.getElementById('editPrimApellido').value = userData.primer_apellido || '';
    document.getElementById('editSegApellido').value = userData.segundo_apellido || '';
    document.getElementById('editEmail').value = userData.email || '';
    document.getElementById('editTelefono').value = userData.telefono || '';
    document.getElementById('editCalle').value = userData.calle || '';
    document.getElementById('editAsentamiento').value = userData.asentamiento || '';
    document.getElementById('editNumExterior').value = userData.numero_exterior || '';
    document.getElementById('editNumInterior').value = userData.numero_interior || '';
    document.getElementById('editCP').value = userData.codigo_postal || '';

    if (userData.rol === 'trabajador') {
        document.getElementById('trabajadorFields').style.display = 'block';
        document.getElementById('editNoNomina').value = userData.no_nomina || '';
        document.getElementById('editPuesto').value = userData.puesto || '';

        const departamentoSelect = document.getElementById('editDepartamento');
        Array.from(departamentoSelect.options).forEach(option => {
            if (option.value === userData.departamento) {
                option.selected = true;
            }
        });
    } else {
        document.getElementById('trabajadorFields').style.display = 'none';
    }
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

document.getElementById('manageDocumentsButton').addEventListener('click', () => {
    document.querySelector('.user-card').classList.add('hidden'); // Oculta la tarjeta de información
    document.querySelector('.document-card').classList.remove('hidden'); // Muestra la tarjeta de documentos
});

document.getElementById('cancelDocumentsButton').addEventListener('click', () => {
    document.querySelector('.document-card').classList.add('hidden'); // Oculta la tarjeta de documentos
    document.querySelector('.user-card').classList.remove('hidden'); // Muestra la tarjeta de información
});

// Maneja el cambio de archivo
function handleFileChange(event, fieldId) {
    const file = event.target.files[0];
    const fileInfo = document.getElementById(`${fieldId}-info`);
    const progressBar = document.getElementById(`${fieldId}-progress`);

    if (file) {
        const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
        if (sizeInMB > 3) {
            fileInfo.textContent = `El archivo es demasiado grande (${sizeInMB} MB). Máximo permitido: 3 MB.`;
            fileInfo.style.color = 'red';
            progressBar.querySelector('.progress').style.width = '0%';
            return;
        }

        fileInfo.textContent = `Archivo seleccionado: ${file.name} (${sizeInMB} MB)`;
        fileInfo.style.color = 'green';
    } else {
        fileInfo.textContent = '';
        progressBar.querySelector('.progress').style.width = '0%';
    }
}

function handleFileChange(event, fieldId) {
    const file = event.target.files[0];
    const fileInfo = document.getElementById(`${fieldId}-info`);
    const progressBar = document.getElementById(`${fieldId}-progress`).querySelector('.progress');
    const uploadButton = document.getElementById(`${fieldId}-upload`);

    if (file) {
        const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
        if (sizeInMB > 3) {
            fileInfo.textContent = `(${sizeInMB} MB) - Tamaño máximo permitido: 3 MB`;
            fileInfo.style.color = 'red';
            progressBar.style.width = '0%';
            uploadButton.disabled = true;
            return;
        }

        fileInfo.textContent = `${file.name} (${sizeInMB} MB)`;
        fileInfo.style.color = 'green';
        uploadButton.disabled = false;
    } else {
        fileInfo.textContent = '';
        progressBar.style.width = '0%';
        uploadButton.disabled = true;
    }
}

function uploadDocument(fieldId) {
    const fileInput = document.getElementById(fieldId);
    const file = fileInput.files[0];
    const progressBar = document.getElementById(`${fieldId}-progress`).querySelector('.progress');

    if (!file) {
        alert('Por favor, selecciona un archivo válido.');
        return;
    }

    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        progressBar.style.width = `${progress}%`;

        if (progress >= 100) {
            clearInterval(interval);

            // Simulación de subida
            alert(`${fieldId.toUpperCase()} subido correctamente.`);
        }
    }, 200);
}



document.addEventListener('DOMContentLoaded', () => {
    cargarGraficaSecretarias();
});

function cargarGraficaSecretarias() {
    const token = localStorage.getItem('token'); // Asumiendo que necesitas autenticar
    const url = 'http://localhost/RepoPresidencia/tramitesPresidenciaSJR/tramites-sjr/Api/principal/grafica_dependencias'; // Cambia por tu endpoint

    fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const labels = data.data.map(item => item.secretaria);
            const values = data.data.map(item => item.total);

            renderGraficaDependencias(labels, values);
        } else {
            console.error('Error al obtener los datos de la gráfica:', data.message);
        }
    })
    .catch(error => {
        console.error('Error al cargar la gráfica:', error);
    });
}

let grafica;
function renderGraficaDependencias(labels, values) {
    const ctx = document.getElementById('graficaDependencias').getContext('2d');

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(153, 102, 255, 0.6)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Evita desbordamientos
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    });
}



// Escuchar cambios en el tamaño de la ventana
window.addEventListener('resize', () => {
    if (grafica) {
        grafica.resize(); // Redimensionar la gráfica
    }
});

function cargarGraficaCodigosPostales() {
    const apiUrl = "http://localhost/RepoPresidencia/tramitesPresidenciaSJR/tramites-sjr/Api/principal/grafica_cp_trabajadores"; // Cambia al endpoint real

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const labels = data.data.map(item => item.codigo_postal);
                const values = data.data.map(item => item.total);

                renderGraficaCodigosPostales(labels, values);
            } else {
                console.error("No se encontraron datos para la gráfica.");
            }
        })
        .catch(error => console.error("Error al cargar la gráfica:", error));
}

function renderGraficaCodigosPostales(labels, values) {
    const ctx = document.getElementById('graficaCodigosPostales').getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Trabajadores por Código Postal',
                data: values,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Evita desbordamientos
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    });
}


// Llamar a la función para cargar la gráfica
document.addEventListener('DOMContentLoaded', cargarGraficaCodigosPostales);


function logout() {
    localStorage.removeItem('token'); // Elimina el token
    window.location.href = 'https://sanjuandelrio.gob.mx/tramites-sjr/public/login.html'; // Redirige al login
}



