function validarCURP(inputId) {
    const input = document.getElementById(inputId);
  
    // Expresión regular progresiva para validar la estructura paso a paso
    const regexEstructura = [
      /^[A-Z]{0,4}$/,                 // Las primeras 4 letras
      /^[A-Z]{4}\d{0,6}$/,            // 4 letras + hasta 6 números (fecha de nacimiento)
      /^[A-Z]{4}\d{6}[HM]?$/,         // Género después de la fecha
      /^[A-Z]{4}\d{6}[HM][A-Z]{0,2}$/, // Código de estado (2 letras)
      /^[A-Z]{4}\d{6}[HM][A-Z]{2}[A-Z]{0,3}$/, // Consonantes internas (3 letras)
      /^[A-Z]{4}\d{6}[HM][A-Z]{2}[A-Z]{3}[A-Z]$/, // Penúltimo carácter alfanumérico
      /^[A-Z]{4}\d{6}[HM][A-Z]{2}[A-Z]{3}[A-Z]\d?$/ // Último carácter numérico
    ];
  
    input.addEventListener('input', () => {
      const valor = input.value.toUpperCase().replace(/[^A-Z0-9]/g, ""); // Convertir a mayúsculas y eliminar caracteres no válidos
      input.value = valor; // Actualizar el valor
  
      // Verificar progresivamente la estructura
      for (const regex of regexEstructura) {
        if (regex.test(valor) && valor.length <= 18) {
          return; // Si cumple con la estructura actual, permite seguir escribiendo
        }
      }
  
      // Si no cumple, revertir el último carácter inválido
      input.value = valor.slice(0, -1); // Eliminar el carácter no válido
    });
  }
  
  
