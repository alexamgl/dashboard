console.log("Archivo JavaScript cargado");

// Variables globales
let userData = {};
let lastActivityTime = Date.now();

// Roles y permisos
const roleConfig = {
    admin: {
        sidebar: [
            { id: 'overview', icon: 'fas fa-home', label: 'Overview' },
            { id: 'reports', icon: 'fas fa-file-alt', label: 'Reports' },
            { id: 'analytics', icon: 'fas fa-chart-line', label: 'Analytics' },
            { id: 'settings', icon: 'fas fa-cog', label: 'Settings' },
            { id: 'registered-users', icon: 'fas fa-users', label: 'Usuarios registrados' },
            { id: 'registered-workers', icon: 'fas fa-briefcase', label: 'Trabajadores registrados' }
        ],
        sections: ['overview', 'reports', 'analytics', 'settings', 'registered-users', 'registered-workers']
    },
    user: {
        sidebar: [
            { id: 'overview', icon: 'fas fa-home', label: 'Overview' },
            { id: 'tramites-user', icon: 'fas fa-file-signature', label: 'Trámites' },
            { id: 'mis-datos', icon: 'fas fa-id-card', label: 'Mis datos' }
        ],
        sections: ['overview', 'tramites-user', 'mis-datos']
    }
};

// Validación del token
function validateToken() {
    const token = localStorage.getItem('token');
    if (!token) {
        redirectToLogin("Tu sesión ha expirado. Por favor, inicia sesión.");
        return null;
    }

    try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);

        if (decoded.exp < currentTime) {
            redirectToLogin("Tu sesión ha expirado. Por favor, inicia sesión.");
            return null;
        }

        return decoded;
    } catch (error) {
        console.error("Error al validar el token:", error);
        redirectToLogin("Hubo un problema con tu sesión. Por favor, inicia sesión nuevamente.");
    }
}

// Redirigir al login
function redirectToLogin(message) {
    alert(message);
    localStorage.removeItem('token');
    window.location.href = 'https://sanjuandelrio.gob.mx/tramites-sjr/public/login.html';
}

// Construir el dashboard
function buildDashboard(decodedToken) {
    const role = decodedToken.role;
    const navList = document.getElementById('nav-list');
    const sectionsContainer = document.getElementById('sections-container');

    const roleData = roleConfig[role];
    if (!roleData) {
        redirectToLogin("Acceso no permitido.");
        return;
    }

    // Construir el menú lateral
    roleData.sidebar.forEach(item => {
        const li = document.createElement('li');
        li.setAttribute('onclick', `toggleVisibility('${item.id}', this)`);
        li.innerHTML = `
            <span class="indicator"></span>
            <i class="${item.icon}"></i>
            <span>${item.label}</span>
        `;
        navList.appendChild(li);
    });

    // Construir las secciones
    roleData.sections.forEach(section => {
        const div = document.createElement('div');
        div.id = section;
        div.className = 'section hidden';
        div.innerHTML = generateSectionContent(section);
        sectionsContainer.appendChild(div);
    });

    // Mostrar datos del usuario
    document.getElementById('user-name').textContent = decodedToken.sub || 'Usuario';
    document.getElementById('user-role').textContent = `Rol: ${role}`;
}

// Generar contenido para las secciones
function generateSectionContent(sectionId) {
    switch (sectionId) {
        case 'overview':
            return '<h2>Overview</h2><div class="cards"><div class="card">Card 1</div><div class="card">Card 2</div></div>';
        case 'reports':
            return '<h2>Reports</h2><div class="chart">Report Chart 1</div><div class="chart">Report Chart 2</div>';
        case 'analytics':
            return '<h2>Analytics</h2><div class="chart">Analytics Content</div>';
        case 'settings':
            return '<h2>Settings</h2><div>Configuración del sistema</div>';
        case 'registered-users':
            return '<h2>Usuarios Registrados</h2><table id="registered-users-table"></table>';
        case 'mis-datos':
            return '<h2>Mis Datos</h2><div class="profile-container"><p>Datos del usuario...</p></div>';
        default:
            return `<h2>${sectionId}</h2>`;
    }
}

// Alternar visibilidad de secciones
function toggleVisibility(sectionId, element) {
    document.querySelectorAll('.section').forEach(section => section.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');

    document.querySelectorAll('.nav li').forEach(li => li.classList.remove('active'));
    element.classList.add('active');
}

// Control de inactividad
function resetActivityTimer() {
    lastActivityTime = Date.now();
}

function checkInactivity() {
    const currentTime = Date.now();
    if (currentTime - lastActivityTime > 3600000) {
        redirectToLogin("Tu sesión ha expirado por inactividad. Por favor, inicia sesión nuevamente.");
    }
}

// Eventos de actividad del usuario
document.addEventListener('mousemove', resetActivityTimer);
document.addEventListener('keydown', resetActivityTimer);
setInterval(checkInactivity, 60000);

// Inicializar el dashboard
document.addEventListener('DOMContentLoaded', () => {
    const decodedToken = validateToken();
    if (decodedToken) {
        buildDashboard(decodedToken);
    }
});
