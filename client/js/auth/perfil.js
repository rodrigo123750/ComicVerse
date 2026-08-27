// =====================================================
// COMICVERSE AI
// PERFIL DE USUARIO
// FIREBASE AUTH + FIRESTORE
// =====================================================


// =====================================================
// IMPORTAR FIREBASE
// =====================================================

import {
    auth,
    db
} from "../firebase/firebase.js";


import {
    onAuthStateChanged,
    signOut,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";


import {
    doc,
    getDoc,
    updateDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


// =====================================================
// ELEMENTOS HTML
// =====================================================

const nombreUsuario =
    document.getElementById("nombreUsuario");


const correoUsuario =
    document.getElementById("correoUsuario");


const fechaUsuario =
    document.getElementById("fechaUsuario");


const rolUsuario =
    document.getElementById("rolUsuario");


const ultimaConexion =
    document.getElementById("ultimaConexion");


const bioUsuario =
    document.getElementById("bioUsuario");


const paisUsuario =
    document.getElementById("paisUsuario");


const imagenPerfil =
    document.getElementById("imagenPerfil");


const inputImagen =
    document.getElementById("inputImagen");


const nombreEditar =
    document.getElementById("nombreEditar");


const paisEditar =
    document.getElementById("paisEditar");


const bioEditar =
    document.getElementById("bioEditar");


const guardarPerfil =
    document.getElementById("guardarPerfil");


const cerrarSesion =
    document.getElementById("cerrarSesion");


const btnAdmin =
    document.getElementById("btnAdmin");


const planUsuario =
    document.getElementById("planUsuario");


const descripcionPlan =
    document.getElementById("descripcionPlan");


const renovacionPlan =
    document.getElementById("renovacionPlan");


const estadoPlan =
    document.getElementById("estadoPlan");


const librosLeidos =
    document.getElementById("librosLeidos");


const comicsLeidos =
    document.getElementById("comicsLeidos");


const favoritosUsuario =
    document.getElementById("favoritosUsuario");


const comentariosUsuario =
    document.getElementById("comentariosUsuario");


const nivelUsuario =
    document.getElementById("nivelUsuario");


const puntosUsuario =
    document.getElementById("puntosUsuario");


// =====================================================
// VARIABLES
// =====================================================

let usuarioActual = null;


// =====================================================
// IMAGEN POR DEFECTO
// =====================================================

const IMAGEN_DEFAULT =
    "img/perfil-default.png";


// =====================================================
// FUNCIONES AUXILIARES
// =====================================================


// -----------------------------------------------------
// FORMATEAR FECHA
// -----------------------------------------------------

function formatearFecha(fecha) {

    if (!fecha) {

        return "No disponible";

    }


    try {

        if (
            typeof fecha.toDate === "function"
        ) {

            return fecha
                .toDate()
                .toLocaleDateString(
                    "es-ES",
                    {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric"
                    }
                );

        }


        if (fecha instanceof Date) {

            return fecha
                .toLocaleDateString(
                    "es-ES",
                    {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric"
                    }
                );

        }


        return String(fecha);

    }
    catch (error) {

        console.error(
            "Error formateando fecha:",
            error
        );

        return "No disponible";

    }

}


// -----------------------------------------------------
// CARGAR ESTADÍSTICA
// -----------------------------------------------------

function cargarEstadistica(
    elemento,
    valor
) {

    if (!elemento) {

        return;

    }


    if (
        valor === undefined ||
        valor === null
    ) {

        elemento.textContent = "0";

        return;

    }


    elemento.textContent = valor;

}


// =====================================================
// CARGAR PERFIL
// =====================================================

async function cargarPerfil(usuario) {

    try {

        console.log(
            "🔥 Cargando perfil de Firebase..."
        );


        console.log(
            "UID:",
            usuario.uid
        );


        // =================================================
        // REFERENCIA FIRESTORE
        // =================================================

        const referenciaUsuario =
            doc(
                db,
                "usuarios",
                usuario.uid
            );


        // =================================================
        // OBTENER DOCUMENTO
        // =================================================

        const documento =
            await getDoc(
                referenciaUsuario
            );


        // =================================================
        // SI NO EXISTE EL DOCUMENTO
        // =================================================

        if (!documento.exists()) {

            console.warn(
                "⚠️ El documento del usuario no existe en Firestore."
            );


            // -------------------------------------------------
            // CREAR DOCUMENTO AUTOMÁTICAMENTE
            // -------------------------------------------------

            const datosIniciales = {

                nombre:
                    usuario.displayName ||
                    "Usuario",

                correo:
                    usuario.email ||
                    "",

                fechaRegistro:
                    serverTimestamp(),

                rol:
                    "usuario",

                plan:
                    "gratuito",

                descripcionPlan:
                    "Disfruta del catálogo gratuito de ComicVerse AI.",

                estadoPlan:
                    "Activo",

                pais:
                    "",

                bio:
                    "",

                imagenPerfil:
                    "",

                librosLeidos:
                    0,

                comicsLeidos:
                    0,

                favoritos:
                    0,

                comentarios:
                    0,

                nivel:
                    "Novato",

                puntos:
                    0

            };


            await setDoc(
                referenciaUsuario,
                datosIniciales
            );


            console.log(
                "✅ Perfil creado automáticamente en Firestore."
            );


            // Volver a cargar

            const nuevoDocumento =
                await getDoc(
                    referenciaUsuario
                );


            if (
                nuevoDocumento.exists()
            ) {

                mostrarDatosPerfil(
                    nuevoDocumento.data(),
                    usuario
                );

            }


            return;

        }


        // =================================================
        // DOCUMENTO EXISTE
        // =================================================

        const datos =
            documento.data();


        console.log(
            "🔥 DATOS FIRESTORE:",
            datos
        );


        mostrarDatosPerfil(
            datos,
            usuario
        );


    }
    catch (error) {

        console.error(
            "❌ ERROR CARGANDO PERFIL:",
            error
        );


        alert(
            "❌ No se pudieron cargar los datos del perfil."
        );

    }

}


// =====================================================
// MOSTRAR DATOS DEL PERFIL
// =====================================================

function mostrarDatosPerfil(
    datos,
    usuario
) {


    // =================================================
    // NOMBRE
    // =================================================

    const nombre =
        datos.nombre ||
        usuario.displayName ||
        "Usuario";


    if (nombreUsuario) {

        nombreUsuario.textContent =
            "👤 " + nombre;

    }


    if (nombreEditar) {

        nombreEditar.value =
            nombre;

    }


    // =================================================
    // CORREO
    // =================================================

    const correo =
        datos.correo ||
        usuario.email ||
        "";


    if (correoUsuario) {

        correoUsuario.textContent =
            "📧 " + correo;

    }


    // =================================================
    // FECHA REGISTRO
    // =================================================

    if (fechaUsuario) {

        if (datos.fechaRegistro) {

            fechaUsuario.textContent =
                "📅 Registrado: " +
                formatearFecha(
                    datos.fechaRegistro
                );

        }
        else {

            fechaUsuario.textContent =
                "📅 Registrado: No disponible";

        }

    }


    // =================================================
    // ROL
    // =================================================

    const rol =
        datos.rol ||
        "usuario";


    if (rolUsuario) {

        rolUsuario.textContent =
            "🛡️ Rol: " +
            rol;

    }


    // =================================================
    // ÚLTIMA CONEXIÓN
    // =================================================

    if (ultimaConexion) {

        if (datos.ultimaConexion) {

            ultimaConexion.textContent =
                "🕒 Última conexión: " +
                formatearFecha(
                    datos.ultimaConexion
                );

        }
        else {

            ultimaConexion.textContent =
                "🕒 Última conexión: Ahora";

        }

    }


    // =================================================
    // BIOGRAFÍA
    // =================================================

    const bio =
        datos.bio ||
        "";


    if (bioUsuario) {

        if (bio.trim()) {

            bioUsuario.textContent =
                "📝 " + bio;

        }
        else {

            bioUsuario.textContent =
                "📝 Sin biografía.";

        }

    }


    if (bioEditar) {

        bioEditar.value =
            bio;

    }


    // =================================================
    // PAÍS
    // =================================================

    const pais =
        datos.pais ||
        "";


    if (paisUsuario) {

        if (pais.trim()) {

            paisUsuario.textContent =
                "🌎 País: " + pais;

        }
        else {

            paisUsuario.textContent =
                "🌎 País: No especificado";

        }

    }


    if (paisEditar) {

        paisEditar.value =
            pais;

    }


    // =================================================
    // IMAGEN DE PERFIL
    // =================================================

    const imagen =
        datos.imagenPerfil ||
        datos.photoURL ||
        usuario.photoURL ||
        IMAGEN_DEFAULT;


    if (imagenPerfil) {

        imagenPerfil.src =
            imagen;

    }


    // =================================================
    // PLAN
    // =================================================

    const plan =
        datos.plan ||
        "gratuito";


    if (planUsuario) {

        let textoPlan =
            "🆓 Plan Gratuito";


        if (
            plan === "plus"
        ) {

            textoPlan =
                "⭐ Plan Plus";

        }


        if (
            plan === "premium"
        ) {

            textoPlan =
                "💎 Plan Premium";

        }


        if (
            plan === "ultra_premium_plus"
        ) {

            textoPlan =
                "👑 Ultra Premium Plus";

        }


        planUsuario.textContent =
            textoPlan;

    }


    // =================================================
    // DESCRIPCIÓN PLAN
    // =================================================

    if (descripcionPlan) {

        descripcionPlan.textContent =
            datos.descripcionPlan ||
            "Disfruta del catálogo gratuito de ComicVerse AI.";

    }


    // =================================================
    // RENOVACIÓN
    // =================================================

    if (renovacionPlan) {

        if (datos.renovacionPlan) {

            renovacionPlan.textContent =
                formatearFecha(
                    datos.renovacionPlan
                );

        }
        else {

            renovacionPlan.textContent =
                "No aplica";

        }

    }


    // =================================================
    // ESTADO
    // =================================================

    if (estadoPlan) {

        estadoPlan.textContent =
            datos.estadoPlan ||
            "Activo";

    }


    // =================================================
    // ESTADÍSTICAS
    // =================================================

    cargarEstadistica(
        librosLeidos,
        datos.librosLeidos
    );


    cargarEstadistica(
        comicsLeidos,
        datos.comicsLeidos
    );


    cargarEstadistica(
        favoritosUsuario,
        datos.favoritos
    );


    cargarEstadistica(
        comentariosUsuario,
        datos.comentarios
    );


    cargarEstadistica(
        nivelUsuario,
        datos.nivel || "Novato"
    );


    cargarEstadistica(
        puntosUsuario,
        datos.puntos
    );


    // =================================================
    // ADMIN
    // =================================================

    if (btnAdmin) {

        if (
            rol === "admin" ||
            rol === "administrador"
        ) {

            btnAdmin.style.display =
                "block";

        }
        else {

            btnAdmin.style.display =
                "none";

        }

    }

}


// =====================================================
// GUARDAR CAMBIOS DEL PERFIL
// =====================================================

async function guardarCambiosPerfil() {


    // =================================================
    // COMPROBAR USUARIO
    // =================================================

    if (!usuarioActual) {

        alert(
            "❌ No hay ningún usuario conectado."
        );

        return;

    }


    // =================================================
    // OBTENER VALORES
    // =================================================

    const nombre =
        nombreEditar
            ? nombreEditar.value.trim()
            : "";


    const pais =
        paisEditar
            ? paisEditar.value.trim()
            : "";


    const bio =
        bioEditar
            ? bioEditar.value.trim()
            : "";


    // =================================================
    // VALIDAR NOMBRE
    // =================================================

    if (!nombre) {

        alert(
            "⚠️ El nombre no puede estar vacío."
        );

        if (nombreEditar) {

            nombreEditar.focus();

        }

        return;

    }


    // =================================================
    // DESACTIVAR BOTÓN
    // =================================================

    if (guardarPerfil) {

        guardarPerfil.disabled =
            true;

        guardarPerfil.textContent =
            "⏳ Guardando...";

    }


    try {


        console.log(
            "💾 Guardando cambios..."
        );


        console.log(
            "Nombre:",
            nombre
        );


        console.log(
            "País:",
            pais
        );


        console.log(
            "Bio:",
            bio
        );


        // =================================================
        // REFERENCIA FIRESTORE
        // =================================================

        const referenciaUsuario =
            doc(
                db,
                "usuarios",
                usuarioActual.uid
            );


        // =================================================
        // GUARDAR FIRESTORE
        // =================================================

        await updateDoc(

            referenciaUsuario,

            {

                nombre:
                    nombre,

                pais:
                    pais,

                bio:
                    bio,

                ultimaActualizacion:
                    serverTimestamp()

            }

        );


        console.log(
            "✅ Firestore actualizado."
        );


        // =================================================
        // ACTUALIZAR FIREBASE AUTH
        // =================================================

        await updateProfile(

            usuarioActual,

            {

                displayName:
                    nombre

            }

        );


        console.log(
            "✅ Firebase Authentication actualizado."
        );


        // =================================================
        // ACTUALIZAR PANTALLA
        // =================================================

        if (nombreUsuario) {

            nombreUsuario.textContent =
                "👤 " + nombre;

        }


        if (bioUsuario) {

            if (bio) {

                bioUsuario.textContent =
                    "📝 " + bio;

            }
            else {

                bioUsuario.textContent =
                    "📝 Sin biografía.";

            }

        }


        if (paisUsuario) {

            if (pais) {

                paisUsuario.textContent =
                    "🌎 País: " + pais;

            }
            else {

                paisUsuario.textContent =
                    "🌎 País: No especificado";

            }

        }


        alert(
            "✅ Perfil actualizado correctamente."
        );


    }
    catch (error) {


        console.error(
            "❌ ERROR GUARDANDO PERFIL:",
            error
        );


        console.error(
            "Código:",
            error.code
        );


        console.error(
            "Mensaje:",
            error.message
        );


        alert(
            "❌ No se pudieron guardar los cambios.\n\n" +
            error.message
        );


    }
    finally {


        // =================================================
        // RESTAURAR BOTÓN
        // =================================================

        if (guardarPerfil) {

            guardarPerfil.disabled =
                false;

            guardarPerfil.textContent =
                "💾 Guardar cambios";

        }

    }

}


// =====================================================
// CERRAR SESIÓN
// =====================================================

async function cerrarSesionUsuario() {


    try {


        console.log(
            "🚪 Cerrando sesión..."
        );


        if (cerrarSesion) {

            cerrarSesion.disabled =
                true;

            cerrarSesion.textContent =
                "⏳ Cerrando sesión...";

        }


        await signOut(auth);


        console.log(
            "✅ Sesión cerrada correctamente."
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
            "❌ No se pudo cerrar la sesión.\n\n" +
            error.message
        );


        if (cerrarSesion) {

            cerrarSesion.disabled =
                false;

            cerrarSesion.textContent =
                "🚪 Cerrar sesión";

        }

    }

}


// =====================================================
// CAMBIO DE IMAGEN
// =====================================================
//
// POR AHORA:
// Solo detectamos el archivo.
//
// La subida real la conectaremos con CLOUDINARY.
// No se subirá a Firebase Storage.
// =====================================================

if (inputImagen) {


    inputImagen.addEventListener(
        "change",
        (event) => {


            const archivo =
                event.target.files[0];


            if (!archivo) {

                return;

            }


            // ---------------------------------------------
            // VALIDAR IMAGEN
            // ---------------------------------------------

            if (
                !archivo.type.startsWith(
                    "image/"
                )
            ) {

                alert(
                    "❌ El archivo seleccionado no es una imagen."
                );

                inputImagen.value =
                    "";

                return;

            }


            // ---------------------------------------------
            // PREVISUALIZACIÓN
            // ---------------------------------------------

            const lector =
                new FileReader();


            lector.onload =
                function () {

                    if (imagenPerfil) {

                        imagenPerfil.src =
                            lector.result;

                    }

                };


            lector.readAsDataURL(
                archivo
            );


            console.log(
                "🖼️ Imagen seleccionada:",
                archivo.name
            );


            // ---------------------------------------------
            // IMPORTANTE
            // ---------------------------------------------
            //
            // Aquí posteriormente conectaremos:
            //
            // INPUT
            // ↓
            // CLOUDINARY
            // ↓
            // URL DE IMAGEN
            // ↓
            // FIRESTORE
            //
            // ---------------------------------------------

        }
    );

}


// =====================================================
// EVENTO GUARDAR PERFIL
// =====================================================

if (guardarPerfil) {


    guardarPerfil.addEventListener(
        "click",
        async (event) => {


            event.preventDefault();


            await guardarCambiosPerfil();

        }
    );

}
else {

    console.error(
        "❌ No se encontró #guardarPerfil en el HTML."
    );

}


// =====================================================
// EVENTO CERRAR SESIÓN
// =====================================================

if (cerrarSesion) {


    cerrarSesion.addEventListener(
        "click",
        async (event) => {


            event.preventDefault();


            await cerrarSesionUsuario();

        }
    );

}
else {

    console.error(
        "❌ No se encontró #cerrarSesion en el HTML."
    );

}


// =====================================================
// FIREBASE AUTH
// DETECTAR USUARIO CONECTADO
// =====================================================

onAuthStateChanged(

    auth,

    async (usuario) => {


        console.log(
            "🔥 Firebase Auth:",
            usuario
        );


        // =================================================
        // NO HAY USUARIO
        // =================================================

        if (!usuario) {


            console.warn(
                "⚠️ No hay usuario autenticado."
            );


            window.location.href =
                "login.html";


            return;

        }


        // =================================================
        // GUARDAR USUARIO ACTUAL
        // =================================================

        usuarioActual =
            usuario;


        console.log(
            "✅ Usuario autenticado:",
            usuario.email
        );


        console.log(
            "🆔 UID:",
            usuario.uid
        );


        // =================================================
        // CARGAR PERFIL FIRESTORE
        // =================================================

        await cargarPerfil(
            usuario
        );

    }

);