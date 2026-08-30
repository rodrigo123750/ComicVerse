// =====================================================
// COMICVERSE AI
// CHAT DE USUARIOS
// FIREBASE AUTH + FIRESTORE
// SISTEMA DE MENSAJES NO LEÍDOS
// =====================================================

import {
    auth,
    db
} from "./firebase/firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
    collection,
    getDocs,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
    where,
    updateDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


// =====================================================
// ELEMENTOS HTML
// =====================================================

const chatLista =
    document.getElementById("chatLista");

const buscadorUsuarios =
    document.getElementById("buscadorUsuarios");

const chatMensajes =
    document.getElementById("chatMensajes");

const mensajeInput =
    document.getElementById("mensajeInput");

const btnEnviar =
    document.getElementById("btnEnviar");

const chatNombre =
    document.getElementById("chatNombre");

const chatEstado =
    document.getElementById("chatEstado");

const chatAvatar =
    document.getElementById("chatAvatar");

const chatContacto =
    document.getElementById("chatContacto");

const chatInputForm =
    document.getElementById("chatInputForm");


// =====================================================
// VARIABLES
// =====================================================

let usuarioActual = null;

let usuarioSeleccionado = null;

let todosLosUsuarios = [];

let cancelarMensajes = null;


// =====================================================
// IMAGEN POR DEFECTO
// =====================================================

const IMAGEN_DEFAULT =
    "img/perfil-default.png";


// =====================================================
// ESCAPAR HTML
// =====================================================

function escaparHTML(texto) {

    const elemento =
        document.createElement("div");

    elemento.textContent =
        String(texto ?? "");

    return elemento.innerHTML;

}


// =====================================================
// CREAR ID DEL CHAT
// =====================================================

function crearIdChat(uid1, uid2) {

    return [uid1, uid2]
        .sort()
        .join("_");

}


// =====================================================
// OBTENER CANTIDAD DE MENSAJES NO LEÍDOS
// =====================================================

async function obtenerNoLeidos(uidUsuario) {

    try {

        const mensajesNoLeidos =
            query(
                collectionGroupMensajes(),
                where(
                    "destinatarioId",
                    "==",
                    uidUsuario
                ),
                where(
                    "leido",
                    "==",
                    false
                )
            );

        const resultado =
            await getDocs(
                mensajesNoLeidos
            );

        return resultado.size;

    }

    catch (error) {

        console.warn(
            "⚠️ No se pudieron obtener mensajes no leídos:",
            error
        );

        return 0;

    }

}


// =====================================================
// REFERENCIA GENERAL DE MENSAJES
// =====================================================
//
// Firestore no permite collectionGroup directamente
// sin importar la función. Se utiliza la referencia
// global para todos los subcolecciones "mensajes".
// =====================================================

function collectionGroupMensajes() {

    return collection(
        db,
        "chats"
    );

}


// =====================================================
// CARGAR USUARIOS
// =====================================================

async function cargarUsuarios() {

    if (!chatLista || !usuarioActual) {
        return;
    }


    chatLista.innerHTML = `

        <div class="chat-cargando">
            👥 Cargando usuarios...
        </div>

    `;


    try {

        console.log(
            "📚 Cargando usuarios desde Firestore..."
        );


        const referencia =
            collection(
                db,
                "usuarios"
            );


        const resultado =
            await getDocs(
                referencia
            );


        todosLosUsuarios = [];


        resultado.forEach(documento => {

            const datos =
                documento.data();


            if (
                documento.id ===
                usuarioActual.uid
            ) {

                return;

            }


            todosLosUsuarios.push({

                uid:
                    documento.id,

                ...datos

            });

        });


        console.log(
            "✅ Usuarios encontrados:",
            todosLosUsuarios.length
        );


        await mostrarUsuarios(
            todosLosUsuarios
        );

    }

    catch (error) {

        console.error(
            "❌ Error cargando usuarios:",
            error
        );


        chatLista.innerHTML = `

            <div class="chat-error">

                ❌ No se pudieron cargar los usuarios.

                <br><br>

                <strong>
                    ${escaparHTML(error.message)}
                </strong>

            </div>

        `;

    }

}


// =====================================================
// MOSTRAR USUARIOS
// =====================================================

