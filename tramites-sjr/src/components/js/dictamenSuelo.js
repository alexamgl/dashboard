/****************************************************************************************** */
/***********************FUNCIONES PARA ABRIR Y CERRAR CARDS DE INFORMACIÓN***************** */
/****************************************************************************************** */

function showModalInfoDicSuelo(id) {
  document.getElementById(id)?.classList.add('show');
}

function closeModalInfoDicSuelo(id) {
  document.getElementById(id)?.classList.remove('show');
}

/********************************************************************************************* */
/**********FUNCIONES PARA MOSTRAR Y OCULTAR CONTENEDORES DE INFO Y FORMULARIO***************** */
/********************************************************************************************* */


document.getElementById('toggleTramiteDicSuelo')?.addEventListener('click', () => {
  document.querySelector('.ContenedorCardsDashboard')?.classList.toggle('hiddenDicSuelo');
  document.querySelector('.modalInfoTramiteDicSuelo')?.classList.toggle('hiddenDicSuelo');
});

// Volver al menú principal
document.getElementById('btnVolverDicSuelo')?.addEventListener('click', () => {
  document.querySelector('.ContenedorCardsDashboard')?.classList.toggle('hiddenDicSuelo');
  document.querySelector('.modalInfoTramiteDicSuelo')?.classList.toggle('hiddenDicSuelo');
}); 

// Mostrar el formulario de trámite y ocultar la información
document.getElementById('toggleTramiteFormDicSuelo')?.addEventListener('click', () => {
  //console.log("Mostrando formulario del trámite...");
  document.querySelector('.modalInfoTramiteDicSuelo')?.classList.add('hiddenDicSuelo');
  document.querySelector('.containerFormTramiteDicSuelo')?.classList.remove('hiddenDicSuelo');

  // Inicializar el stepper cuando se muestra el formulario
  initStepperDicSuelo();
});


//************************************************************************************************** */
//****************FUNCIONAMIENTO DE LOS PASOS Y BOTONES DE EL FORMULARIO**************************** */
//************************************************************************************************** */

// Paso actual del formulario
let currentStepDicSuelo = 0;

// Función para inicializar el stepper
function initStepperDicSuelo() {
  currentStepDicSuelo = 0; // Asegurar que siempre inicie en el paso 0
  const form = document.querySelector('.containerFormTramiteDicSuelo');
  updateStepVisibilityDicSuelo(form); // Llamar a la actualización inicial de los pasos
}

// Asegurarse de que el código se ejecute cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  const formContainers = document.querySelectorAll(".containerFormTramiteDicSuelo");

  formContainers.forEach((form) => {
    const nextButton = form.querySelectorAll(".btnNextDicSuelo");
    const prevButton = form.querySelectorAll(".btnPrevDicSuelo");
    const btnVolverAInfo = form.querySelector(".btnVolverAInfo");
    const btnConfirmarDicSuelo = form.querySelector(".btnConfirmarDicSuelo");

    // Evento para avanzar al siguiente paso
    nextButton.forEach((button) => {
      button.addEventListener("click", () => handleNextStepDicSuelo(form));
    });

    // Evento para retroceder al paso anterior
    prevButton.forEach((button) => {
      button.addEventListener("click", () => handlePrevStepDicSuelo(form));
    });

    // Evento para "Volver"
    if (btnVolverAInfo) {
      btnVolverAInfo.addEventListener('click', () => {
        document.querySelector('.modalInfoTramiteDicSuelo')?.classList.remove('hiddenDicSuelo');
        document.querySelector('.containerFormTramiteDicSuelo')?.classList.add('hiddenDicSuelo');
      });
    }

    // Evento para "Confirmar"
    if (btnConfirmarDicSuelo) {
      btnConfirmarDicSuelo.addEventListener('click', () => {
        // Ocultar el formulario
        document.querySelector('.containerFormTramiteDicSuelo')?.classList.add('hiddenDicSuelo');
        
        // Mostrar el dashboard
        document.querySelector('.ContenedorCardsDashboard')?.classList.remove('hiddenDicSuelo');
        
        // **Opcional: Resetear el formulario si es necesario**
        // document.querySelector('.containerFormTramiteDicSuelo form')?.reset();
      });
    }
  });
});


//******************************************************************************************* */
//*****************FUNCION QUE ACTUALIZA LA VISIBILIDAD DE EL FORMULARIO********************* */
//******************************************************************************************* */


// Función para actualizar la visibilidad de los pasos
function updateStepVisibilityDicSuelo(form) {
  const steps = form.querySelectorAll(".form-step");
  const stepperItems = document.querySelectorAll(".stepperDicSuelo .stepDicSuelo");
  

  if (!steps.length || !stepperItems.length) {
     // console.warn("⚠️ No se encontraron los pasos o el stepper.");
      return;
  }

  //console.log("🔄 Cambiando visibilidad al paso:", currentStepDicSuelo);

  // Ocultar todos los pasos del formulario y mostrar solo el actual
  steps.forEach((step, index) => {
      step.style.display = index === currentStepDicSuelo ? "block" : "none";
  });

  //****************FUNCION QUE AJUSTA EL STEPPER CUANDO SE HACE RESPONSIVE******************** */

  // Detectar tamaño de pantalla en vivo y ajustar la visibilidad
  function adjustStepperView() {
      if (window.innerWidth <= 768) {
          // En modo móvil: Solo se muestra el paso actual
          stepperItems.forEach((stepper, index) => {
              stepper.classList.remove("active", "completed"); // Limpia estilos
              stepper.style.display = "none"; // Oculta todos los pasos

              if (index === currentStepDicSuelo) {
                  stepper.classList.add("active"); // Solo el paso actual
                  stepper.style.display = "flex"; // Se muestra
              }
          });
      } else {
          // En PC: Mostrar todos los pasos y marcar los anteriores como completados
          stepperItems.forEach((stepper, index) => {
              stepper.style.display = "flex"; // Asegura que todos sean visibles
              stepper.classList.remove("active", "completed"); // Limpia clases

              if (index < currentStepDicSuelo) {
                  stepper.classList.add("completed"); // Pasos anteriores completados
              } else if (index === currentStepDicSuelo) {
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
  const form = document.querySelector(".containerFormTramiteDicSuelo");
  if (form) {
      updateStepVisibilityDicSuelo(form);
  }
});


//************************************************************************************************* */
//*****************FUNCIONAMIENTO DE LOS BOTONES SIGUIENTE Y VOLVER******************************** */
//************************************************************************************************* */

// Función para avanzar al siguiente paso
function handleNextStepDicSuelo(form) {
  const steps = form.querySelectorAll(".form-step");

  if (currentStepDicSuelo < steps.length - 1) {
    currentStepDicSuelo++; // Incrementar el paso actual
    console.log("Avanzando al paso:", currentStepDicSuelo); // Verifica que el paso se actualiza
    updateStepVisibilityDicSuelo(form); // Actualizar la visibilidad de los pasos
    
  } else {
    //console.log("Ya estás en el último paso.");
  }
}

// Función para retroceder al paso anterior
function handlePrevStepDicSuelo(form) {
  if (currentStepDicSuelo > 0) {
    currentStepDicSuelo--; // Retroceder el paso actual
    //console.log("Retrocediendo al paso:", currentStepDicSuelo);
    updateStepVisibilityDicSuelo(form); // Actualizar la visibilidad de los pasos
  } else {
    //console.log("Ya estás en el primer paso.");
  }
}
