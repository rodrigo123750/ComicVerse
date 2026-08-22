// =====================================
// COMICVERSE AI
// LOGIN DE USUARIOS
// =====================================


import { auth } from "../firebase/firebase.js";


import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";



const loginForm = document.getElementById("loginForm");



loginForm.addEventListener("submit", async (e)=>{


    e.preventDefault();



    const email =
    document.getElementById("email").value;



    const password =
    document.getElementById("password").value;



    try{


        const usuario =
        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );



        alert(
            "🎉 Bienvenido a ComicVerse AI"
        );



        window.location.href =
        "perfil.html";



    }catch(error){


        alert(
            "❌ Correo o contraseña incorrectos"
        );


        console.error(error);


    }



});