function ValidarNombres(inputId) {
    const input = document.getElementById(inputId);
  
    // Expresión regular para letras mayúsculas, espacios y punto
    const regex = /^[A-Z .]*$/;
  
    input.addEventListener('input', () => {
      input.value = input.value
        .toUpperCase() // Convertir todo a mayúsculas
        .replace(/[^A-Z .]/g, ""); // Remover caracteres no permitidos
    });
  }
  
  function ValidarLugarNacimiento(inputId) {
    const input = document.getElementById(inputId);
    
    // Expresión regular para permitir solo letras mayúsculas y espacios
    const regex = /^[A-Z ]*$/;
  
    // Remover caracteres inválidos al perder el foco
    input.value = input.value
      .toUpperCase() // Convertir todo a mayúsculas
      .replace(/[^A-Z ]/g, ""); // Eliminar caracteres no permitidos
  }

  function validarCalle(inputId) {
    const input = document.getElementById(inputId);
  
  // Expresión regular para letras mayúsculas, números, espacios, puntos, guiones y diagonales
  const regex = /^[A-Z0-9 .\/-]*$/;

  // Detectar cambios mientras se escribe
  input.addEventListener('input', () => {
    input.value = input.value
      .toUpperCase() // Convertir a mayúsculas
      .replace(/[^A-Z0-9 .\/-]/g, ""); // Eliminar caracteres no permitidos
  });
  }
  
  function validarNumeroCasa(inputId) {
    const input = document.getElementById(inputId);
  
    // Expresión regular para permitir letras mayúsculas, números, guiones y diagonales
    const regex = /^[A-Z0-9\/-]*$/;
  
    // Detectar cambios mientras se escribe
    input.addEventListener('input', () => {
      input.value = input.value
        .toUpperCase() // Convertir a mayúsculas
        .replace(/[^A-Z0-9\/-]/g, ""); // Eliminar caracteres no permitidos
    });
  }
  
  function validarColonias(inputId) {
    const input = document.getElementById(inputId);
  
    // Expresión regular para permitir letras mayúsculas, números, espacios, puntos y guiones
    const regex = /^[A-Z0-9 .-]*$/;
  
    // Detectar cambios mientras se escribe
    input.addEventListener('input', () => {
      input.value = input.value
        .toUpperCase() // Convertir a mayúsculas
        .replace(/[^A-Z0-9 .-]/g, ""); // Eliminar caracteres no permitidos
    });
  }
  
  function validarMunicipio(inputId) {
    const input = document.getElementById(inputId);
  
    // Expresión regular para permitir letras mayúsculas, números, espacios, puntos y guiones
    const regex = /^[A-Z0-9 .-]*$/;
  
    // Detectar cambios mientras se escribe
    input.addEventListener('input', () => {
      input.value = input.value
        .toUpperCase() // Convertir a mayúsculas
        .replace(/[^A-Z0-9 .-]/g, ""); // Eliminar caracteres no permitidos
    });
  }
  
  function validarTelefono(inputId) {
    const input = document.getElementById(inputId);
  
    // Detectar cambios mientras se escribe
    input.addEventListener('input', () => {
      // Permitir solo números y limitar a 10 caracteres
      input.value = input.value
        .replace(/[^0-9]/g, "") // Eliminar caracteres no numéricos
        .slice(0, 10); // Limitar a 10 caracteres
    });
  }
  
  function validarSelect(inputId) {
    const select = document.getElementById(inputId);
  
    // Detectar cuando pierde el foco o se intenta enviar
    if (select.value === "" || select.value === "Selecciona una opción") {
      alert("Por favor, selecciona una opción válida.");
      select.focus(); // Devuelve el enfoque al select
      return false;
    }
    return true; // Es válido
  }
  
  function validarNombreInstitucion(inputId) {
    const input = document.getElementById(inputId);
  
    // Detectar cambios mientras se escribe
    input.addEventListener('input', () => {
      input.value = input.value
        .toUpperCase() // Convertir a mayúsculas
        .replace(/[^A-Z0-9 .&\/-]/g, ""); // Eliminar caracteres no permitidos
    });
  }
  
  function validarPromedioEstudiante(inputId) {
    const input = document.getElementById(inputId);
  
    // Detectar cambios mientras se escribe
    input.addEventListener('input', () => {
      // Permitir solo un dígito, un punto y otro dígito (formato X.Y)
      input.value = input.value
        .replace(/[^0-9.]/g, "") // Eliminar caracteres no válidos
        .replace(/(\..*?)\./g, ".") // Permitir solo un punto
        .replace(/^(\d?\.\d?).*/, "$1"); // Limitar a un dígito, punto y otro dígito
  
      // Validar que el número esté en el rango 0.0 a 10.0
      const valor = parseFloat(input.value);
  
      if (valor > 10) {
        input.value = "10"; // Forzar al máximo permitido
      } else if (valor < 0) {
        input.value = "0"; // Forzar al mínimo permitido
      }
    });
  
    // Detectar cuando pierde el foco para limpiar entradas incompletas
    input.addEventListener('blur', () => {
      if (!/^([0-9](\.[0-9])?|10)$/.test(input.value)) {
        input.value = ""; // Limpiar si el formato no es válido
      }
    });
  }


  function validarOcupacionTutor(inputId) {
    const input = document.getElementById(inputId);
  
    // Detectar cambios mientras se escribe
    input.addEventListener('input', () => {
      // Permitir solo letras mayúsculas, espacios, puntos y guiones
      input.value = input.value
        .toUpperCase() // Convertir todo a mayúsculas
        .replace(/[^A-Z .-]/g, ""); // Eliminar caracteres no permitidos
    });
  }
  
  
  function validarNumeroPersonasHabitan(inputId) {
    const input = document.getElementById(inputId);
  
    // Detectar cambios mientras se escribe
    input.addEventListener('input', () => {
      // Permitir solo números y limitar a 2 dígitos
      input.value = input.value
        .replace(/[^0-9]/g, "") // Eliminar caracteres no numéricos
        .slice(0, 2); // Limitar a 2 caracteres
    });
  }
  
  function validarIngresoMensualFamiliar(inputId) {
    const input = document.getElementById(inputId);
  
    // Detectar cambios mientras se escribe
    input.addEventListener('input', () => {
      // Permitir solo números
      input.value = input.value.replace(/[^0-9]/g, ""); // Eliminar cualquier carácter no numérico
    });
  }
  
  