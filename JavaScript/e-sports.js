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

const contenedor = document.getElementById("noticias-container");

async function cargarNoticias() {
  const noticiasRef = collection(db, "E-Sports");
  const q = query(noticiasRef, orderBy("fecha", "desc"));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    contenedor.innerHTML = "<p class='text-center text-gray-500 col-span-full'>No hay noticias disponibles.</p>";
    return;
  }

  snapshot.forEach(doc => {
    const data = doc.data();
    const fecha = data.fecha?.toDate().toLocaleDateString("es-AR", {
      year: "numeric", month: "long", day: "numeric"
    }) || "Fecha no disponible";

    const card = document.createElement("div");
    card.className = "bg-white p-6 rounded-2xl shadow hover:shadow-lg transition";
    card.innerHTML = `
      <h2 class="text-xl font-bold mb-2 text-blue-700">${data.titulo}</h2>
      <p class="text-sm text-gray-600 mb-2">${fecha}</p>
      <p class="text-gray-800">${data.contenido}</p>
    `;

    contenedor.appendChild(card);
  });
}

cargarNoticias();
