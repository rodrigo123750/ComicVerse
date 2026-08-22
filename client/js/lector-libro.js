// =====================================
// COMICVERSE AI
// LECTOR DE LIBROS
// =====================================


// =====================================
// OBTENER ID DESDE LA URL
// =====================================

const parametros =
    new URLSearchParams(
        window.location.search
    );

const id =
    parametros.get("id");


// =====================================
// ELEMENTOS
// =====================================

const titulo =
    document.getElementById("tituloLibro");

const autor =
    document.getElementById("autorLibro");

const fecha =
    document.getElementById("fechaLibro");

const genero =
    document.getElementById("generoLibro");

const descripcion =
    document.getElementById("descripcionLibro");

const portada =
    document.getElementById("portadaLibro");

const fuente =
    document.getElementById("fuenteLibro");

const mensajeLectura =
    document.getElementById("mensajeLectura");

const visorLibro =
    document.getElementById("visorLibro");


// =====================================
// COMPROBAR ID
// =====================================

if (!id) {

    mostrarError(
        "Libro no encontrado",
        "No se proporcionó un identificador de libro."
    );

} else {

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
        // COMPROBAR QUE SEA OPEN LIBRARY
        // =================================

        if (!id.startsWith("/works/")) {

            throw new Error(
                "Identificador de libro no compatible."
            );

        }


        // =================================
        // CONSULTAR OPEN LIBRARY
        // =================================

        const respuesta =
            await fetch(
                `https://openlibrary.org${id}.json`
            );


        if (!respuesta.ok) {

            throw new Error(
                `Open Library respondió ${respuesta.status}`
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

        titulo.textContent =
            libro.title ||
            "Sin título";


        // =================================
        // AUTORES
        // =================================

        if (
            libro.authors &&
            Array.isArray(libro.authors) &&
            libro.authors.length
        ) {

            autor.textContent =
                "👤 Autor disponible en Open Library";

        } else {

            autor.textContent =
                "👤 Autor no especificado";

        }


        // =================================
        // FECHA
        // =================================

        fecha.textContent =
            "📅 Publicado: " +
            (
                libro.first_publish_date ||
                "Fecha no disponible"
            );


        // =================================
        // GÉNERO
        // =================================

        if (
            libro.subjects &&
            Array.isArray(libro.subjects) &&
            libro.subjects.length
        ) {

            const generos =
                libro.subjects
                    .slice(0, 5)
                    .join(", ");

            genero.textContent =
                "📚 " + generos;

        } else {

            genero.textContent =
                "📚 Género no especificado";

        }


        // =================================
        // DESCRIPCIÓN
        // =================================

        let textoDescripcion =
            "No hay una descripción disponible para este libro.";


        if (libro.description) {

            if (
                typeof libro.description ===
                "string"
            ) {

                textoDescripcion =
                    libro.description;

            }

            else if (
                typeof libro.description ===
                "object"
            ) {

                textoDescripcion =
                    libro.description.value ||
                    textoDescripcion;

            }

        }


        descripcion.textContent =
            textoDescripcion;


        // =================================
        // PORTADA
        // =================================

        if (
            libro.covers &&
            Array.isArray(libro.covers) &&
            libro.covers.length
        ) {

            portada.src =
                `https://covers.openlibrary.org/b/id/${libro.covers[0]}-L.jpg`;

            portada.alt =
                `Portada de ${libro.title || "libro"}`;

            portada.style.display =
                "block";

        }

        else {

            portada.style.display =
                "none";

        }


        // =================================
        // FUENTE
        // =================================

        fuente.textContent =
            "Open Library";


        // =================================
        // PREPARAR LECTOR
        // =================================

        prepararLector(
            libro
        );

    }

    catch (error) {

        console.error(
            "❌ Error cargando libro:",
            error
        );


        mostrarError(
            "No se pudo cargar el libro",
            "Ocurrió un problema al obtener la información desde Open Library."
        );

    }

}


// =====================================
// PREPARAR LECTOR
// =====================================

function prepararLector(libro) {

    if (!mensajeLectura) {
        return;
    }


    if (!visorLibro) {
        return;
    }


    visorLibro.innerHTML = "";


    // =================================
    // COMPROBAR POSIBLE CONTENIDO
    // =================================

    const tienePreview =
        libro.ebook_access === "public" ||
        libro.ebook_access === "borrow";


    if (tienePreview) {

        mensajeLectura.innerHTML = `

            <h3>
                📖 Lectura disponible
            </h3>

            <p>
                Este libro tiene contenido
                digital disponible según
                las condiciones de Open Library.
            </p>

            <button
                id="btnAbrirLectura"
                class="btn-lectura"
                type="button"
            >
                📖 Abrir lectura
            </button>

        `;


        const btn =
            document.getElementById(
                "btnAbrirLectura"
            );


        if (btn) {

            btn.addEventListener(
                "click",
                () => {

                    abrirLectura(
                        libro
                    );

                }
            );

        }

        return;

    }


    // =================================
    // SIN LECTURA DIGITAL
    // =================================

    mensajeLectura.innerHTML = `

        <h3>
            📚 Información disponible
        </h3>

        <p>
            Este registro contiene información
            sobre el libro, pero no proporciona
            una lectura digital completa
            disponible para ComicVerse.
        </p>

        <p>
            Puedes consultar los datos
            bibliográficos desde la biblioteca.
        </p>

    `;

}


// =====================================
// ABRIR LECTURA
// =====================================

function abrirLectura(libro) {

    visorLibro.innerHTML = "";


    // =================================
    // MENSAJE DE LECTURA
    // =================================

    const aviso =
        document.createElement("div");


    aviso.className =
        "aviso-lectura";


    aviso.innerHTML = `

        <h2>
            📖 Vista de lectura
        </h2>

        <p>
            ComicVerse puede mostrar aquí
            contenido digital cuando la fuente
            lo permita.
        </p>

    `;


    visorLibro.appendChild(
        aviso
    );


    // =================================
    // INFORMACIÓN DEL REGISTRO
    // =================================

    if (libro.key) {

        const informacion =
            document.createElement("p");


        informacion.textContent =
            "Identificador: " +
            libro.key;


        informacion.className =
            "info-registro";


        visorLibro.appendChild(
            informacion
        );

    }


    // =================================
    // MENSAJE
    // =================================

    const estado =
        document.createElement("div");


    estado.className =
        "estado-lector";


    estado.innerHTML = `

        <span>
            📚
        </span>

        <p>
            El acceso al texto completo
            depende de los derechos y permisos
            proporcionados por la fuente.
        </p>

    `;


    visorLibro.appendChild(
        estado
    );

}


// =====================================
// MOSTRAR ERROR
// =====================================

function mostrarError(
    tituloError,
    mensajeError
) {

    if (titulo) {

        titulo.textContent =
            tituloError;

    }


    if (descripcion) {

        descripcion.textContent =
            mensajeError;

    }


    if (mensajeLectura) {

        mensajeLectura.innerHTML = `

            <h3>
                ⚠️ No disponible
            </h3>

            <p>
                ${escaparHTML(
                    mensajeError
                )}
            </p>

        `;

    }


    if (visorLibro) {

        visorLibro.innerHTML = "";

    }

}


// =====================================
// PROTECCIÓN HTML
// =====================================

function escaparHTML(texto) {

    const elemento =
        document.createElement(
            "div"
        );


    elemento.textContent =
        String(texto);


    return elemento.innerHTML;

}