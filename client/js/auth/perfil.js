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

let imagenSeleccionada = null;


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
            "❌ Error formateando fecha:",
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


    elemento.textContent =
        valor;

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
            "🆔 UID:",
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
        // SI NO EXISTE
        // =================================================

        if (!documento.exists()) {

            console.warn(
                "⚠️ El documento no existe. Creándolo..."
            );


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
                    usuario.photoURL ||
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
                    0,

                ultimaConexion:
                    serverTimestamp()

            };


            await setDoc(
                referenciaUsuario,
                datosIniciales
            );


            console.log(
                "✅ Perfil creado correctamente."
            );


            mostrarDatosPerfil(
                datosIniciales,
                usuario
            );


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


        console.error(
            "Código:",
            error?.code
        );


        console.error(
            "Mensaje:",
            error?.message
        );


        alert(
            "❌ No se pudieron cargar los datos del perfil.\n\n" +
            (error?.message || "")
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


        imagenPerfil.onerror =
            () => {

                console.warn(
                    "⚠️ No se pudo cargar la imagen de perfil."
                );

                imagenPerfil.src =
                    IMAGEN_DEFAULT;

            };

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
    // ESTADO PLAN
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
// CAMBIO DE IMAGEN
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


            // =================================================
            // VALIDAR TIPO
            // =================================================

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


            // =================================================
            // VALIDAR TAMAÑO
            // =================================================

            // Máximo 700 KB para evitar
            // documentos Firestore demasiado grandes.

            const maximo =
                700 * 1024;


            if (
                archivo.size > maximo
            ) {

                alert(
                    "❌ La imagen es demasiado grande.\n\n" +
                    "Selecciona una imagen de menos de 700 KB."
                );

                inputImagen.value =
                    "";

                return;

            }


            // =================================================
            // LEER IMAGEN
            // =================================================

            const lector =
                new FileReader();


            lector.onload =
                function () {

                    imagenSeleccionada =
                        lector.result;


                    if (imagenPerfil) {

                        imagenPerfil.src =
                            imagenSeleccionada;

                    }


                    console.log(
                        "🖼️ Imagen preparada para guardar."
                    );

                };


            lector.onerror =
                function () {

                    console.error(
                        "❌ Error leyendo la imagen."
                    );


                    imagenSeleccionada =
                        null;


                    alert(
                        "❌ No se pudo leer la imagen."
                    );

                };


            lector.readAsDataURL(
                archivo
            );

        }
    );

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
            "💾 GUARDANDO PERFIL..."
        );


        console.log(
            "🆔 UID:",
            usuarioActual.uid
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
        // OBTENER DOCUMENTO ACTUAL
        // =================================================

        const documentoActual =
            await getDoc(
                referenciaUsuario
            );


        let datosActuales = {};


        if (
            documentoActual.exists()
        ) {

            datosActuales =
                documentoActual.data();

        }


        // =================================================
        // DETERMINAR IMAGEN
        // =================================================

        let imagenFinal =
            datosActuales.imagenPerfil ||
            usuarioActual.photoURL ||
            "";


        if (
            imagenSeleccionada
        ) {

            imagenFinal =
                imagenSeleccionada;

        }


        // =================================================
        // DATOS A GUARDAR
        // =================================================

        const datosPerfil = {

            nombre:
                nombre,

            correo:
                usuarioActual.email ||
                datosActuales.correo ||
                "",

            pais:
                pais,

            bio:
                bio,

            imagenPerfil:
                imagenFinal,

            ultimaActualizacion:
                serverTimestamp(),

            ultimaConexion:
                serverTimestamp()

        };


        // =================================================
        // MANTENER DATOS EXISTENTES
        // =================================================

        if (
            !datosActuales.fechaRegistro
        ) {

            datosPerfil.fechaRegistro =
                serverTimestamp();

        }


        if (
            !datosActuales.rol
        ) {

            datosPerfil.rol =
                "usuario";

        }


        if (
            !datosActuales.plan
        ) {

            datosPerfil.plan =
                "gratuito";

        }


        if (
            !datosActuales.descripcionPlan
        ) {

            datosPerfil.descripcionPlan =
                "Disfruta del catálogo gratuito de ComicVerse AI.";

        }


        if (
            !datosActuales.estadoPlan
        ) {

            datosPerfil.estadoPlan =
                "Activo";

        }


        if (
            datosActuales.librosLeidos === undefined
        ) {

            datosPerfil.librosLeidos =
                0;

        }


        if (
            datosActuales.comicsLeidos === undefined
        ) {

            datosPerfil.comicsLeidos =
                0;

        }


        if (
            datosActuales.favoritos === undefined
        ) {

            datosPerfil.favoritos =
                0;

        }


        if (
            datosActuales.comentarios === undefined
        ) {

            datosPerfil.comentarios =
                0;

        }


        if (
            !datosActuales.nivel
        ) {

            datosPerfil.nivel =
                "Novato";

        }


        if (
            datosActuales.puntos === undefined
        ) {

            datosPerfil.puntos =
                0;

        }


        // =================================================
        // GUARDAR FIRESTORE
        // =================================================

        console.log(
            "☁️ Guardando en Firestore..."
        );


        await setDoc(
            referenciaUsuario,
            datosPerfil,
            {
                merge: true
            }
        );


        console.log(
            "✅ FIRESTORE ACTUALIZADO."
        );


        // =================================================
        // ACTUALIZAR FIREBASE AUTH
        // =================================================

        try {

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

        }

        catch (errorAuth) {

            console.warn(
                "⚠️ No se pudo actualizar el nombre en Authentication:",
                errorAuth
            );

        }


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


        if (imagenPerfil) {

            imagenPerfil.src =
                imagenFinal;

        }


        // =================================================
        // LIMPIAR IMAGEN SELECCIONADA
        // =================================================

        imagenSeleccionada =
            null;


        if (inputImagen) {

            inputImagen.value =
                "";

        }


        // =================================================
        // MENSAJE ÉXITO
        // =================================================

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
            error?.code
        );


        console.error(
            "Mensaje:",
            error?.message
        );


        let mensaje =
            error?.message ||
            "Error desconocido.";


        // =================================================
        // ERRORES FIRESTORE
        // =================================================

        if (
            error?.code ===
            "permission-denied"
        ) {

            mensaje =
                "Firebase rechazó la operación por las reglas de seguridad de Firestore.";

        }


        if (
            error?.code ===
            "failed-precondition"
        ) {

            mensaje =
                "Firestore no pudo completar la operación.";

        }


        alert(
            "❌ No se pudieron guardar los cambios.\n\n" +
            mensaje
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


        await signOut(
            auth
        );


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
            (error?.message || "")
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