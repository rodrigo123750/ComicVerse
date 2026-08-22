// =====================================
// COMICVERSE AI
// CARGAR COMICS DESTACADOS EN INDEX
// =====================================

import { db } from "./firebase/firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


const contenedor = document.getElementById("destacados");


async function cargarComics(){

    try{

        const consulta = await getDocs(
            collection(db,"comics")
        );


        contenedor.innerHTML = "";


        consulta.forEach((doc)=>{


            const comic = doc.data();

            const id = doc.id;


            contenedor.innerHTML += `

            <div class="card">


                <img 
                src="${comic.imagen}" 
                alt="${comic.titulo}">


                <h3>
                📖 ${comic.titulo}
                </h3>


                <p>
                ${comic.genero}
                </p>


                <button 
                class="btn"
                onclick="location.href='comic.html?id=${id}'">

                📖 Leer ahora

                </button>


            </div>

            `;


        });


    }
    catch(error){

        console.error(
            "Error cargando cómics:",
            error
        );

    }


}


cargarComics(); 