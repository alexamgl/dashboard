
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
function validateToken() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
    window.location.href = 'https://sanjuandelrio.gob.mx/tramites-sjr/public/login.html';
    return;
  }

    try {
        const payload = parseJwt(token);
        const currentTime = Math.floor(Date.now() / 1000);
  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos

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

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
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

  // Actualizar el título del Dashboard basado en el rol
  const roleTitles = {
    admin: 'Panel de Administrador',
    trabajador: 'Panel de Trabajador',
    ciudadano: 'Trámites en Línea',
    ciudadano_moral: 'Trámites en Línea'
  };
  const dashboardTitle = roleTitles[userRole] || 'Dashboard'; // Fallback si el rol no coincide
  document.getElementById('dashboard-title').textContent = dashboardTitle;

  // Actualizar el texto del rol en el top-bar
  const roleDescriptions = {
    admin: 'Administrador',
    trabajador: 'Trabajador'
  };
  const userRoleText = roleDescriptions[userRole] || ''; // Si es ciudadano, no mostrar nada
  const userRoleElement = document.getElementById('user-role');

  if (userRoleText) {
    userRoleElement.textContent = `Rol: ${userRoleText}`;
    userRoleElement.style.display = 'block'; // Asegurarse de que sea visible
  } else {
    userRoleElement.style.display = 'none'; // Ocultar si el rol es ciudadano
  }

  // Mostrar secciones para admin
  document.querySelectorAll('.admin-section').forEach((element) => {
    element.style.display = userRole === 'admin' ? 'block' : 'none';
  });

  // Mostrar secciones para ciudadano
  document.querySelectorAll('.ciudadano-section').forEach((element) => {
    element.style.display = userRole === 'ciudadano' || userRole === 'ciudadano_moral' ? 'block' : 'none';
  });

  // Mostrar secciones para trabajador
  document.querySelectorAll('.trabajador-section').forEach((element) => {
    element.style.display = userRole === 'trabajador' ? 'block' : 'none';
  });

  // Mostrar secciones para ciudadano y trabajador
  document.querySelectorAll('.ciudadano-trabajador-section').forEach((element) => {
    element.style.display = (userRole === 'ciudadano' || userRole === 'ciudadano_moral' || userRole === 'trabajador') ? 'block' : 'none';
  });
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = '../../public/login.html';
}

// Función para cargar datos del usuario
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
                userData = data.data; // Guardar los datos del usuario en el objeto global
                userData.id_usuario = id_usuario; // Agregar ID del usuario desde el token
                userData.rol = rol; // Agregar rol del usuario desde el token
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

}

function displayPayrollReceipt(reciboUrl) {
  const reciboContainer = document.getElementById('recibo-container');

  if (reciboUrl) {
    reciboContainer.innerHTML = `
      <h3>recibo de nómina</h3>
      <iframe src="${reciboUrl}" width="100%" height="600px" style="border: none;"></iframe>
    `;
  } else {
    reciboContainer.innerHTML = `
      <h3>recibo de nómina</h3>
      <p>no hay recibos de nómina disponibles para este trabajador.</p>
    `;
  }
}


// Variables para paginación
let currentPage = 1;
const recordsPerPage = 10;
let filteredData = []; // Datos filtrados después de aplicar los filtros
let tableBody, resultsCount;

// Función para actualizar la tabla
function updateTable() {
  tableBody.innerHTML = "";
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const pageData = filteredData.slice(startIndex, endIndex);

  pageData.forEach(ciudadano => {
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
  });

  resultsCount.textContent = `Registros encontrados: ${filteredData.length}`;
  updatePaginationButtons();
}

