// =====================================
// COMICVERSE AI
// PERFIL CON FIREBASE
// =====================================

import {
    auth,
    db
} from "../firebase/firebase.js";

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

const nombreUsuario =
    document.getElementById("nombreUsuario");

const correoUsuario =
    document.getElementById("correoUsuario");

const fechaUsuario =
    document.getElementById("fechaUsuario");

const imagenPerfil =
    document.getElementById("imagenPerfil");

const planUsuario =
    document.getElementById("planUsuario");

const cerrarSesion =
    document.getElementById("cerrarSesion");


// =====================================
// COMPROBAR SESIÓN
// =====================================

onAuthStateChanged(
    auth,
    async (usuario) => {

        if (!usuario) {

            window.location.href = "login.html";
            return;

        }

        console.log("=================================");
        console.log("USUARIO AUTENTICADO");
        console.log("UID:", usuario.uid);
        console.log("Correo:", usuario.email);
        console.log("Nombre Auth:", usuario.displayName);
        console.log("=================================");

        try {

            const referencia =
                doc(
                    db,
                    "usuarios",
                    usuario.uid
                );

            const documento =
                await getDoc(referencia);

            console.log(
                "¿Existe documento?:",
                documento.exists()
            );

            // =================================
            // SI EXISTE EN FIRESTORE
            // =================================

            if (documento.exists()) {

                const datos =
                    documento.data();

                console.log(
                    "Datos Firestore:",
                    datos
                );

                nombreUsuario.textContent =
                    "👤 " +
                    (
                        datos.nombre ||
                        usuario.displayName ||
                        "Usuario"
                    );

                correoUsuario.textContent =
                    "📧 " +
                    (
                        datos.correo ||
                        usuario.email
                    );

                if (datos.imagenPerfil) {

                    imagenPerfil.src =
                        datos.imagenPerfil;

                }
                else {

                    imagenPerfil.src =
                        "https://ui-avatars.com/api/?name=" +
                        encodeURIComponent(
                            datos.nombre ||
                            usuario.displayName ||
                            "Usuario"
                        ) +
                        "&background=random&color=fff";

                }

                const nombresPlanes = {

                    gratuito:
                        "🆓 Plan Gratuito",

                    plus:
                        "⭐ Plan Plus",

                    premium:
                        "💎 Plan Premium",

                    ultra_premium_plus:
                        "👑 Ultra Premium Plus"

                };

                planUsuario.textContent =
                    nombresPlanes[
                        datos.plan
                    ] ||
                    "🆓 Plan Gratuito";

                if (datos.fechaRegistro) {

                    fechaUsuario.textContent =
                        "📅 Registrado: " +
                        datos.fechaRegistro
                            .toDate()
                            .toLocaleDateString(
                                "es-ES"
                            );

                }

            }

            // =================================
            // SI NO EXISTE EN FIRESTORE
            // =================================

            else {

                console.warn(
                    "⚠️ No existe documento en Firestore."
                );

                nombreUsuario.textContent =
                    "👤 " +
                    (
                        usuario.displayName ||
                        "Usuario"
                    );

                correoUsuario.textContent =
                    "📧 " +
                    usuario.email;

                fechaUsuario.textContent =
                    "📅 Sin información";

                planUsuario.textContent =
                    "🆓 Plan Gratuito";

                imagenPerfil.src =
                    "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(
                        usuario.displayName ||
                        "Usuario"
                    ) +
                    "&background=random&color=fff";

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

cerrarSesion?.addEventListener(
    "click",
    async () => {

        try {

            await signOut(auth);

            window.location.href =
                "index.html";

        }

        catch (error) {

            console.error(
                "❌ ERROR CERRANDO SESIÓN:",
                error
            );

        }

    }
);