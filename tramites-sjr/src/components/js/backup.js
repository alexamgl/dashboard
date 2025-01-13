
// Configuración del formulario con múltiples pasos
setupStepNavigation('stepForm');

// Configuración de botones Next y Prev para el formulario de Becas
function setupStepNavigationVBueno() {
    const formContainer = document.getElementById('stepForm'); // Formulario de Becas
    let currentStep = 1;

    // Obtener todos los botones "Next" y "Prev" del formulario
    const nextButtons = formContainer.querySelectorAll('.next');
    const prevButtons = formContainer.querySelectorAll('.prev');

    // Configurar la acción para los botones "Next"
    nextButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const currentFormStep = formContainer.querySelector(`.form-step[data-step="${currentStep}"]`);
            const inputs = currentFormStep.querySelectorAll('input');

            let valid = true;
            // Validar los campos del paso actual
            inputs.forEach((input) => {
                const errorMessage = input.nextElementSibling; // Mensaje de error relacionado
                if (!input.checkValidity()) {
                    valid = false;
                    if (errorMessage) errorMessage.style.display = 'block';
                } else {
                    if (errorMessage) errorMessage.style.display = 'none';
                }
            });

            // Si los campos son válidos, avanzar al siguiente paso
            if (valid) {
                currentStep++;
                updateStepUIVBueno(formContainer, currentStep);
            }
        });
    });

    // Configurar la acción para los botones "Prev"
    prevButtons.forEach((button) => {
        button.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                updateStepUIVBueno(formContainer, currentStep);
            }
        });
    });
}

// Actualiza la UI de los pasos para el formulario de Becas
function updateStepUIVBueno(formContainer, currentStep) {
    const steps = formContainer.querySelectorAll('.step'); // Pasos del stepper (indicadores)
    const formSteps = formContainer.querySelectorAll('.form-step'); // Contenido de los pasos

    // Actualizar la UI del stepper
    steps.forEach((step, index) => {
        const circle = step.querySelector('.circle');
        if (index + 1 < currentStep) {
            step.classList.add('active');
            circle.style.backgroundColor = '#faa21b'; // Color del círculo de pasos anteriores
        } else if (index + 1 === currentStep) {
            step.classList.add('active');
            circle.style.backgroundColor = '#faa21b'; // Color del círculo del paso actual
        } else {
            step.classList.remove('active');
            circle.style.backgroundColor = '#e0e0e0'; // Color del círculo de pasos futuros
        }
    });

    // Mostrar el paso actual y ocultar los demás
    formSteps.forEach((formStep, index) => {
        if (index + 1 === currentStep) {
            formStep.classList.add('active'); // Mostrar el paso actual
        } else {
            formStep.classList.remove('active'); // Ocultar los pasos no actuales
        }
    });
}

// Inicializar la navegación para el formulario de Becas
setupStepNavigationVBueno();



// Configuración de botones Next y Prev
function setupStepNavigation(formId) {
    const formContainer = document.getElementById(formId);
    let currentStep = 1;

    const nextButtons = formContainer.querySelectorAll('.next');
    const prevButtons = formContainer.querySelectorAll('.prev');

    nextButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const currentFormStep = formContainer.querySelector(`.form-step[data-step="${currentStep}"]`);
            const inputs = currentFormStep.querySelectorAll('input');

            let valid = true;
            inputs.forEach((input) => {
                const errorMessage = input.nextElementSibling;
                if (!input.checkValidity()) {
                    valid = false;
                    errorMessage.style.display = 'block';
                } else {
                    errorMessage.style.display = 'none';
                }
            });

            if (valid) {
                currentStep++;
                updateStepUI(formContainer, currentStep);
            }
        });
    });

    prevButtons.forEach((button) => {
        button.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                updateStepUI(formContainer, currentStep);
            }
        });
    });
}

// Actualiza la UI de los pasos
function updateStepUI(formContainer, currentStep) {
    const steps = formContainer.querySelectorAll('.step'); // Pasos del stepper
    const formSteps = formContainer.querySelectorAll('.form-step'); // Contenido de los pasos

    steps.forEach((step, index) => {
        const circle = step.querySelector('.circle');
        if (index + 1 < currentStep) {
            // Pasos anteriores
            step.classList.add('active');
            circle.style.backgroundColor = '#faa21b'; // Colorear círculo
        } else if (index + 1 === currentStep) {
            // Paso actual
            step.classList.add('active');
            circle.style.backgroundColor = '#faa21b';
        } else {
            // Pasos futuros
            step.classList.remove('active');
            circle.style.backgroundColor = '#e0e0e0';
        }
    });

    formSteps.forEach((formStep, index) => {
        if (index + 1 === currentStep) {
            formStep.classList.add('active'); // Muestra el paso actual
        } else {
            formStep.classList.remove('active'); // Oculta los pasos no actuales
        }
    });
}

