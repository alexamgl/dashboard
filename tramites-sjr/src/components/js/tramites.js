console.log("archivo cargado");

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

            // botón "next"
            if (target.classList.contains("btnNextTramite")) {
                if (currentStep < steps.length - 1) {
                    currentStep++; // avanzar paso
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