// Función para cargar ciudadanos
function loadCiudadanos() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert("No estás autenticado");
    return;
  }
  fetch('https://sanjuandelrio.gob.mx/tramites-sjr/Api/principal/ciudadanos', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  })
    .then(response => response.json())
    .then(data => {
      tableBody = document.querySelector("#ciudadanos-table tbody");
      const filterNombre = document.getElementById("filter-nombre-ciudadanos");
      const filterColonia = document.getElementById("filter-colonia-ciudadanos");
      const filterCP = document.getElementById("filter-cp-ciudadanos");
      const filterEdad = document.getElementById("filter-edad-ciudadanos");
      resultsCount = document.getElementById("results-ciudadanos");

      // Filtro
      function applyFilterCiudadanos() {
        const values = {
          nombre: filterNombre.value.toLowerCase(),
          colonia: filterColonia.value.toLowerCase(),
          cp: filterCP.value.toLowerCase(),
          rangoEdad: filterEdad.value
        };

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

        const [edadMin, edadMax] = values.rangoEdad
          ? values.rangoEdad.split('-').map(Number)
          : [null, null];

        filteredData = data.filter(ciudadano => {
          const edad = calcularEdad(ciudadano.fecha_nacimiento);
          return (
            ciudadano.nombre_completo.toLowerCase().includes(values.nombre) &&
            ciudadano.asentamiento.toLowerCase().includes(values.colonia) &&
            ciudadano.codigo_postal.toLowerCase().includes(values.cp) &&
            (values.rangoEdad === "" ||
              (edadMin !== null && edadMax !== null
                ? edad >= edadMin && edad <= edadMax
                : edad >= 85))
          );
        });

        currentPage = 1; // Reiniciar a la primera página
        updateTable();
      }

      filterNombre.addEventListener("input", applyFilterCiudadanos);
      filterColonia.addEventListener("input", applyFilterCiudadanos);
      filterCP.addEventListener("input", applyFilterCiudadanos);
      filterEdad.addEventListener("input", applyFilterCiudadanos);
      applyFilterCiudadanos();
    })
    .catch(error => console.error('Error al cargar los ciudadanos:', error));
}

function updatePaginationButtons() {
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  // Botones anteriores/siguientes
  document.getElementById("prev-page").disabled = currentPage === 1;
  document.getElementById("next-page").disabled = currentPage === totalPages || totalPages === 0;
  document.getElementById("current-page").textContent = `Página ${currentPage} de ${totalPages}`;

  // Crear botones de página con un rango limitado
  const pageButtonsContainer = document.getElementById("page-buttons");
  pageButtonsContainer.innerHTML = ""; // Limpiar botones anteriores

  const maxButtons = 10; // Número máximo de botones visibles
  let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxButtons - 1);

  // Ajustar rango si nos acercamos al inicio o al final
  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    button.className = i === currentPage ? "active" : "";
    button.onclick = () => goToPage(i);
    pageButtonsContainer.appendChild(button);
  }

  // Limitar input al número máximo de páginas
  const pageInput = document.getElementById("page-input");
  if (pageInput) {
    pageInput.max = totalPages;
  }
}

// Función para ir a una página específica
function goToPage(page) {
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  // Validar que el número de página sea válido
  const pageNumber = parseInt(page);
  if (pageNumber >= 1 && pageNumber <= totalPages) {
    currentPage = pageNumber;
    updateTable(); // Actualiza la tabla con los datos de la página seleccionada
  }
}

// Validar y navegar a una página desde el input
function validateAndGoToPage(input) {
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const pageNumber = parseInt(input.value);

  // Validar si el número ingresado está en el rango permitido
  if (pageNumber >= 1 && pageNumber <= totalPages) {
    goToPage(pageNumber);
  } else if (input.value !== "") {
    // Si el valor es inválido, resaltar el campo
    input.style.borderColor = "red";
  } else {
    input.style.borderColor = ""; // Restablecer estilo si el campo está vacío
  }
}

