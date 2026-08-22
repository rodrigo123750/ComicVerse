// =====================================
// COMICVERSE AI
// SISTEMA DE FAVORITOS
// =====================================


import { auth, db } from "../firebase/firebase.js";


import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";


import {
    doc,
    getDoc,
    setDoc,
    deleteDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";





const boton = document.getElementById(
    "btnFavorito"
);


let usuario = null;



const params = new URLSearchParams(
    window.location.search
);


const comicID = params.get("id");





let datosComic = null;








// ================================
// CARGAR USUARIO Y CÓMIC
// ================================


onAuthStateChanged(
auth,
async(user)=>{


    usuario = user;



    if(!usuario || !comicID){

        return;

    }





    // Buscar datos del cómic


    const comicRef = doc(
        db,
        "comics",
        comicID
    );


    const comicDoc = await getDoc(
        comicRef
    );



    if(comicDoc.exists()){


        datosComic = comicDoc.data();



    }





    // Revisar favorito


    const favoritoRef = doc(
        db,
        "favoritos",
        usuario.uid + "_" + comicID
    );



    const favorito = await getDoc(
        favoritoRef
    );



    if(favorito.exists()){


        boton.textContent =
        "💔 Quitar de favoritos";


    }else{


        boton.textContent =
        "❤️ Agregar a favoritos";


    }



});









// ================================
// BOTÓN FAVORITO
// ================================


boton.addEventListener(
"click",
async()=>{


    if(!usuario){


        alert(
            "Debes iniciar sesión"
        );


        window.location.href =
        "login.html";


        return;


    }





    const referencia = doc(
        db,
        "favoritos",
        usuario.uid + "_" + comicID
    );





    const favorito = await getDoc(
        referencia
    );






    if(favorito.exists()){


        await deleteDoc(
            referencia
        );



        boton.textContent =
        "❤️ Agregar a favoritos";



        alert(
            "Se eliminó de favoritos"
        );




    }else{



        await setDoc(
        referencia,
        {


            usuario: usuario.uid,


            comicID: comicID,


            titulo:
            datosComic.titulo,


            imagen:
            datosComic.imagen,


            genero:
            datosComic.genero,


            descripcion:
            datosComic.descripcion,


            rating:
            datosComic.rating,


            fecha:
            serverTimestamp()


        });



        boton.textContent =
        "💔 Quitar de favoritos";



        alert(
            "❤️ Guardado en favoritos"
        );


    }



});