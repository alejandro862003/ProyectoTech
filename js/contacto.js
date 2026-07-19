// ===================================================
// CONTACTO.JS — Formulario de contacto

const form = document.getElementById("contactForm");
const nameInput = document.getElementById("contactName");
const emailInput = document.getElementById("contactEmail");
const messageInput = document.getElementById("contactMessage");
const sendBtn = document.getElementById("sendBtn");
const formError = document.getElementById("formError");
const formSuccess = document.getElementById("formSuccess");

// Expresión regular simple para validar formato de email
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

form.addEventListener("submit", function (e) {
    e.preventDefault();
    ocultarMensajes();

    const nombre = nameInput.value.trim();
    const email = emailInput.value.trim();
    const mensaje = messageInput.value.trim();

    const errores = validarCampos(nombre, email, mensaje);

    if (errores.length > 0) {
        mostrarError(errores[0]);
        return;
    }

    enviarFormulario({ nombre, email, mensaje });
});

function validarCampos(nombre, email, mensaje) {
    const errores = [];

    limpiarEstilosError();

    if (nombre.length < 2) {
        errores.push("Por favor ingresá tu nombre.");
        marcarCampoError(nameInput);
    }

    if (!EMAIL_REGEX.test(email)) {
        errores.push("Ingresá un email válido.");
        marcarCampoError(emailInput);
    }

    if (mensaje.length < 10) {
        errores.push("El mensaje debe tener al menos 10 caracteres.");
        marcarCampoError(messageInput);
    }

    return errores;
}

function marcarCampoError(input) {
    input.closest(".input-field").classList.add("input-error");
}

function limpiarEstilosError() {
    document.querySelectorAll(".input-field").forEach(function (field) {
        field.classList.remove("input-error");
    });
}

function mostrarError(mensaje) {
    formError.textContent = mensaje;
    formError.hidden = false;
}

function ocultarMensajes() {
    formError.hidden = true;
    formSuccess.hidden = true;
}

function enviarFormulario(datos) {
    sendBtn.disabled = true;
    sendBtn.textContent = "Enviando...";

    setTimeout(function () {
        formSuccess.hidden = false;
        form.reset();
        limpiarEstilosError();
        sendBtn.disabled = false;
        sendBtn.textContent = "Enviar mensaje";
    }, 800);

}