// Botones de navegación
function nextPage() {
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    updateTable();
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    updateTable();
  }
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
  const progressBar = document.getElementById(`${fieldId}-progress`).querySelector('.progress');
  const uploadButton = document.getElementById(`${fieldId}-upload`);
  const previewContainer = document.getElementById(`${fieldId}-preview-container`);
  const previewFrame = document.getElementById(`${fieldId}-preview`);

  // validación de tamaño del archivo
  if (file) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    if (sizeInMB > 3) {
      fileInfo.textContent = `(${sizeInMB} MB) - Tamaño máximo permitido: 3 MB`;
      fileInfo.style.color = 'red';
      progressBar.style.width = '0%';
      uploadButton.disabled = true;
      previewContainer.hidden = true;
      return;
    }

    fileInfo.textContent = `${file.name} (${sizeInMB} MB)`;
    fileInfo.style.color = 'green';
    uploadButton.disabled = false;

    // mostrar vista previa del archivo
    const fileURL = URL.createObjectURL(file);
    previewFrame.src = fileURL;
    previewContainer.hidden = false;
    previewContainer.onclick = () => {
      window.open(fileURL, '_blank');
    };

    // lógica para deshabilitar campos conflictivos
    if (fieldId === 'actaMatrimonio') {
      const concubinatoButton = document.querySelector(`[onclick="document.getElementById('actaConcubinato').click()"]`);
      concubinatoButton.disabled = true;

      // muestra un mensaje específico
      const concubinatoInfo = document.getElementById('actaConcubinato-info');
      concubinatoInfo.textContent = 'Ya se subió un acta de matrimonio.';
      concubinatoInfo.style.color = 'red';
    } else if (fieldId === 'actaConcubinato') {
      const matrimonioButton = document.querySelector(`[onclick="document.getElementById('actaMatrimonio').click()"]`);
      matrimonioButton.disabled = true;

      // muestra un mensaje específico
      const matrimonioInfo = document.getElementById('actaMatrimonio-info');
      matrimonioInfo.textContent = 'Ya se subió un acta de concubinato.';
      matrimonioInfo.style.color = 'red';
    }
  } else {
    fileInfo.textContent = '';
    progressBar.style.width = '0%';
    uploadButton.disabled = true;
    previewContainer.hidden = true;

    // si se deselecciona un archivo, habilita los botones nuevamente
    if (fieldId === 'actaMatrimonio') {
      const concubinatoButton = document.querySelector(`[onclick="document.getElementById('actaConcubinato').click()"]`);
      concubinatoButton.disabled = false;

      // limpia el mensaje
      const concubinatoInfo = document.getElementById('actaConcubinato-info');
      concubinatoInfo.textContent = '';
    } else if (fieldId === 'actaConcubinato') {
      const matrimonioButton = document.querySelector(`[onclick="document.getElementById('actaMatrimonio').click()"]`);
      matrimonioButton.disabled = false;

      // limpia el mensaje
      const matrimonioInfo = document.getElementById('actaMatrimonio-info');
      matrimonioInfo.textContent = '';
    }
  }
}



function previewDocument(fieldId) {
  const fileInput = document.getElementById(fieldId);
  const file = fileInput.files[0];

  if (!file) {
    alert('Por favor, selecciona un archivo válido.');
    return;
  }

  const fileURL = URL.createObjectURL(file);
  window.open(fileURL, '_blank');
}

