// acuaticas.js actualizado con stepper en cada trámite

document.addEventListener("DOMContentLoaded", () => {
    console.log("Script de acuáticas cargado.");

    const btnIniciarTramite = document.getElementById("btnIniciarTramite");
    if (btnIniciarTramite) {
        btnIniciarTramite.addEventListener("click", openAcuaticaForm);
    }
});

function showAcuaticaInfo(acuaticaId, titulo, descripcion) {
    document.getElementById("modalAcuaticaTitulo").innerText = titulo;
    document.getElementById("modalAcuaticaDescripcion").innerText = descripcion;
    document.getElementById("btnIniciarTramite").setAttribute("data-acuatica", acuaticaId);
    openModal("acuaticaInfoModal");
}

function openAcuaticaForm() {
    let acuaticaSeleccionada = document.getElementById("btnIniciarTramite").getAttribute("data-acuatica");

    if (!acuaticaSeleccionada) {
        alert("Por favor, selecciona una acuática antes de iniciar el trámite.");
        return;
    }

    const formularioTitulo = document.getElementById("formularioAcuaticaTitulo");
    const formularioDescripcion = document.getElementById("formularioAcuaticaDescripcion");
    const acuaticasFormContainer = document.getElementById("acuaticasFormContainer");
    acuaticasFormContainer.innerHTML = ""; // Limpiar contenido anterior

    let stepsContent = "";

    switch (acuaticaSeleccionada) {
        case "cdc":
            formularioTitulo.innerText = "Trámite para el Centro de Desarrollo Comunitario";
            formularioDescripcion.innerText = "Detalles del trámite para el CDC...";
            stepsContent = generarStepperHTML();
            break;
        case "multideportivo":
            formularioTitulo.innerText = "Trámite para el Multideportivo Municipal";
            formularioDescripcion.innerText = "Detalles del trámite para el Multideportivo...";
            stepsContent = generarStepperHTML();
            break;
        case "oriente":
            formularioTitulo.innerText = "Trámite para la Acuática Municipal Oriente";
            formularioDescripcion.innerText = "Detalles del trámite en la acuática Oriente...";
            stepsContent = generarStepperHTML();
            break;
        case "gomez_morin":
            formularioTitulo.innerText = "Trámite para la Acuática Manuel Gómez Morính";
            formularioDescripcion.innerText = "Detalles del trámite en Gómez Morín...";
            stepsContent = generarStepperHTML();
            break;
        default:
            formularioTitulo.innerText = "Trámite de Acuática Municipal";
            formularioDescripcion.innerText = "Selecciona una acuática para continuar.";
    }
    acuaticasFormContainer.innerHTML = stepsContent;
    initializeStepperAcuaticas(); // Inicializar stepper dinámico después de insertarlo
    openModal("modalFormAcuatica");
}

// acuaticas.js actualizado con stepper en cada trámite

document.addEventListener("DOMContentLoaded", () => {
    console.log("Script de acuáticas cargado.");

    const btnIniciarTramite = document.getElementById("btnIniciarTramite");
    if (btnIniciarTramite) {
        btnIniciarTramite.addEventListener("click", openAcuaticaForm);
    }
});

function showAcuaticaInfo(acuaticaId, titulo, descripcion) {
    document.getElementById("modalAcuaticaTitulo").innerText = titulo;
    document.getElementById("modalAcuaticaDescripcion").innerText = descripcion;
    document.getElementById("btnIniciarTramite").setAttribute("data-acuatica", acuaticaId);
    openModal("acuaticaInfoModal");
}

