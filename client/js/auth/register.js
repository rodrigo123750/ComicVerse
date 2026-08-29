// =====================================
// COMICVERSE AI
// REGISTRO + FIRESTORE
// =====================================

import {
    auth,
    db
} from "../firebase/firebase.js";

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
    document.getElementById(
        "registerForm"
    );


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
        // VALIDAR NOMBRE
        // =================================

        if (!nombre) {

            alert(
                "❌ Escribe tu nombre."
            );

            return;

        }


        // =================================
        // VALIDAR CONTRASEÑAS
        // =================================

        if (password !== confirmar) {

            alert(
                "❌ Las contraseñas no coinciden."
            );

            return;

        }


        try {

            // =================================
            // CREAR USUARIO
            // =================================

            const credenciales =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            const usuario =
                credenciales.user;


            // =================================
            // ACTUALIZAR PERFIL AUTH
            // =================================

            await updateProfile(
                usuario,
                {
                    displayName:
                        nombre
                }
            );


            // =================================
            // IMAGEN PREDETERMINADA
            // =================================

            const imagenPerfil =
                "https://ui-avatars.com/api/?name=" +
                encodeURIComponent(
                    nombre
                ) +
                "&background=random&color=fff";


            // =================================
            // CREAR DOCUMENTO FIRESTORE
            // =================================

            await setDoc(

                doc(
                    db,
                    "usuarios",
                    usuario.uid
                ),

                {

                    // =========================
                    // DATOS PRINCIPALES
                    // =========================

                    nombre:
                        nombre,

                    correo:
                        email,

                    imagenPerfil:
                        imagenPerfil,


                    // =========================
                    // PERFIL
                    // =========================

                    pais:
                        "",

                    biografia:
                        "",


                    // =========================
                    // PLAN
                    // =========================

                    plan:
                        "gratuito",

                    rol:
                        "admin",


                    // =========================
                    // ESTADÍSTICAS
                    // =========================

                    librosFavoritos:
                        [],

                    comicsFavoritos:
                        [],

                    librosLeidos:
                        0,

                    comicsLeidos:
                        0,

                    comentarios:
                        0,


                    // =========================
                    // FECHAS
                    // =========================

                    fechaRegistro:
                        serverTimestamp(),

                    ultimaConexion:
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


            switch (error.code) {

                case "auth/email-already-in-use":

                    alert(
                        "⚠️ Este correo ya está registrado."
                    );

                    break;


                case "auth/weak-password":

                    alert(
                        "⚠️ La contraseña es demasiado débil."
                    );

                    break;


                case "auth/invalid-email":

                    alert(
                        "⚠️ El correo electrónico no es válido."
                    );

                    break;


                default:

                    alert(
                        "❌ " +
                        error.message
                    );

            }

        }

    }

);