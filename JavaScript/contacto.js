import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB2sj8hEN9RcUSmREvAS-NAZiN8C2rqt4M",
  authDomain: "blog-del-gamer-3c1e2.firebaseapp.com",
  projectId: "blog-del-gamer-3c1e2",
  storageBucket: "blog-del-gamer-3c1e2.appspot.com",
  messagingSenderId: "574788156311",
  appId: "1:574788156311:web:22f90825e8cbafd8f622d2",
  measurementId: "G-W0528FZ9RE"
};

// Inicialización
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Elementos del formulario y botón
const form = document.getElementById("contacto-form");
const submitBtn = document.getElementById("submit-btn");

// Elementos para mostrar errores
const errores = {
  nombre: document.getElementById("error-nombre"),
  apellido: document.getElementById("error-apellido"),
  email: document.getElementById("error-email"),
  asunto: document.getElementById("error-asunto"),
  mensaje: document.getElementById("error-mensaje"),
};

// Funciones para validar campos
function validarCampo(idInput, idError) {
  const input = document.getElementById(idInput);
  const error = document.getElementById(idError);
  if (!input.value.trim()) {
    error.classList.remove("hidden");
    input.setAttribute("aria-invalid", "true");
    return false;
  } else {
    error.classList.add("hidden");
    input.removeAttribute("aria-invalid");
    return true;
  }
}

function validarEmail(idInput, idError) {
  const input = document.getElementById(idInput);
  const error = document.getElementById(idError);
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(input.value.trim())) {
    error.classList.remove("hidden");
    input.setAttribute("aria-invalid", "true");
    return false;
  } else {
    error.classList.add("hidden");
    input.removeAttribute("aria-invalid");
    return true;
  }
}

// Control de delay 15 minutos entre envíos
function puedeEnviar() {
  const ultimaFechaStr = localStorage.getItem("ultimoEnvioMensaje");
  if (!ultimaFechaStr) return true;

  const ultimaFecha = new Date(ultimaFechaStr);
  const ahora = new Date();
  const diffSegundos = (ahora - ultimaFecha) / 1000;

  return diffSegundos >= 900; // 900 segundos = 15 minutos
}

function tiempoRestante() {
  const ultimaFechaStr = localStorage.getItem("ultimoEnvioMensaje");
  if (!ultimaFechaStr) return 0;

  const ultimaFecha = new Date(ultimaFechaStr);
  const ahora = new Date();
  const diffSegundos = (ahora - ultimaFecha) / 1000;
  return Math.max(0, 900 - diffSegundos);
}

function formatoTiempo(segundos) {
  const min = Math.floor(segundos / 60);
  const seg = Math.floor(segundos % 60);
  return `${min} minuto${min !== 1 ? "s" : ""} y ${seg} segundo${seg !== 1 ? "s" : ""}`;
}

function actualizarEstadoEnvio() {
  if (!puedeEnviar()) {
    const segundosRest = tiempoRestante();
    submitBtn.disabled = true;
    submitBtn.textContent = `Espera ${formatoTiempo(segundosRest)} para enviar otro mensaje`;

    const interval = setInterval(() => {
      const segundosRestActual = tiempoRestante();
      if (segundosRestActual <= 0) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Enviar mensaje";
        clearInterval(interval);
      } else {
        submitBtn.textContent = `Espera ${formatoTiempo(segundosRestActual)} para enviar otro mensaje`;
      }
    }, 1000);
  } else {
    submitBtn.disabled = false;
    submitBtn.textContent = "Enviar mensaje";
  }
}

actualizarEstadoEnvio();

// Envío del formulario
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!puedeEnviar()) {
    alert("Debes esperar 15 minutos entre cada mensaje. Por favor, intenta más tarde.");
    return;
  }

  const nombreOk = validarCampo("nombre", "error-nombre");
  const apellidoOk = validarCampo("apellido", "error-apellido");
  const emailOk = validarEmail("email", "error-email");
  const asuntoOk = validarCampo("asunto", "error-asunto");
  const mensajeOk = validarCampo("mensaje", "error-mensaje");

  if (!nombreOk || !apellidoOk || !emailOk || !asuntoOk || !mensajeOk) return;

  const nombre = document.getElementById("nombre").value.trim();
  const apellido = document.getElementById("apellido").value.trim();
  const email = document.getElementById("email").value.trim();
  const asunto = document.getElementById("asunto").value.trim();
  const mensaje = document.getElementById("mensaje").value.trim();

  submitBtn.disabled = true;
  submitBtn.textContent = "Enviando...";

  try {
    await addDoc(collection(db, "mensajes"), {
      nombre,
      apellido,
      email,
      asunto,
      mensaje,
      fecha: new Date().toISOString(),
    });

    alert("Mensaje enviado correctamente. ¡Gracias por contactarnos!");
    localStorage.setItem("ultimoEnvioMensaje", new Date().toISOString());
    window.location.reload();

  } catch (error) {
    console.error("Error al enviar mensaje:", error);
    alert("Ocurrió un error al enviar el mensaje. Inténtalo más tarde.");
    submitBtn.disabled = false;
    submitBtn.textContent = "Enviar mensaje";
  }
});