// Configuración de formularios
setupStepNavigation('stepForm'); // Configuración para "Visto Bueno"
setupStepNavigation('stepFormBecas'); // Configuración para "Becas"

// Manejo de envío de formularios
const formVistoBueno = document.getElementById('stepForm');
const formBecas = document.getElementById('stepFormBecas');

formVistoBueno.addEventListener('submit', (e) => {
    e.preventDefault();
    closeModal('vistoBueno'); // Cerrar el modal del formulario
    setTimeout(() => showConfirmationModal('vistoBueno'), 300); // Mostrar el modal de confirmación
});

formBecas.addEventListener('submit', (e) => {
    e.preventDefault();
    closeModal('becas'); // Cerrar el modal del formulario
    setTimeout(() => showConfirmationModal('becas'), 300); // Mostrar el modal de confirmación
});

// Cerrar los modales de confirmación
document.getElementById('closeConfirmationVistoBueno').addEventListener('click', () => {
    document.getElementById('confirmationModalVistoBueno').style.display = 'none';
});

document.getElementById('closeConfirmationBecas').addEventListener('click', () => {
    document.getElementById('confirmationModalBecas').style.display = 'none';
});


// **************************************** BECAS *************************************************



// Configuración del formulario con múltiples pasos
setupStepNavigation('stepFormBecas');

// Configuración de botones Next y Prev para el formulario de Becas
function setupStepNavigationBecas() {
    const formContainer = document.getElementById('stepFormBecas'); // Formulario de Becas
    let currentStep = 1;

    // Obtener todos los botones "Next" y "Prev" del formulario
    const nextButtons = formContainer.querySelectorAll('.next');
    const prevButtons = formContainer.querySelectorAll('.prev');

    // Configurar la acción para los botones "Next"
    nextButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const currentFormStep = formContainer.querySelector(`.form-step[data-step="${currentStep}"]`);
            const inputs = currentFormStep.querySelectorAll('input');

            let valid = true;
            // Validar los campos del paso actual
            inputs.forEach((input) => {
                const errorMessage = input.nextElementSibling; // Mensaje de error relacionado
                if (!input.checkValidity()) {
                    valid = false;
                    if (errorMessage) errorMessage.style.display = 'block';
                } else {
                    if (errorMessage) errorMessage.style.display = 'none';
                }
            });

            // Si los campos son válidos, avanzar al siguiente paso
            if (valid) {
                currentStep++;
                updateStepUIBecas(formContainer, currentStep);
            }
        });
    });

    // Configurar la acción para los botones "Prev"
    prevButtons.forEach((button) => {
        button.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                updateStepUIBecas(formContainer, currentStep);
            }
        });
    });
}

// Actualiza la UI de los pasos para el formulario de Becas
function updateStepUIBecas(formContainer, currentStep) {
    const steps = formContainer.querySelectorAll('.step'); // Pasos del stepper (indicadores)
    const formSteps = formContainer.querySelectorAll('.form-step'); // Contenido de los pasos

    // Actualizar la UI del stepper
    steps.forEach((step, index) => {
        const circle = step.querySelector('.circle');
        if (index + 1 < currentStep) {
            step.classList.add('active');
            circle.style.backgroundColor = '#faa21b'; // Color del círculo de pasos anteriores
        } else if (index + 1 === currentStep) {
            step.classList.add('active');
            circle.style.backgroundColor = '#faa21b'; // Color del círculo del paso actual
        } else {
            step.classList.remove('active');
            circle.style.backgroundColor = '#e0e0e0'; // Color del círculo de pasos futuros
        }
    });

    // Mostrar el paso actual y ocultar los demás
    formSteps.forEach((formStep, index) => {
        if (index + 1 === currentStep) {
            formStep.classList.add('active'); // Mostrar el paso actual
        } else {
            formStep.classList.remove('active'); // Ocultar los pasos no actuales
        }
    });
}

// Inicializar la navegación para el formulario de Becas
setupStepNavigationBecas();