async function mostrarUsuarios(usuarios) {

    if (!chatLista) {
        return;
    }


    chatLista.innerHTML = "";


    if (usuarios.length === 0) {

        chatLista.innerHTML = `

            <div class="chat-cargando">

                👥 No hay otros usuarios registrados.

            </div>

        `;

        return;

    }


    for (const usuario of usuarios) {

        const boton =
            document.createElement("button");


        boton.type =
            "button";


        boton.className =
            "chat-usuario";


        boton.dataset.uid =
            usuario.uid;


        const nombre =
            usuario.nombre ||
            usuario.displayName ||
            "Usuario";


        const imagen =
            usuario.imagenPerfil ||
            usuario.photoURL ||
            IMAGEN_DEFAULT;


        // =============================================
        // CONTADOR NO LEÍDOS
        // =============================================

        let cantidadNoLeidos = 0;


        try {

            cantidadNoLeidos =
                await contarMensajesNoLeidos(
                    usuario.uid
                );

        }

        catch (error) {

            console.warn(
                "No se pudo contar mensajes:",
                error
            );

        }


        boton.innerHTML = `

            <div class="chat-avatar">

                <img
                    src="${escaparHTML(imagen)}"
                    alt="Avatar"
                >

                <span class="chat-online"></span>

            </div>


            <div class="chat-usuario-info">

                <span class="chat-usuario-nombre">

                    ${escaparHTML(nombre)}

                </span>


                <span class="chat-usuario-ultimo">

                    💬 Iniciar conversación

                </span>

            </div>


            ${
                cantidadNoLeidos > 0
                    ? `
                        <span
                            class="chat-no-leidos"
                            title="${cantidadNoLeidos} mensaje(s) no leído(s)"
                        >
                            ${
                                cantidadNoLeidos > 99
                                    ? "99+"
                                    : cantidadNoLeidos
                            }
                        </span>
                    `
                    : ""
            }

        `;


        boton.addEventListener(
            "click",
            () => {

                seleccionarUsuario(
                    usuario
                );

            }
        );


        chatLista.appendChild(
            boton
        );

    }

}


// =====================================================
// CONTAR MENSAJES NO LEÍDOS
// =====================================================
//
// Los mensajes están guardados en:
//
// chats/{chatId}/mensajes/{mensajeId}
//
// Para buscar mensajes de todos los chats usamos
// collectionGroup("mensajes").
// =====================================================

async function contarMensajesNoLeidos(uidRemitente) {

    try {

        const {
            collectionGroup
        } = await import(
            "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js"
        );


        const consulta =
            query(

                collectionGroup(
                    db,
                    "mensajes"
                ),

                where(
                    "destinatarioId",
                    "==",
                    usuarioActual.uid
                ),

                where(
                    "remitenteId",
                    "==",
                    uidRemitente
                ),

                where(
                    "leido",
                    "==",
                    false
                )

            );


        const resultado =
            await getDocs(
                consulta
            );


        return resultado.size;

    }

    catch (error) {

        console.warn(
            "⚠️ Error contando no leídos:",
            error
        );

        return 0;

    }

}


// =====================================================
// MARCAR MENSAJES COMO LEÍDOS
// =====================================================

async function marcarMensajesComoLeidos() {

    if (
        !usuarioActual ||
        !usuarioSeleccionado
    ) {

        return;

    }


    try {

        const {
            collectionGroup
        } = await import(
            "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js"
        );


        const consulta =
            query(

                collectionGroup(
                    db,
                    "mensajes"
                ),

                where(
                    "destinatarioId",
                    "==",
                    usuarioActual.uid
                ),

                where(
                    "remitenteId",
                    "==",
                    usuarioSeleccionado.uid
                ),

                where(
                    "leido",
                    "==",
                    false
                )

            );


        const resultado =
            await getDocs(
                consulta
            );


        const actualizaciones = [];


        resultado.forEach(
            documento => {

                actualizaciones.push(

                    updateDoc(
                        doc(
                            db,
                            documento.ref.path
                        ),

                        {
                            leido: true
                        }

                    )

                );

            }
        );


        await Promise.all(
            actualizaciones
        );


        console.log(
            "✅ Mensajes marcados como leídos:",
            resultado.size
        );


        // Actualizar lista

        await mostrarUsuarios(
            todosLosUsuarios
        );

    }

    catch (error) {

        console.warn(
            "⚠️ No se pudieron marcar mensajes como leídos:",
            error
        );

    }

}


// =====================================================
// BUSCADOR
// =====================================================

if (buscadorUsuarios) {

    buscadorUsuarios.addEventListener(
        "input",
        () => {

            const texto =
                buscadorUsuarios.value
                    .trim()
                    .toLowerCase();


            if (!texto) {

                mostrarUsuarios(
                    todosLosUsuarios
                );

                return;

            }


            const filtrados =
                todosLosUsuarios.filter(
                    usuario => {

                        const nombre =
                            String(
                                usuario.nombre ||
                                usuario.displayName ||
                                ""
                            )
                            .toLowerCase();


                        const correo =
                            String(
                                usuario.correo ||
                                usuario.email ||
                                ""
                            )
                            .toLowerCase();


                        return (
                            nombre.includes(texto) ||
                            correo.includes(texto)
                        );

                    }
                );


            mostrarUsuarios(
                filtrados
            );

        }
    );

}


