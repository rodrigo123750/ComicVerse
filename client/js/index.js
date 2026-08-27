// =====================================
// COMICVERSE AI
// CARGAR COMICS DESTACADOS EN INDEX
// SISTEMA DE VOTACIONES
// =====================================


import { auth, db } from "./firebase/firebase.js";


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


// =====================================
// CONTENEDOR
// =====================================

const contenedor =
    document.getElementById("destacados");


// =====================================
// USUARIO ACTUAL
// =====================================

let usuarioActual = null;


// =====================================
// ESCAPAR HTML
// =====================================

function escaparHTML(texto) {

    const elemento =
        document.createElement("div");

    elemento.textContent =
        String(texto ?? "");

    return elemento.innerHTML;

}


// =====================================
// ESPERAR ESTADO DE AUTENTICACIÓN
// =====================================

onAuthStateChanged(
    auth,
    (usuario) => {

        usuarioActual = usuario || null;

        cargarComics();

    }
);


// =====================================
// CARGAR CÓMICS
// =====================================

async function cargarComics() {

    if (!contenedor) {

        console.error(
            "❌ No se encontró el contenedor #destacados"
        );

        return;

    }


    try {

        // =================================
        // CONSULTAR CÓMICS
        // =================================

        const consulta =
            await getDocs(
                collection(
                    db,
                    "comics"
                )
            );


        contenedor.innerHTML = "";


        // =================================
        // COMPROBAR
        // =================================

        if (consulta.empty) {

            contenedor.innerHTML = `

                <div class="sin-resultados">

                    <h3>
                        📚 No hay cómics disponibles
                    </h3>

                    <p>
                        Todavía no se han agregado
                        historias a ComicVerse AI.
                    </p>

                </div>

            `;

            return;

        }


        // =================================
        // CARGAR CADA CÓMIC
        // =================================

        for (
            const documento of consulta.docs
        ) {

            const comic =
                documento.data();

            const id =
                documento.id;


            // =================================
            // OBTENER INFORMACIÓN DE VOTOS
            // =================================

            const votacion =
                await obtenerVotacion(id);


            // =================================
            // CREAR TARJETA
            // =================================

            const tarjeta =
                document.createElement("div");


            tarjeta.className =
                "card comic-destacado";


            // =================================
            // DATOS
            // =================================

            const titulo =
                comic.titulo ||
                "Sin título";


            const genero =
                comic.genero ||
                "Sin género";


            const imagen =
                comic.imagen ||
                "img/portada/default-book.jpg";


            const promedio =
                votacion.promedio;


            const cantidadVotos =
                votacion.cantidad;


            // =================================
            // ESTRELLAS
            // =================================

            const estrellas =
                generarEstrellas(
                    promedio
                );


            // =================================
            // BOTONES DE VOTO
            // =================================

            const botonesEstrellas =
                generarBotonesVoto(
                    id
                );


            // =================================
            // HTML TARJETA
            // =================================

            tarjeta.innerHTML = `

                <div class="comic-imagen">

                    <img
                        src="${escaparHTML(imagen)}"
                        alt="${escaparHTML(titulo)}"
                        onerror="
                            this.src='img/portada/default-book.jpg'
                        "
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


                    <!-- =====================
                         VALORACIÓN
                    ====================== -->

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
                            ${cantidadVotos === 1
                                ? "voto"
                                : "votos"}

                        </span>

                    </div>


                    <!-- =====================
                         VOTAR
                    ====================== -->

                    <div class="zona-votacion">

                        <p>

                            ⭐
                            ${usuarioActual
                                ? "¿Qué te parece?"
                                : "Inicia sesión para votar"}

                        </p>


                        <div
                            class="botones-estrellas"
                            data-comic-id="${escaparHTML(id)}"
                        >

                            ${botonesEstrellas}

                        </div>

                    </div>


                    <!-- =====================
                         LEER
                    ====================== -->

                    <button
                        class="btn btn-leer-comic"
                        data-comic-id="${escaparHTML(id)}"
                    >

                        📖 Leer ahora

                    </button>

                </div>

            `;


            // =================================
            // AÑADIR AL CONTENEDOR
            // =================================

            contenedor.appendChild(
                tarjeta
            );

        }


        // =================================
        // ACTIVAR BOTONES
        // =================================

        activarBotonesVoto();


        activarBotonesLeer();


    }

    catch(error) {

        console.error(
            "❌ Error cargando cómics:",
            error
        );


        contenedor.innerHTML = `

            <div class="sin-resultados">

                <h3>
                    ❌ No se pudieron cargar
                    las historias
                </h3>

                <p>
                    Inténtalo nuevamente.
                </p>

            </div>

        `;

    }

}


