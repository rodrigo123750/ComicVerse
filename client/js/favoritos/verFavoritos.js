// =====================================
// COMICVERSE AI
// MOSTRAR FAVORITOS
// =====================================


import { auth, db } from "../firebase/firebase.js";


import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";


import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";





const contenedor =
document.getElementById(
    "listaFavoritos"
);









onAuthStateChanged(
auth,
async(usuario)=>{


    if(!usuario){


        window.location.href =
        "login.html";


        return;


    }






    contenedor.innerHTML = "";






    const consulta =
    await getDocs(
        collection(db,"favoritos")
    );






    let encontrados = 0;






    consulta.forEach((documento)=>{



        const datos =
        documento.data();





        if(datos.usuario === usuario.uid){



            encontrados++;





            contenedor.innerHTML += `


            <div class="card">



                <img 
                src="${datos.imagen}"
                alt="${datos.titulo}"
                >




                <h3>
                📚 ${datos.titulo}
                </h3>





                <p>
                🎭 Género:
                ${datos.genero}
                </p>





                <p class="rating">
                ⭐ ${datos.rating}
                </p>





                <p>
                ${datos.descripcion}
                </p>





                <a 
                class="btn"
                href="comic.html?id=${datos.comicID}">
                
                📖 Leer nuevamente
                
                </a>



            </div>


            `;



        }



    });








    if(encontrados === 0){



        contenedor.innerHTML = `

        <h2>
        No tienes favoritos todavía ❤️
        </h2>

        `;



    }




});