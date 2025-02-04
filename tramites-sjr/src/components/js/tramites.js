//console.log("archivo cargado");
console.log("validarCamposPasoActual:", typeof validarCamposPasoActual);

// paso actual del formulario
let currentStep = 0;

// guardar el paso actual en localstorage
const saveCurrentStep = (modalId, step) => {
  localStorage.setItem(`currentStep_${modalId}`, step);
};

// restaurar el paso guardado al abrir el modal
const restoreStep = (modalId) => {
  const savedStep = localStorage.getItem(`currentStep_${modalId}`);
  
  // si ya se movió al paso de documentos, mantenerlo
  if (window.currentStep > 0) {
      return window.currentStep;
  }

  // si hay un paso guardado en localstorage, úsalo
  return savedStep !== null ? parseInt(savedStep, 10) : 0;
};




// limpiar el paso guardado al finalizar el trámite
const clearCurrentStep = (modalId) => {
  localStorage.removeItem(`currentStep_${modalId}`);
};

// función para abrir un modal
window.openModal = async function (modalId) {
  const modal = document.getElementById(modalId);

  if (!modal) {
      return;
  }

  // Restaurar el paso guardado antes de abrir el modal
  window.currentStep = restoreStep(modalId);

  if (modalId === "modalFormBecas") {
      const id_usuario = 1; // ⚠️ cambiar por el id real cuando esté disponible

      try {
          const estado = await verificarDatosBecaYDocumentos(id_usuario);

          if (estado === "beca_y_documentos") {
              mostrarModalGlobal("ya tienes un trámite de beca registrado y todos tus documentos. no puedes hacer otro.", "warning");
              return;
          }

          // Si solo tiene beca, lo mandamos al paso de documentos
          if (estado === "solo_beca") {
              modal.style.display = "flex";
              modal.dispatchEvent(new Event("open"));

              setTimeout(() => {
                  moverAlPasoDeDocumentos(modal, modalId);
              }, 300);

              return;
          }
      } catch (error) {
          mostrarModalGlobal("hubo un problema al verificar los datos de beca. inténtalo de nuevo.", "error");
          return;
      }
  }

  modal.style.display = "flex";
  modal.dispatchEvent(new Event("open"));
};


window.closeModal = function (modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) {
    //console.error(`No se encontró el modal con id: ${modalId}`);
    return;
  }
  // Ocultar el modal sin reiniciar los datos ni los pasos
  modal.style.display = "none";
 // console.log(`Modal ${modalId} cerrado. Los datos se mantienen.`);
};


function moverAlPasoDeDocumentos(modal, modalId) {
  const pasos = modal.querySelectorAll(".form-step");
  const stepperItems = modal.querySelectorAll(".stepper .step");

  let pasoDocumentosIndex = -1;
  pasos.forEach((step, index) => {
      if (step.getAttribute("data-step") === "5") { // verifica que este sea el número correcto
          pasoDocumentosIndex = index;
      }
  });

  if (pasoDocumentosIndex !== -1) {
      console.log("🚀 Moviendo al paso de documentos...");
      console.log("📌 Total de pasos:", pasos.length);
      console.log("📌 Índice del paso de documentos:", pasoDocumentosIndex);
      console.log("📌 CurrentStep antes de actualizar:", window.currentStep);

      // actualizar currentStep y guardarlo en localStorage
      window.currentStep = pasoDocumentosIndex; 
      saveCurrentStep(modalId, window.currentStep);

      console.log("✅ CurrentStep actualizado:", window.currentStep);
      console.log("✅ Paso guardado en localStorage:", localStorage.getItem(`currentStep_${modalId}`));

      // actualizar visibilidad de los pasos
      pasos.forEach((step, index) => {
          step.classList.toggle("active", index === window.currentStep);
          step.style.display = index === window.currentStep ? "block" : "none";
      });

      stepperItems.forEach((stepper, index) => {
          stepper.classList.toggle("active", index <= window.currentStep);
      });

      console.log(`🎯 Usuario enviado al paso ${window.currentStep} (documentos) en ${modalId}.`);
  } else {
      console.warn("⚠️ No se encontró el paso de documentos.");
  }
}






