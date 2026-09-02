// =====================================================
// COMICVERSE AI
// LIBROS POPULARES
// OPEN LIBRARY API
// =====================================================


// =====================================================
// CONTENEDOR
// =====================================================

const librosPopulares =
    document.getElementById(
        "librosPopulares"
    );


// =====================================================
// CONFIGURACIÓN
// =====================================================

const OPEN_LIBRARY_API =
    "https://openlibrary.org/search.json";


// =====================================================
// LIBROS POPULARES
// =====================================================

const BUSQUEDAS_POPULARES = [

    "Don Quixote",

    "Pride and Prejudice",

    "1984 George Orwell",

    "The Little Prince",

    "One Hundred Years of Solitude",

    "Moby Dick",

    "Jane Eyre",

    "Crime and Punishment",

    "The Adventures of Sherlock Holmes",

    "The Great Gatsby",

    "Frankenstein",

    "The Hobbit"

];


// =====================================================
// IMAGEN DEFAULT
// =====================================================

const IMAGEN_DEFAULT =
    "img/libro-default.png";


// =====================================================
// ESCAPAR HTML
// =====================================================

function escaparHTML(
    texto
) {

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


// =====================================================
// CARGAR LIBROS
// =====================================================

async function cargarLibrosPopulares() {

    if (!librosPopulares) {

        console.error(
            "❌ No existe #librosPopulares"
        );

        return;

    }


    librosPopulares.innerHTML = `

        <div class="libros-cargando">

            ⏳ Buscando libros populares...

        </div>

    `;


    try {

        console.log(
            "📚 Consultando Open Library..."
        );


        const libros = [];


        // =================================================
        // BUSCAR CADA LIBRO
        // =================================================

        for (
            const busqueda
            of BUSQUEDAS_POPULARES
        ) {

            try {

                const libro =
                    await buscarLibro(
                        busqueda
                    );


                if (libro) {

                    libros.push(
                        libro
                    );

                }

            }

            catch (error) {

                console.warn(
                    "⚠️ No se pudo buscar:",
                    busqueda,
                    error
                );

            }

        }


        console.log(
            "📚 Libros obtenidos:",
            libros.length
        );


        // =================================================
        // SIN RESULTADOS
        // =================================================

        if (
            libros.length === 0
        ) {

            throw new Error(
                "Open Library no devolvió resultados."
            );

        }


        // =================================================
        // MOSTRAR
        // =================================================

        mostrarLibros(
            libros
        );


        console.log(
            "✅ Libros populares mostrados."
        );

    }


    catch (error) {

        console.error(
            "❌ ERROR OPEN LIBRARY:",
            error
        );


        librosPopulares.innerHTML = `

            <div class="libros-error">

                <h3>

                    📚 No se pudieron cargar
                    los libros

                </h3>


                <p>

                    Open Library no está disponible
                    en este momento.

                </p>


                <button
                    type="button"
                    class="libros-reintentar"
                    id="btnReintentarLibros"
                >

                    🔄 Intentar nuevamente

                </button>

            </div>

        `;


        const boton =
            document.getElementById(
                "btnReintentarLibros"
            );


        if (boton) {

            boton.addEventListener(
                "click",
                cargarLibrosPopulares
            );

        }

    }

}


// =====================================================
// BUSCAR UN LIBRO
// =====================================================

async function buscarLibro(
    busqueda
) {

    const url =
        `${OPEN_LIBRARY_API}?title=${encodeURIComponent(
            busqueda
        )}&limit=5&language=spa`;


    const respuesta =
        await fetch(
            url
        );


    if (!respuesta.ok) {

        throw new Error(
            `HTTP ${respuesta.status}`
        );

    }


    const datos =
        await respuesta.json();


    if (
        !datos ||
        !Array.isArray(
            datos.docs
        ) ||
        datos.docs.length === 0
    ) {

        return null;

    }


    // =================================================
    // BUSCAR MEJOR RESULTADO
    // =================================================

    const resultado =
        datos.docs.find(
            libro => {

                return (
                    libro.title &&
                    (
                        libro.cover_i ||
                        libro.cover_edition_key
                    )
                );

            }
        )
        ||
        datos.docs[0];


    if (!resultado) {

        return null;

    }


    // =================================================
    // PORTADA
    // =================================================

    let portada =
        IMAGEN_DEFAULT;


    if (
        resultado.cover_i
    ) {

        portada =
            `https://covers.openlibrary.org/b/id/${resultado.cover_i}-L.jpg`;

    }


    // =================================================
    // AUTORES
    // =================================================

    const autores =
        Array.isArray(
            resultado.author_name
        )
            ? resultado.author_name
            : [];


    // =================================================
    // AÑO
    // =================================================

    const año =
        resultado.first_publish_year
        ||
        "Año desconocido";


    // =================================================
    // ID OPEN LIBRARY
    // =================================================

    const clave =
        resultado.key
        ||
        "";


    const enlace =
        clave
            ? `https://openlibrary.org${clave}`
            : "https://openlibrary.org/";


    // =================================================
    // DEVOLVER
    // =================================================

    return {

        titulo:
            resultado.title ||
            "Sin título",

        autores:
            autores.length > 0
                ? autores
                : ["Autor desconocido"],

        año:
            año,

        portada:
            portada,

        enlace:
            enlace

    };

}


// =====================================================
// MOSTRAR LIBROS
// =====================================================

function mostrarLibros(
    libros
) {

    if (!librosPopulares) {

        return;

    }


    librosPopulares.innerHTML =
        "";


    libros.forEach(
        libro => {

            const tarjeta =
                document.createElement(
                    "article"
                );


            tarjeta.className =
                "libro-card";


            const autores =
                Array.isArray(
                    libro.autores
                )
                    ? libro.autores.join(
                        ", "
                    )
                    : "Autor desconocido";


            tarjeta.innerHTML = `

                <img
                    class="libro-portada"
                    src="${escaparHTML(
                        libro.portada
                    )}"
                    alt="${escaparHTML(
                        libro.titulo
                    )}"
                    loading="lazy"
                >


                <div class="libro-info">


                    <h3 class="libro-titulo">

                        ${escaparHTML(
                            libro.titulo
                        )}

                    </h3>


                    <p class="libro-autor">

                        ✍️
                        ${escaparHTML(
                            autores
                        )}

                    </p>


                    <p class="libro-genero">

                        📅
                        ${escaparHTML(
                            libro.año
                        )}

                    </p>


                    <a
                        class="libro-boton"
                        href="${escaparHTML(
                            libro.enlace
                        )}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >

                        📖 Ver libro

                    </a>


                </div>

            `;


            // =================================================
            // FALLBACK PORTADA
            // =================================================

            const imagen =
                tarjeta.querySelector(
                    ".libro-portada"
                );


            if (imagen) {

                imagen.addEventListener(
                    "error",
                    () => {

                        imagen.src =
                            IMAGEN_DEFAULT;

                    },
                    {
                        once: true
                    }
                );

            }


            librosPopulares.appendChild(
                tarjeta
            );

        }
    );

}


// =====================================================
// INICIAR
// =====================================================

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        cargarLibrosPopulares
    );

}

else {

    cargarLibrosPopulares();

}