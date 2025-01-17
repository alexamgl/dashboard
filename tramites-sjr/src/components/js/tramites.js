console.log("Archivo tramites cargado");
document.addEventListener("DOMContentLoaded", () => {
    const initDynamicFormNavigation = () => {
        const modalContainers = document.querySelectorAll(".modalTramite");

        modalContainers.forEach((modal) => {
            const form = modal.querySelector("form");
            const steps = modal.querySelectorAll(".form-step");
            const stepperItems = modal.querySelectorAll(".stepper .step");
            const confirmationModalId = modal.dataset.confirmationModal;
            const confirmationModal = confirmationModalId
                ? document.getElementById(confirmationModalId)
                : null;

            let currentStep = 0; // índice del paso actual

            // Función para actualizar visibilidad de los pasos
            const updateStepVisibility = () => {
                steps.forEach((step, index) => {
                    step.classList.toggle("active", index === currentStep);
                    step.style.display = index === currentStep ? "block" : "none";
                });

                stepperItems.forEach((stepper, index) => {
                    stepper.classList.toggle("active", index <= currentStep);
                });
            };

            // Reiniciar pasos y formulario
            const resetFormAndSteps = () => {
                if (form) {
                    form.reset(); // Reinicia el formulario
                }
                currentStep = 0; // Reinicia el índice del paso actual
                updateStepVisibility(); // Muestra el primer paso
            };

            // Manejo de clics dentro del modal
            modal.addEventListener("click", (e) => {
                const target = e.target;

                // Botón "Next"
                if (target.classList.contains("btnNextTramite")) {
                    if (currentStep < steps.length - 1) {
                        currentStep++;
                        updateStepVisibility();
                    }
                }

                // Botón "Prev"
                if (target.classList.contains("btnPrevTramite")) {
                    if (currentStep > 0) {
                        currentStep--;
                        updateStepVisibility();
                    }
                }

                // Botón "Confirmar"
                if (target.classList.contains("btnConfirmarTramite")) {
                    e.preventDefault(); // Evita envío del formulario
                    if (confirmationModal) {
                        openModal(confirmationModalId); // Muestra modal de confirmación
                    }
                }
            });

            // Configuración de botones para cerrar modales
            const closeModalButtons = modal.querySelectorAll(".close-modalTramite");
            closeModalButtons.forEach((button) => {
                button.addEventListener("click", () => {
                    closeModal(modal.id); // Cierra el modal
                    resetFormAndSteps(); // Reinicia formulario y pasos
                });
            });

            // Configuración del modal de confirmación
            if (confirmationModal) {
                const confirmationCloseButtons = confirmationModal.querySelectorAll(".btn, .close-modalConfirmation");
                confirmationCloseButtons.forEach((button) => {
                    button.addEventListener("click", () => {
                        closeModal(confirmationModalId); // Cierra modal de confirmación
                        closeModal(modal.id); // Cierra el modal principal
                        resetFormAndSteps(); // Reinicia formulario y pasos
                    });
                });
            }

            // Inicializa visibilidad de los pasos al cargar
            updateStepVisibility();
        });
    };

    initDynamicFormNavigation();
});

// Función para abrir un modal por su ID
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "block"; // Muestra el modal
        console.log('hola')
    } else {
        console.error(`No se encontró el modal con ID: ${modalId}`);
    }
}

function closeModal(modalId) {
    console.log(`Intentando cerrar el modal con ID: ${modalId}`); // registro inicial

    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "none"; // oculta el modal
        console.log(`Modal con ID: ${modalId} cerrado.`);

        // reinicia el formulario y los pasos si el modal tiene un formulario
        const form = modal.querySelector("form");
        const steps = modal.querySelectorAll(".form-step");
        const stepperItems = modal.querySelectorAll(".stepper .step");

        if (form) {
            form.reset(); // reinicia el formulario
            console.log(`Formulario dentro del modal con ID: ${modalId} reiniciado.`);
        } else {
            console.warn(`No se encontró formulario dentro del modal con ID: ${modalId}.`);
        }

        if (steps.length > 0 && stepperItems.length > 0) {
            let currentStep = 0; // reinicia el índice del paso actual
            console.log(`Reiniciando los pasos del formulario dentro del modal con ID: ${modalId}.`);

            steps.forEach((step, index) => {
                step.classList.toggle("active", index === currentStep); // activa solo el primer paso
                step.style.display = index === currentStep ? "block" : "none"; // muestra solo el primer paso
            });

            stepperItems.forEach((stepper, index) => {
                stepper.classList.toggle("active", index <= currentStep); // activa solo el primer paso en el stepper
            });

            console.log(`Pasos del formulario dentro del modal con ID: ${modalId} reiniciados.`);
        } else {
            console.warn(`No se encontraron pasos o stepper dentro del modal con ID: ${modalId}.`);
        }
    } else {
        console.error(`No se encontró el modal con ID: ${modalId}`);
    }
}

