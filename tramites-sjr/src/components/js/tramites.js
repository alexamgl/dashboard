console.log("Archivo cargado");

// Función para abrir un modal
window.openModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "flex"; // Mostrar el modal
        console.log(`Modal con ID ${modalId} abierto.`);
        modal.dispatchEvent(new Event("open")); // Disparar evento personalizado al abrir el modal
    } else {
        console.error(`No se encontró el modal con ID: ${modalId}`);
    }
};

// Función para cerrar todos los modales y reiniciar los pasos
window.closeAllModalsAndReset = function () {
    const allModals = document.querySelectorAll(".modalTramite, .modalInfoTramite, .modalConfirmationTramite");
    allModals.forEach((modal) => {
        modal.style.display = "none"; // Ocultar todos los modales
        console.log(`Cerrado modal con ID: ${modal.id}`);
    });

    // Reiniciar todos los formularios y pasos
    const modalContainers = document.querySelectorAll(".modalTramite");
    modalContainers.forEach((modal) => {
        resetFormAndSteps(modal.id); // Reiniciar cada formulario asociado
    });
};

// Manejar eventos del DOM al cargar
document.addEventListener("DOMContentLoaded", () => {
    console.log("Documento cargado.");

    const modalContainers = document.querySelectorAll(".modalTramite");

    modalContainers.forEach((modal) => {
        const steps = modal.querySelectorAll(".form-step");
        const stepperItems = modal.querySelectorAll(".stepper .step");
        const confirmationModalId = modal.dataset.confirmationModal;

        let currentStep = 0; // Paso actual del formulario

        // Función: Actualizar visibilidad de los pasos
        const updateStepVisibility = () => {
            steps.forEach((step, index) => {
                step.classList.toggle("active", index === currentStep);
                step.style.display = index === currentStep ? "block" : "none";
            });

            stepperItems.forEach((stepper, index) => {
                stepper.classList.toggle("active", index <= currentStep);
            });
        };

        // Función: Reiniciar el paso actual al cerrar/reiniciar
        const resetCurrentStep = () => {
            currentStep = 0; // Reiniciar la variable local
            updateStepVisibility();
            console.log(`Pasos reiniciados en modal: ${modal.id}`);
        };

        // Reiniciar pasos al abrir el modal
        modal.addEventListener("open", resetCurrentStep);

        // Manejo de botones dentro del modal
        modal.addEventListener("click", (event) => {
            const target = event.target;

            // Botón "Next"
            if (target.classList.contains("btnNextTramite")) {
                if (currentStep < steps.length - 1) {
                    currentStep++; // Avanzar paso
                    updateStepVisibility();
                }
            }

            // Botón "Prev"
            if (target.classList.contains("btnPrevTramite")) {
                if (currentStep > 0) {
                    currentStep--; // Retroceder paso
                    updateStepVisibility();
                }
            }

            // Botón "Confirmar"
            if (target.classList.contains("btnConfirmarTramite")) {
                event.preventDefault(); // Evitar envío del formulario
                if (confirmationModalId) {
                    openModal(confirmationModalId); // Mostrar modal de confirmación
                }
            }
        });

        // Configurar botones para cerrar el modal principal
        const closeModalButtons = modal.querySelectorAll(".close-modalTramite");
        closeModalButtons.forEach((button) => {
            button.addEventListener("click", () => {
                closeAllModalsAndReset(); // Cerrar todos los modales
                resetCurrentStep(); // Reiniciar pasos locales del formulario
            });
        });

        // Evitar envío del formulario para todos los trámites
        const form = modal.querySelector("form");
        if (form) {
            form.addEventListener("submit", (event) => {
                event.preventDefault(); // Evitar el envío del formulario
                console.log(`Formulario del modal ${modal.id} bloqueado para envío.`);
            });
        }

        // Inicializar pasos visibles
        updateStepVisibility();
    });

    // Configurar botones de cierre de confirmación
    const closeConfirmationButtons = document.querySelectorAll(".btnCerrarConfirmarTramite");
    closeConfirmationButtons.forEach((button) => {
        button.addEventListener("click", () => {
            closeAllModalsAndReset(); // Cerrar todos los modales y reiniciar pasos
        });
    });
});

// Reiniciar formulario y pasos
window.resetFormAndSteps = function (modalId) {
    console.log(`Reiniciando formulario y pasos del modal: ${modalId}`);
    const modal = document.getElementById(modalId);
    if (modal) {
        const form = modal.querySelector("form");
        if (form) {
            form.reset(); // Reiniciar formulario
            console.log(`Formulario en modal ${modalId} reiniciado.`);
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

        console.log(`Pasos reiniciados para modal ${modalId}.`);
    } else {
        console.error(`No se encontró el modal con ID: ${modalId}`);
    }
};
