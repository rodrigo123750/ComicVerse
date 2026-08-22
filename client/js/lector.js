// =====================================
// COMICVERSE AI
// LECTOR INTERNO DE LIBROS
// =====================================

const parametros =
    new URLSearchParams(window.location.search);

const id =
    parametros.get("id");


// =====================================
// ELEMENTOS
// =====================================

const tituloLibro =
    document.getElementById("tituloLibro");

const autorLibro =
    document.getElementById("autorLibro");

const fechaLibro =
    document.getElementById("fechaLibro");

const generoLibro =
    document.getElementById("generoLibro");

const descripcionLibro =
    document.getElementById("descripcionLibro");

const portadaLibro =
    document.getElementById("portadaLibro");

const fuenteLibro =
    document.getElementById("fuenteLibro");

const enlaceFuente =
    document.getElementById("enlaceFuente");

const mensajeLectura =
    document.getElementById("mensajeLectura");

const visorLibro =
    document.getElementById("visorLibro");


// =====================================
// COMPROBAR ID
// =====================================

if (!id) {

    tituloLibro.textContent =
        "Libro no encontrado";

    descripcionLibro.textContent =
        "No se recibió el identificador del libro.";

}
else {

    cargarLibro();

}


// =====================================
// CARGAR LIBRO
// =====================================

async function cargarLibro() {

    try {

        console.log(
            "📖 Cargando libro:",
            id
        );


        // =================================
        // OBTENER INFORMACIÓN
        // =================================

        const respuesta =
            await fetch(
                `https://openlibrary.org${id}.json`
            );


        if (!respuesta.ok) {

            throw new Error(
                "No se pudo obtener el libro."
            );

        }


        const libro =
            await respuesta.json();


        console.log(
            "📚 LIBRO:",
            libro
        );


        // =================================
        // TÍTULO
        // =================================

        tituloLibro.textContent =
            libro.title ||
            "Sin título";


        // =================================
        // AUTOR
        // =================================

        if (
            libro.authors &&
            libro.authors.length
        ) {

            const autores =
                await obtenerAutores(
                    libro.authors
                );


            autorLibro.textContent =
                "Autor: " + autores;

        }
        else {

            autorLibro.textContent =
                "Autor: No especificado";

        }


        // =================================
        // FECHA
        // =================================

        fechaLibro.textContent =
            "Año: " +
            (
                libro.first_publish_date ||
                "No disponible"
            );


        // =================================
        // GÉNERO
        // =================================

        if (
            libro.subjects &&
            libro.subjects.length
        ) {

            generoLibro.textContent =
                "Género: " +
                libro.subjects
                    .slice(0, 3)
                    .join(", ");

        }
        else {

            generoLibro.textContent =
                "Género: No especificado";

        }


        // =================================
        // DESCRIPCIÓN
        // =================================

        let descripcion =
            "No existe una descripción disponible para este libro.";


        if (libro.description) {

            if (
                typeof libro.description ===
                "string"
            ) {

                descripcion =
                    libro.description;

            }
            else if (
                libro.description.value
            ) {

                descripcion =
                    libro.description.value;

            }

        }


        descripcionLibro.textContent =
            descripcion;


        // =================================
        // PORTADA
        // =================================

        if (
            libro.covers &&
            libro.covers.length
        ) {

            portadaLibro.src =
                `https://covers.openlibrary.org/b/id/${libro.covers[0]}-L.jpg`;

        }
        else {

            portadaLibro.style.display =
                "none";

        }


        // =================================
        // FUENTE
        // =================================

        fuenteLibro.textContent =
            "Open Library";


        // =================================
        // IMPORTANTE
        // NO REDIRECCIONAR
        // =================================

        enlaceFuente.style.display =
            "none";


        // =================================
        // MENSAJE DE LECTURA
        // =================================

        mensajeLectura.innerHTML = `

            <h3>
                📖 Lector ComicVerse
            </h3>

            <p>
                Estamos comprobando si existe
                contenido disponible para lectura
                dentro de ComicVerse.
            </p>

        `;


        // =================================
        // PREPARAR VISOR
        // =================================

        visorLibro.innerHTML = `

            <div class="visor-mensaje">

                <div class="icono-visor">
                    📚
                </div>

                <h2>
                    Contenido del libro
                </h2>

                <p>
                    Este libro tiene información
                    disponible en la biblioteca.
                </p>

                <p>
                    ComicVerse mostrará aquí
                    únicamente contenido que la
                    fuente permita visualizar.
                </p>

            </div>

        `;

    }

    catch (error) {

        console.error(
            "❌ ERROR LECTOR:",
            error
        );


        tituloLibro.textContent =
            "No se pudo cargar el libro";


        descripcionLibro.textContent =
            "Ocurrió un error al obtener la información.";

    }

}


// =====================================
// OBTENER AUTORES
// =====================================

async function obtenerAutores(
    autores
) {

    const nombres = [];


    for (
        const autorInfo of autores.slice(0, 5)
    ) {

        try {

            if (
                !autorInfo.author ||
                !autorInfo.author.key
            ) {

                continue;

            }


            const respuesta =
                await fetch(
                    `https://openlibrary.org${autorInfo.author.key}.json`
                );


            if (!respuesta.ok) {

                continue;

            }


            const autor =
                await respuesta.json();


            if (autor.name) {

                nombres.push(
                    autor.name
                );

            }

        }

        catch {

            // Ignorar autor individual
        }

    }


    return nombres.length
        ? nombres.join(", ")
        : "Autor no especificado";

}