async function uploadDocument(fieldId) {
  const user = validateToken();
  if (!user) return; // Si el token no es válido, detener la subida

  const existingDocuments = await fetch(
    `https://sanjuandelrio.gob.mx/tramites-sjr/Api/principal/get_documentos?id_usuario=${user.sub}`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }
  ).then((res) => res.json());

  if (existingDocuments.success) {
    const documentMap = existingDocuments.data.reduce((acc, doc) => {
      acc[doc.nombre_documento] = doc.url_documento;
      return acc;
    }, {});

    // evita subir acta de nacimiento si ya existe acta de concubinato (y viceversa)
    if (
      (fieldId === 'actaNacimiento' && documentMap['actaConcubinato.pdf']) ||
      (fieldId === 'actaConcubinato' && documentMap['actaNacimiento.pdf'])
    ) {
      alert('ya se ha subido un documento incompatible. no puedes subir este archivo.');
      return;
    }
  }

  const fileInput = document.getElementById(fieldId);
  const file = fileInput.files[0];
  const progressBar = document.getElementById(`${fieldId}-progress`).querySelector('.progress');
  const successIcon = document.getElementById(`${fieldId}-success`);
  const selectButton = document.querySelector(`[onclick="document.getElementById('${fieldId}').click()"]`);
  const uploadButton = document.getElementById(`${fieldId}-upload`);

  if (!file) {
    alert('Por favor, selecciona un archivo válido.');
    return;
  }

  // Mapeo de roles
  const roleMapping = {
    admin: 1,
    trabajador: 2,
    ciudadano: 3,
    ciudadano_moral: 3
  };

  // Convertir el rol del usuario a su valor numérico
  const numericRole = roleMapping[user.role];
  if (!numericRole) {
    alert('Rol desconocido. No se puede proceder.');
    return;
  }

  // Generar el identificador
  let nomina;
  if (user.role === 'trabajador') {
    nomina = userData.no_nomina; // Usar el campo de nómina
  } else {
    // Tomar las iniciales del nombre completo
    const iniciales = userData.nombre_completo
      .split(' ')
      .map(palabra => palabra.charAt(0).toUpperCase())
      .join('');
    // Combinar iniciales con el id_sub
    nomina = `${iniciales}-${user.sub}`;
  }

  // Reinicia la barra de progreso y oculta el icono de éxito
  progressBar.style.width = '0%';
  successIcon.classList.remove('visible');

  const formData = new FormData();
  formData.append('file', file);
  formData.append('nomina', nomina); // Identificador único para el usuario
  formData.append('id_usuario', user.sub); // ID del usuario
  formData.append('rol', numericRole); // Rol numérico
  formData.append('nuevo_nombre', `${fieldId}.pdf`); // Nombre del archivo

  try {
    // Crear una solicitud XMLHttpRequest para monitorear el progreso
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://sanjuandelrio.gob.mx/tramites-sjr/Api/principal/upload_document', true);
    xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token')}`);

    // Monitorea el progreso de la subida
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        progressBar.style.width = `${percentComplete}%`;
      }
    });

    // Maneja la respuesta del servidor
    xhr.onload = () => {
      if (xhr.status === 200) {
        const result = JSON.parse(xhr.responseText);

        // Mostrar el icono de éxito
        successIcon.classList.add('visible');

        // Deshabilitar los botones
        selectButton.disabled = true;
        uploadButton.disabled = true;
      } else {
        throw new Error('Error al subir el documento.');
      }
    };

    xhr.onerror = () => {
      alert('Hubo un error en la subida.');
      progressBar.style.width = '0%'; // Reinicia la barra de progreso en caso de error
    };

    // Enviar el formulario
    xhr.send(formData);
  } catch (error) {
    alert(`Error: ${error.message}`);
    progressBar.style.width = '0%'; // Reinicia la barra de progreso en caso de error
  }
}



