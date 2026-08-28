// =====================================
// COMICVERSE AI
// SERVICIO DE LIBROS Y CÓMICS
// GOOGLE BOOKS + OPEN LIBRARY
// =====================================


// =====================================
// GOOGLE BOOKS
// =====================================

async function buscarGoogleBooks(busqueda) {

    // =================================
    // URL BASE
    // =================================

    let url =
        "https://www.googleapis.com/books/v1/volumes" +
        "?q=" +
        encodeURIComponent(busqueda) +
        "&maxResults=20";


    // =================================
    // API KEY OPCIONAL
    // =================================
    //
    // La clave permanece en el servidor.
    //
    // .env:
    //
    // GOOGLE_BOOKS_API_KEY=TU_CLAVE
    //
    // =================================

    if (
        process.env.GOOGLE_BOOKS_API_KEY
    ) {

        url +=
            "&key=" +
            encodeURIComponent(
                process.env.GOOGLE_BOOKS_API_KEY
            );

    }


    console.log(
        "📚 Consultando Google Books..."
    );


    // =================================
    // CONSULTAR GOOGLE BOOKS
    // =================================

    const respuesta =
        await fetch(url);


    // =================================
    // COMPROBAR RESPUESTA HTTP
    // =================================

    if (!respuesta.ok) {

        throw new Error(
            "Google Books HTTP " +
            respuesta.status
        );

    }


    // =================================
    // CONVERTIR JSON
    // =================================

    const datos =
        await respuesta.json();


    // =================================
    // SIN RESULTADOS
    // =================================

    if (
        !datos.items ||
        !Array.isArray(datos.items)
    ) {

        return [];

    }


    // =================================
    // TRANSFORMAR RESULTADOS
    // =================================

    return datos.items.map(
        libro => {

            const info =
                libro.volumeInfo || {};


            // =================================
            // IDENTIFICADORES
            // =================================

            const identificadores =
                Array.isArray(
                    info.industryIdentifiers
                )
                    ? info.industryIdentifiers
                    : [];


            const isbn13 =
                identificadores.find(
                    item =>
                        item.type ===
                        "ISBN_13"
                );


            const isbn10 =
                identificadores.find(
                    item =>
                        item.type ===
                        "ISBN_10"
                );


            // =================================
            // PORTADA
            // =================================

            let portada = "";


            if (
                info.imageLinks
            ) {

                portada =
                    info.imageLinks.thumbnail ||
                    info.imageLinks.smallThumbnail ||
                    "";

                portada =
                    portada.replace(
                        "http://",
                        "https://"
                    );

            }


            // =================================
            // ENLACE
            // =================================

            const enlace =
                info.infoLink ||
                info.previewLink ||
                "";


            // =================================
            // RESULTADO
            // =================================

            return {

                id:
                    libro.id || "",

                fuente:
                    "Google Books",

                titulo:
                    info.title ||
                    "Sin título",

                subtitulo:
                    info.subtitle ||
                    "",

                autores:
                    Array.isArray(
                        info.authors
                    )
                        ? info.authors
                        : [],

                descripcion:
                    info.description ||
                    "Sin descripción",

                genero:
                    info.categories?.[0] ||
                    "Sin género",

                categorias:
                    Array.isArray(
                        info.categories
                    )
                        ? info.categories
                        : [],

                fecha:
                    info.publishedDate ||
                    "",

                editorial:
                    info.publisher ||
                    "",

                isbn:
                    isbn13?.identifier ||
                    isbn10?.identifier ||
                    "",

                isbn13:
                    isbn13?.identifier ||
                    "",

                isbn10:
                    isbn10?.identifier ||
                    "",

                paginas:
                    info.pageCount ||
                    0,

                idioma:
                    info.language ||
                    "",

                portada:
                    portada,

                enlace:
                    enlace,

                preview:
                    info.previewLink ||
                    "",

                lectura:
                    info.accessInfo?.webReaderLink ||
                    "",

                textoDisponible:
                    info.accessInfo?.textToSpeechPermission ||
                    "",

                tipo:
                    info.printType ||
                    "BOOK",

                promedioValoracion:
                    info.averageRating ||
                    0,

                cantidadValoraciones:
                    info.ratingsCount ||
                    0

            };

        }
    );

}


// =====================================
// OPEN LIBRARY
// =====================================

