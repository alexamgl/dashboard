console.log("Archivo JavaScript cargado");
// Llamar a la función al cargar la página

let userData = {}; // Objeto global para almacenar los datos del usuario

document.addEventListener('DOMContentLoaded', () => {
<<<<<<< Updated upstream

=======
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
>>>>>>> Stashed changes
});

document.addEventListener('DOMContentLoaded', loadCiudadanos);
document.addEventListener('DOMContentLoaded', loadTrabajadores);

<<<<<<< Updated upstream
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
=======
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
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
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
=======
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
        userData.sub = id_usuario; // Agregar ID del usuario desde el token
        userData.role = rol; // Agregar rol del usuario desde el token
        checkUserDocuments();

        // Mostrar datos específicos dependiendo del rol
        let userInfoHtml = ``;

        if (rol === 'admin') {
          document.getElementById('user-name').textContent = userData.nombre_completo || 'Usuario';
          userInfoHtml += `
                        <p><strong>Nombre Completo:</strong> ${userData.nombre_completo}</p>
                        <p><strong>Correo:</strong> ${userData.email || "No disponible"}</p>
                        <p><strong>Teléfono:</strong> ${userData.telefono || "No disponible"}</p>
                        <p><strong>Dirección:</strong> ${userData.calle || "No disponible"}, ${userData.asentamiento || "No disponible"}, ${userData.codigo_postal || "No disponible"}</p>
                    `;
        } else if (rol === 'ciudadano') {
          document.getElementById('user-name').textContent = userData.nombre_completo || 'Usuario';
          userInfoHtml += `
                        <p><strong>Nombre Completo:</strong> ${userData.nombre_completo}</p>
                        <p><strong>CURP:</strong> ${userData.curp_ciudadano || "No disponible"}</p>
                        <p><strong>Correo:</strong> ${userData.email || "No disponible"}</p>
                        <p><strong>Teléfono:</strong> ${userData.telefono || "No disponible"}</p>
                        <p><strong>Dirección:</strong> ${userData.calle || "No disponible"}, ${userData.asentamiento || "No disponible"}, ${userData.codigo_postal || "No disponible"}</p>
                    `;
        } else if (rol === 'trabajador') {
          document.getElementById('user-name').textContent = userData.nombre_completo || 'Usuario';
          userInfoHtml += `
                        <p><strong>Número de nómina:</strong> ${userData.no_nomina}</p>
                        <p><strong>Dependencia:</strong> ${userData.departamento}</p>
                        <p><strong>Puesto:</strong> ${userData.puesto}</p>
                        <p><strong>Nombre Completo:</strong> ${userData.nombre_completo}</p>
                        <p><strong>Correo:</strong> ${userData.email || "No disponible"}</p>
                        <p><strong>Teléfono:</strong> ${userData.telefono || "No disponible"}</p>
                    `;
          const apiEndpoint = 'https://sistemadenominas.vercel.app/api/publica';

          // realizar la solicitud a la api
          fetch(apiEndpoint)
            .then(response => response.json())
            .then(data => {
              // filtrar el trabajador correspondiente al usuario actual
              const trabajador = data.find(item => item.trabajador_id.trim() === userData.no_nomina);

              if (trabajador && trabajador.data.length > 0) {
                // obtener el enlace del recibo
                const reciboUrl = trabajador.data[0].url;

                // actualizar la interfaz para mostrar el recibo
                displayPayrollReceipt(reciboUrl);
              } else {
                console.log('no se encontró información para este trabajador.');
                displayPayrollReceipt(null); // muestra un mensaje de que no hay recibos disponibles
              }
            })
            .catch(error => console.error('error al obtener los datos del trabajador:', error));
        } else if (rol === 'ciudadano_moral') {
          document.getElementById('user-name').textContent = userData.razon_social || 'Usuario';
          userInfoHtml += `
                        <p><strong>Nombre Organización:</strong> ${userData.razon_social}</p>
                        <p><strong>RFC:</strong> ${userData.rfc_organizacion}</p>
                        <p><strong>Representante:</strong> ${userData.nombre_completo_representante}</p>
                        <p><strong>Correo:</strong> ${userData.email || "No disponible"}</p>
                        <p><strong>Teléfono:</strong> ${userData.telefono || "No disponible"}</p>
                        <p><strong>Dirección:</strong> ${userData.calle || "No disponible"}, ${userData.asentamiento || "No disponible"}, ${userData.codigo_postal || "No disponible"}</p>
                    `;
        } else {
          userInfoHtml += `<p>Rol desconocido.</p>`;
        }

        // Mostrar los datos del usuario en la interfaz
        document.getElementById('user-info').innerHTML = userInfoHtml;

        // Llenar el formulario de edición con los datos del usuario
        document.getElementById('editNombre').value = userData.nombre || userData.nombre_representante || '';
        document.getElementById('editPrimApellido').value = userData.primer_apellido || userData.primer_apellido_representante || '';
        document.getElementById('editSegApellido').value = userData.segundo_apellido || userData.segundo_apellido_representante || '';
        document.getElementById('editEmail').value = userData.email || '';
        document.getElementById('editTelefono').value = userData.telefono || '';
        document.getElementById('editCalle').value = userData.calle || '';
        document.getElementById('editAsentamiento').value = userData.asentamiento || '';
        document.getElementById('editNumExterior').value = userData.numero_exterior || '';
        document.getElementById('editNumInterior').value = userData.numero_interior || '';
        document.getElementById('editCP').value = userData.codigo_postal || '';

        // Mostrar campos adicionales para trabajadores
        if (rol === 'trabajador') {
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

        // Mostrar campos adicionales para organizaciones
        if (rol === 'ciudadano_moral') {
          document.getElementById('organizacionFields').style.display = 'block';
          document.getElementById('editRazonSocial').value = userData.razon_social || '';
          document.getElementById('editRFC').value = userData.rfc_organizacion || '';
        } else {
          document.getElementById('organizacionFields').style.display = 'none';
        }
      } else {
        alert("Error al cargar los datos del usuario");
      }
    })
    .catch(error => console.error('Error:', error));