// =====================================================
// SELECCIONAR USUARIO
// =====================================================

async function seleccionarUsuario(usuario) {

    usuarioSeleccionado =
        usuario;


    console.log(
        "👤 Usuario seleccionado:",
        usuario
    );


    // =============================================
    // MARCAR ACTIVO
    // =============================================

    document
        .querySelectorAll(".chat-usuario")
        .forEach(elemento => {

            elemento.classList.remove(
                "activo"
            );

        });


    const botonActivo =
        document.querySelector(
            `.chat-usuario[data-uid="${usuario.uid}"]`
        );


    if (botonActivo) {

        botonActivo.classList.add(
            "activo"
        );

    }


    // =============================================
    // DATOS DEL USUARIO
    // =============================================

    const nombre =
        usuario.nombre ||
        usuario.displayName ||
        "Usuario";


    const imagen =
        usuario.imagenPerfil ||
        usuario.photoURL ||
        IMAGEN_DEFAULT;


    if (chatNombre) {

        chatNombre.textContent =
            nombre;

    }


    if (chatAvatar) {

        chatAvatar.src =
            imagen;


        chatAvatar.onerror =
            () => {

                chatAvatar.src =
                    IMAGEN_DEFAULT;

            };

    }


    if (chatEstado) {

        chatEstado.textContent =
            "💬 Disponible para chatear";

    }


    // =============================================
    // ACTIVAR INPUT
    // =============================================

    if (mensajeInput) {

        mensajeInput.disabled =
            false;

        mensajeInput.focus();

    }


    if (btnEnviar) {

        btnEnviar.disabled =
            false;

    }


    // =============================================
    // BOTÓN SEGUIR
    // =============================================

    mostrarBotonSeguir();


    // =============================================
    // ESCUCHAR MENSAJES
    // =============================================

    escucharMensajes();


    // =============================================
    // MARCAR MENSAJES COMO LEÍDOS
    // =============================================

    await marcarMensajesComoLeidos();

}


// =====================================================
// BOTÓN SEGUIR
// =====================================================

function mostrarBotonSeguir() {

    if (!chatContacto) {
        return;
    }


    chatContacto.innerHTML = `

        <button
            id="btnSeguir"
            class="btn-seguir"
            type="button"
        >

            ➕ Seguir

        </button>

    `;


    const boton =
        document.getElementById(
            "btnSeguir"
        );


    if (boton) {

        boton.addEventListener(
            "click",
            () => {

                alert(
                    "👥 Seguidores: lo conectaremos con Firestore después."
                );

            }
        );

    }

}


// =====================================================
// ESCUCHAR MENSAJES
// =====================================================

function escucharMensajes() {

    if (
        !usuarioActual ||
        !usuarioSeleccionado
    ) {

        return;

    }


    // Cancelar listener anterior

    if (cancelarMensajes) {

        cancelarMensajes();

        cancelarMensajes =
            null;

    }


    const idChat =
        crearIdChat(
            usuarioActual.uid,
            usuarioSeleccionado.uid
        );


    console.log(
        "💬 Escuchando chat:",
        idChat
    );


    const referenciaMensajes =
        collection(
            db,
            "chats",
            idChat,
            "mensajes"
        );


    const consulta =
        query(
            referenciaMensajes,
            orderBy(
                "fecha",
                "asc"
            )
        );


    cancelarMensajes =
        onSnapshot(

            consulta,

            snapshot => {

                const mensajes = [];


                snapshot.forEach(
                    documento => {

                        mensajes.push({

                            id:
                                documento.id,

                            ...documento.data()

                        });

                    }
                );


                mostrarMensajes(
                    mensajes
                );


                // =================================
                // SI ESTAMOS DENTRO DEL CHAT
                // MARCAR COMO LEÍDOS
                // =================================

                marcarMensajesComoLeidos();

            },

            error => {

                console.error(
                    "❌ Error escuchando mensajes:",
                    error
                );


                if (chatMensajes) {

                    chatMensajes.innerHTML = `

                        <div class="chat-error">

                            ❌ No se pudieron cargar
                            los mensajes.

                            <br><br>

                            ${escaparHTML(
                                error.message
                            )}

                        </div>

                    `;

                }

            }

        );

}


// =====================================================
// MOSTRAR MENSAJES
// =====================================================

