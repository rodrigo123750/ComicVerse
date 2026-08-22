// =====================================
// COMICVERSE AI
// PERFIL CON FIRESTORE
// =====================================


import { auth, db } from "../firebase/firebase.js";


import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";


import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";





const nombreUsuario =
document.getElementById("nombreUsuario");


const correoUsuario =
document.getElementById("correoUsuario");


const fechaUsuario =
document.getElementById("fechaUsuario");


const cerrarSesion =
document.getElementById("cerrarSesion");







onAuthStateChanged(auth, async(usuario)=>{


    if(usuario){


        const referencia =
        doc(
            db,
            "usuarios",
            usuario.uid
        );



        const documento =
        await getDoc(referencia);





        if(documento.exists()){


            const datos =
            documento.data();



            nombreUsuario.textContent =
            "👤 " + datos.nombre;



            correoUsuario.textContent =
            "📧 " + datos.correo;



            if(datos.fechaRegistro){


                fechaUsuario.textContent =
                "📅 Registrado: " +
                datos.fechaRegistro
                .toDate()
                .toLocaleDateString();


            }



        }



    }else{


        window.location.href =
        "login.html";


    }



});







cerrarSesion.addEventListener(
"click",
async()=>{


    await signOut(auth);


    window.location.href =
    "index.html";


});