async function buscarOpenLibrary(busqueda) {

    // =================================
    // URL
    // =================================

    const url =
        "https://openlibrary.org/search.json" +
        "?q=" +
        encodeURIComponent(busqueda) +
        "&limit=20";


    console.log(
        "📖 Consultando Open Library..."
    );


    // =================================
    // CONSULTAR OPEN LIBRARY
    // =================================

    const respuesta =
        await fetch(
            url,
            {

                headers: {

                    "User-Agent":
                        "ComicVerseAI/1.0"

                }

            }
        );


    // =================================
    // COMPROBAR HTTP
    // =================================

    if (!respuesta.ok) {

        throw new Error(
            "Open Library HTTP " +
            respuesta.status
        );

    }


    // =================================
    // JSON
    // =================================

    const datos =
        await respuesta.json();


    // =================================
    // SIN RESULTADOS
    // =================================

    if (
        !datos.docs ||
        !Array.isArray(
            datos.docs
        )
    ) {

        return [];

    }


    // =================================
    // TRANSFORMAR RESULTADOS
    // =================================

    return datos.docs.map(
        libro => {

            // =================================
            // PORTADA
            // =================================

            let portada = "";


            if (
                libro.cover_i
            ) {

                portada =
                    "https://covers.openlibrary.org/b/id/" +
                    libro.cover_i +
                    "-L.jpg";

            }


            // =================================
            // AUTORES
            // =================================

            const autores =
                Array.isArray(
                    libro.author_name
                )
                    ? libro.author_name
                    : [];


            // =================================
            // CATEGORÍAS
            // =================================

            const categorias =
                Array.isArray(
                    libro.subject
                )
                    ? libro.subject.slice(
                        0,
                        10
                    )
                    : [];


            // =================================
            // ENLACE
            // =================================

            const enlace =
                libro.key
                    ? "https://openlibrary.org" +
                      libro.key
                    : "";


            // =================================
            // RESULTADO
            // =================================

            return {

                id:
                    libro.key ||
                    "",

                fuente:
                    "Open Library",

                titulo:
                    libro.title ||
                    "Sin título",

                subtitulo:
                    "",

                autores:
                    autores,

                descripcion:
                    "Libro encontrado en Open Library.",

                genero:
                    categorias[0] ||
                    "Sin género",

                categorias:
                    categorias,

                fecha:
                    libro.first_publish_year ||
                    "",

                editorial:
                    Array.isArray(
                        libro.publisher
                    )
                        ? libro.publisher[0] ||
                          ""
                        : "",

                isbn:
                    Array.isArray(
                        libro.isbn
                    )
                        ? libro.isbn[0] ||
                          ""
                        : "",

                isbn13:
                    "",

                isbn10:
                    "",

                paginas:
                    libro.number_of_pages_median ||
                    0,

                idioma:
                    Array.isArray(
                        libro.language
                    )
                        ? libro.language[0] ||
                          ""
                        : "",

                portada:
                    portada,

                enlace:
                    enlace,

                preview:
                    enlace,

                lectura:
                    enlace,

                textoDisponible:
                    "",

                tipo:
                    "BOOK",

                promedioValoracion:
                    0,

                cantidadValoraciones:
                    0

            };

        }
    );

}


// =====================================
// ELIMINAR DUPLICADOS
// =====================================

function eliminarDuplicados(
    resultados
) {

    const vistos =
        new Set();


    const resultadoFinal =
        [];


    for (
        const libro of resultados
    ) {

        // =================================
        // CREAR CLAVE
        // =================================

        const titulo =
            String(
                libro.titulo || ""
            )
                .trim()
                .toLowerCase();


        const isbn =
            String(
                libro.isbn || ""
            )
                .trim()
                .toLowerCase();


        const clave =
            isbn
                ? "isbn:" + isbn
                : "titulo:" + titulo;


        // =================================
        // COMPROBAR
        // =================================

        if (
            !clave ||
            vistos.has(
                clave
            )
        ) {

            continue;

        }


        vistos.add(
            clave
        );


        resultadoFinal.push(
            libro
        );

    }


    return resultadoFinal;

}


// =====================================
// BUSCAR EN LAS DOS APIs
// =====================================

async function buscarLibros(
    busqueda
) {

    console.log(
        "🔎 BUSCANDO EN APIs:",
        busqueda
    );


    let resultados =
        [];


    // =================================
    // GOOGLE BOOKS
    // =================================

    try {

        const google =
            await buscarGoogleBooks(
                busqueda
            );


        console.log(
            "📚 Google Books:",
            google.length,
            "resultados"
        );


        resultados =
            resultados.concat(
                google
            );

    }

    catch (error) {

        console.error(
            "❌ ERROR GOOGLE BOOKS:",
            error.message
        );

    }


    // =================================
    // OPEN LIBRARY
    // =================================

    try {

        const openLibrary =
            await buscarOpenLibrary(
                busqueda
            );


        console.log(
            "📖 Open Library:",
            openLibrary.length,
            "resultados"
        );


        resultados =
            resultados.concat(
                openLibrary
            );

    }

    catch (error) {

        console.error(
            "❌ ERROR OPEN LIBRARY:",
            error.message
        );

    }


    // =================================
    // ELIMINAR DUPLICADOS
    // =================================

    resultados =
        eliminarDuplicados(
            resultados
        );


    console.log(
        "📚 TOTAL RESULTADOS:",
        resultados.length
    );


    // =================================
    // DEVOLVER RESULTADOS
    // =================================

    return resultados;

}


// =====================================
// LIBROS FAMOSOS / POPULARES
// =====================================
//
// Esta función nos servirá después
// para la página index.html.
//
// Ejemplo:
// buscarLibrosPopulares()
//
// =====================================

async function buscarLibrosPopulares() {

    const busquedas = [

        "bestsellers",

        "best selling books",

        "popular books"

    ];


    let resultados =
        [];


    // =================================
    // HACER VARIAS BÚSQUEDAS
    // =================================

    for (
        const busqueda of busquedas
    ) {

        try {

            const libros =
                await buscarGoogleBooks(
                    busqueda
                );


            resultados =
                resultados.concat(
                    libros
                );

        }

        catch (error) {

            console.error(
                "❌ ERROR LIBROS POPULARES:",
                error.message
            );

        }

    }


    // =================================
    // ELIMINAR DUPLICADOS
    // =================================

    resultados =
        eliminarDuplicados(
            resultados
        );


    // =================================
    // ORDENAR POR VALORACIÓN
    // =================================

    resultados.sort(
        (
            a,
            b
        ) => {

            const ratingA =
                Number(
                    a.promedioValoracion ||
                    0
                );


            const ratingB =
                Number(
                    b.promedioValoracion ||
                    0
                );


            return (
                ratingB -
                ratingA
            );

        }
    );


    // =================================
    // LIMITAR RESULTADOS
    // =================================

    return resultados.slice(
        0,
        20
    );

}


// =====================================
// EXPORTAR
// =====================================

module.exports = {

    buscarLibros,

    buscarLibrosPopulares

};