function mostrarMensajes(mensajes) {

    if (!chatMensajes) {
        return;
    }


    if (mensajes.length === 0) {

        chatMensajes.innerHTML = `

            <div class="chat-vacio">

                <div class="chat-vacio-contenido">

                    <div class="chat-vacio-icono">
                        💬
                    </div>

                    <h3>
                        No hay mensajes todavía
                    </h3>

                    <p>
                        ¡Envía el primer mensaje!
                    </p>

                </div>

            </div>

        `;

        return;

    }


    chatMensajes.innerHTML = "";


    mensajes.forEach(mensaje => {

        const mio =
            mensaje.remitenteId ===
            usuarioActual.uid;


        const contenedor =
            document.createElement("div");


        contenedor.className =
            mio
                ? "chat-mensaje usuario"
                : "chat-mensaje otro";


        const burbuja =
            document.createElement("div");


        burbuja.className =
            "chat-burbuja";


        const texto =
            escaparHTML(
                mensaje.texto || ""
            );


        let hora =
            "";


        if (
            mensaje.fecha &&
            typeof mensaje.fecha.toDate ===
                "function"
        ) {

            hora =
                mensaje.fecha
                    .toDate()
                    .toLocaleTimeString(
                        "es-ES",
                        {
                            hour: "2-digit",
                            minute: "2-digit"
                        }
                    );

        }


        burbuja.innerHTML = `

            <span>
                ${texto}
            </span>

            <span class="chat-hora">

                ${hora}

                ${
                    mio
                        ? (
                            mensaje.leido
                                ? " ✓✓"
                                : " ✓"
                        )
                        : ""
                }

            </span>

        `;


        contenedor.appendChild(
            burbuja
        );


        chatMensajes.appendChild(
            contenedor
        );

    });


    // =============================================
    // SCROLL SOLO DENTRO DEL CHAT
    // =============================================

    chatMensajes.scrollTop =
        chatMensajes.scrollHeight;

}


// =====================================================
// ENVIAR MENSAJE
// =====================================================

async function enviarMensaje() {

    if (
        !usuarioActual ||
        !usuarioSeleccionado
    ) {

        alert(
            "👤 Primero selecciona un usuario."
        );

        return;

    }


    if (!mensajeInput) {
        return;
    }


    const texto =
        mensajeInput.value.trim();


    if (!texto) {
        return;

    }


    if (texto.length > 1000) {

        alert(
            "⚠️ El mensaje no puede superar 1000 caracteres."
        );

        return;

    }


    try {

        if (btnEnviar) {

            btnEnviar.disabled =
                true;

        }


        const idChat =
            crearIdChat(
                usuarioActual.uid,
                usuarioSeleccionado.uid
            );


        const referenciaMensajes =
            collection(
                db,
                "chats",
                idChat,
                "mensajes"
            );


        // =============================================
        // GUARDAR MENSAJE
        // =============================================

        await addDoc(
            referenciaMensajes,
            {

                texto:
                    texto,

                remitenteId:
                    usuarioActual.uid,

                destinatarioId:
                    usuarioSeleccionado.uid,

                // =================================
                // MENSAJE NUEVO = NO LEÍDO
                // =================================

                leido:
                    false,

                fecha:
                    serverTimestamp()

            }
        );


        mensajeInput.value =
            "";


        mensajeInput.focus();


        console.log(
            "✅ Mensaje enviado correctamente."
        );

    }

    catch (error) {

        console.error(
            "❌ Error enviando mensaje:",
            error
        );


        alert(
            "❌ No se pudo enviar el mensaje.\n\n" +
            error.message
        );

    }

    finally {

        if (btnEnviar) {

            btnEnviar.disabled =
                false;

        }

    }

}


// =====================================================
// FORMULARIO
// =====================================================

if (chatInputForm) {

    chatInputForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            await enviarMensaje();

        }
    );

}


// =====================================================
// ENTER
// =====================================================

if (mensajeInput) {

    mensajeInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                enviarMensaje();

            }

        }
    );

}


// =====================================================
// AUTENTICACIÓN
// =====================================================

onAuthStateChanged(

    auth,

    async usuario => {

        console.log(
            "🔥 Firebase Auth:",
            usuario
        );


        if (!usuario) {

            console.warn(
                "⚠️ No hay usuario autenticado."
            );


            window.location.href =
                "login.html";


            return;

        }


        usuarioActual =
            usuario;


        console.log(
            "✅ Usuario conectado:",
            usuario.email
        );


        console.log(
            "🆔 UID:",
            usuario.uid
        );


        // =============================================
        // DESACTIVAR INPUT
        // =============================================

        if (mensajeInput) {

            mensajeInput.disabled =
                true;

        }


        if (btnEnviar) {

            btnEnviar.disabled =
                true;

        }


        // =============================================
        // CARGAR USUARIOS
        // =============================================

        await cargarUsuarios();

    }

);