function openAcuaticaForm() {
    let acuaticaSeleccionada = document.getElementById("btnIniciarTramite").getAttribute("data-acuatica");

    if (!acuaticaSeleccionada) {
        alert("Por favor, selecciona una acuática antes de iniciar el trámite.");
        return;
    }

    const formularioTitulo = document.getElementById("formularioAcuaticaTitulo");
    const formularioDescripcion = document.getElementById("formularioAcuaticaDescripcion");
    const acuaticasFormContainer = document.getElementById("acuaticasFormContainer");
    acuaticasFormContainer.innerHTML = ""; // Limpiar contenido anterior

    let stepsContent = "";

    switch (acuaticaSeleccionada) {
        case "cdc":
            formularioTitulo.innerText = "Trámite para el Centro de Desarrollo Comunitario";
            formularioDescripcion.innerText = "Completa el siguiente formulario para registrarte.";
            stepsContent = generarStepperCDC();
            break;
        case "multideportivo":
            formularioTitulo.innerText = "Trámite para el Multideportivo Municipal";
            formularioDescripcion.innerText = "Completa el siguiente formulario para inscribirte.";
            stepsContent = generarStepperMultideportivo();
            break;
        case "oriente":
            formularioTitulo.innerText = "Trámite para la Acuática Municipal Oriente";
            formularioDescripcion.innerText = "Completa el siguiente formulario para tu inscripción.";
            stepsContent = generarStepperOriente();
            break;
        case "gomez_morin":
            formularioTitulo.innerText = "Trámite para la Acuática Manuel Gómez Morín";
            formularioDescripcion.innerText = "Llena este formulario para tu inscripción.";
            stepsContent = generarStepperGomezMorin();
            break;
        default:
            formularioTitulo.innerText = "Trámite de Acuática Municipal";
            formularioDescripcion.innerText = "Selecciona una acuática para continuar.";
    }

    acuaticasFormContainer.innerHTML = stepsContent;
    initializeStepperAcuaticas(); // Inicializar stepper dinámico después de insertarlo
    openModal("modalFormAcuatica");
}

// ** Generar Stepper dinámico para cada acuática **

// ** Formulario para CDC **
function generarStepperCDC() {
    return `
    <div class="containerTramite">
        <div class="stepper">
            <div class="step active" data-step="1">
                <div class="circle">1</div>
                <span>CDC</span>
            </div>
            <div class="step" data-step="2">
                <div class="circle">2</div>
                <span>Preferencias</span>
            </div>
            <div class="step" data-step="3">
                <div class="circle">3</div>
                <span>Confirmación</span>
            </div>
        </div>
        <form id="stepForm">
            <div class="form-step active" data-step="1">
                <label for="nombre">Nombre Completo111</label>
                <input type="text" id="nombre" name="nombre" required>
                <label for="telefono">Teléfono</label>
                <input type="tel" id="telefono" name="telefono" required>
                <div class="form-navigation">
                    <button type="button" class="btnNextTramite">Siguiente</button>
                </div>
            </div>
            <div class="form-step" data-step="2">
                <label for="nivelNatacion">Nivel de natación111</label>
                <select id="nivelNatacion" name="nivelNatacion" required>
                    <option value="Principiante">Principiante</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                </select>
                <label for="horario">Horario preferido</label>
                <input type="time" id="horario" name="horario" required>
                <div class="form-navigation">
                    <button type="button" class="btnPrevTramite">Atrás</button>
                    <button type="button" class="btnNextTramite">Siguiente</button>
                </div>
            </div>
            <div class="form-step" data-step="3">
                <h2>¡Confirmación!</h2>
                <p>Confirma que has registrado los datos correctos.</p>
                <div class="form-navigation">
                    <button type="button" class="btnPrevTramite">Atrás</button>
                    <button type="submit" class="btnConfirmarTramite">Confirmar</button>
                </div>
            </div>
        </form>
    </div>`;
}

// ** Formulario para Multideportivo **
function generarStepperMultideportivo() {
    return `
    <div class="containerTramite">
        <div class="stepper">
            <div class="step active" data-step="1">
                <div class="circle">1</div>
                <span>Multideportivo</span>
            </div>
            <div class="step" data-step="2">
                <div class="circle">2</div>
                <span>Documentos</span>
            </div>
            <div class="step" data-step="3">
                <div class="circle">3</div>
                <span>Confirmación</span>
            </div>
        </div>
        <form id="stepForm">
            <div class="form-step active" data-step="1">
                <label for="nombre">Nombre Completo2222</label>
                <input type="text" id="nombre" name="nombre" required>
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required>
                <div class="form-navigation">
                    <button type="button" class="btnNextTramite">Siguiente</button>
                </div>
            </div>
            <div class="form-step" data-step="2">
                <label for="certificadoMedico">Certificado médico222</label>
                <input type="file" id="certificadoMedico" name="certificadoMedico" required>
                <label for="experiencia">Experiencia en natación</label>
                <textarea id="experiencia" name="experiencia" required></textarea>
                <div class="form-navigation">
                    <button type="button" class="btnPrevTramite">Atrás</button>
                    <button type="button" class="btnNextTramite">Siguiente</button>
                </div>
            </div>
            <div class="form-step" data-step="3">
                <h2>¡Confirmación!</h2>
                <p>Confirma que has registrado los datos correctos.</p>
                <div class="form-navigation">
                    <button type="button" class="btnPrevTramite">Atrás</button>
                    <button type="submit" class="btnConfirmarTramite">Confirmar</button>
                </div>
            </div>
        </form>
    </div>`;
}

