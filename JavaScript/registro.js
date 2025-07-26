import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app);

// Elementos del formulario
const form = document.getElementById("registro-form");
const passwordInput = document.getElementById("password");

const requisitos = {
  length: { regex: /^.{6,}$/, el: document.getElementById("req-length") },
  uppercase: { regex: /[A-Z]/, el: document.getElementById("req-uppercase") },
  lowercase: { regex: /[a-z]/, el: document.getElementById("req-lowercase") },
  number: { regex: /[0-9]/, el: document.getElementById("req-number") },
  special: { regex: /[!@#$%^&*(),.?":{}|<>]/, el: document.getElementById("req-special") }
};

const errores = {
  nombre: document.getElementById("nombre-error"),
  apellido: document.getElementById("apellido-error"),
  email: document.getElementById("email-error"),
  password: document.getElementById("password-error")
};

// Actualiza íconos de validación
function actualizarIcono(el, cumple) {
  const icono = el.querySelector(".icon");
  icono.textContent = cumple ? "✔" : "✖";
  icono.classList.remove("bg-gray-300", "bg-green-500", "bg-red-500");
  icono.classList.add(cumple ? "bg-green-500" : "bg-red-500");
}

// Validación de contraseña en tiempo real
passwordInput.addEventListener("input", () => {
  const value = passwordInput.value;
  Object.values(requisitos).forEach(req => {
    const cumple = req.regex.test(value);
    actualizarIcono(req.el, cumple);
  });
});

// Validación campos simples
function validarCampo(inputId, errorId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
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

// Validación de email
function validarEmail(inputId, errorId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(input.value.trim())) {
    error.classList.remove("hidden");
    input.setAttribute("aria-invalid", "true");
    return false;
  } else {
    error.classList.add("hidden");
    input.removeAttribute("aria-invalid");
    return true;
  }
}

// Envío del formulario
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombreOk = validarCampo("nombre", "nombre-error");
  const apellidoOk = validarCampo("apellido", "apellido-error");
  const emailOk = validarEmail("email", "email-error");

  const password = passwordInput.value;
  const requisitosCumplidos = Object.values(requisitos).every(req => req.regex.test(password));

  if (!requisitosCumplidos) {
    errores.password.classList.remove("hidden");
  } else {
    errores.password.classList.add("hidden");
  }

  if (!nombreOk || !apellidoOk || !emailOk || !requisitosCumplidos) return;

  const nombre = document.getElementById("nombre").value.trim();
  const apellido = document.getElementById("apellido").value.trim();
  const email = document.getElementById("email").value.trim();

  try {
    const credenciales = await createUserWithEmailAndPassword(auth, email, password);
    const uid = credenciales.user.uid;

    // Guardar en Firestore
    await setDoc(doc(db, "usuarios", uid), {
      nombre,
      apellido,
      email
    });

    alert("¡Usuario registrado correctamente!");
    form.reset();
    Object.values(requisitos).forEach(req => actualizarIcono(req.el, false));
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    alert("Error: " + error.message);
  }
});