// función para cerrar todos los modales y reiniciar los pasos
window.closeAllModalsAndReset = function () {
  const allModals = document.querySelectorAll(
    ".modalTramite, .modalInfoTramite, .modalConfirmationTramite"
  );
  allModals.forEach((modal) => {
    modal.style.display = "none"; // Ocultar todos los modales
  });

  /* // Reiniciar formularios y pasos
    const modalContainers = document.querySelectorAll(".modalTramite");
    modalContainers.forEach((modal) => {
        resetFormAndSteps(modal.id);
    });

    // Llamar a resetFormFields
    console.log("Llamando a resetFormFields desde closeAllModalsAndReset");
    resetFormFields();*/
};

// manejar eventos del dom al cargar
document.addEventListener("DOMContentLoaded", () => {
  //console.log("Documento cargado. Configurando eventos...");

  const modalContainers = document.querySelectorAll(".modalTramite");

  modalContainers.forEach((modal) => {
    const steps = modal.querySelectorAll(".form-step");
    const stepperItems = modal.querySelectorAll(".stepper .step");
    const confirmationModalId = modal.dataset.confirmationModal;

    let currentStep = 0; // paso actual del formulario

    // función: actualizar visibilidad de los pasos
    function updateStepVisibility(modal, step) {
      if (!modal) {
          console.error("⚠️ Error: El `modal` no está definido en updateStepVisibility.");
          return;
      }
  
      /* const steps = modal.querySelectorAll(".form-step");
      const stepperItems = modal.querySelectorAll(".stepper .step");
  
      console.log("🔄 Actualizando visibilidad de pasos...");
      console.log("📌 Total de pasos:", steps.length);
      console.log("📌 CurrentStep:", step);
  
      // Asegurar que el paso esté dentro de los límites
      if (step < 0 || step >= steps.length) {
          console.warn("⚠️ Paso fuera de rango, no se actualiza la visibilidad.");
          return;
      } */
  
      // ✅ Actualizar visibilidad de los pasos del formulario
      steps.forEach((stepElement, index) => {
          stepElement.classList.toggle("active", index === step);
          stepElement.style.display = index === step ? "block" : "none";
      });
  
      // ✅ Actualizar el stepper visualmente
      stepperItems.forEach((stepper, index) => {
          stepper.classList.toggle("active", index <= step);
          console.log('funciona');
      });
  
      // **🔥 Manejo de visibilidad en MÓVILES (<600px)**
      if (window.innerWidth <= 600) {
          stepperItems.forEach((stepper) => {
              stepper.style.display = "none"; // Oculta todos los steps
          });
  
          // **Mostrar solo el paso activo con su círculo y nombre**
          if (stepperItems[step]) {
              stepperItems[step].style.display = "flex";
              stepperItems[step].style.flexDirection = "row";
              stepperItems[step].style.alignItems = "center";
              stepperItems[step].style.justifyContent = "center";
              stepperItems[step].style.width = "100%";
          }
      } else {
          // **En pantallas grandes, restaurar todos los pasos visibles**
          stepperItems.forEach((stepper) => {
              stepper.style.display = "flex";
          });
      }
  
      // ✅ Guardar el paso actual en LocalStorage
      saveCurrentStep("", step);
      window.currentStep = step; // Actualizar variable global
  
      console.log("✅ Visibilidad de pasos actualizada correctamente.");
      console.log("✅ Paso actual en `window.currentStep`:", window.currentStep);
      console.log("✅ Paso guardado en LocalStorage:", localStorage.getItem(`currentStep_${modal.id}`));
  }
  
  // 🔥 Detectar cambios en el tamaño de la ventana y actualizar la visibilidad del stepper automáticamente
  window.addEventListener("resize", () => {
      updateStepVisibility(document.querySelector(".modalTramite"), window.currentStep);
  });
  
  

    // ✅ asegurarse de que el primer paso se muestre al cargar la página
    document.addEventListener("DOMContentLoaded", () => {
      updateStepVisibility();
    });
    
    // ✅ forzar actualización al avanzar o retroceder
    document.addEventListener("click", (event) => {
      if (event.target.classList.contains("btnNextTramite") || event.target.classList.contains("btnPrevTramite")) {
        setTimeout(updateStepVisibility, 10);
      }
    });

    
    

    // manejo de botones dentro del modal
    modal.addEventListener("click", async (event) => {
      const target = event.target;

      // Manejo de botones "Siguiente" (btnNextTramite)
      if (target.classList.contains("btnNextTramite")) {
        //console.log("Click en btnNextTramite.");

        // Primero ejecutar `RegistroFormBecaAPI()` si es el botón de protesta
        if (target.getAttribute("data-btn") === "protesta") {
          console.log("Botón de protesta detectado.");

          mostrarModalConfirmacion(async () => {
            try {
              const registroExitoso = await RegistroFormBecaAPI();

              if (registroExitoso) {
                /*console.log(
                  "¡Registro exitoso! Mostrando modal y avanzando al siguiente paso."
                );*/
                mostrarModalGlobal(
                  "Los datos se guardaron correctamente.",
                  "success"
                );
            window.currentStep++;
            console.log("📌 Paso actualizado a:", window.currentStep);
            saveCurrentStep(modal.id, window.currentStep);
            updateStepVisibility(modal, window.currentStep);


              } else {
                //console.warn("El registro no fue exitoso.");//
                mostrarModalGlobal(
                  "No se pudieron guardar los datos. Verifica los datos e intenta nuevamente.",
                  "error"
                );
              }
            } catch (error) {
             // console.error("Error durante el registro:", error);//
              mostrarModalGlobal(
                "Ocurrió un error inesperado. Por favor, intenta de nuevo.",
                "error"
              );
            }
          });

          return; // Detener el flujo normal
        }

        // Primero ejecutar `RegistroFormBecaAPI()` si es el botón de protesta
        if (target.getAttribute("data-btn") === "docsBeca") {
         // console.log("Botón de documentos detectado.");
          
          // Validar documentos antes de mostrar el modal de carga
          const documentosValidos = await validarDocumentosAntesDeGuardar();
          if (!documentosValidos) {
            return; // No continuar si faltan documentos
          }

          mostrarModalCarga("Espere, se están guardando los documentos...");

          try {
            const documentosGuardados = await guardarDocumentosBeca();

            cerrarModalCarga(); // Cerrar modal de carga después de la ejecución

            if (documentosGuardados) {
             // console.log("¡Documentos guardados con éxito!");
              mostrarModalGlobal(
                "Los documentos fueron guardados correctamente.",
                "success"
              );
              window.currentStep++;
              console.log("📌 Paso actualizado a:", window.currentStep);
              saveCurrentStep(modal.id, window.currentStep);
              updateStepVisibility(modal, window.currentStep);
  
            } else {
              //console.warn("Los documentos no pudieron ser guardados.");
              mostrarModalGlobal(
                "No fue posible guardar los documentos. Intente nuevamente.",
                "error"
              );
            }
          } catch (error) {
            cerrarModalCarga(); // Asegurar que el modal de carga se cierra en caso de error
            //console.error("Error al guardar documentos:", error);
            mostrarModalGlobal(
              "Ocurrió un error al guardar los documentos. Intente nuevamente.",
              "error"
            );
          }

          return; // Detener el flujo normal
        }

        // Luego ejecutar `guardarDocumentosBeca()` si es el botón de documentos
        if (target.getAttribute("data-btn") === "docsBeca") {
          //console.log("Botón de documentos detectado.");
          mostrarModalGlobal(
            "Espere, se están guardando los documentos...",
            "loading"
          );

          try {
            const documentosGuardados = await guardarDocumentosBeca();

            if (documentosGuardados) {
              //console.log("¡Documentos guardados con éxito!");
              mostrarModalGlobal(
                "Los documentos fueron guardados correctamente.",
                "success"
              );
              window.currentStep++;
              saveCurrentStep(modal.id,  window.currentStep);
              updateStepVisibility(modal,  window.currentStep);              
            } else {
             // console.warn("Los documentos no pudieron ser guardados.");
              mostrarModalGlobal(
                "No fue posible guardar los documentos. Intente nuevamente.",
                "error"
              );
            }
          } catch (error) {
           // console.error("Error al guardar documentos:", error);
            mostrarModalGlobal(
              "Ocurrió un error al guardar los documentos. Intente nuevamente.",
              "error"
            );
          }

          return; // Detener el flujo normal
        }

        // lógica para otros botones "siguiente"
        const steps = modal.querySelectorAll(".form-step");
        currentStep = Array.from(steps).findIndex((step) =>
          step.classList.contains("active")
        );
       // console.log("paso actual antes de avanzar:", currentStep);

        if (!validarCamposPasoActual(steps[currentStep])) {
          alert(
            "por favor, completa correctamente todos los campos antes de continuar."
          );
          return;
        }

        if (currentStep < steps.length - 1) {
          currentStep++;
          saveCurrentStep(modal.id, currentStep);
          updateStepVisibility(modal, currentStep);
          //console.log("actualizando paso a:", currentStep);

          steps.forEach((step, index) => {
            step.classList.toggle("active", index === currentStep);
            step.style.display = index === currentStep ? "block" : "none";
          });

          const stepperItems = modal.querySelectorAll(".stepper .step");
          stepperItems.forEach((stepper, index) => {
            stepper.classList.toggle("active", index <= currentStep);
          });

         // console.log("paso avanzado a:", currentStep);
        } else {
         // console.warn("ya estás en el último paso.");
        }
      }

      // botón "prev"
      if (target.classList.contains("btnPrevTramite")) {

        if (window.currentStep > 0) {
            window.currentStep--; // retroceder paso
            saveCurrentStep(modal.id, window.currentStep);
            updateStepVisibility(modal, window.currentStep);
            console.log("🔙 botón prev presionado, paso actual antes:", window.currentStep);

        }
    }
    

      // botón "confirmar"
      if (target.classList.contains("btnConfirmarTramite")) {
        event.preventDefault(); // evitar envío del formulario
        if (confirmationModalId) {
          openModal(confirmationModalId); // mostrar modal de confirmación
        }
      }
    });

    // configurar botones para cerrar el modal principal
    const closeModalButtons = modal.querySelectorAll(".close-modalTramite");
    closeModalButtons.forEach((button) => {
      button.addEventListener("click", () => {
        closeAllModalsAndReset(); // cerrar todos los modales
        resetCurrentStep(); // reiniciar pasos locales del formulario
      });
    });

    // evitar envío del formulario para todos los trámites
    const form = modal.querySelector("form");
    if (form) {
      form.addEventListener("submit", (event) => {
        event.preventDefault(); // evitar el envío del formulario
        //console.log(`formulario del modal ${modal.id} bloqueado para envío.`);
      });
    }

    // inicializar pasos visibles
    updateStepVisibility();
    // 🔥 detectar cambios en el tamaño de la ventana y actualizar la visibilidad del stepper
window.addEventListener("resize", () => {
  updateStepVisibility();
});

  });

  // configurar botones de cierre de confirmación
  const closeConfirmationButtons = document.querySelectorAll(
    ".btnCerrarConfirmarTramite"
  );
  closeConfirmationButtons.forEach((button) => {
    button.addEventListener("click", () => {
      closeAllModalsAndReset(); // cerrar todos los modales y reiniciar pasos
    });
  });
});

