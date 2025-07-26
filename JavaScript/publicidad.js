import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB2sj8hEN9RcUSmREvAS-NAZiN8C2rqt4M",
  authDomain: "blog-del-gamer-3c1e2.firebaseapp.com",
  projectId: "blog-del-gamer-3c1e2",
  storageBucket: "blog-del-gamer-3c1e2.appspot.com",
  messagingSenderId: "574788156311",
  appId: "1:574788156311:web:22f90825e8cbafd8f622d2",
  measurementId: "G-W0528FZ9RE"
};

console.log("Inicializando Firebase...");
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log("Firebase inicializado correctamente.");

const form = document.getElementById("publicidad-form");
const submitBtn = document.getElementById("submit-btn");
const estadoMensaje = document.getElementById("estado-mensaje");

const errores = {
  nombre: document.getElementById("error-nombre"),
  apellido: document.getElementById("error-apellido"),
  email: document.getElementById("error-email"),
  producto: document.getElementById("error-producto"),
  datoContacto: document.getElementById("error-dato-contacto"),
};

function validarCampo(idInput, idError) {
  const input = document.getElementById(idInput);
  const error = document.getElementById(idError);
  if (!input.value.trim()) {
    error.classList.remove("hidden");
    input.setAttribute("aria-invalid", "true");
    console.log(`Validación fallida: campo ${idInput} vacío.`);
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
    console.log(`Validación fallida: correo inválido en campo ${idInput}.`);
    return false;
  } else {
    error.classList.add("hidden");
    input.removeAttribute("aria-invalid");
    return true;
  }
}

function puedeEnviar() {
  const ultimaFechaStr = localStorage.getItem("ultimoEnvioPublicidad");
  if (!ultimaFechaStr) {
    console.log("No hay registro previo de envío, puede enviar.");
    return true;
  }

  const ultimaFecha = new Date(ultimaFechaStr);
  const ahora = new Date();
  const diffSegundos = (ahora - ultimaFecha) / 1000;
  console.log(`Segundos desde último envío: ${diffSegundos.toFixed(2)}`);
  return diffSegundos >= 900; // 15 minutos
}

function tiempoRestante() {
  const ultimaFechaStr = localStorage.getItem("ultimoEnvioPublicidad");
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
    submitBtn.textContent = `Espera ${formatoTiempo(segundosRest)} para enviar otra solicitud`;

    const interval = setInterval(() => {
      const segundosRestActual = tiempoRestante();
      if (segundosRestActual <= 0) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Enviar solicitud";
        clearInterval(interval);
      } else {
        submitBtn.textContent = `Espera ${formatoTiempo(segundosRestActual)} para enviar otra solicitud`;
      }
    }, 1000);
  } else {
    submitBtn.disabled = false;
    submitBtn.textContent = "Enviar solicitud";
  }
}

actualizarEstadoEnvio();

function validarDatoContacto(opcion) {
  if (opcion === "") {
    console.log("No se seleccionó método de contacto, dato contacto no obligatorio.");
    return true; 
  }
  
  let valido = false;
  switch(opcion) {
    case "whatsapp":
      const prefijo = document.getElementById("prefijo-whatsapp").value.trim();
      const numero = document.getElementById("dato-contacto").value.trim();
      valido = numero.length > 0;
      if (!valido) {
        errores.datoContacto.classList.remove("hidden");
        console.log("Validación fallida: número WhatsApp vacío.");
      } else {
        errores.datoContacto.classList.add("hidden");
      }
      break;
    case "correo":
      valido = validarEmail("dato-contacto-correo", "error-dato-contacto");
      break;
    case "instagram":
      valido = validarCampo("dato-contacto-instagram", "error-dato-contacto");
      break;
    case "telegram":
      valido = validarCampo("dato-contacto-telegram", "error-dato-contacto");
      break;
    case "otros":
      valido = validarCampo("dato-contacto-otros", "error-dato-contacto");
      break;
    default:
      valido = true;
  }
  return valido;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("Submit form detectado.");

  if (!puedeEnviar()) {
    estadoMensaje.textContent = "Debes esperar 15 minutos entre cada solicitud. Por favor, intenta más tarde.";
    estadoMensaje.classList.remove("hidden", "text-green-600");
    estadoMensaje.classList.add("text-red-600");
    console.log("Rechazado por tiempo de espera.");
    return;
  }

  const nombreOk = validarCampo("nombre", "error-nombre");
  const apellidoOk = validarCampo("apellido", "error-apellido");
  const emailOk = validarEmail("email", "error-email");
  const productoOk = validarCampo("producto", "error-producto");
  const contactoSelect = document.getElementById("contacto");
  const contactoVal = contactoSelect.value;
  const datoContactoOk = validarDatoContacto(contactoVal);

  if (!nombreOk || !apellidoOk || !emailOk || !productoOk || !datoContactoOk) {
    estadoMensaje.textContent = "Por favor completa correctamente todos los campos obligatorios.";
    estadoMensaje.classList.remove("hidden", "text-green-600");
    estadoMensaje.classList.add("text-red-600");
    console.log("Validación de formulario fallida, no se envía.");
    return;
  }

  const nombre = document.getElementById("nombre").value.trim();
  const apellido = document.getElementById("apellido").value.trim();
  const email = document.getElementById("email").value.trim();
  const producto = document.getElementById("producto").value.trim();
  const mensaje = document.getElementById("mensaje").value.trim();

  let datoContacto = "";
  if (contactoVal === "whatsapp") {
    const prefijo = document.getElementById("prefijo-whatsapp").value.trim();
    const numero = document.getElementById("dato-contacto").value.trim();
    datoContacto = `${prefijo} ${numero}`;
  } else if (contactoVal === "correo") {
    datoContacto = document.getElementById("dato-contacto-correo").value.trim();
  } else if (contactoVal === "instagram") {
    datoContacto = document.getElementById("dato-contacto-instagram").value.trim();
  } else if (contactoVal === "telegram") {
    datoContacto = document.getElementById("dato-contacto-telegram").value.trim();
  } else if (contactoVal === "otros") {
    datoContacto = document.getElementById("dato-contacto-otros").value.trim();
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Enviando...";
  estadoMensaje.classList.add("hidden");

  try {
    console.log("Intentando enviar datos a Firestore:", {
      nombre,
      apellido,
      email,
      producto,
      mensaje,
      contactoPreferido: contactoVal,
      datoContacto,
      fecha: new Date().toISOString(),
    });

    await addDoc(collection(db, "mensajes_publicidad"), {
      nombre,
      apellido,
      email,
      producto,
      mensaje,
      contactoPreferido: contactoVal,
      datoContacto,
      fecha: new Date().toISOString(),
    });

    console.log("Documento agregado con éxito.");

    estadoMensaje.textContent = "Solicitud enviada correctamente. ¡Gracias por contactarnos!";
    estadoMensaje.classList.remove("hidden", "text-red-600");
    estadoMensaje.classList.add("text-green-600");

    localStorage.setItem("ultimoEnvioPublicidad", new Date().toISOString());

    form.reset();
    const campoContacto = document.getElementById("campo-contacto");
    campoContacto.classList.add("hidden");

    actualizarEstadoEnvio();
  } catch (error) {
    console.error("Error al enviar solicitud:", error);
    estadoMensaje.textContent = "Ocurrió un error al enviar la solicitud. Inténtalo más tarde.";
    estadoMensaje.classList.remove("hidden", "text-green-600");
    estadoMensaje.classList.add("text-red-600");

    submitBtn.disabled = false;
    submitBtn.textContent = "Enviar solicitud";
  }
});
