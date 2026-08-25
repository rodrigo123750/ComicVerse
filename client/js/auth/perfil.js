// =====================================
// COMICVERSE AI
// PERFIL CON FIRESTORE
// FOTO + PLAN
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


// =====================================
// ELEMENTOS
// =====================================

const fotoUsuario =
    document.getElementById("fotoUsuario");


const nombreUsuario =
    document.getElementById("nombreUsuario");


const correoUsuario =
    document.getElementById("correoUsuario");


const fechaUsuario =
    document.getElementById("fechaUsuario");


const planUsuario =
    document.getElementById("planUsuario");


const cerrarSesion =
    document.getElementById("cerrarSesion");


// =====================================
// COMPROBAR ELEMENTOS
// =====================================

if (!nombreUsuario) {

    console.warn(
        "⚠️ No se encontró nombreUsuario."
    );

}


// =====================================
// COMPROBAR SESIÓN
// =====================================

onAuthStateChanged(
    auth,
    async (usuario) => {

        // =================================
        // NO HAY SESIÓN
        // =================================

        if (!usuario) {

            window.location.href =
                "login.html";

            return;

        }


        try {

            console.log(
                "👤 Usuario conectado:",
                usuario.uid
            );


            // =================================
            // REFERENCIA FIRESTORE
            // =================================

            const referencia =
                doc(
                    db,
                    "usuarios",
                    usuario.uid
                );


            // =================================
            // OBTENER DATOS
            // =================================

            const documento =
                await getDoc(
                    referencia
                );


            // =================================
            // COMPROBAR DOCUMENTO
            // =================================

            if (!documento.exists()) {

                console.warn(
                    "⚠️ No existe el perfil en Firestore."
                );

                return;

            }


            const datos =
                documento.data();


            // =================================
            // NOMBRE
            // =================================

            if (nombreUsuario) {

                nombreUsuario.textContent =
                    "👤 " +
                    (
                        datos.nombre ||
                        usuario.displayName ||
                        "Usuario"
                    );

            }


            // =================================
            // CORREO
            // =================================

            if (correoUsuario) {

                correoUsuario.textContent =
                    "📧 " +
                    (
                        datos.correo ||
                        usuario.email ||
                        ""
                    );

            }


            // =================================
            // FOTO
            // =================================

            const foto =
                datos.foto ||
                usuario.photoURL;


            if (
                fotoUsuario &&
                foto
            ) {

                fotoUsuario.src =
                    foto;

                fotoUsuario.alt =
                    "Foto de perfil";


                // =================================
                // SI LA FOTO FALLA
                // =================================

                fotoUsuario.onerror =
                    () => {

                        fotoUsuario.src =
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                datos.nombre || "Usuario"
                            )}&background=random&color=fff&size=256`;

                    };

            }


            // =================================
            // FECHA DE REGISTRO
            // =================================

            if (
                fechaUsuario &&
                datos.fechaRegistro
            ) {

                fechaUsuario.textContent =
                    "📅 Registrado: " +
                    datos.fechaRegistro
                        .toDate()
                        .toLocaleDateString();

            }


            // =================================
            // PLAN
            // =================================

            if (planUsuario) {

                const plan =
                    datos.plan ||
                    "gratuito";


                let nombrePlan =
                    "🆓 Gratuito";


                if (
                    plan === "plus"
                ) {

                    nombrePlan =
                        "⭐ Plus";

                }

                else if (
                    plan === "premium"
                ) {

                    nombrePlan =
                        "💎 Premium";

                }

                else if (
                    plan === "ultra"
                ) {

                    nombrePlan =
                        "👑 Ultra Premium Plus";

                }


                planUsuario.textContent =
                    nombrePlan;

            }


        }

        catch (error) {

            console.error(
                "❌ ERROR CARGANDO PERFIL:",
                error
            );

        }

    }
);


// =====================================
// CERRAR SESIÓN
// =====================================

if (cerrarSesion) {

    cerrarSesion.addEventListener(
        "click",
        async () => {

            try {

                await signOut(auth);


                alert(
                    "👋 Sesión cerrada correctamente."
                );


                window.location.href =
                    "index.html";

            }

            catch (error) {

                console.error(
                    "❌ ERROR CERRANDO SESIÓN:",
                    error
                );

                alert(
                    "❌ No se pudo cerrar la sesión."
                );

            }

        }
    );

}