>>>>>>> Stashed changes
}

// Función para cargar trabajadores y habilitar filtros
let currentPageWorkers = 1;
const recordsPerPageWorkers = 10;
let filteredWorkers = [];
let tableBodyWorkers, resultsCountWorkers;

// Función para actualizar la tabla
function updateTableWorkers() {
  tableBodyWorkers.innerHTML = "";
  const startIndex = (currentPageWorkers - 1) * recordsPerPageWorkers;
  const endIndex = startIndex + recordsPerPageWorkers;
  const pageData = filteredWorkers.slice(startIndex, endIndex);

  pageData.forEach(trabajador => {
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
    tableBodyWorkers.appendChild(row);
  });

  resultsCountWorkers.textContent = `Registros encontrados: ${filteredWorkers.length}`;
  updatePaginationButtonsWorkers();
}

// Actualiza los botones de paginación con números
function updatePaginationButtonsWorkers() {
  const totalPages = Math.ceil(filteredWorkers.length / recordsPerPageWorkers);

  // Botones anteriores/siguientes
  document.getElementById("prev-page-workers").disabled = currentPageWorkers === 1;
  document.getElementById("next-page-workers").disabled = currentPageWorkers === totalPages || totalPages === 0;
  document.getElementById("current-page-workers").textContent = `Página ${currentPageWorkers} de ${totalPages}`;

  // Crear botones de página con un rango limitado
  const pageButtonsContainer = document.getElementById("page-buttons-workers");
  pageButtonsContainer.innerHTML = ""; // Limpiar botones anteriores

  const maxButtons = 10; // Número máximo de botones visibles
  let startPage = Math.max(1, currentPageWorkers - Math.floor(maxButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxButtons - 1);

  // Ajustar rango si nos acercamos al inicio o al final
  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    button.className = i === currentPageWorkers ? "active" : "";
    button.onclick = () => goToPageWorkers(i);
    pageButtonsContainer.appendChild(button);
  }

  // Limitar input al número máximo de páginas
  const pageInput = document.getElementById("page-input-workers");
  if (pageInput) {
    pageInput.max = totalPages;
  }
}

// Función para ir a una página específica
function goToPageWorkers(page) {
  const totalPages = Math.ceil(filteredWorkers.length / recordsPerPageWorkers);

  // Validar que el número de página sea válido
  const pageNumber = parseInt(page);
  if (pageNumber >= 1 && pageNumber <= totalPages) {
    currentPageWorkers = pageNumber;
    updateTableWorkers(); // Actualiza la tabla con los datos de la página seleccionada
  }
}


