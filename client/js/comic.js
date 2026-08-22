// =====================================
// COMICVERSE AI
// DETALLE DEL COMIC DESDE FIRESTORE
// =====================================


import { db } from "./firebase/firebase.js";


import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";




// ================================
// OBTENER ID DEL CÓMIC
// ================================


const parametros = new URLSearchParams(
    window.location.search
);


const id = parametros.get("id");


console.log("=================================");
console.log("📌 URL:", window.location.href);
console.log("📌 ID recibido:", id);
console.log("=================================");









// ================================
// CARGAR CÓMIC
// ================================


async function cargarComic(){


    try{


        if(!id){


            console.error(
                "❌ No existe ID en la URL"
            );


            document.getElementById(
                "comicTitulo"
            ).textContent =
            "No se recibió ID";


            return;


        }






        console.log(
            "🔎 Buscando documento:",
            id
        );






        const referencia = doc(
            db,
            "comics",
            id
        );





        const documento = await getDoc(
            referencia
        );






        console.log(
            "📄 Documento encontrado:",
            documento.exists()
        );







        if(!documento.exists()){


            console.error(
                "❌ No existe este documento en Firestore:",
                id
            );


            document.getElementById(
                "comicTitulo"
            ).textContent =
            "❌ Cómic no encontrado";


            return;


        }









        const comic = documento.data();





        console.log(
            "✅ DATOS DEL CÓMIC:",
            comic
        );









        // ================================
        // IMAGEN
        // ================================


        const imagen = document.getElementById(
            "comicImagen"
        );



        if(comic.imagen){


            imagen.src =
            comic.imagen;


            console.log(
                "🖼️ Imagen:",
                imagen.src
            );



            imagen.onload = ()=>{


                console.log(
                    "✅ Imagen cargada correctamente"
                );


            };



            imagen.onerror = ()=>{


                console.error(
                    "❌ No se pudo cargar la imagen:",
                    comic.imagen
                );


            };



        }else{


            console.error(
                "❌ El campo imagen está vacío"
            );


            imagen.src =
            "img/no-image.png";


        }









        // ================================
        // INFORMACIÓN
        // ================================


        document.getElementById(
            "comicTitulo"
        ).textContent =
        comic.titulo ?? "Sin título";




        document.getElementById(
            "comicGenero"
        ).textContent =
        "🎭 Género: " +
        (comic.genero ?? "Sin género");




        document.getElementById(
            "comicDescripcion"
        ).textContent =
        comic.descripcion ?? "Sin descripción";




        document.getElementById(
            "comicRating"
        ).textContent =
        "⭐ " +
        (comic.rating ?? "Sin rating");









        // ================================
        // FAVORITO
        // ================================


        const botonFavorito =
        document.getElementById(
            "btnFavorito"
        );



        if(botonFavorito){


            botonFavorito.addEventListener(
                "click",
                ()=>{


                    agregarFavorito(comic);


                }
            );


        }






    }

    catch(error){


        console.error(
            "❌ Error cargando cómic:",
            error
        );


    }


}











// ================================
// FAVORITOS TEMPORAL
// ================================


function agregarFavorito(comic){


    console.log(
        "❤️ Favorito:",
        comic
    );


    alert(
        "❤️ Cómic agregado a favoritos"
    );


}












// ================================
// ABRIR LECTOR
// ================================


window.leerCapitulo = function(){


    window.location.href =

    `lector.html?id=${id}`;


}











// ================================
// INICIAR
// ================================


cargarComic();