// ** Formulario para Oriente **
function generarStepperOriente() {
    return `
    <div class="containerTramite">
        <div class="stepper">
            <div class="step active" data-step="1">
                <div class="circle">1</div>
                <span>Oriente</span>
            </div>
            <div class="step" data-step="2">
                <div class="circle">2</div>
                <span>Documentos</span>
            </div>
            <div class="step" data-step="3">
                <div class="circle">3</div>
                <span>Confirmación</span>
            </div>
        </div>
        <form id="stepForm">
            <div class="form-step active" data-step="1">
                <label for="nombre">Nombre Completo2222</label>
                <input type="text" id="nombre" name="nombre" required>
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required>
                <div class="form-navigation">
                    <button type="button" class="btnNextTramite">Siguiente</button>
                </div>
            </div>
            <div class="form-step" data-step="2">
                <label for="certificadoMedico">Certificado médico222</label>
                <input type="file" id="certificadoMedico" name="certificadoMedico" required>
                <label for="experiencia">Experiencia en natación</label>
                <textarea id="experiencia" name="experiencia" required></textarea>
                <div class="form-navigation">
                    <button type="button" class="btnPrevTramite">Atrás</button>
                    <button type="button" class="btnNextTramite">Siguiente</button>
                </div>
            </div>
            <div class="form-step" data-step="3">
                <h2>¡Confirmación!</h2>
                <p>Confirma que has registrado los datos correctos.</p>
                <div class="form-navigation">
                    <button type="button" class="btnPrevTramite">Atrás</button>
                    <button type="submit" class="btnConfirmarTramite">Confirmar</button>
                </div>
            </div>
        </form>
    </div>`;
}

// ** Formulario para GomezMorin **
function generarStepperGomezMorin() {
    return `
    <div class="containerTramite">
        <div class="stepper">
            <div class="step active" data-step="1">
                <div class="circle">1</div>
                <span>Datos de inscripción</span>
            </div>
            <div class="step" data-step="2">
                <div class="circle">2</div>
                <span>Ficha de Ingreso</span>
            </div>
            <div class="step" data-step="3">
                <div class="circle">3</div>
                <span>Carta responsiva de ingreso</span>
            </div>
            <div class="step" data-step="4">
                <div class="circle">4</div>
                <span>Reglamento Interno</span>
            </div>
            <div class="step" data-step="5">
                <div class="circle">5</div>
                <span>Confirmación</span>
            </div>
        </div>
        <form id="stepForm">
            <div class="form-step active" data-step="1">
                <p>Juan López selecciona lo siguiente:</p>
                <label for="nombre">Nombre Completo2222</label>
                <input type="text" id="nombre" name="nombre" required>
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required>
                <div class="form-navigation">
                    <button type="button" class="btnNextTramite">Siguiente</button>
                </div>
            </div>
            <div class="form-step" data-step="2">
                <p>Aquí va la ficha de ingreso</p>
                <label for="certificadoMedico">Certificado médico222</label>
                <input type="file" id="certificadoMedico" name="certificadoMedico" required>
                <label for="experiencia">Experiencia en natación</label>
                <textarea id="experiencia" name="experiencia" required></textarea>
                <div class="form-navigation">
                    <button type="button" class="btnPrevTramite">Atrás</button>
                    <button type="button" class="btnNextTramite">Siguiente</button>
                </div>
            </div>
            <div class="form-step" data-step="3">
                <p>Aquí va la carta responsiva de ingreso</p>
                <label for="certificadoMedico">Certificado médico222</label>
                <input type="file" id="certificadoMedico" name="certificadoMedico" required>
                <label for="experiencia">Experiencia en natación</label>
                <textarea id="experiencia" name="experiencia" required></textarea>
                <div class="form-navigation">
                    <button type="button" class="btnPrevTramite">Atrás</button>
                    <button type="button" class="btnNextTramite">Siguiente</button>
                </div>
            </div>
            <div class="form-step" data-step="4">
                <p>Aquí va el reglamento interno</p>
                <label for="certificadoMedico">Certificado médico222</label>
                <input type="file" id="certificadoMedico" name="certificadoMedico" required>
                <label for="experiencia">Experiencia en natación</label>
                <textarea id="experiencia" name="experiencia" required></textarea>
                <div class="form-navigation">
                    <button type="button" class="btnPrevTramite">Atrás</button>
                    <button type="button" class="btnNextTramite">Siguiente</button>
                </div>
            </div>
            <div class="form-step" data-step="5">
                <h2>¡Confirmación!</h2>
                <p>Confirma que has registrado los datos correctos.</p>
                <div class="form-navigation">
                    <button type="button" class="btnPrevTramite">Atrás</button>
                    <button type="submit" class="btnConfirmarTramite">Confirmar</button>
                </div>
            </div>
        </form>
    </div>`;
}