async function checkUserDocuments() {
  const user = validateToken();
  if (!user) return; // Redirigir si el token no es válido

  // Mapeo de roles (si no está ya incluido en otro lugar)
  const roleMapping = {
    admin: 1,
    trabajador: 2,
    ciudadano: 3,
    ciudadano_moral: 3
  };

  const numericRole = roleMapping[user.role];
  if (!numericRole) {
    alert('Rol desconocido. No se puede proceder.');
    return;
  }

  try {
    const response = await fetch(
      `https://sanjuandelrio.gob.mx/tramites-sjr/Api/principal/get_documentos?id_usuario=${user.sub}&rol=${numericRole}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );

    const result = await response.json();

    if (response.ok && result.success) {
      updateFormWithDocuments(result.data); // Actualiza el formulario con los documentos obtenidos
    } else {
      throw new Error(result.message || 'Error al verificar los documentos.');
    }
  } catch (error) {
    console.error('Error al verificar los documentos:', error.message);
  }
}


function updateFormWithDocuments(documents) {
  const documentMap = documents.reduce((acc, doc) => {
    acc[doc.nombre_documento] = doc.url_documento;
    return acc;
  }, {});

  const documentFields = [
    'ine',
    'actaNacimiento',
    'curp',
    'comprobanteDomicilio',
    'actaMatrimonio',
    'actaConcubinato'
  ];

  let matrimonioSubido = false;
  let concubinatoSubido = false;

  // verifica si ya se subieron acta de matrimonio o acta de concubinato
  if (documentMap['actaMatrimonio.pdf']) {
    matrimonioSubido = true;
  }
  if (documentMap['actaConcubinato.pdf']) {
    concubinatoSubido = true;
  }

  documentFields.forEach((fieldId) => {
    const fileInfo = document.getElementById(`${fieldId}-info`);
    const progressBar = document.getElementById(`${fieldId}-progress`).querySelector('.progress');
    const previewContainer = document.getElementById(`${fieldId}-preview-container`);
    const previewFrame = document.getElementById(`${fieldId}-preview`);
    const selectButton = document.querySelector(`[onclick="document.getElementById('${fieldId}').click()"]`);
    const uploadButton = document.getElementById(`${fieldId}-upload`);
    const successIcon = document.getElementById(`${fieldId}-success`);

    // verifica si el documento ya existe
    if (documentMap[`${fieldId}.pdf`]) {
      const fileUrl = documentMap[`${fieldId}.pdf`];

      fileInfo.textContent = `archivo subido: ${fieldId}.pdf`;
      fileInfo.style.color = 'blue';
      progressBar.style.width = '100%';
      successIcon.classList.add('visible');
      previewFrame.src = fileUrl;
      previewContainer.hidden = false;
      selectButton.disabled = true;
      uploadButton.disabled = true;
      previewContainer.onclick = () => {
        window.open(fileUrl, '_blank');
      };

      // deshabilita los campos conflictivos
      if (fieldId === 'actaMatrimonio') {
        const concubinatoButton = document.querySelector(`[onclick="document.getElementById('actaConcubinato').click()"]`);
        concubinatoButton.disabled = true;

        // muestra un mensaje específico
        const concubinatoInfo = document.getElementById('actaConcubinato-info');
        concubinatoInfo.textContent = 'ya se subió un acta de matrimonio.';
        concubinatoInfo.style.color = 'red';
      } else if (fieldId === 'actaConcubinato') {
        const matrimonioButton = document.querySelector(`[onclick="document.getElementById('actaMatrimonio').click()"]`);
        matrimonioButton.disabled = true;

        // muestra un mensaje específico
        const matrimonioInfo = document.getElementById('actaMatrimonio-info');
        matrimonioInfo.textContent = 'ya se subió un acta de concubinato.';
        matrimonioInfo.style.color = 'red';
      }
    } else {
      // si no hay documento, restablecer los elementos
      fileInfo.textContent = '';
      progressBar.style.width = '0%';
      successIcon.classList.remove('visible');
      previewContainer.hidden = true;
      selectButton.disabled = false;
      uploadButton.disabled = true;

      // habilita los botones si no hay conflicto
      if (matrimonioSubido && fieldId === 'actaConcubinato') {
        selectButton.disabled = true;
        fileInfo.textContent = 'ya se subió un acta de matrimonio.';
        fileInfo.style.color = 'red';
      } else if (concubinatoSubido && fieldId === 'actaMatrimonio') {
        selectButton.disabled = true;
        fileInfo.textContent = 'ya se subió un acta de concubinato.';
        fileInfo.style.color = 'red';
      }
    }
  });
}



document.addEventListener('DOMContentLoaded', () => {
  cargarGraficaSecretarias();
});

function cargarGraficaSecretarias() {
  const token = localStorage.getItem('token'); // Asumiendo que necesitas autenticar
  const url = 'https://sanjuandelrio.gob.mx/tramites-sjr/Api/principal/grafica_dependencias'; // Cambia por tu endpoint

  fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Filtrar las dependencias con total mayor a 5
        const filteredData = data.data.filter(item => item.total > 0);

        // Extraer etiquetas y valores solo de las dependencias filtradas
        const labels = filteredData.map(item => item.departamento);
        const values = filteredData.map(item => item.total);

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
          '#e35293', // Color base
          '#f062a2', // Tonos más claros derivados
          '#f57ba9',
          '#fa93b9',
          '#ffc0d5'
        ],
        borderColor: '#ffffff', // Opcional: bordes blancos
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // Evita desbordamientos
      plugins: {
        legend: {
          display: false // Ocultar las etiquetas superiores
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
  const token = localStorage.getItem('token');
  if (!token) {
    alert("No estás autenticado");
    return;
  }
  const apiUrl = "https://sanjuandelrio.gob.mx/tramites-sjr/Api/principal/grafica_cp_trabajadores"; // Cambia al endpoint real

  fetch(apiUrl, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  })
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
        backgroundColor: '#00ae6f',
        borderColor: '#408740',
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

document.addEventListener("DOMContentLoaded", async () => {
  // Obtener el token del localStorage
  const token = localStorage.getItem("token");
  if (!token) {
    alert("No estás autenticado. Por favor, inicia sesión.");
    return;
  }

  // Inicializar el mapa
  const map = L.map("map").setView([20.3864, -100.0110], 13); // Coordenadas aproximadas de San Juan del Río

  // Añadir la capa base
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  let markerLayer = null;
  let circleLayer = null;

  // Función para mostrar marcadores agrupados
  const mostrarMarcadores = (map, data) => {
    if (circleLayer) map.removeLayer(circleLayer); // Quitar círculos si existen

    if (markerLayer) map.removeLayer(markerLayer); // Reiniciar la capa si ya existe
    markerLayer = L.markerClusterGroup();

    data.forEach((item) => {
      const marker = L.marker([item.lat, item.lon]).bindPopup(`
                <b>Código Postal:</b> ${item.codigo_postal}<br>
                <b>Trabajador:</b> ${item.trabajadores}
            `);
      markerLayer.addLayer(marker);
    });

    map.addLayer(markerLayer);
  };

  // Función para mostrar círculos con tamaño dinámico basado en el zoom
  const mostrarCirculos = (map, data) => {
    if (markerLayer) map.removeLayer(markerLayer); // Quitar marcadores si existen

    if (circleLayer) map.removeLayer(circleLayer); // Reiniciar la capa si ya existe
    circleLayer = L.layerGroup();

    const baseRadius = 500; // Tamaño base del círculo

    data.forEach((item) => {
      const circle = L.circle([item.lat, item.lon], {
        radius: baseRadius, // Tamaño base
        color: '#faa21b', // Color base naranja
        fillColor: '#faa21b',
        fillOpacity: 0.5,
      }).bindPopup(`
                <b>Código Postal:</b> ${item.codigo_postal}<br>
                <b>Trabajadores:</b> ${item.trabajadores}
            `);

      circleLayer.addLayer(circle);
    });

    circleLayer.addTo(map);

    // Ajustar tamaño dinámico de los círculos al cambiar el nivel de zoom
    map.on("zoomend", () => {
      const zoomFactor = map.getZoom() / 15; // Relación del zoom inicial (15)
      circleLayer.eachLayer((layer) => {
        layer.setRadius(baseRadius * zoomFactor);
      });
    });
  };

  // Función para consumir el API y cargar los datos
  const cargarDatosMapa = async () => {
    try {
      const response = await fetch("https://sanjuandelrio.gob.mx/tramites-sjr/Api/principal/markerMap", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`, // Agregar el token al header
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();

        if (result.success) {
          // Inicialmente mostrar marcadores
          mostrarMarcadores(map, result.data);
        } else {
          alert("No se encontraron datos para mostrar en el mapa.");
        }
      } else {
        //alert("Error al cargar los datos del mapa: " + response.status);
      }
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      alert("Ocurrió un error al cargar los datos.");
    }
  };

  // Configurar los botones para alternar entre mapas
  document.getElementById("load-markers").addEventListener("click", async () => {
    const response = await fetch("https://sanjuandelrio.gob.mx/tramites-sjr/Api/principal/markerMap", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        mostrarMarcadores(map, result.data);
      }
    }
  });

  document.getElementById("load-circles").addEventListener("click", async () => {
    const response = await fetch("https://sanjuandelrio.gob.mx/tramites-sjr/Api/principal/circleMap", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        mostrarCirculos(map, result.data);
      }
    }
  });

  // Mostrar el mapa de marcadores por defecto
  await cargarDatosMapa();
});





