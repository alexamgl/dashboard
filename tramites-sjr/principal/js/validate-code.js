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

    const email = localStorage.getItem('recoveryEmail');

    if (email) {
        document.getElementById('email').value = email;
    } else {
        alert('No se encontraron datos de recuperación. Por favor, inicia el proceso de nuevo.');
        window.location.href = 'https://www.sanjuandelrio.gob.mx/tramites-sjr/public/forgot-password.html';
    }
  });

async function validateCode() {
    const email = document.getElementById('email').value;
    const code = document.getElementById('code').value;

    if (!email || !code) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    try {
        const response = await fetch('https://sanjuandelrio.gob.mx/tramites-sjr/Api/principal/validate_recovery_code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, code }),
        });

        const data = await response.json();

        if (data.success) {
            alert(data.message);

            // Guardar en localStorage
            localStorage.setItem('recoveryCode', code);
            localStorage.setItem('recoveryEmail', email);

            // Redirigir a la página de restablecimiento
            window.location.href = 'https://www.sanjuandelrio.gob.mx/tramites-sjr/public/reset-password.html';
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al procesar tu solicitud.');
    }
}