// Validar y navegar a una página desde el input
function validateAndGoToPageWorkers(input) {
  const totalPages = Math.ceil(filteredWorkers.length / recordsPerPageWorkers);
  const pageNumber = parseInt(input.value);

  // Validar si el número ingresado está en el rango permitido
  if (pageNumber >= 1 && pageNumber <= totalPages) {
    goToPageWorkers(pageNumber);
  } else if (input.value !== "") {
    // Si el valor es inválido, resaltar el campo
    input.style.borderColor = "red";
  } else {
    input.style.borderColor = ""; // Restablecer estilo si el campo está vacío
  }
}

// Función para cargar trabajadores
function loadTrabajadores() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert("No estás autenticado");
    return;
  }
  fetch('https://sanjuandelrio.gob.mx/tramites-sjr/Api/principal/trabajadores', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  })
    .then(response => response.json())
    .then(data => {
      tableBodyWorkers = document.querySelector("#trabajadores-table tbody");
      resultsCountWorkers = document.getElementById("results-trabajadores");
      const filters = {
        filterNombre: document.getElementById("filter-nombre-trabajadores"),
        filterColonia: document.getElementById("filter-colonia-trabajadores"),
        filterCP: document.getElementById("filter-cp-trabajadores"),
        filterGenero: document.getElementById("filter-genero-trabajadores"),
        filterDepartamento: document.getElementById("filter-departamento-trabajadores"),
        filterPuesto: document.getElementById("filter-puesto-trabajadores"),
        filterEdad: document.getElementById("filter-edad-trabajadores") // Nuevo filtro
      };


      function applyFilterWorkers() {
        const values = {
          nombre: filters.filterNombre.value.toLowerCase(),
          colonia: filters.filterColonia.value.toLowerCase(),
          cp: filters.filterCP.value.toLowerCase(),
          genero: filters.filterGenero.value.toLowerCase(),
          departamento: filters.filterDepartamento.value.toLowerCase(),
          puesto: filters.filterPuesto.value.toLowerCase(),
          rangoEdad: filters.filterEdad.value // Nuevo filtro
        };

        // Función para calcular la edad
        function calcularEdad(fechaNacimiento) {
          const hoy = new Date();
          const fechaNac = new Date(fechaNacimiento);
          let edad = hoy.getFullYear() - fechaNac.getFullYear();
          const mes = hoy.getMonth() - fechaNac.getMonth();
          if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
            edad--;
          }
          return edad;
        }

<<<<<<< Updated upstream
=======
        // Obtener los rangos de edad seleccionados
        const [edadMin, edadMax] = values.rangoEdad
          ? values.rangoEdad.split('-').map(Number)
          : [null, null];

        filteredWorkers = data.filter(trabajador => {
          const edad = calcularEdad(trabajador.fecha_nacimiento);

          return (
            trabajador.nombre_completo.toLowerCase().includes(values.nombre) &&
            trabajador.asentamiento.toLowerCase().includes(values.colonia) &&
            trabajador.codigo_postal.toLowerCase().includes(values.cp) &&
            trabajador.sexo.toLowerCase().includes(values.genero) &&
            trabajador.departamento.toLowerCase().includes(values.departamento) &&
            trabajador.puesto.toLowerCase().includes(values.puesto) &&
            (values.rangoEdad === "" ||
              (edadMin !== null && edadMax !== null
                ? edad >= edadMin && edad <= edadMax
                : edad >= 85)) // Condición para "85 y más"
          );
        });

        currentPageWorkers = 1; // Reiniciar a la primera página
        updateTableWorkers();
      }


      Object.values(filters).forEach(filter => filter.addEventListener("input", applyFilterWorkers));
      applyFilterWorkers();
    })
    .catch(error => console.error('Error al cargar los trabajadores:', error));
}

// Botones de navegación
function nextPageWorkers() {
  const totalPages = Math.ceil(filteredWorkers.length / recordsPerPageWorkers);
  if (currentPageWorkers < totalPages) {
    currentPageWorkers++;
    updateTableWorkers();
  }
}

function prevPageWorkers() {
  if (currentPageWorkers > 1) {
    currentPageWorkers--;
    updateTableWorkers();
  }
}


