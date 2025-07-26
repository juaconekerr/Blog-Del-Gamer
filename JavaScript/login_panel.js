import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB2sj8hEN9RcUSmREvAS-NAZiN8C2rqt4M",
  authDomain: "blog-del-gamer-3c1e2.firebaseapp.com",
  projectId: "blog-del-gamer-3c1e2",
  storageBucket: "blog-del-gamer-3c1e2.appspot.com",
  messagingSenderId: "574788156311",
  appId: "1:574788156311:web:22f90825e8cbafd8f622d2",
  measurementId: "G-W0528FZ9RE"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const form = document.getElementById("login-form");

const errores = {
  email: document.getElementById("email-error"),
  password: document.getElementById("password-error"),
};

let mensajeErrorGlobal = null;

function crearContenedorError() {
  const formContainer = form.parentElement;
  mensajeErrorGlobal = document.createElement("p");
  mensajeErrorGlobal.className = "text-red-600 text-center mt-4 font-semibold";
  formContainer.appendChild(mensajeErrorGlobal);
}
crearContenedorError();

function validarEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  mensajeErrorGlobal.textContent = "";
  mensajeErrorGlobal.style.color = "red";

  const emailInput = form.email;
  const passwordInput = form.password;

  let valid = true;

  if (!validarEmail(emailInput.value)) {
    errores.email.classList.remove("hidden");
    valid = false;
  } else {
    errores.email.classList.add("hidden");
  }

  if (!passwordInput.value.trim()) {
    errores.password.classList.remove("hidden");
    valid = false;
  } else {
    errores.password.classList.add("hidden");
  }

  if (!valid) return;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, emailInput.value.trim(), passwordInput.value);

    // Obtener datos de Firestore
    const uid = userCredential.user.uid;
    const userDocRef = doc(db, "usuarios", uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      console.log("Datos del usuario:", userData);

      // Validar rol
      if (userData.rol === "Administrador") {
        localStorage.setItem("userData", JSON.stringify(userData));

        mensajeErrorGlobal.style.color = "green";
        mensajeErrorGlobal.textContent = "¡Has iniciado sesión correctamente!";

        setTimeout(() => {
          window.location.href = "pagina-crear-noticias.html"; // Cambiar a la página de creación de noticias
        }, 1200);
      } else {
        mensajeErrorGlobal.style.color = "red";
        mensajeErrorGlobal.textContent = "Registro fallido: no tenés permiso para acceder.";

        setTimeout(() => {
          window.location.href = "index.html";
        }, 5000);
      }
    } else {
      console.warn("No se encontró datos adicionales del usuario en Firestore.");
      mensajeErrorGlobal.textContent = "Error al obtener datos del usuario.";
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    if (error.code === "auth/user-not-found") {
      mensajeErrorGlobal.textContent = "Usuario no registrado. Por favor, crea una cuenta.";
    } else if (error.code === "auth/wrong-password") {
      mensajeErrorGlobal.textContent = "Contraseña incorrecta. Intenta nuevamente.";
    } else if (error.code === "auth/invalid-email") {
      mensajeErrorGlobal.textContent = "Correo electrónico no válido.";
    } else {
      mensajeErrorGlobal.textContent = "Error al iniciar sesión: " + error.message;
    }
  }
});
