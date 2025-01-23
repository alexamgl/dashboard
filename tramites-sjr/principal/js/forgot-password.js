function loadComponent(id, file) {
    fetch(`/tramites-sjr/src/components/${file}`)
        .then(response => {
            if (!response.ok) throw new Error("Error loading component");
            return response.text();
        })
        .then(html => {
            document.getElementById(id).innerHTML = html;
        })
        .catch(error => console.error(error));
}

document.addEventListener("DOMContentLoaded", () => {
    loadComponent("header", "header.html");
    loadComponent("footer", "footer.html");
});

// Función para mostrar el modal con el mensaje y el tipo de alerta (error o éxito)
function showModal(message, type) {
    const modal = document.getElementById('alertModal');
    const modalMessage = document.getElementById('modalMessage');
    const modalIcon = document.getElementById('modalIcon');
    const modalContent = document.querySelector('.modal-content');
    const modalCloseButton = document.getElementById('modalClose');

    // Establecer el mensaje
    modalMessage.textContent = message;

    // Cambiar el estilo según el tipo de mensaje (error o éxito)
    if (type === 'error') {
        modalIcon.innerHTML = '<i class="fas fa-times-circle"></i>';  // Icono de error (X)
        modalContent.classList.add('modal-error');
        modalContent.classList.remove('modal-success');
    } else if (type === 'success') {
        modalIcon.innerHTML = '<i class="fas fa-check-circle"></i>';  // Icono de éxito (Palomita)
        modalContent.classList.add('modal-success');
        modalContent.classList.remove('modal-error');
    }

    // Mostrar el modal
    modal.style.display = 'flex';

    // Función de cierre automático después de 4 segundos
    setTimeout(() => {
        modal.style.animation = 'fadeOut 0.5s ease-out';  // Cierre con animación
        setTimeout(() => {
            modal.style.display = 'none';
            modal.style.animation = ''; // Resetear la animación para futuros usos
        }, 500); // Esperar a que termine la animación
    }, 4000);  // 4 segundos de duración del modal

    // Función de cierre cuando se hace clic en el botón de "X"
    modalCloseButton.onclick = function () {
        modal.style.animation = 'fadeOut 0.5s ease-out';
        setTimeout(() => {
            modal.style.display = 'none';
            modal.style.animation = ''; // Resetear la animación
        }, 500);
    };
}

// Función para validar el correo
function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

// Función para validar CURP / RFC
function validateCurpOrRfc(identifier) {
    const curpRegex = /^[A-Z0-9]{18}$/;  // CURP debe tener 18 caracteres y ser solo mayúsculas y números
    const rfcRegex = /^[A-Z0-9]{12,13}$/;  // RFC puede tener 12 o 13 caracteres, solo mayúsculas y números

    return curpRegex.test(identifier) || rfcRegex.test(identifier);
}

// Función para validar que solo se permitan letras mayúsculas y números en CURP/RFC
function allowUpperCaseAndNumbers(event) {
    const input = event.target;
    input.value = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '');  // Solo permite mayúsculas y números
}

// Función para validar correo en tiempo real
function allowValidEmailCharacters(event) {
    const input = event.target;
    // Solo permite letras, números y caracteres válidos para un correo
    input.value = input.value.replace(/[^a-zA-Z0-9._%+-@]/g, '');
}

// Función para validar y procesar la solicitud de recuperación de contraseña
async function requestRecoveryCode() {
    const email = document.getElementById('email').value;
    const identifier = document.getElementById('identifier').value;
    const emailInput = document.getElementById('email');
    const identifierInput = document.getElementById('identifier');

    // Validar el correo
    if (!validateEmail(email)) {
        showModal('Por favor ingresa un correo válido.', 'error');
        emailInput.focus();  // Enfocar el campo de correo
        return;
    }

    // Validar el CURP/RFC
    if (!validateCurpOrRfc(identifier)) {
        showModal('El CURP o RFC no es válido. Asegúrate de que solo contenga mayúsculas y números, y tenga la longitud adecuada.', 'error');
        identifierInput.focus();  // Enfocar el campo de CURP/RFC
        return;
    }

    try {
        const response = await fetch('https://sanjuandelrio.gob.mx/tramites-sjr/Api/principal/request_password_reset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, identifier }),
        });

        const data = await response.json();
        localStorage.setItem('recoveryEmail', email);

        if (data.success) {
            showModal(data.message, 'success');
            window.location.href = 'https://sanjuandelrio.gob.mx/tramites-sjr/public/validate-code.html';

        } else {
            showModal(data.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showModal('Hubo un error al procesar tu solicitud.', 'error');
    }
}

// Asignar eventos a los inputs para validaciones en tiempo real
document.getElementById('email').addEventListener('input', allowValidEmailCharacters);
document.getElementById('identifier').addEventListener('input', allowUpperCaseAndNumbers);