// =====================================
// OBTENER VOTACIÓN
// =====================================

async function obtenerVotacion(
    comicId
) {

    try {

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


        consulta.forEach(
            documento => {

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


        const promedio =
            cantidad > 0
                ? suma / cantidad
                : 0;


        return {

            promedio,
            cantidad

        };

    }

    catch(error) {

        console.error(
            "❌ Error obteniendo votos:",
            error
        );


        return {

            promedio: 0,

            cantidad: 0

        };

    }

}


// =====================================
// GENERAR ESTRELLAS DEL PROMEDIO
// =====================================

function generarEstrellas(
    promedio
) {

    let resultado = "";


    for (
        let i = 1;
        i <= 5;
        i++
    ) {

        if (
            i <= Math.round(promedio)
        ) {

            resultado += `
                <span class="estrella llena">
                    ★
                </span>
            `;

        }

        else {

            resultado += `
                <span class="estrella vacia">
                    ☆
                </span>
            `;

        }

    }


    return resultado;

}


// =====================================
// GENERAR BOTONES DE VOTACIÓN
// =====================================

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
                title="Dar ${puntuacion} estrella${puntuacion > 1 ? "s" : ""}"
            >

                ${puntuacion}★
                
            </button>

        `;

    }


    return resultado;

}


// =====================================
// ACTIVAR BOTONES DE VOTO
// =====================================

function activarBotonesVoto() {

    const botones =
        document.querySelectorAll(
            ".btn-voto"
        );


    botones.forEach(
        boton => {

            boton.addEventListener(
                "click",
                async () => {

                    const comicId =
                        boton.dataset.comicId;


                    const puntuacion =
                        Number(
                            boton.dataset.puntuacion
                        );


                    // =========================
                    // COMPROBAR LOGIN
                    // =========================

                    if (!usuarioActual) {

                        alert(
                            "🔐 Debes iniciar sesión para votar."
                        );


                        window.location.href =
                            "login.html";


                        return;

                    }


                    // =========================
                    // COMPROBAR PUNTUACIÓN
                    // =========================

                    if (
                        puntuacion < 1 ||
                        puntuacion > 5
                    ) {

                        return;

                    }


                    try {

                        // =========================
                        // REFERENCIA DEL VOTO
                        // =========================

                        const votoRef =
                            doc(
                                db,
                                "comics",
                                comicId,
                                "votos",
                                usuarioActual.uid
                            );


                        // =========================
                        // COMPROBAR SI YA VOTÓ
                        // =========================

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


                        // =========================
                        // GUARDAR VOTO
                        // =========================

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


                        // =========================
                        // CONFIRMACIÓN
                        // =========================

                        alert(
                            `⭐ Has dado ${puntuacion} estrella${puntuacion > 1 ? "s" : ""}. ¡Gracias por votar!`
                        );


                        // =========================
                        // RECARGAR
                        // =========================

                        await cargarComics();

                    }

                    catch(error) {

                        console.error(
                            "❌ Error guardando voto:",
                            error
                        );


                        alert(
                            "❌ No se pudo guardar tu voto."
                        );

                    }

                }
            );

        }
    );

}


// =====================================
// ACTIVAR BOTONES LEER
// =====================================

function activarBotonesLeer() {

    const botones =
        document.querySelectorAll(
            ".btn-leer-comic"
        );


    botones.forEach(
        boton => {

            boton.addEventListener(
                "click",
                () => {

                    const id =
                        boton.dataset.comicId;


                    if (!id) {

                        alert(
                            "❌ Este cómic no tiene identificador."
                        );


                        return;

                    }


                    window.location.href =
                        `comic.html?id=${encodeURIComponent(id)}`;

                }
            );

        }
    );

}