>>>>>>> Stashed changes
function saveChanges() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert("No estás autenticado");
    return;
  }

  const decoded = JSON.parse(atob(token.split('.')[1]));
  const id_usuario = decoded.sub; // Obtener el ID del usuario desde el token
  const rol = decoded.role; // Obtener el rol del usuario desde el token

  let url = '';
  const data = {};

  // Construir URL y objeto de datos según el rol
  if (rol === 'ciudadano') {
    url = '/tramites-sjr/Api/principal/update_ciudadano_data';
    data.id_ciudadano = id_usuario;
    data.nombre = document.getElementById('editNombre').value || userData.nombre;
    data.primer_apellido = document.getElementById('editPrimApellido').value || userData.primer_apellido;
    data.segundo_apellido = document.getElementById('editSegApellido').value || userData.segundo_apellido;
    data.curp_ciudadano = userData.curp_ciudadano || null;
    data.email = document.getElementById('editEmail').value || userData.email;
    data.telefono = document.getElementById('editTelefono').value || userData.telefono;
    data.calle = document.getElementById('editCalle').value || userData.calle;
    data.asentamiento = document.getElementById('editAsentamiento').value || userData.asentamiento;
    data.numero_exterior = document.getElementById('editNumExterior').value || userData.numero_exterior;
    data.numero_interior = document.getElementById('editNumInterior').value || userData.numero_interior;
    data.codigo_postal = document.getElementById('editCP').value || userData.codigo_postal;
  } else if (rol === 'trabajador') {
    url = '/tramites-sjr/Api/principal/update_trabajador_data';
    data.id_trabajador = id_usuario;
    data.nombre = document.getElementById('editNombre').value || userData.nombre;
    data.primer_apellido = document.getElementById('editPrimApellido').value || userData.primer_apellido;
    data.segundo_apellido = document.getElementById('editSegApellido').value || userData.segundo_apellido;
    data.no_nomina = document.getElementById('editNoNomina').value || userData.no_nomina;
    data.departamento = document.getElementById('editDepartamento').value || userData.departamento;
    data.puesto = document.getElementById('editPuesto').value || userData.puesto;
    data.email = document.getElementById('editEmail').value || userData.email;
    data.telefono = document.getElementById('editTelefono').value || userData.telefono;
    data.calle = document.getElementById('editCalle').value || userData.calle;
    data.asentamiento = document.getElementById('editAsentamiento').value || userData.asentamiento;
    data.numero_exterior = document.getElementById('editNumExterior').value || userData.numero_exterior;
    data.numero_interior = document.getElementById('editNumInterior').value || userData.numero_interior;
    data.codigo_postal = document.getElementById('editCP').value || userData.codigo_postal;
    data.sexo = userData.sexo || null,
      data.estado = userData.estado || null,
      data.curp_trabajador = userData.curp_trabajador || null,
      data.fecha_nacimiento = userData.fecha_nacimiento || null,
      data.password = userData.password || null,
      data.carpeta_raiz = userData.carpeta_raiz || null,
      data.acepto_terminos_condiciones = userData.acepto_terminos_condiciones || 0,
      data.tipo_asentamiento = userData.tipo_asentamiento || 'N/A',
      data.latitud = userData.latitud || null,
      data.longitud = userData.longitud || null,
      data.tipo_telefono = userData.tipo_telefono || null
    data.nombre_completo = `${data.nombre} ${data.primer_apellido} ${data.segundo_apellido}`.trim();
    console.log(data);
  } else if (rol === 'organizacion') {
    url = '/tramites-sjr/Api/principal/update_organizacion_data';
    data.id_organizacion = id_usuario;
    data.razon_social = document.getElementById('editRazonSocial').value || userData.razon_social;
    data.rfc_organizacion = document.getElementById('editRFC').value || userData.rfc_organizacion;
    data.nombre_completo_representante = document.getElementById('editNombre').value || userData.nombre_completo_representante;
    data.email = document.getElementById('editEmail').value || userData.email;
    data.telefono = document.getElementById('editTelefono').value || userData.telefono;
    data.calle = document.getElementById('editCalle').value || userData.calle;
    data.asentamiento = document.getElementById('editAsentamiento').value || userData.asentamiento;
    data.numero_exterior = document.getElementById('editNumExterior').value || userData.numero_exterior;
    data.numero_interior = document.getElementById('editNumInterior').value || userData.numero_interior;
    data.codigo_postal = document.getElementById('editCP').value || userData.codigo_postal;
  } else {
    alert("Rol desconocido. No se pueden guardar los cambios.");
    return;
  }

  // Enviar los datos al servidor
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
      if (result.success) {
        alert('Datos actualizados correctamente');
        location.reload(); // Recargar la página para mostrar los datos actualizados
      } else {
        alert('Error al actualizar los datos');
      }
    })
    .catch(error => console.error('Error:', error));
}
