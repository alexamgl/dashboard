/****************************************************************************************** */
/************FUNCIONES PARA ABRIR Y CERRAR CARDS DE INFORMACIÓN**************************** */
/****************************************************************************************** */

function showModalInfodicSuelo(id) {
    document.getElementById(id)?.classList.add('show');
  }
  
  function closeModalInfodicSuelo(id) {
    document.getElementById(id)?.classList.remove('show');
  }
  

  
  //************************************************************************************************** */
  //****************FUNCIONAMIENTO DE LOS PASOS Y BOTONES DE EL FORMULARIO**************************** */
  //************************************************************************************************** */
  
  
  // Paso actual del formulario
  let currentStepdicSuelo = 0;
  
  // Función para inicializar el stepper
  function initStepperdicSuelo() {
    currentStepdicSuelo = 0; // Asegurar que siempre inicie en el paso 0
    const form = document.querySelector('.containerFormTramitedicSuelo');
    updateStepVisibilitydicSuelo(form); // Llamar a la actualización inicial de los pasos
  }
  
  // Asegurarse de que el código se ejecute cuando el DOM esté completamente cargado
  document.addEventListener("DOMContentLoaded", () => {
    const formContainers = document.querySelectorAll(".containerFormTramitedicSuelo");
  
    formContainers.forEach((form) => {
      const nextButton = form.querySelectorAll(".btnNextdicSuelo");
      const prevButton = form.querySelectorAll(".btnPrevdicSuelo");
      const btnVolverAInfo = form.querySelector(".btnVolverAInfo");
      const btnConfirmardicSuelo = form.querySelector(".btnConfirmardicSuelo");
  
      // Evento para avanzar al siguiente paso
      nextButton.forEach((button) => {
        button.addEventListener("click", () => handleNextStepdicSuelo(form));
      });
  
      // Evento para retroceder al paso anterior
      prevButton.forEach((button) => {
        button.addEventListener("click", () => handlePrevStepdicSuelo(form));
      });
  
      // Evento para "Volver"
      if (btnVolverAInfo) {
        btnVolverAInfo.addEventListener('click', () => {
          document.querySelector('.modalInfoTramitedicSuelo')?.classList.remove('hiddendicSuelo');
          document.querySelector('.containerFormTramitedicSuelo')?.classList.add('hiddendicSuelo');
        });
      }
  
      // Evento para "Confirmar"
      if (btnConfirmardicSuelo) {
        btnConfirmardicSuelo.addEventListener('click', () => {
          // Ocultar el formulario
          document.querySelector('.containerFormTramitedicSuelo')?.classList.add('hiddendicSuelo');
          
          // Mostrar el dashboard
          document.querySelector('.ContenedorCardsDashboard')?.classList.remove('hiddendicSuelo');
          
          // **Opcional: Resetear el formulario si es necesario**
          // document.querySelector('.containerFormTramitedicSuelo form')?.reset();
        });
      }
    });
  });
  
  
  //******************************************************************************************* */
  //*****************FUNCION QUE ACTUALIZA LA VISIBILIDAD DE EL FORMULARIO********************* */
  //******************************************************************************************* */
  
  // Función para actualizar la visibilidad de los pasos
  function updateStepVisibilitydicSuelo(form) {
    const steps = form.querySelectorAll(".form-step");
    const stepperItems = document.querySelectorAll(".stepperdicSuelo .stepdicSuelo");
  
    if (!steps.length || !stepperItems.length) {
       // console.warn("⚠️ No se encontraron los pasos o el stepper.");
        return;
    }
  
    //console.log("🔄 Cambiando visibilidad al paso:", currentStepdicSuelo);
  
    // Ocultar todos los pasos del formulario y mostrar solo el actual
    steps.forEach((step, index) => {
        step.style.display = index === currentStepdicSuelo ? "block" : "none";
    });
  
    //****************FUNCION QUE AJUSTA EL STEPPER CUANDO SE HACE RESPONSIVE******************** */
  
    // Detectar tamaño de pantalla en vivo y ajustar la visibilidad
    function adjustStepperView() {
        if (window.innerWidth <= 768) {
            // En modo móvil: Solo se muestra el paso actual
            stepperItems.forEach((stepper, index) => {
                stepper.classList.remove("active", "completed"); // Limpia estilos
                stepper.style.display = "none"; // Oculta todos los pasos
  
                if (index === currentStepdicSuelo) {
                    stepper.classList.add("active"); // Solo el paso actual
                    stepper.style.display = "flex"; // Se muestra
                }
            });
        } else {
            // En PC: Mostrar todos los pasos y marcar los anteriores como completados
            stepperItems.forEach((stepper, index) => {
                stepper.style.display = "flex"; // Asegura que todos sean visibles
                stepper.classList.remove("active", "completed"); // Limpia clases
  
                if (index < currentStepdicSuelo) {
                    stepper.classList.add("completed"); // Pasos anteriores completados
                } else if (index === currentStepdicSuelo) {
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
  
  /* Llamar a la función est funcion nos sirve para que si el usuario ya tiene un  registro en la base de datos 
     se mande al usuario directamente a el paso de pagos en caso de no haber pagado*/
  document.addEventListener("DOMContentLoaded", async function () {
    const form = document.querySelector(".containerFormTramitedicSuelo");

    if (form) {
        // Obtener los datos del usuario antes de iniciar el formulario
        const id_usuario = 1; // Ajusta el ID dinámicamente si es necesario
        const datosSuelo = await obtenerDatosSuelo(id_usuario);

        if (datosSuelo) {
            // Si el usuario ya tiene datos en la base, lo lleva directamente al paso 4
            currentStepdicSuelo = 4; // Paso 4 (los índices empiezan desde 0)
        } else {
            // Si no tiene datos, comienza desde el paso 1
            currentStepdicSuelo = 0;
        }

        // Inicializar la visibilidad del stepper y los pasos correctamente
        updateStepVisibilitydicSuelo(form);
    }
});
  
  //************************************************************************************************* */
  //*****************FUNCIONAMIENTO DE LOS BOTONES SIGUIENTE Y VOLVER******************************** */
  //************************************************************************************************* */

// Función para avanzar al siguiente paso con validación e inserción en la API
async function handleNextStepdicSuelo(form) {
  // Seleccionamos todos los pasos
  const steps = form.querySelectorAll(".form-step");

  // Verificar si estamos en el último paso antes de enviar a la API
  if (currentStepdicSuelo === steps.length - 1) {
      alert("¡Ya estás en el último paso!");
      return;
  }

 // Verificar que todos los campos del paso actual sean válidos
  if (!validarCamposPasoActual(steps[currentStepdicSuelo])) {
      mostrarModalValidarCampos(); // Mostrar el modal para notificar al usuario que los campos no están completos
      return; // Si la validación falla, no avanzamos al siguiente paso
  }

  // Verificar si el paso actual tiene el botón de insertar datos y subir documentos
  if (steps[currentStepdicSuelo].querySelector('[data-btn="insertAndUploadSuelo"]')) {
      mostrarModalConfirmacion(async () => {
          mostrarModalCargaSuelo("Guardando datos y subiendo documentos...");

          try {
              // 1️⃣ Insertar los datos primero
              const registroExitoso = await RegistroFormDicSueloAPI();
              if (!registroExitoso) {
                  cerrarModalCargaSuelo();
                  mostrarModalResultado("Hubo un error al registrar los datos. Verifica la información e intenta nuevamente.", false);
                  return; // Detener el avance si la inserción falla
              }

              // 2️⃣ Subir los documentos después de insertar los datos
              const id_usuario = 1; // Ajusta según cómo obtengas el ID del usuario
              const subidaExitosa = await subirDocumentosSuelo(id_usuario);

              if (!subidaExitosa) {
                  cerrarModalCargaSuelo();
                  mostrarModalResultado("Error al subir los documentos. Asegúrate de haber subido todos los documentos requeridos.", false);
                  return; // Detener el avance si la subida falla
              }

              // 3️⃣ Si todo es exitoso, avanzar al siguiente paso
              cerrarModalCargaSuelo();
              mostrarModalResultado("Los datos y documentos fueron guardados correctamente.", true);

              if (currentStepdicSuelo < steps.length - 1) {
                  steps[currentStepdicSuelo].classList.remove("active");
                  currentStepdicSuelo++;
                  steps[currentStepdicSuelo].classList.add("active");

                  // Actualizar visibilidad de los pasos
                  updateStepVisibilitydicSuelo(form);
              }
          } catch (error) {
              cerrarModalCargaSuelo();
              mostrarModalResultado("Ocurrió un error inesperado. Intenta nuevamente.", false);
          }
      });

      return; // Detener el flujo hasta que el usuario confirme
  }

  // Si la validación es exitosa y no es un paso de inserción/subida, avanzar normalmente
  if (currentStepdicSuelo < steps.length - 1) {
      steps[currentStepdicSuelo].classList.remove("active");

      // Incrementar el paso actual
      currentStepdicSuelo++;

      steps[currentStepdicSuelo].classList.add("active");

      // Actualizar visibilidad de los pasos (para asegurarnos de que solo se muestra el paso actual)
      updateStepVisibilitydicSuelo(form);
  }
}



// Función para retroceder al paso anterior
function handlePrevStepdicSuelo(form) {
  if (currentStepdicSuelo > 0) {
    currentStepdicSuelo--; // Retroceder el paso actual

    // Actualizar la visibilidad de los pasos
    updateStepVisibilitydicSuelo(form);
  } else {
    console.log("Ya estás en el primer paso.");
  }
}

  // Función para retroceder al paso anterior
  function handlePrevStepdicSuelo(form) {
    if (currentStepdicSuelo > 0) {
      currentStepdicSuelo--; // Retroceder el paso actual
      //console.log("Retrocediendo al paso:", currentStepdicSuelo);
      updateStepVisibilitydicSuelo(form); // Actualizar la visibilidad de los pasos
    } else {
      //console.log("Ya estás en el primer paso.");
    }
  }
  

//#############MODALES DE CONFIRMACION Y RESPUESTA###############

// Función para mostrar el modal de confirmación
function mostrarModalConfirmacion(callback) {
  const modalHTML = `
      <div id="modalConfirmaciondicSuelo" class="modal-overlay">
          <div class="modal-content">
              <h3>Confirmación</h3>
              <img src="./images/advertencia.png" alt="Advertencia" class="icono-advertencia-validar">
              <p>¿Estás seguro que los datos y documentos ingresados son correctos?,
              No se podrán corregir una vez continues</p>
              <div class="modal-buttons">
                  <button id="btnCancelarConfirmacion" class="btn-cancel">Cancelar</button>
                  <button id="btnAceptarConfirmacion" class="btn-confirm">Aceptar</button>
              </div>
          </div>
      </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  document.getElementById("btnAceptarConfirmacion").addEventListener("click", async function () {
      document.getElementById("modalConfirmaciondicSuelo").remove();
      await callback(); // Llamar a la función para insertar los datos
  });

  document.getElementById("btnCancelarConfirmacion").addEventListener("click", function () {
      document.getElementById("modalConfirmaciondicSuelo").remove();
  });
}

// Función para mostrar el modal de éxito o error
function mostrarModalResultado(mensaje, exito = true) {
  const modalHTML = `
      <div id="modalResultadodicSuelo" class="modal-overlay">
          <div class="modal-content ${exito ? 'success' : 'error'}">
              <h3>${exito ? "Éxito" : "Error"}</h3>
              <p>${mensaje}</p>
              <button id="btnCerrarResultado" class="btn-cerrar">Cerrar</button>
          </div>
      </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);
  
  document.getElementById("btnCerrarResultado").addEventListener("click", function () {
      document.getElementById("modalResultadodicSuelo").remove();
  });
}

//MODAL DE CARGA 
function mostrarModalCargaSuelo(mensaje) {
  const modal = document.createElement("div");
  modal.classList.add("modal-global");
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.display = "flex";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";
  modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  modal.style.zIndex = "10000";

  const modalContent = `
      <div style="
          background: white; 
          padding: 20px; 
          border-radius: 12px; 
          max-width: 400px; 
          text-align: center;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          align-items: center;
      ">
          <h2 style="color: #333; font-size: 18px; margin-bottom: 10px;">${mensaje}</h2>
          <img src="./images/Spinner2.gif" alt="Cargando..." style="width: 80px; height: 80px;">
          <p style="font-size: 14px; color: #666;">Por favor, sea paciente...</p>
      </div>
  `;
  modal.innerHTML = modalContent;
  document.body.appendChild(modal);
}

// Función para cerrar el modal de carga
function cerrarModalCargaSuelo() {
  const modal = document.querySelector(".modal-global");
  if (modal) {
      modal.remove();
  }
}
