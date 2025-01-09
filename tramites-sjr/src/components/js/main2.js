const steps = document.querySelectorAll('.step');
const formSteps = document.querySelectorAll('.form-step');
const nextButtons = document.querySelectorAll('.next');
const prevButtons = document.querySelectorAll('.prev');
const form = document.getElementById('stepForm');

let currentStep = 1;

// Update the stepper UI
function updateStepUI() {
    steps.forEach((step, index) => {
        if (index + 1 === currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });

    formSteps.forEach((formStep, index) => {
        if (index + 1 === currentStep) {
            formStep.classList.add('active');
        } else {
            formStep.classList.remove('active');
        }
    });
}

// Validate the current step
function validateStep() {
    const currentFormStep = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    const inputs = currentFormStep.querySelectorAll('input');
    let valid = true;

    inputs.forEach(input => {
        const errorMessage = input.nextElementSibling;
        if (!input.checkValidity()) {
            valid = false;
            errorMessage.style.display = 'block';
        } else {
            errorMessage.style.display = 'none';
        }
    });

    return valid;
}

// Next button event
nextButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (validateStep()) {
            currentStep++;
            updateStepUI();
        }
    });
});

// Previous button event
prevButtons.forEach(button => {
    button.addEventListener('click', () => {
        currentStep--;
        updateStepUI();
    });
});

// Form submission
form.addEventListener('submit', e => {
    e.preventDefault();
    alert('Form submitted successfully!');
});
