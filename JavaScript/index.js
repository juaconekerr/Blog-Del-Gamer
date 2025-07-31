import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore, collection, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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

// Función para obtener la última noticia de una colección
async function obtenerUltimaNoticia(coleccion) {
  try {
    const q = query(collection(db, coleccion), orderBy("fecha", "desc"), limit(1));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    const docData = querySnapshot.docs[0].data();
    const id = querySnapshot.docs[0].id;
    return { id, ...docData };
  } catch (error) {
    console.error(`Error obteniendo noticia de ${coleccion}:`, error);
    return null;
  }
}

// Función para actualizar el artículo con la noticia
function actualizarArticulo(articulo, noticia) {
  if (!noticia) {
    articulo.querySelector("h3").textContent = "No hay noticias disponibles";
    articulo.querySelector("p").textContent = "";
    articulo.querySelector("a").removeAttribute("href");
    articulo.querySelector("img").src = "https://via.placeholder.com/800x400?text=Sin+Imagen";
    articulo.querySelector("img").alt = "Sin imagen";
    return;
  }

  articulo.querySelector("h3").textContent = noticia.titulo || "Sin título";
  articulo.querySelector("p").textContent = noticia.contenido ? noticia.contenido.substring(0, 150) + "..." : "Sin resumen disponible.";
  articulo.querySelector("img").src = noticia.imagenURL || "https://via.placeholder.com/800x400";
  articulo.querySelector("img").alt = noticia.titulo || "Imagen noticia";
  articulo.querySelector("a").href = noticia.url || "#";
  articulo.querySelector("a").textContent = "Leer más";
}

// Al cargar la página
window.addEventListener("DOMContentLoaded", async () => {
  // Los artículos destacados están en el segundo <section> (índice 1) en tu HTML
  const secciones = document.querySelectorAll("section");
  if (secciones.length < 2) {
    console.warn("No se encontraron las secciones esperadas.");
    return;
  }
  const destacadosSection = secciones[1];
  const articulos = destacadosSection.querySelectorAll("article");

  if (articulos.length < 2) {
    console.warn("No se encontraron los dos artículos destacados para actualizar.");
    return;
  }

  // Carga últimas noticias según tu lógica
  const noticiaImpuestos = await obtenerUltimaNoticia("Impuestos");
  actualizarArticulo(articulos[0], noticiaImpuestos);

  const noticiaLanzamientos = await obtenerUltimaNoticia("Lanzamientos");
  actualizarArticulo(articulos[1], noticiaLanzamientos);
});
