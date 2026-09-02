// =====================================================
// COMICVERSE AI
// ADMIN.JS
// PANEL DE ADMINISTRACIÓN
//
// FIREBASE AUTH
// FIRESTORE
// CLOUDINARY
// =====================================================


import {

    auth,
    db

} from "../firebase/firebase.js";


import {

    onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";


import {

    collection,
    addDoc,
    serverTimestamp,
    doc,
    getDoc

} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


// =====================================================
// CONFIGURACIÓN CLOUDINARY
// =====================================================
//
// IMPORTANTE:
//
// Reemplaza:
//
// TU_CLOUD_NAME
// TU_UPLOAD_PRESET
//
// NO pongas aquí:
// API SECRET
//
// =====================================================

const CLOUDINARY_CLOUD_NAME = "gx4ncdip";
const CLOUDINARY_UPLOAD_PRESET = "comicverse";




// =====================================================
// URL CLOUDINARY
// =====================================================

const CLOUDINARY_UPLOAD_URL =
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;


// =====================================================
// ELEMENTOS
// =====================================================

const formulario =
    document.getElementById(
        "comicForm"
    );


const tituloInput =
    document.getElementById(
        "titulo"
    );


const autorInput =
    document.getElementById(
        "autor"
    );


const generoInput =
    document.getElementById(
        "genero"
    );


const descripcionInput =
    document.getElementById(
        "descripcion"
    );


const imagenArchivoInput =
    document.getElementById(
        "imagenArchivo"
    );


const imagenUrlInput =
    document.getElementById(
        "imagenUrl"
    );


const archivoObraInput =
    document.getElementById(
        "archivoObra"
    );


const archivoUrlInput =
    document.getElementById(
        "archivoUrl"
    );


const ratingInput =
    document.getElementById(
        "rating"
    );


const previewPortada =
    document.getElementById(
        "previewPortada"
    );


const imagenNombre =
    document.getElementById(
        "imagenNombre"
    );


const archivoNombre =
    document.getElementById(
        "archivoNombre"
    );


const btnPublicar =
    document.getElementById(
        "btnPublicar"
    );


const btnLimpiar =
    document.getElementById(
        "btnLimpiar"
    );


const mensaje =
    document.getElementById(
        "mensaje"
    );


// =====================================================
// VARIABLES
// =====================================================

let usuarioActual =
    null;


let usuarioEsAdmin =
    false;


// =====================================================
// FUNCIONES AUXILIARES
// =====================================================


// -----------------------------------------------------
// ESCAPAR TEXTO
// -----------------------------------------------------

function escaparHTML(texto) {

    const elemento =
        document.createElement(
            "div"
        );


    elemento.textContent =
        String(
            texto ?? ""
        );


    return elemento.innerHTML;

}


// -----------------------------------------------------
// MOSTRAR MENSAJE
// -----------------------------------------------------

function mostrarMensaje(
    texto,
    tipo = "info"
) {

    if (!mensaje) {

        return;

    }


    mensaje.className =
        `admin-message ${tipo}`;


    mensaje.textContent =
        texto;

}


// -----------------------------------------------------
// OCULTAR MENSAJE
// -----------------------------------------------------

function ocultarMensaje() {

    if (!mensaje) {

        return;

    }


    mensaje.className =
        "admin-message";


    mensaje.textContent =
        "";

}


// =====================================================
// COMPROBAR CONFIGURACIÓN CLOUDINARY
// =====================================================

function cloudinaryConfigurado() {

    if (
        !CLOUDINARY_CLOUD_NAME ||
        CLOUDINARY_CLOUD_NAME ===
            "TU_CLOUD_NAME"
    ) {

        return false;

    }


    if (
        !CLOUDINARY_UPLOAD_PRESET ||
        CLOUDINARY_UPLOAD_PRESET ===
            "TU_UPLOAD_PRESET"
    ) {

        return false;

    }


    return true;

}


// =====================================================
// COMPROBAR ADMIN
// =====================================================

async function comprobarAdministrador(
    usuario
) {

    try {

        const referencia =
            doc(
                db,
                "usuarios",
                usuario.uid
            );


        const documento =
            await getDoc(
                referencia
            );


        if (
            !documento.exists()
        ) {

            console.warn(
                "⚠️ El perfil del usuario no existe."
            );

            return false;

        }


        const datos =
            documento.data();


        const rol =
            String(
                datos.rol || ""
            )
            .toLowerCase()
            .trim();


        return (
            rol === "admin" ||
            rol === "administrador"
        );

    }

    catch (error) {

        console.error(
            "❌ Error comprobando administrador:",
            error
        );


        return false;

    }

}


// =====================================================
// SUBIR ARCHIVO A CLOUDINARY
// =====================================================

async function subirACloudinary(
    archivo
) {

    if (!archivo) {

        throw new Error(
            "No se seleccionó ningún archivo."
        );

    }


    if (
        !cloudinaryConfigurado()
    ) {

        throw new Error(
            "Cloudinary todavía no está configurado. Revisa CLOUD_NAME y UPLOAD_PRESET en admin.js."
        );

    }


    const datos =
        new FormData();


    datos.append(
        "file",
        archivo
    );


    datos.append(
        "upload_preset",
        CLOUDINARY_UPLOAD_PRESET
    );


    mostrarMensaje(
        `☁️ Subiendo ${archivo.name}...`,
        "info"
    );


    const respuesta =
        await fetch(
            CLOUDINARY_UPLOAD_URL,
            {

                method:
                    "POST",

                body:
                    datos

            }
        );


    if (
        !respuesta.ok
    ) {

        let detalle =
            "Cloudinary rechazó el archivo.";

        try {

            const errorData =
                await respuesta.json();

            detalle =
                errorData?.error?.message ||
                detalle;

        }

        catch {

            // No hacer nada.

        }


        throw new Error(
            detalle
        );

    }


    const resultado =
        await respuesta.json();


    if (
        !resultado.secure_url
    ) {

        throw new Error(
            "Cloudinary no devolvió una URL válida."
        );

    }


    return {

        url:
            resultado.secure_url,

        publicId:
            resultado.public_id ||
            "",

        formato:
            resultado.format ||
            "",

        recurso:
            resultado.resource_type ||
            "auto"

    };

}


// =====================================================
// VISTA PREVIA PORTADA
// =====================================================

if (imagenArchivoInput) {

    imagenArchivoInput.addEventListener(
        "change",
        () => {

            const archivo =
                imagenArchivoInput.files[0];


            if (!archivo) {

                if (imagenNombre) {

                    imagenNombre.textContent =
                        "Ninguna imagen seleccionada.";

                }

                return;

            }


            if (
                !archivo.type.startsWith(
                    "image/"
                )
            ) {

                alert(
                    "❌ Selecciona un archivo de imagen válido."
                );


                imagenArchivoInput.value =
                    "";

                return;

            }


            if (imagenNombre) {

                imagenNombre.textContent =
                    archivo.name;

            }


            const lector =
                new FileReader();


            lector.onload =
                () => {

                    if (!previewPortada) {

                        return;

                    }


                    previewPortada.innerHTML = "";


                    const imagen =
                        document.createElement(
                            "img"
                        );


                    imagen.src =
                        lector.result;


                    imagen.alt =
                        "Vista previa de portada";


                    previewPortada.appendChild(
                        imagen
                    );

                };


            lector.readAsDataURL(
                archivo
            );

        }
    );

}


// =====================================================
// MOSTRAR NOMBRE DEL ARCHIVO
// =====================================================

if (archivoObraInput) {

    archivoObraInput.addEventListener(
        "change",
        () => {

            const archivo =
                archivoObraInput.files[0];


            if (!archivo) {

                if (archivoNombre) {

                    archivoNombre.textContent =
                        "Ningún archivo seleccionado.";

                }

                return;

            }


            if (archivoNombre) {

                archivoNombre.textContent =
                    `📎 ${archivo.name}`;
                
            }

        }
    );

}


// =====================================================
// LIMPIAR FORMULARIO
// =====================================================

function limpiarFormulario() {

    if (formulario) {

        formulario.reset();

    }


    if (ratingInput) {

        ratingInput.value =
            "0";

    }


    if (imagenNombre) {

        imagenNombre.textContent =
            "Ninguna imagen seleccionada.";

    }


    if (archivoNombre) {

        archivoNombre.textContent =
            "Ningún archivo seleccionado.";

    }


    if (previewPortada) {

        previewPortada.innerHTML = `

            <span>
                🖼️
            </span>

            <p>
                Vista previa
            </p>

        `;

    }


    ocultarMensaje();

}


// =====================================================
// BOTÓN LIMPIAR
// =====================================================

if (btnLimpiar) {

    btnLimpiar.addEventListener(
        "click",
        () => {

            limpiarFormulario();

        }
    );

}


// =====================================================
// VALIDAR ARCHIVO
// =====================================================

function validarArchivoObra(
    archivo
) {

    if (!archivo) {

        return true;

    }


    const nombre =
        archivo.name.toLowerCase();


    const extensionesPermitidas = [

        ".pdf",
        ".epub",
        ".doc",
        ".docx",
        ".txt"

    ];


    const extensionValida =
        extensionesPermitidas.some(
            extension =>
                nombre.endsWith(
                    extension
                )
        );


    if (!extensionValida) {

        throw new Error(
            "El archivo debe ser PDF, EPUB, DOC, DOCX o TXT."
        );

    }


    return true;

}


// =====================================================
// PUBLICAR OBRA
// =====================================================

async function publicarObra(
    event
) {

    event.preventDefault();


    ocultarMensaje();


    // =================================================
    // COMPROBAR ADMIN
    // =================================================

    if (!usuarioActual) {

        mostrarMensaje(
            "🔐 Debes iniciar sesión para publicar una obra.",
            "error"
        );

        return;

    }


    if (!usuarioEsAdmin) {

        mostrarMensaje(
            "⛔ No tienes permisos de administrador.",
            "error"
        );

        return;

    }


    // =================================================
    // DATOS
    // =================================================

    const titulo =
        tituloInput.value.trim();


    const autor =
        autorInput.value.trim();


    const genero =
        generoInput.value.trim();


    const descripcion =
        descripcionInput.value.trim();


    const imagenUrl =
        imagenUrlInput.value.trim();


    const archivoUrl =
        archivoUrlInput.value.trim();


    const rating =
        Number(
            ratingInput.value
        );


    const imagenArchivo =
        imagenArchivoInput.files[0] ||
        null;


    const archivoObra =
        archivoObraInput.files[0] ||
        null;


    // =================================================
    // VALIDACIONES
    // =================================================

    if (!titulo) {

        mostrarMensaje(
            "⚠️ Escribe el título de la obra.",
            "error"
        );

        tituloInput.focus();

        return;

    }


    if (!autor) {

        mostrarMensaje(
            "⚠️ Escribe el nombre del autor.",
            "error"
        );

        autorInput.focus();

        return;

    }


    if (!genero) {

        mostrarMensaje(
            "⚠️ Escribe el género.",
            "error"
        );

        generoInput.focus();

        return;

    }


    if (!descripcion) {

        mostrarMensaje(
            "⚠️ Escribe una descripción.",
            "error"
        );

        descripcionInput.focus();

        return;

    }


    if (
        !imagenArchivo &&
        !imagenUrl
    ) {

        mostrarMensaje(
            "🖼️ Selecciona una portada o introduce una URL.",
            "error"
        );

        return;

    }


    if (
        !archivoObra &&
        !archivoUrl
    ) {

        mostrarMensaje(
            "📎 Selecciona el archivo de la obra o introduce una URL.",
            "error"
        );

        return;

    }


    if (
        rating < 0 ||
        rating > 5
    ) {

        mostrarMensaje(
            "⭐ La calificación debe estar entre 0 y 5.",
            "error"
        );

        return;

    }


    try {

        validarArchivoObra(
            archivoObra
        );


        // =================================================
        // DESACTIVAR
        // =================================================

        btnPublicar.disabled =
            true;


        btnLimpiar.disabled =
            true;


        btnPublicar.textContent =
            "⏳ Publicando...";


        // =================================================
        // PORTADA
        // =================================================

        let portadaFinal =
            imagenUrl;


        let portadaCloudinary =
            null;


        if (imagenArchivo) {

            mostrarMensaje(
                "🖼️ Subiendo portada...",
                "info"
            );


            portadaCloudinary =
                await subirACloudinary(
                    imagenArchivo
                );


            portadaFinal =
                portadaCloudinary.url;

        }


        // =================================================
        // ARCHIVO
        // =================================================

        let archivoFinal =
            archivoUrl;


        let archivoCloudinary =
            null;


        if (archivoObra) {

            mostrarMensaje(
                "📕 Subiendo archivo de la obra...",
                "info"
            );


            archivoCloudinary =
                await subirACloudinary(
                    archivoObra
                );


            archivoFinal =
                archivoCloudinary.url;

        }


        // =================================================
        // DATOS FIRESTORE
        // =================================================

        mostrarMensaje(
            "☁️ Guardando la obra en Firestore...",
            "info"
        );


        const datosComic = {

            titulo:
                titulo,

            autor:
                autor,

            genero:
                genero,

            descripcion:
                descripcion,

            imagen:
                portadaFinal,

            portada:
                portadaFinal,

            archivo:
                archivoFinal,

            rating:
                rating,

            creadoPor:
                usuarioActual.uid,

            fechaPublicacion:
                serverTimestamp(),

            fechaActualizacion:
                serverTimestamp(),

            activo:
                true,

            tipoArchivo:
                archivoObra
                    ? archivoObra.type
                    : "",

            nombreArchivo:
                archivoObra
                    ? archivoObra.name
                    : "",

            portadaCloudinaryId:
                portadaCloudinary
                    ?.publicId ||
                "",

            archivoCloudinaryId:
                archivoCloudinary
                    ?.publicId ||
                ""

        };


        // =================================================
        // CREAR DOCUMENTO
        // =================================================

        const referencia =
            await addDoc(
                collection(
                    db,
                    "comics"
                ),
                datosComic
            );


        console.log(
            "✅ Obra publicada:",
            referencia.id
        );


        // =================================================
        // ÉXITO
        // =================================================

        mostrarMensaje(
            "✅ ¡Obra publicada correctamente en ComicVerse AI!",
            "exito"
        );


        // =================================================
        // LIMPIAR CAMPOS
        // =================================================

        formulario.reset();


        ratingInput.value =
            "0";


        if (imagenNombre) {

            imagenNombre.textContent =
                "Ninguna imagen seleccionada.";

        }


        if (archivoNombre) {

            archivoNombre.textContent =
                "Ningún archivo seleccionado.";

        }


        if (previewPortada) {

            previewPortada.innerHTML = `

                <span>
                    🖼️
                </span>

                <p>
                    Vista previa
                </p>

            `;

        }


        // =================================================
        // REDIRECCIÓN OPCIONAL
        // =================================================

        setTimeout(
            () => {

                window.location.href =
                    "comics.html";

            },
            1800
        );

    }

    catch (error) {

        console.error(
            "❌ ERROR PUBLICANDO OBRA:",
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


        mostrarMensaje(
            "❌ No se pudo publicar la obra: " +
            (
                error?.message ||
                "Error desconocido."
            ),
            "error"
        );

    }

    finally {

        btnPublicar.disabled =
            false;


        btnLimpiar.disabled =
            false;


        btnPublicar.textContent =
            "🚀 Publicar obra";

    }

}


// =====================================================
// EVENTO FORMULARIO
// =====================================================

if (formulario) {

    formulario.addEventListener(
        "submit",
        publicarObra
    );

}


// =====================================================
// AUTH
// =====================================================

onAuthStateChanged(

    auth,

    async usuario => {

        console.log(
            "🔥 Usuario:",
            usuario
        );


        usuarioActual =
            usuario || null;


        // =================================================
        // NO LOGIN
        // =================================================

        if (!usuario) {

            usuarioEsAdmin =
                false;


            mostrarMensaje(
                "🔐 Debes iniciar sesión como administrador.",
                "error"
            );


            if (btnPublicar) {

                btnPublicar.disabled =
                    true;

            }


            return;

        }


        // =================================================
        // COMPROBAR ADMIN
        // =================================================

        usuarioEsAdmin =
            await comprobarAdministrador(
                usuario
            );


        if (!usuarioEsAdmin) {

            mostrarMensaje(
                "⛔ Esta página es solamente para administradores.",
                "error"
            );


            if (btnPublicar) {

                btnPublicar.disabled =
                    true;

            }


            return;

        }


        // =================================================
        // ADMIN CORRECTO
        // =================================================

        console.log(
            "🛡️ Administrador autorizado."
        );


        mostrarMensaje(
            "🛡️ Administrador autorizado. Puedes publicar obras.",
            "info"
        );


        if (btnPublicar) {

            btnPublicar.disabled =
                false;

        }

    }

);