// =====================================
// COMICVERSE AI
// LOGIN DE USUARIOS
// =====================================

import { auth } from "../firebase/firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";


// =====================================
// FORMULARIO
// =====================================

const loginForm =
    document.getElementById("loginForm");


// =====================================
// COMPROBAR FORMULARIO
// =====================================

if (!loginForm) {

    console.error(
        "❌ No se encontró loginForm."
    );

}


// =====================================
// LOGIN
// =====================================

loginForm?.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();


        // =================================
        // OBTENER DATOS
        // =================================

        const email =
            document
                .getElementById("email")
                .value
                .trim();


        const password =
            document
                .getElementById("password")
                .value;


        // =================================
        // COMPROBAR
        // =================================

        if (!email || !password) {

            alert(
                "❌ Completa todos los campos."
            );

            return;

        }


        try {

            // =================================
            // INICIAR SESIÓN
            // =================================

            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );


            // =================================
            // ÉXITO
            // =================================

            alert(
                "🎉 Bienvenido a ComicVerse AI."
            );


            window.location.href =
                "perfil.html";


        }

        catch (error) {

            console.error(
                "❌ ERROR LOGIN:",
                error
            );


            if (
                error.code ===
                "auth/invalid-credential"
            ) {

                alert(
                    "❌ Correo o contraseña incorrectos."
                );

            }

            else if (
                error.code ===
                "auth/user-not-found"
            ) {

                alert(
                    "❌ No existe una cuenta con ese correo."
                );

            }

            else {

                alert(
                    "❌ No se pudo iniciar sesión."
                );

            }

        }

    }
);