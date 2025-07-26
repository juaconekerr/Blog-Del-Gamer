import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
  Timestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Configuración Firebase (usa tu configuración)
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

// Contenedor donde se mostrarán las noticias
const contenedorNoticias = document.getElementById("contenedor-noticias");

// Función para formatear fecha legible
function formatearFecha(timestamp) {
  if (!timestamp) return "";
  let date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

// Función para cargar y mostrar noticias
async function cargarNoticiasPolitica() {
  try {
    // Consulta a Firestore: colección 'Politica' ordenada por 'fecha' descendente
    const q = query(collection(db, "Politica"), orderBy("fecha", "desc"));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      contenedorNoticias.innerHTML = "<p class='text-center text-gray-500'>No hay noticias para mostrar.</p>";
      return;
    }

    // Limpiar contenedor
    contenedorNoticias.innerHTML = "";

    // Recorrer documentos y crear elementos HTML para cada noticia
    querySnapshot.forEach((doc) => {
      const data = doc.data();

      // Crear artículo noticia
      const article = document.createElement("article");
      article.className = "bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden mb-6 p-6";

      const titulo = document.createElement("h3");
      titulo.className = "text-xl font-semibold mb-2";
      titulo.textContent = data.titulo || "Sin título";

      const fecha = document.createElement("p");
      fecha.className = "text-gray-500 text-sm mb-4";
      fecha.textContent = formatearFecha(data.fecha);

      const contenido = document.createElement("p");
      contenido.className = "text-gray-700 text-base";
      contenido.textContent = data.contenido || "";

      article.appendChild(titulo);
      article.appendChild(fecha);
      article.appendChild(contenido);

      contenedorNoticias.appendChild(article);
    });

  } catch (error) {
    console.error("Error al cargar noticias de Política:", error);
    contenedorNoticias.innerHTML = "<p class='text-center text-red-600'>Error al cargar las noticias. Intenta nuevamente más tarde.</p>";
  }
}

// Ejecutar la carga al cargar la página
document.addEventListener("DOMContentLoaded", cargarNoticiasPolitica);