// Llamar a la función para cargar la gráfica
document.addEventListener('DOMContentLoaded', cargarGraficaCodigosPostales);

function logout() {
  localStorage.removeItem('token'); // Elimina el token
  window.location.href = 'https://sanjuandelrio.gob.mx/tramites-sjr/public/login.html'; // Redirige al login
}

//FORMULARIOS
// Manejo de apertura y cierre de modales
function openModal(type) {
  if (type === 'vistoBueno') {
    document.getElementById('modal').style.display = 'flex';
  } else if (type === 'becas') {
    document.getElementById('modalBecas').style.display = 'flex';
  }
}

function closeModal(type) {
  if (type === 'vistoBueno') {
    document.getElementById('modal').style.display = 'none';
  } else if (type === 'becas') {
    document.getElementById('modalBecas').style.display = 'none';
  }
}

// Función para mostrar el modal de confirmación
function showConfirmationModal(type) {
  if (type === 'vistoBueno') {
    document.getElementById('confirmationModalVistoBueno').style.display = 'flex';
  } else if (type === 'becas') {
    document.getElementById('confirmationModalBecas').style.display = 'flex';
  }
}

// Configuración de botones Next y Prev
function setupStepNavigation(formId) {
  const formContainer = document.getElementById(formId);
  let currentStep = 1;

  const nextButtons = formContainer.querySelectorAll('.next');
  const prevButtons = formContainer.querySelectorAll('.prev');

  nextButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const currentFormStep = formContainer.querySelector(`.form-step[data-step="${currentStep}"]`);
      const inputs = currentFormStep.querySelectorAll('input');

      let valid = true;
      inputs.forEach((input) => {
        const errorMessage = input.nextElementSibling;
        if (!input.checkValidity()) {
          valid = false;
          errorMessage.style.display = 'block';
        } else {
          errorMessage.style.display = 'none';
        }
      });

      if (valid) {
        currentStep++;
        updateStepUI(formContainer, currentStep);
      }
    });
  });

  prevButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        updateStepUI(formContainer, currentStep);
      }
    });
  });
}

