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

document.addEventListener('DOMContentLoaded', () => {
    const email = localStorage.getItem('recoveryEmail');
    const code = localStorage.getItem('recoveryCode');

    if (email && code) {
        document.getElementById('email').value = email;
        document.getElementById('code').value = code;
    } else {
        alert('No se encontraron datos de recuperación. Por favor, inicia el proceso de nuevo.');
        window.location.href = '/tramites-sjr/public/forgot-password.html';
    }
});

async function resetPassword() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const code = document.getElementById('code').value;

    if (!email || !password || !confirmPassword || !code) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden.');
        return;
    }

    try {
        const response = await fetch('https://sanjuandelrio.gob.mx/tramites-sjr/Api/principal/reset_password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, code }),
        });

        const data = await response.json();

        if (data.success) {
            alert(data.message);
            localStorage.clear();
            window.location.href = 'https://www.sanjuandelrio.gob.mx/tramites-sjr/public/login.html';
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al procesar tu solicitud.');
    }
}
