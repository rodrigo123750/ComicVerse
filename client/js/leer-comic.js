// =========================================================
// COMICVERSE AI - LECTOR
// =========================================================

import { db } from "../firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


// =========================================================
// ELEMENTOS
// =========================================================

const comicTitulo =
    document.getElementById("comicTitulo");

const comicDescripcion =
    document.getElementById("comicDescripcion");

const comicAutor =
    document.getElementById("comicAutor");

const comicGenero =
    document.getElementById("comicGenero");

const comicPortada =
    document.getElementById("comicPortada");

const estadoLector =
    document.getElementById("estadoLector");

const comicViewer =
    document.getElementById("comicViewer");

const paginaComic =
    document.getElementById("paginaComic");

const btnAnterior =
    document.getElementById("btnAnterior");

const btnSiguiente =
    document.getElementById("btnSiguiente");

const contadorPagina =
    document.getElementById("contadorPagina");


// =========================================================
// ID DEL CÓMIC
// =========================================================

const parametros =
    new URLSearchParams(
        window.location.search
    );

const comicId =
    parametros.get("id");


// =========================================================
// VARIABLES
// =========================================================

let paginas = [];

let paginaActual = 0;


// =========================================================
// CARGAR CÓMIC
// =========================================================

async function cargarComic() {

    if (!comicId) {

        mostrarError(
            "No se encontró el cómic.",
            "La dirección no contiene el identificador del cómic."
        );

        return;
    }

    try {

        const referencia =
            doc(
                db,
                "comics",
                comicId
            );

        const snapshot =
            await getDoc(
                referencia
            );

        if (!snapshot.exists()) {

            mostrarError(
                "Cómic no encontrado",
                "Este cómic no existe o fue eliminado."
            );

            return;
        }

        const comic =
            snapshot.data();

        mostrarInformacion(
            comic
        );

        prepararPaginas(
            comic
        );

    } catch (error) {

        console.error(
            "Error cargando cómic:",
            error
        );

        mostrarError(
            "No se pudo abrir el cómic",
            "Ocurrió un problema al consultar la publicación."
        );

    }
}


// =========================================================
// INFORMACIÓN
// =========================================================

function mostrarInformacion(
    comic
) {

    comicTitulo.textContent =
        comic.titulo ||
        comic.nombre ||
        "Cómic sin título";

    comicDescripcion.textContent =
        comic.descripcion ||
        comic.sinopsis ||
        "Sin descripción disponible.";

    comicAutor.textContent =
        "✍️ " +
        (
            comic.autorNombre ||
            comic.autor ||
            "Autor desconocido"
        );

    comicGenero.textContent =
        "📚 " +
        (
            comic.genero ||
            comic.categoria ||
            "Sin género"
        );

    const portada =
        comic.portadaUrl ||
        comic.portada ||
        comic.imagen ||
        comic.imagenUrl;

    if (portada) {

        comicPortada.src =
            portada;

    }

    document.title =
        (
            comic.titulo ||
            comic.nombre ||
            "Leer cómic"
        ) +
        " | ComicVerse AI";
}


// =========================================================
// PREPARAR PÁGINAS
// =========================================================

function prepararPaginas(
    comic
) {

    /*
       Aceptamos varios nombres para que
       sea más fácil conectarlo con tu admin.
    */

    if (
        Array.isArray(
            comic.paginas
        )
    ) {

        paginas =
            comic.paginas
                .map(pagina => {

                    if (
                        typeof pagina ===
                        "string"
                    ) {

                        return pagina;

                    }

                    return (
                        pagina.url ||
                        pagina.archivoUrl ||
                        pagina.imagenUrl ||
                        ""
                    );

                })
                .filter(Boolean);

    }


    /*
       Si el admin guarda un solo archivo
       como archivoUrl.
    */

    if (
        !paginas.length &&
        comic.archivoUrl
    ) {

        paginas = [
            comic.archivoUrl
        ];

    }


    /*
       Otros nombres posibles.
    */

    if (
        !paginas.length &&
        comic.url
    ) {

        paginas = [
            comic.url
        ];

    }


    if (!paginas.length) {

        mostrarError(
            "Este cómic no tiene páginas",
            "La publicación existe, pero todavía no contiene un archivo para leer."
        );

        return;
    }


    paginaActual = 0;

    mostrarPagina();
}


// =========================================================
// MOSTRAR PÁGINA
// =========================================================

function mostrarPagina() {

    if (!paginas.length) {
        return;
    }

    const url =
        paginas[
            paginaActual
        ];

    paginaComic.src =
        url;

    paginaComic.alt =
        `Página ${paginaActual + 1}`;

    paginaComic.onerror =
        () => {

            estadoLector.textContent =
                "No se pudo cargar esta página.";

        };

    estadoLector.classList.add(
        "oculto"
    );

    comicViewer.classList.remove(
        "oculto"
    );

    actualizarControles();
}


// =========================================================
// CONTROLES
// =========================================================

function actualizarControles() {

    contadorPagina.textContent =
        `Página ${paginaActual + 1} de ${paginas.length}`;

    btnAnterior.disabled =
        paginaActual <= 0;

    btnSiguiente.disabled =
        paginaActual >=
        paginas.length - 1;
}


btnAnterior.addEventListener(
    "click",
    () => {

        if (
            paginaActual <= 0
        ) {
            return;
        }

        paginaActual--;

        mostrarPagina();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


btnSiguiente.addEventListener(
    "click",
    () => {

        if (
            paginaActual >=
            paginas.length - 1
        ) {
            return;
        }

        paginaActual++;

        mostrarPagina();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


// =========================================================
// TECLADO
// =========================================================

document.addEventListener(
    "keydown",
    evento => {

        if (
            evento.key ===
            "ArrowLeft"
        ) {

            btnAnterior.click();

        }

        if (
            evento.key ===
            "ArrowRight"
        ) {

            btnSiguiente.click();

        }

    }
);


// =========================================================
// ERROR
// =========================================================

function mostrarError(
    titulo,
    descripcion
) {

    estadoLector.classList.remove(
        "oculto"
    );

    comicViewer.classList.add(
        "oculto"
    );

    estadoLector.innerHTML = `

        <div class="error-lector">

            <div class="icono">
                📕
            </div>

            <h2>
                ${escaparHTML(titulo)}
            </h2>

            <p>
                ${escaparHTML(descripcion)}
            </p>

            <a
                href="index.html"
                class="btn-volver"
            >
                🏠 Volver al inicio
            </a>

        </div>

    `;
}


// =========================================================
// SEGURIDAD HTML
// =========================================================

function escaparHTML(
    texto = ""
) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        texto;

    return div.innerHTML;
}


// =========================================================
// INICIAR
// =========================================================

cargarComic();