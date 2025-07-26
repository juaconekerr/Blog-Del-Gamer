import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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
const db = getFirestore(app);

const form = document.getElementById("noticia-form");
const submitBtn = document.getElementById("submit-btn");
const estadoMensaje = document.getElementById("estado-mensaje");

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

function validarCategorias() {
  const checkboxes = document.querySelectorAll('input[name="categoria"]:checked');
  const error = document.getElementById("error-categoria");
  if (checkboxes.length === 0) {
    error.classList.remove("hidden");
    return false;
  } else {
    error.classList.add("hidden");
    return true;
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const tituloOk = validarCampo("titulo", "error-titulo");
  const categoriasOk = validarCategorias();
  const contenidoOk = validarCampo("contenido", "error-contenido");

  if (!tituloOk || !categoriasOk || !contenidoOk) {
    estadoMensaje.textContent = "Por favor completa correctamente todos los campos obligatorios.";
    estadoMensaje.classList.remove("hidden", "text-green-600");
    estadoMensaje.classList.add("text-red-600");
    return;
  }

  const titulo = document.getElementById("titulo").value.trim();
  const contenido = document.getElementById("contenido").value.trim();
  const categorias = Array.from(document.querySelectorAll('input[name="categoria"]:checked')).map(cb => cb.value);

  submitBtn.disabled = true;
  submitBtn.textContent = "Publicando...";

  try {
    // Publicar en todas las colecciones de categorías seleccionadas
    const promises = categorias.map(cat => {
      return addDoc(collection(db, cat), {
        titulo,
        contenido,
        fecha: serverTimestamp(),
      });
    });

    await Promise.all(promises);

    estadoMensaje.textContent = "Noticia publicada correctamente en todas las categorías seleccionadas.";
    estadoMensaje.classList.remove("hidden", "text-red-600");
    estadoMensaje.classList.add("text-green-600");

    form.reset();
  } catch (error) {
    console.error("Error al publicar noticia:", error);
    estadoMensaje.textContent = "Ocurrió un error al publicar la noticia. Intenta nuevamente.";
    estadoMensaje.classList.remove("hidden", "text-green-600");
    estadoMensaje.classList.add("text-red-600");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Publicar noticia";
  }
});
