// =====================================
// COMICVERSE AI
// CARGAR Y FILTRAR CÓMICS FIRESTORE
// =====================================


import { db } from "./firebase/firebase.js";


import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";




// CONTENEDOR DE CÓMICS

const listaComics =
document.getElementById("listaComics");



// BUSCADOR

const buscador =
document.getElementById("buscador");




// GUARDAR TODOS LOS CÓMICS

let todosLosComics = [];






// =====================================
// CARGAR CÓMICS DESDE FIREBASE
// =====================================


async function cargarComics(){


    try{


        const consulta =
        await getDocs(
            collection(db,"comics")
        );



        todosLosComics = [];



        consulta.forEach((doc)=>{


            todosLosComics.push({

                id: doc.id,

                ...doc.data()

            });


        });




        mostrarComics(todosLosComics);



    }

    catch(error){


        console.error(
            "Error cargando cómics:",
            error
        );



        listaComics.innerHTML = `

        <h3>
        ❌ No se pudieron cargar las historias
        </h3>

        `;


    }


}








// =====================================
// MOSTRAR CÓMICS
// =====================================


function mostrarComics(comics){


    listaComics.innerHTML = "";



    if(comics.length === 0){


        listaComics.innerHTML = `

        <h3>

        😔 No se encontraron cómics

        </h3>

        `;


        return;


    }





    comics.forEach(comic=>{


        const tarjeta =
        document.createElement("div");



        tarjeta.className =
        "card";





        tarjeta.innerHTML = `


        <img

        src="${comic.imagen}"

        alt="${comic.titulo}"

        >




        <h3>

        📖 ${comic.titulo}

        </h3>





        <p>

        🎭 ${comic.genero}

        </p>





        <p>

        ⭐ ${comic.rating}

        </p>





        <button

        class="btn"

        onclick="abrirComic('${comic.id}')">

        📖 Leer ahora

        </button>




        `;



        listaComics.appendChild(tarjeta);



    });



}








// =====================================
// BUSCADOR EN TIEMPO REAL
// =====================================


if(buscador){


    buscador.addEventListener(
        "input",
        ()=>{


            const texto =

            buscador.value
            .toLowerCase()
            .trim();




            const resultado =

            todosLosComics.filter(comic=>{


                return (

                comic.titulo
                .toLowerCase()
                .includes(texto)

                ||

                comic.genero
                .toLowerCase()
                .includes(texto)

                );


            });




            mostrarComics(resultado);



        }

    );


}








// =====================================
// ABRIR CÓMIC
// =====================================


window.abrirComic = function(id){


    window.location.href =

    `comic.html?id=${id}`;


}








// INICIAR

cargarComics();