// reiniciar formulario y pasos
/*window.resetFormAndSteps = function (modalId) {
    console.log(`reiniciando formulario y pasos del modal: ${modalId}`);
    const modal = document.getElementById(modalId);
    if (modal) {
        const form = modal.querySelector("form");
        if (form) {
            form.reset(); // reiniciar formulario
            console.log(`formulario en modal ${modalId} reiniciado.`);
        }

        const steps = modal.querySelectorAll(".form-step");
        const stepperItems = modal.querySelectorAll(".stepper .step");

        steps.forEach((step, index) => {
            step.classList.toggle("active", index === 0);
            step.style.display = index === 0 ? "block" : "none";
        });

        stepperItems.forEach((stepper, index) => {
            stepper.classList.toggle("active", index === 0);
        });

        // llamar a la función que reinicia los campos de pdf
        resetFormFields();

        console.log(`pasos reiniciados para modal ${modalId}.`);
    } else {
        console.error(`no se encontró el modal con id: ${modalId}`);
    }
};*/

// Botón de pago ACUÁTICA

document.addEventListener("DOMContentLoaded", () => {
  //console.log("Documento cargado.");

  // Escuchar clic en el botón de pago
  const btnPagarAcuatica = document.getElementById("btnPagarAcuatica");
  if (btnPagarAcuatica) {
    btnPagarAcuatica.addEventListener("click", () => {
      // Crear modal dinámico para el iframe de pago
      const modalPago = document.createElement("div");
      modalPago.style.position = "fixed";
      modalPago.style.top = "0";
      modalPago.style.left = "0";
      modalPago.style.width = "100%";
      modalPago.style.height = "100%";
      modalPago.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
      modalPago.style.zIndex = "1000";
      modalPago.style.display = "flex";
      modalPago.style.justifyContent = "center";
      modalPago.style.alignItems = "center";

      // Crear iframe para mostrar la URL del pago
      const iframePago = document.createElement("iframe");
      iframePago.src = "PagosMotor/cadenacifrada.php"; // Cambia esta URL
      iframePago.style.width = "80%";
      iframePago.style.height = "80%";
      iframePago.style.border = "none";
      iframePago.style.borderRadius = "10px";

      // Crear botón para cerrar el modal
      const btnCerrar = document.createElement("button");
      btnCerrar.innerText = "Cerrar";
      btnCerrar.style.position = "absolute";
      btnCerrar.style.top = "20px";
      btnCerrar.style.right = "20px";
      btnCerrar.style.padding = "10px";
      btnCerrar.style.backgroundColor = "#ff0000";
      btnCerrar.style.color = "#fff";
      btnCerrar.style.border = "none";
      btnCerrar.style.borderRadius = "5px";
      btnCerrar.style.cursor = "pointer";

      // Cerrar el modal cuando se haga clic en el botón
      btnCerrar.addEventListener("click", () => {
        modalPago.remove();
      });

      // Agregar el iframe y el botón al modal
      modalPago.appendChild(iframePago);
      modalPago.appendChild(btnCerrar);

      // Agregar el modal al body
      document.body.appendChild(modalPago);
    });
  }
});

