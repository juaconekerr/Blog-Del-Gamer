import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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
const contenedor = document.getElementById("contenedor-noticias");

async function cargarNoticias() {
  const q = query(collection(db, "Impuestos"), orderBy("fecha", "desc"));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    const noticia = doc.data();
    const fecha = noticia.fecha?.toDate().toLocaleDateString("es-AR", {
      day: "numeric", month: "long", year: "numeric"
    }) || "Fecha desconocida";

    const card = document.createElement("article");
    card.className = "bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition duration-300";

    card.innerHTML = `
      <h2 class="text-xl font-bold text-gray-800 mb-2">${noticia.titulo}</h2>
      <p class="text-sm text-gray-500 mb-4">${fecha}</p>
      <p class="text-gray-700">${noticia.contenido}</p>
    `;

    contenedor.appendChild(card);
  });
}

cargarNoticias().catch(error => {
  console.error("Error al cargar noticias:", error);
});