// Actualiza la UI de los pasos
function updateStepUI(formContainer, currentStep) {
  const steps = formContainer.querySelectorAll('.step'); // Pasos del stepper
  const formSteps = formContainer.querySelectorAll('.form-step'); // Contenido de los pasos

  steps.forEach((step, index) => {
    const circle = step.querySelector('.circle');
    if (index + 1 < currentStep) {
      // Pasos anteriores
      step.classList.add('active');
      circle.style.backgroundColor = '#faa21b'; // Colorear círculo
    } else if (index + 1 === currentStep) {
      // Paso actual
      step.classList.add('active');
      circle.style.backgroundColor = '#faa21b';
    } else {
      // Pasos futuros
      step.classList.remove('active');
      circle.style.backgroundColor = '#e0e0e0';
    }
  });

  formSteps.forEach((formStep, index) => {
    if (index + 1 === currentStep) {
      formStep.classList.add('active'); // Muestra el paso actual
    } else {
      formStep.classList.remove('active'); // Oculta los pasos no actuales
    }
  });
}

// Configuración de formularios
setupStepNavigation('stepForm'); // Configuración para "Visto Bueno"
setupStepNavigation('stepFormBecas'); // Configuración para "Becas"

// Manejo de envío de formularios
const formVistoBueno = document.getElementById('stepForm');
const formBecas = document.getElementById('stepFormBecas');

formVistoBueno.addEventListener('submit', (e) => {
  e.preventDefault();
  closeModal('vistoBueno'); // Cerrar el modal del formulario
  setTimeout(() => showConfirmationModal('vistoBueno'), 300); // Mostrar el modal de confirmación
});

formBecas.addEventListener('submit', (e) => {
  e.preventDefault();
  closeModal('becas'); // Cerrar el modal del formulario
  setTimeout(() => showConfirmationModal('becas'), 300); // Mostrar el modal de confirmación
});

// Cerrar los modales de confirmación
document.getElementById('closeConfirmationVistoBueno').addEventListener('click', () => {
  document.getElementById('confirmationModalVistoBueno').style.display = 'none';
});