//******************************************************************************************************************************** */
//***************************************MODAL GLOBAL DE ADVERTENCIA PARA EL GUARDADO DE DATOS********************************** */
//*********************************************************************************************************************************** */

function mostrarModalConfirmacion(onAcceptCallback) {
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
        <div style="background: white; padding: 20px; border-radius: 8px; max-width: 400px; text-align: center;">
            <h2>¿estás seguro?</h2>
            <p>una vez que avances, no podrás regresar para editar esta información.</p>
            <button id="aceptarModal" style="margin: 10px; padding: 10px 20px; background-color: #4caf50; color: white; border: none; border-radius: 4px; cursor: pointer;">
                aceptar
            </button>
            <button id="cancelarModal" style="margin: 10px; padding: 10px 20px; background-color: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">
                cancelar
            </button>
        </div>
    `;

  modal.innerHTML = modalContent;
  document.body.appendChild(modal);

  // manejar clic en "aceptar"
  const aceptarBoton = modal.querySelector("#aceptarModal");
  aceptarBoton.addEventListener("click", () => {
    modal.remove(); // cerrar modal
    if (typeof onAcceptCallback === "function") {
      onAcceptCallback(); // ejecutar callback de aceptación
    }
  });

  // manejar clic en "cancelar"
  const cancelarBoton = modal.querySelector("#cancelarModal");
  cancelarBoton.addEventListener("click", () => {
    modal.remove(); // cerrar modal
  });
}

//******************************************************************************************************************************** */
//***************************************MODAL GLOBAL DE ADVERTENCIA EN EL REGISTRO DE DATOS A LA BD********************************** */
//*********************************************************************************************************************************** */
// función para mostrar un modal dinámicamente
function mostrarModalGlobal(mensaje, tipo, onCloseCallback = null) {
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
        <div style="background: white; padding: 20px; border-radius: 8px; max-width: 400px; text-align: center;">
            <h2>${tipo === "success" ? "¡Éxito!" : "¡Error!"}</h2>
            <p>${mensaje}</p>
            <button id="cerrarModalGlobal" style="margin-top: 10px; padding: 10px 20px; background-color: ${
              tipo === "success" ? "#4CAF50" : "#f44336"
            }; color: white; border: none; border-radius: 4px; cursor: pointer;">
                Cerrar
            </button>
        </div>
    `;

  modal.innerHTML = modalContent;
  document.body.appendChild(modal);

  const cerrarBoton = modal.querySelector("#cerrarModalGlobal");
  cerrarBoton.addEventListener("click", () => {
    modal.remove();
    if (typeof onCloseCallback === "function") {
      onCloseCallback(); // ejecuta el callback al cerrar el modal
    }
  });
}


