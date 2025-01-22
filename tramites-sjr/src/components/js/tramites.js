console.log("archivo cargado");
console.log("validarCamposPasoActual:", typeof validarCamposPasoActual);


// función para abrir un modal
window.openModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "flex"; // mostrar el modal
        console.log(`modal con id ${modalId} abierto.`);
        modal.dispatchEvent(new Event("open")); // disparar evento personalizado al abrir el modal
    } else {
        console.error(`no se encontró el modal con id: ${modalId}`);
    }

    
};

window.closeModal = function(modalId){
    const modal = document.getElementById(modalId);
    modal.style.display='none';
}

// función para cerrar todos los modales y reiniciar los pasos
window.closeAllModalsAndReset = function () {
    const allModals = document.querySelectorAll(".modalTramite, .modalInfoTramite, .modalConfirmationTramite");
    allModals.forEach((modal) => {
        modal.style.display = "none"; // Ocultar todos los modales
    });

    // Reiniciar formularios y pasos
    const modalContainers = document.querySelectorAll(".modalTramite");
    modalContainers.forEach((modal) => {
        resetFormAndSteps(modal.id);
    });

    // Llamar a resetFormFields
    console.log("Llamando a resetFormFields desde closeAllModalsAndReset");
    resetFormFields();
};



// manejar eventos del dom al cargar
document.addEventListener("DOMContentLoaded", () => {
    console.log("Documento cargado. Configurando eventos...");

    const modalContainers = document.querySelectorAll(".modalTramite");

    modalContainers.forEach((modal) => {
        const steps = modal.querySelectorAll(".form-step");
        const stepperItems = modal.querySelectorAll(".stepper .step");
        const confirmationModalId = modal.dataset.confirmationModal;

        let currentStep = 0; // paso actual del formulario

        // función: actualizar visibilidad de los pasos
        const updateStepVisibility = () => {
            steps.forEach((step, index) => {
                step.classList.toggle("active", index === currentStep);
                step.style.display = index === currentStep ? "block" : "none";
            });

            stepperItems.forEach((stepper, index) => {
                stepper.classList.toggle("active", index <= currentStep);
            });
        };

        // función: reiniciar el paso actual al cerrar/reiniciar
        const resetCurrentStep = () => {
            currentStep = 0; // reiniciar la variable local
            updateStepVisibility();
            console.log(`pasos reiniciados en modal: ${modal.id}`);
        };

        // reiniciar pasos al abrir el modal
        modal.addEventListener("open", resetCurrentStep);

        // manejo de botones dentro del modal
        modal.addEventListener("click", (event) => {
            const target = event.target;


                //btn Next
            if (target.classList.contains("btnNextTramite")) {
                const currentFormStep = steps[currentStep]; // obtener el paso actual
        
                // agregar el console.log para verificar el paso actual
                console.log("paso actual (currentFormStep):", currentFormStep);
        
                // validar los campos del paso actual
                if (!validarCamposPasoActual(currentFormStep)) {
                    alert("por favor, completa correctamente todos los campos antes de continuar.");
                    return; // no avanzar al siguiente paso
                }
        
                if (currentStep < steps.length - 1) {
                    currentStep++;
                    updateStepVisibility();
                }
            }
            
            

            // botón "prev"
            if (target.classList.contains("btnPrevTramite")) {
                if (currentStep > 0) {
                    currentStep--; // retroceder paso
                    updateStepVisibility();
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
                console.log(`formulario del modal ${modal.id} bloqueado para envío.`);
            });
        }

        // inicializar pasos visibles
        updateStepVisibility();
    });

    // configurar botones de cierre de confirmación
    const closeConfirmationButtons = document.querySelectorAll(".btnCerrarConfirmarTramite");
    closeConfirmationButtons.forEach((button) => {
        button.addEventListener("click", () => {
            closeAllModalsAndReset(); // cerrar todos los modales y reiniciar pasos
        });
    });
});

// reiniciar formulario y pasos
window.resetFormAndSteps = function (modalId) {
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
};


// Botón de pago ACUÁTICA

document.addEventListener("DOMContentLoaded", () => {
    console.log("Documento cargado.");

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
 