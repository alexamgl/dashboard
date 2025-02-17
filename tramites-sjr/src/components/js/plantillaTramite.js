/****************************************************************************************** */
/************FUNCIONES PARA ABRIR Y CERRAR CARDS DE INFORMACIÓN**************************** */
/****************************************************************************************** */

function showModalInfoPlantilla(id) {
  document.getElementById(id)?.classList.add('show');
}

function closeModalInfoPlantilla(id) {
  document.getElementById(id)?.classList.remove('show');
}

/********************************************************************************************* */
/**********FUNCIONES PARA MOSTRAR Y OCULTAR CONTENEDORES DE INFO Y FORMULARIO***************** */
/********************************************************************************************* */


document.getElementById('toggleTramitePlantilla')?.addEventListener('click', () => {
  document.querySelector('.ContenedorCardsDashboard')?.classList.toggle('hiddenPlantilla');
  document.querySelector('.modalInfoTramitePlantilla')?.classList.toggle('hiddenPlantilla');
});

// Volver al menú principal
document.getElementById('btnVolverPlantilla')?.addEventListener('click', () => {
  document.querySelector('.ContenedorCardsDashboard')?.classList.toggle('hiddenPlantilla');
  document.querySelector('.modalInfoTramitePlantilla')?.classList.toggle('hiddenPlantilla');
});

// Mostrar el formulario de trámite y ocultar la información
document.getElementById('toggleTramiteFormPlantilla')?.addEventListener('click', () => {
  //console.log("Mostrando formulario del trámite...");
  document.querySelector('.modalInfoTramitePlantilla')?.classList.add('hiddenPlantilla');
  document.querySelector('.containerFormTramitePlantilla')?.classList.remove('hiddenPlantilla');

  // Inicializar el stepper cuando se muestra el formulario
  initStepperPlantilla();
});



//************************************************************************************************** */
//****************FUNCIONAMIENTO DE LOS PASOS Y BOTONES DE EL FORMULARIO**************************** */
//************************************************************************************************** */


// Paso actual del formulario
let currentStepPlantilla = 0;

// Función para inicializar el stepper
function initStepperPlantilla() {
  currentStepPlantilla = 0; // Asegurar que siempre inicie en el paso 0
  const form = document.querySelector('.containerFormTramitePlantilla');
  updateStepVisibilityPlantilla(form); // Llamar a la actualización inicial de los pasos
}

// Asegurarse de que el código se ejecute cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  const formContainers = document.querySelectorAll(".containerFormTramitePlantilla");

  formContainers.forEach((form) => {
    const nextButton = form.querySelectorAll(".btnNextPlantilla");
    const prevButton = form.querySelectorAll(".btnPrevPlantilla");
    const btnVolverAInfo = form.querySelector(".btnVolverAInfo");
    const btnConfirmarPlantilla = form.querySelector(".btnConfirmarPlantilla");

    // Evento para avanzar al siguiente paso
    nextButton.forEach((button) => {
      button.addEventListener("click", () => handleNextStepPLantilla(form));
    });

    // Evento para retroceder al paso anterior
    prevButton.forEach((button) => {
      button.addEventListener("click", () => handlePrevStepPlantilla(form));
    });

    // Evento para "Volver"
    if (btnVolverAInfo) {
      btnVolverAInfo.addEventListener('click', () => {
        document.querySelector('.modalInfoTramitePlantilla')?.classList.remove('hiddenPlantilla');
        document.querySelector('.containerFormTramitePlantilla')?.classList.add('hiddenPlantilla');
      });
    }

    // Evento para "Confirmar"
    if (btnConfirmarPlantilla) {
      btnConfirmarPlantilla.addEventListener('click', () => {
        // Ocultar el formulario
        document.querySelector('.containerFormTramitePlantilla')?.classList.add('hiddenPlantilla');
        
        // Mostrar el dashboard
        document.querySelector('.ContenedorCardsDashboard')?.classList.remove('hiddenPlantilla');
        
        // **Opcional: Resetear el formulario si es necesario**
        // document.querySelector('.containerFormTramitePlantilla form')?.reset();
      });
    }
  });
});


//******************************************************************************************* */
//*****************FUNCION QUE ACTUALIZA LA VISIBILIDAD DE EL FORMULARIO********************* */
//******************************************************************************************* */


// Función para actualizar la visibilidad de los pasos
function updateStepVisibilityPlantilla(form) {
  const steps = form.querySelectorAll(".form-step");
  const stepperItems = document.querySelectorAll(".stepperPlantilla .stepPlantilla");

  if (!steps.length || !stepperItems.length) {
     // console.warn("⚠️ No se encontraron los pasos o el stepper.");
      return;
  }

  //console.log("🔄 Cambiando visibilidad al paso:", currentStepPlantilla);

  // Ocultar todos los pasos del formulario y mostrar solo el actual
  steps.forEach((step, index) => {
      step.style.display = index === currentStepPlantilla ? "block" : "none";
  });

  //****************FUNCION QUE AJUSTA EL STEPPER CUANDO SE HACE RESPONSIVE******************** */

  // Detectar tamaño de pantalla en vivo y ajustar la visibilidad
  function adjustStepperView() {
      if (window.innerWidth <= 768) {
          // En modo móvil: Solo se muestra el paso actual
          stepperItems.forEach((stepper, index) => {
              stepper.classList.remove("active", "completed"); // Limpia estilos
              stepper.style.display = "none"; // Oculta todos los pasos

              if (index === currentStepPlantilla) {
                  stepper.classList.add("active"); // Solo el paso actual
                  stepper.style.display = "flex"; // Se muestra
              }
          });
      } else {
          // En PC: Mostrar todos los pasos y marcar los anteriores como completados
          stepperItems.forEach((stepper, index) => {
              stepper.style.display = "flex"; // Asegura que todos sean visibles
              stepper.classList.remove("active", "completed"); // Limpia clases

              if (index < currentStepPlantilla) {
                  stepper.classList.add("completed"); // Pasos anteriores completados
              } else if (index === currentStepPlantilla) {
                  stepper.classList.add("active"); // Paso actual resaltado
              }
          });
      }
  }
  // Ajustar la vista al cargar
  adjustStepperView();

  // Escuchar cambios en el tamaño de la pantalla y ajustar en tiempo real
  window.addEventListener("resize", adjustStepperView);
}

// Llamar a la función cuando la página se carga
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".containerFormTramitePlantilla");
  if (form) {
      updateStepVisibilityPlantilla(form);
  }
});


//************************************************************************************************* */
//*****************FUNCIONAMIENTO DE LOS BOTONES SIGUIENTE Y VOLVER******************************** */
//************************************************************************************************* */

// Función para avanzar al siguiente paso
function handleNextStepPlantilla(form) {
  const steps = form.querySelectorAll(".form-step");

  if (currentStepPlantilla < steps.length - 1) {
    currentStepPlantilla++; // Incrementar el paso actual
    //console.log("Avanzando al paso:", currentStepPlantilla); // Verifica que el paso se actualiza
    updateStepVisibilityPlantilla(form); // Actualizar la visibilidad de los pasos
  } else {
    //console.log("Ya estás en el último paso.");
  }
}

// Función para retroceder al paso anterior
function handlePrevStepPlantilla(form) {
  if (currentStepPlantilla > 0) {
    currentStepPlantilla--; // Retroceder el paso actual
    //console.log("Retrocediendo al paso:", currentStepPlantilla);
    updateStepVisibilityPlantilla(form); // Actualizar la visibilidad de los pasos
  } else {
    //console.log("Ya estás en el primer paso.");
  }
}