// Inicializar Stepper dinámico en acuáticas
function initializeStepperAcuaticas() {
    document.querySelectorAll(".modalTramite").forEach((modal) => {
        const steps = modal.querySelectorAll(".form-step");
        const stepperItems = modal.querySelectorAll(".stepper .step");
        let currentStep = 0;

        const updateStepVisibility = () => {
            steps.forEach((step, index) => {
                step.classList.toggle("active", index === currentStep);
                step.style.display = index === currentStep ? "block" : "none";
            });
            stepperItems.forEach((stepper, index) => {
                stepper.classList.toggle("active", index <= currentStep);
            });
        };

        modal.addEventListener("click", (event) => {
            const target = event.target;

            if (target.classList.contains("btnNextTramite")) {
                if (currentStep < steps.length - 1) {
                    currentStep++;
                    updateStepVisibility();
                }
            }

            if (target.classList.contains("btnPrevTramite")) {
                if (currentStep > 0) {
                    currentStep--;
                    updateStepVisibility();
                }
            }

            if (target.classList.contains("btnConfirmarTramite")) {
                event.preventDefault();
                console.log("Botón confirmar presionado.");
                openModal("confirmationModalAcuatica");
            }
        });

        updateStepVisibility();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initializeStepperAcuaticas();
});


// acuaticas.js actualizado con información detallada y stepper en cada trámite

document.addEventListener("DOMContentLoaded", () => {
    console.log("Script de acuáticas cargado.");

    const btnIniciarTramite = document.getElementById("btnIniciarTramite");
    if (btnIniciarTramite) {
        btnIniciarTramite.addEventListener("click", openAcuaticaForm);
    }
});

// 📌 Información detallada de cada acuática con descripción y tabla de paquetes
const acuaticasDetalles = {
    cdc: {
        titulo: "Centro de Desarrollo Comunitario",
        descripcion: "Ubicado en Granjas Banthi, este centro ofrece clases de natación para todas las edades y niveles.",
        detallesExtra: `
            <p>Ofrecemos clases para principiantes, intermedios y avanzados con instructores certificados.</p>
            <p>Horario de atención: <strong>Lunes a Viernes de 7:00 AM a 8:00 PM</strong></p>
        `,
        tabla: `
            <table class="tabla-acuatica">
                <thead>
                    <tr><th>Paquete</th><th>Duración</th><th>Costo</th></tr>
                </thead>
                <tbody>
                    <tr><td>Básico</td><td>1 Mes</td><td>$500 MXN</td></tr>
                    <tr><td>Intermedio</td><td>3 Meses</td><td>$1,350 MXN</td></tr>
                    <tr><td>Avanzado</td><td>6 Meses</td><td>$2,500 MXN</td></tr>
                </tbody>
            </table>
        `
    },
    multideportivo: {
        titulo: "Multideportivo Municipal",
        descripcion: "Un espacio ideal para entrenamientos intensivos y clases de natación con instructores certificados.",
        detallesExtra: `
            <p>Incluye acceso a gimnasio, área de pesas y piscina olímpica climatizada.</p>
            <p>Horario de atención: <strong>Lunes a Domingo de 6:00 AM a 10:00 PM</strong></p>
        `,
        tabla: `
            <table class="tabla-acuatica">
                <thead>
                    <tr><th>Paquete</th><th>Duración</th><th>Costo</th></tr>
                </thead>
                <tbody>
                    <tr><td>Acceso Diario</td><td>1 Día</td><td>$100 MXN</td></tr>
                    <tr><td>Mensual</td><td>1 Mes</td><td>$800 MXN</td></tr>
                    <tr><td>Semestral</td><td>6 Meses</td><td>$4,500 MXN</td></tr>
                </tbody>
            </table>
        `
    },
    oriente: {
        titulo: "Acuática Municipal Oriente",
        descripcion: "Piscinas semiolímpicas con clases para principiantes y avanzados, ubicadas en INFONAVIT Pedregoso.",
        detallesExtra: `
            <p>Además de clases de natación, ofrecemos rehabilitación acuática y aquafitness.</p>
            <p>Horario de atención: <strong>Lunes a Sábado de 7:00 AM a 9:00 PM</strong></p>
        `,
        tabla: `
            <table class="tabla-acuatica">
                <thead>
                    <tr><th>Clase</th><th>Días a la Semana</th><th>Precio</th></tr>
                </thead>
                <tbody>
                    <tr><td>Clases de Natación</td><td>3 días</td><td>$600 MXN</td></tr>
                    <tr><td>Rehabilitación</td><td>5 días</td><td>$1,000 MXN</td></tr>
                </tbody>
            </table>
        `
    },
    gomez_morin: {
        titulo: "Acuática Manuel Gómez Morín",
        descripcion: "Una de las acuáticas más completas de la ciudad con acceso a entrenamientos y rehabilitación acuática",
        detallesExtra: `
            <p>Horario de atención: <strong>Lunes a Viernes de 6:00 AM a 9:00 PM</strong></p>
        `,
        tabla: `
            <table class="tabla-acuatica">
                <thead>
                    <tr>
                        <th>Tipo de Membresía</th>
                        <th>Horarios</th>
                        <th>UMA (Publicada en Ley de Ingresos)</th>
                        <th>Costo proporcional al valor de la UMA 2024 (108.57)</th>
                        <th>Costo con base al nuevo valor de UMA 2025 (113.14)</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Categoría: Infantiles -->
                    <tr>
                        <td colspan="5" class="categoria-titulo">Infantiles</td>
                    </tr>
                    <tr>
                        <td>2 días a la semana (martes y jueves)</td>
                        <td>10 am, 2, 3, 4, 5 y 6 pm</td>
                        <td>4.50</td>
                        <td>$488.57 MXN</td>
                        <td>$509.13 MXN</td>
                    </tr>
                    <tr>
                        <td>3 días a la semana (lunes, miércoles y viernes)</td>
                        <td>10 am, 2, 3, 4, 5 y 6 pm</td>
                        <td>6.00</td>
                        <td>$461.42 MXN</td>
                        <td>$678.84 MXN</td>
                    </tr>
                    <tr>
                        <td>5 días a la semana (lunes a viernes)</td>
                        <td>10 am, 2, 3, 4, 5 y 6 pm</td>
                        <td>9.00</td>
                        <td>$977.13 MXN</td>
                        <td>$1,018.26 MXN</td>
                    </tr>
    
                    <!-- Categoría: Adultos -->
                    <tr>
                        <td colspan="5" class="categoria-titulo">Adultos</td>
                    </tr>
                    <tr>
                        <td>2 días a la semana (martes y jueves)</td>
                        <td>6, 7, 8 y 9 am, 7, 8 y 9 pm</td>
                        <td>4.50</td>
                        <td>$488.57 MXN</td>
                        <td>$509.13 MXN</td>
                    </tr>
                    <tr>
                        <td>3 días a la semana (lunes, miércoles y viernes)</td>
                        <td>6, 7, 8 y 9 am, 7, 8 y 9 pm</td>
                        <td>6.00</td>
                        <td>$651.42 MXN</td>
                        <td>$678.84 MXN</td>
                    </tr>
                    <tr>
                        <td>5 días a la semana (lunes a viernes)</td>
                        <td>6, 7, 8 y 9 am, 7, 8 y 9 pm</td>
                        <td>9.00</td>
                        <td>$977.13 MXN</td>
                        <td>$1,018.26 MXN</td>
                    </tr>
    
                    <!-- Categoría: Horarios Económicos -->
                    <tr>
                        <td colspan="5" class="categoria-titulo">Horarios Económicos</td>
                    </tr>
                    <tr>
                        <td>2 días a la semana (martes y jueves)</td>
                        <td>11 am, 12 y 1 pm</td>
                        <td>2.50</td>
                        <td>$271.43 MXN</td>
                        <td>$282.85 MXN</td>
                    </tr>
                    <tr>
                        <td>3 días a la semana (lunes, miércoles y viernes)</td>
                        <td>11 am, 12 y 1 pm</td>
                        <td>3.50</td>
                        <td>$380.00 MXN</td>
                        <td>$395.99 MXN</td>
                    </tr>
                    <tr>
                        <td>5 días a la semana (lunes a viernes)</td>
                        <td>11 am, 12 y 1 pm</td>
                        <td>5.50</td>
                        <td>$597.14 MXN</td>
                        <td>$622.27 MXN</td>
                    </tr>
                </tbody>
            </table>
            <p>COSTOS ADICIONALES</p>
            <table class="tabla-acuatica">
                <thead>
                    <tr>
                        <th>Concepto</th>
                        <th>UMA</th>
                        <th>Costo proporcional al valor de la UMA 2024 (108.57)</th>
                        <th>Costo con base al nuevo valor de UMA 2025 (113.14)</th>
                    </tr>
                </thead>
                <tbody>
                <tr>
                    <td>Inscripción</td>
                    <td>2.50</td>
                    <td>$271.43 MXN</td>
                    <td>$282.85 MXN</td>
                </tr>
                </tbody>
            </table>

        `
    }

};

// 📌 Modificar contenido del modal dinámicamente
function showAcuaticaInfo(acuaticaId) {
    if (!acuaticasDetalles[acuaticaId]) {
        console.error(`No se encontró información para la acuática: ${acuaticaId}`);
        return;
    }

    const { titulo, descripcion, detallesExtra, tabla } = acuaticasDetalles[acuaticaId];

    document.getElementById("modalAcuaticaTitulo").innerText = titulo;
    document.getElementById("modalAcuaticaDescripcion").innerText = descripcion;

    // Insertar información detallada en el modal
    const modalContent = document.querySelector("#acuaticaInfoModal0 .modalInfoTramite-content");
    modalContent.innerHTML = `
        <button class="close-modalInfoTramite" onclick="closeModal('acuaticaInfoModal0')">X</button>
        <h2>${titulo}</h2>
        <p>${descripcion}</p>
        ${detallesExtra}
        ${tabla}
        <button id="btnIniciarTramite" class="btnTramite" data-acuatica="${acuaticaId}" onclick="openAcuaticaForm()">Iniciar Trámite</button>
    `;

    openModal("acuaticaInfoModal0");
}

// 📌 Función para restablecer el contenido del modal al cerrarlo
function resetAcuaticaModal() {
    const modalContent = document.querySelector("#acuaticaInfoModal0 .modalInfoTramite-content");

    modalContent.innerHTML = `
        <button class="close-modalInfoTramite" onclick="closeModal('acuaticaInfoModal0')">X</button>
        <h2>Información sobre el Trámite de Acuática Municipal</h2>
        <p>Selecciona la acuática de tu interés:</p>
        
        <div class="acuaticas-container">
            <div class="cardTramite" onclick="showAcuaticaInfo('cdc')">
                <div class="cardTramite-image">
                    <img src="images/CDC.jpg" alt="Centro de Desarrollo Comunitario" class="imgTramite" />
                </div>
                <div class="heading">Centro de Desarrollo Comunitario</div>
            </div>

            <div class="cardTramite" onclick="showAcuaticaInfo('multideportivo')">
                <div class="cardTramite-image">
                    <img src="images/MultideportivoMunicipal.JPG" alt="Multideportivo Municipal" class="imgTramite" />
                </div>
                <div class="heading">Multideportivo Municipal</div>
            </div>

            <div class="cardTramite" onclick="showAcuaticaInfo('oriente')">
                <div class="cardTramite-image">
                    <img src="images/MunicipalOriente.jpg" alt="Acuática Municipal Oriente" class="imgTramite" />
                </div>
                <div class="heading">Acuática Municipal Oriente</div>
            </div>

            <div class="cardTramite" onclick="showAcuaticaInfo('gomez_morin')">
                <div class="cardTramite-image">
                    <img src="images/ManuelGomezMorin.jpg" alt="Acuática Manuel Gómez Morín" class="imgTramite" />
                </div>
                <div class="heading">Acuática Manuel Gómez Morín</div>
            </div>
        </div>
    `;
}
