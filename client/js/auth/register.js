// =====================================
// COMICVERSE AI
// REGISTRO + FIRESTORE
// =====================================

import { auth, db } from "../firebase/firebase.js";

import {
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


// =====================================
// FORMULARIO
// =====================================

const formulario =
    document.getElementById("registerForm");


// =====================================
// COMPROBAR FORMULARIO
// =====================================

if (!formulario) {

    console.error(
        "❌ No se encontró registerForm."
    );

}


// =====================================
// REGISTRO
// =====================================

formulario?.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();


        // =================================
        // OBTENER DATOS
        // =================================

        const nombre =
            document
                .getElementById("nombre")
                .value
                .trim();


        const email =
            document
                .getElementById("email")
                .value
                .trim();


        const password =
            document
                .getElementById("password")
                .value;


        const confirmar =
            document
                .getElementById("confirmPassword")
                .value;


        // =================================
        // COMPROBAR CONTRASEÑAS
        // =================================

        if (password !== confirmar) {

            alert(
                "❌ Las contraseñas no coinciden."
            );

            return;

        }


        // =================================
        // COMPROBAR NOMBRE
        // =================================

        if (!nombre) {

            alert(
                "❌ Escribe tu nombre."
            );

            return;

        }


        try {

            // =================================
            // CREAR USUARIO
            // =================================

            const usuario =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            // =================================
            // GUARDAR NOMBRE EN AUTH
            // =================================

            await updateProfile(
                usuario.user,
                {
                    displayName: nombre
                }
            );


            // =================================
            // IMAGEN PREDETERMINADA
            // =================================

            const imagenPerfil =
                "https://ui-avatars.com/api/?name=" +
                encodeURIComponent(nombre) +
                "&background=random&color=fff";


            // =================================
            // CREAR PERFIL FIRESTORE
            // =================================

            await setDoc(

                doc(
                    db,
                    "usuarios",
                    usuario.user.uid
                ),

                {

                    nombre: nombre,

                    correo: email,

                    imagenPerfil:
                        imagenPerfil,

                    plan: "gratuito",

                    fechaRegistro:
                        serverTimestamp()

                }

            );


            // =================================
            // ÉXITO
            // =================================

            alert(
                "🎉 Cuenta creada correctamente."
            );


            window.location.href =
                "login.html";


        }

        catch (error) {

            console.error(
                "❌ ERROR REGISTRO:",
                error
            );


            if (
                error.code ===
                "auth/email-already-in-use"
            ) {

                alert(
                    "⚠️ Este correo ya está registrado."
                );

            }

            else if (
                error.code ===
                "auth/weak-password"
            ) {

                alert(
                    "⚠️ La contraseña es demasiado débil."
                );

            }

            else {

                alert(
                    "❌ Error: " +
                    error.message
                );

            }

        }

    }
);