// =====================================================
// COMICVERSE AI
// INDEX.JS
// HISTORIAS DESTACADAS
// FIREBASE FIRESTORE
// SISTEMA DE VOTACIONES
// =====================================================


import {
    auth,
    db
} from "./firebase/firebase.js";


import {
    collection,
    getDocs,
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";


// =====================================================
// CONTENEDOR DE HISTORIAS DESTACADAS
// =====================================================

const contenedor =
    document.getElementById("destacados");


// =====================================================
// USUARIO ACTUAL
// =====================================================

let usuarioActual = null;


// =====================================================
// IMAGEN POR DEFECTO
// =====================================================

const IMAGEN_DEFAULT =
    "img/portada/default-book.jpg";


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
// AUTENTICACIÓN
// =====================================================

onAuthStateChanged(
    auth,
    async (usuario) => {

        usuarioActual =
            usuario || null;

        console.log(
            "🔥 Firebase Auth:",
            usuarioActual
                ? "Usuario autenticado"
                : "Usuario no autenticado"
        );

        await cargarComics();

    }
);


// =====================================================
// CARGAR CÓMICS DESTACADOS
// =====================================================

async function cargarComics() {

    if (!contenedor) {

        console.error(
            "❌ No existe el contenedor #destacados"
        );

        return;

    }


    // =================================================
    // ESTADO DE CARGA
    // =================================================

    contenedor.innerHTML = `

        <div class="sin-resultados">

            <h3>
                ⏳ Cargando historias...
            </h3>

            <p>
                Estamos preparando los cómics.
            </p>

        </div>

    `;


    try {

        console.log(
            "📚 Consultando Firestore: /comics"
        );


        // =================================================
        // REFERENCIA A LA COLECCIÓN
        // =================================================

        const referencia =
            collection(
                db,
                "comics"
            );


        // =================================================
        // OBTENER DOCUMENTOS
        // =================================================

        const consulta =
            await getDocs(
                referencia
            );


        console.log(
            "📚 Documentos encontrados:",
            consulta.size
        );


        // =================================================
        // COMPROBAR SI ESTÁ VACÍA
        // =================================================

        if (consulta.empty) {

            contenedor.innerHTML = `

                <div class="sin-resultados">

                    <h3>
                        📚 No hay historias todavía
                    </h3>

                    <p>
                        Todavía no se han agregado
                        cómics a ComicVerse AI.
                    </p>

                    <a
                        href="comics.html"
                        class="btn"
                    >
                        📖 Explorar cómics
                    </a>

                </div>

            `;

            return;

        }


        // =================================================
        // CONVERTIR DOCUMENTOS EN ARRAY
        // =================================================

        const comics =
            consulta.docs.map(
                (documento) => {

                    return {

                        id:
                            documento.id,

                        ...documento.data()

                    };

                }
            );


        // =================================================
        // LIMPIAR CONTENEDOR
        // =================================================

        contenedor.innerHTML = "";


        // =================================================
        // CREAR TARJETAS
        // =================================================

        for (
            const comic of comics
        ) {

            await crearTarjetaComic(
                comic
            );

        }


        // =================================================
        // ACTIVAR FUNCIONES
        // =================================================

        activarBotonesVoto();

        activarBotonesLeer();


        console.log(
            "✅ Historias cargadas correctamente."
        );

    }


    catch (error) {

        console.error(
            "❌ ERROR FIRESTORE:",
            error
        );


        // =================================================
        // ERROR DE PERMISOS
        // =================================================

        if (
            error.code ===
            "permission-denied"
        ) {

            contenedor.innerHTML = `

                <div class="sin-resultados">

                    <h3>
                        🔐 Firestore bloqueó las historias
                    </h3>

                    <p>
                        La colección
                        <strong>comics</strong>
                        no permite lectura desde esta página.
                    </p>

                    <p class="error-detalle">

                        Revisa las reglas de seguridad
                        de Firestore.

                    </p>

                </div>

            `;

            return;

        }


        // =================================================
        // ERROR GENERAL
        // =================================================

        contenedor.innerHTML = `

            <div class="sin-resultados">

                <h3>
                    ❌ No se pudieron cargar las historias
                </h3>

                <p>
                    Inténtalo nuevamente.
                </p>

                <p class="error-detalle">

                    ${escaparHTML(
                        error.message
                    )}

                </p>

            </div>

        `;

    }

}


// =====================================================
// CREAR TARJETA DE CÓMIC
// =====================================================

async function crearTarjetaComic(
    comic
) {

    const id =
        comic.id;


    // =================================================
    // DATOS DEL CÓMIC
    // =================================================

    const titulo =
        comic.titulo ||
        "Sin título";


    const genero =
        comic.genero ||
        "Sin género";


    const imagen =
        comic.imagen ||
        comic.portada ||
        IMAGEN_DEFAULT;


    const descripcion =
        comic.descripcion ||
        "Descubre esta historia en ComicVerse AI.";


    // =================================================
    // INFORMACIÓN DE VOTACIÓN
    // =================================================

    let votacion = {

        promedio: 0,

        cantidad: 0

    };


    try {

        votacion =
            await obtenerVotacion(
                id
            );

    }

    catch (error) {

        console.warn(
            "⚠️ No se pudieron cargar los votos:",
            error
        );

    }


    // =================================================
    // CREAR TARJETA
    // =================================================

    const tarjeta =
        document.createElement(
            "article"
        );


    tarjeta.className =
        "card comic-destacado";


    // =================================================
    // DATOS DE VOTACIÓN
    // =================================================

    const promedio =
        votacion.promedio;


    const cantidadVotos =
        votacion.cantidad;


    const estrellas =
        generarEstrellas(
            promedio
        );


    const botonesEstrellas =
        generarBotonesVoto(
            id
        );


    // =================================================
    // HTML DE LA TARJETA
    // =================================================

    tarjeta.innerHTML = `

        <div class="comic-imagen">

            <img
                src="${escaparHTML(imagen)}"
                alt="${escaparHTML(titulo)}"
                loading="lazy"
            >

        </div>


        <div class="comic-info">


            <h3>

                📖
                ${escaparHTML(titulo)}

            </h3>


            <p>

                🏷️
                ${escaparHTML(genero)}

            </p>


            <p class="comic-descripcion">

                ${escaparHTML(descripcion)}

            </p>


            <!-- =====================================
                 VALORACIÓN
            ====================================== -->

            <div class="comic-valoracion">


                <div class="estrellas-promedio">

                    ${estrellas}

                </div>


                <span class="promedio-texto">

                    ${promedio.toFixed(1)}
                    / 5

                </span>


                <span class="cantidad-votos">

                    👥
                    ${cantidadVotos}

                    ${
                        cantidadVotos === 1
                            ? "voto"
                            : "votos"
                    }

                </span>


            </div>


            <!-- =====================================
                 ZONA DE VOTACIÓN
            ====================================== -->

            <div class="zona-votacion">


                <p>

                    ⭐

                    ${
                        usuarioActual
                            ? "¿Qué te parece?"
                            : "Inicia sesión para votar"
                    }

                </p>


                <div
                    class="botones-estrellas"
                    data-comic-id="${escaparHTML(id)}"
                >

                    ${botonesEstrellas}

                </div>


            </div>


            <!-- =====================================
                 BOTÓN LEER
            ====================================== -->

            <button
                type="button"
                class="btn btn-leer-comic"
                data-comic-id="${escaparHTML(id)}"
            >

                📖 Leer ahora

            </button>


        </div>

    `;


    // =================================================
    // FALLBACK DE IMAGEN
    // =================================================

    const imagenElemento =
        tarjeta.querySelector(
            ".comic-imagen img"
        );


    if (imagenElemento) {

        imagenElemento.addEventListener(
            "error",
            () => {

                if (
                    imagenElemento.src.endsWith(
                        IMAGEN_DEFAULT
                    )
                ) {

                    return;

                }


                imagenElemento.src =
                    IMAGEN_DEFAULT;

            },
            {
                once: true
            }
        );

    }


    // =================================================
    // AÑADIR TARJETA
    // =================================================

    contenedor.appendChild(
        tarjeta
    );

}


// =====================================================
// OBTENER VOTACIÓN DE UN CÓMIC
// =====================================================

async function obtenerVotacion(
    comicId
) {

    const votosRef =
        collection(
            db,
            "comics",
            comicId,
            "votos"
        );


    const consulta =
        await getDocs(
            votosRef
        );


    let suma = 0;

    let cantidad = 0;


    // =================================================
    // RECORRER VOTOS
    // =================================================

    consulta.forEach(
        (documento) => {

            const datos =
                documento.data();


            const puntuacion =
                Number(
                    datos.puntuacion
                );


            if (
                Number.isFinite(
                    puntuacion
                ) &&
                puntuacion >= 1 &&
                puntuacion <= 5
            ) {

                suma +=
                    puntuacion;

                cantidad++;

            }

        }
    );


    // =================================================
    // CALCULAR PROMEDIO
    // =================================================

    const promedio =
        cantidad > 0
            ? suma / cantidad
            : 0;


    return {

        promedio,

        cantidad

    };

}


// =====================================================
// GENERAR ESTRELLAS DEL PROMEDIO
// =====================================================

function generarEstrellas(
    promedio
) {

    let resultado = "";


    for (
        let i = 1;
        i <= 5;
        i++
    ) {

        const llena =
            i <= Math.round(
                promedio
            );


        resultado += `

            <span
                class="estrella ${
                    llena
                        ? "llena"
                        : "vacia"
                }"
            >

                ${
                    llena
                        ? "★"
                        : "☆"
                }

            </span>

        `;

    }


    return resultado;

}


// =====================================================
// GENERAR BOTONES DE VOTACIÓN
// =====================================================

function generarBotonesVoto(
    comicId
) {

    let resultado = "";


    for (
        let puntuacion = 1;
        puntuacion <= 5;
        puntuacion++
    ) {

        resultado += `

            <button
                type="button"
                class="btn-voto"
                data-comic-id="${escaparHTML(comicId)}"
                data-puntuacion="${puntuacion}"
                title="Dar ${puntuacion} estrella${
                    puntuacion > 1
                        ? "s"
                        : ""
                }"
            >

                ${puntuacion}★

            </button>

        `;

    }


    return resultado;

}


// =====================================================
// ACTIVAR BOTONES DE VOTO
// =====================================================

function activarBotonesVoto() {

    const botones =
        document.querySelectorAll(
            ".btn-voto"
        );


    botones.forEach(
        (boton) => {

            boton.addEventListener(
                "click",
                async () => {

                    const comicId =
                        boton.dataset.comicId;


                    const puntuacion =
                        Number(
                            boton.dataset.puntuacion
                        );


                    // =================================
                    // COMPROBAR LOGIN
                    // =================================

                    if (!usuarioActual) {

                        alert(
                            "🔐 Debes iniciar sesión para votar."
                        );


                        window.location.href =
                            "login.html";


                        return;

                    }


                    // =================================
                    // VALIDAR DATOS
                    // =================================

                    if (
                        !comicId ||
                        puntuacion < 1 ||
                        puntuacion > 5
                    ) {

                        return;

                    }


                    try {

                        // =================================
                        // DESACTIVAR BOTÓN
                        // =================================

                        boton.disabled =
                            true;


                        // =================================
                        // REFERENCIA DEL VOTO
                        // =================================

                        const votoRef =
                            doc(
                                db,
                                "comics",
                                comicId,
                                "votos",
                                usuarioActual.uid
                            );


                        // =================================
                        // COMPROBAR SI YA VOTÓ
                        // =================================

                        const votoExistente =
                            await getDoc(
                                votoRef
                            );


                        if (
                            votoExistente.exists()
                        ) {

                            alert(
                                "⭐ Ya has votado este cómic."
                            );


                            return;

                        }


                        // =================================
                        // GUARDAR VOTO
                        // =================================

                        await setDoc(
                            votoRef,
                            {

                                usuarioId:
                                    usuarioActual.uid,

                                puntuacion:
                                    puntuacion,

                                fecha:
                                    new Date()

                            }
                        );


                        // =================================
                        // CONFIRMACIÓN
                        // =================================

                        alert(
                            `⭐ Has dado ${puntuacion} estrella${
                                puntuacion > 1
                                    ? "s"
                                    : ""
                            }. ¡Gracias por votar!`
                        );


                        // =================================
                        // ACTUALIZAR TARJETAS
                        // =================================

                        await cargarComics();

                    }


                    catch (error) {

                        console.error(
                            "❌ Error guardando voto:",
                            error
                        );


                        alert(
                            "❌ No se pudo guardar el voto."
                        );

                    }


                    finally {

                        boton.disabled =
                            false;

                    }

                }
            );

        }
    );

}


// =====================================================
// ACTIVAR BOTONES "LEER AHORA"
// =====================================================

function activarBotonesLeer() {

    const botones =
        document.querySelectorAll(
            ".btn-leer-comic"
        );


    botones.forEach(
        (boton) => {

            boton.addEventListener(
                "click",
                () => {

                    const id =
                        boton.dataset.comicId;


                    // =================================
                    // VALIDAR ID
                    // =================================

                    if (!id) {

                        alert(
                            "❌ Este cómic no tiene identificador."
                        );

                        return;

                    }


                    // =================================
                    // IR A comic.html
                    // =================================

                    window.location.href =
                        `comic.html?id=${encodeURIComponent(id)}`;

                }
            );

        }
    );

}