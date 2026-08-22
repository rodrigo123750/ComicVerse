// =====================================
// COMICVERSE AI
// PANEL ADMIN - CREAR CÓMICS
// =====================================


import { db } from "../firebase/firebase.js";


import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";





const formulario = document.getElementById("comicForm");

const mensaje = document.getElementById("mensaje");





formulario.addEventListener("submit", async(e)=>{


    e.preventDefault();




    const titulo =
    document.getElementById("titulo").value;



    const genero =
    document.getElementById("genero").value;



    const descripcion =
    document.getElementById("descripcion").value;



    const imagen =
    document.getElementById("imagen").value;



    const rating =
    document.getElementById("rating").value;





    try{



        await addDoc(

            collection(db,"comics"),

            {

                titulo: titulo,

                genero: genero,

                descripcion: descripcion,

                imagen: imagen,

                rating: Number(rating),

                fecha:
                serverTimestamp()

            }

        );





        mensaje.textContent =
        "✅ Cómic guardado correctamente";



        formulario.reset();




    }catch(error){



        console.error(error);


        mensaje.textContent =
        "❌ Error: " + error.message;



    }



});