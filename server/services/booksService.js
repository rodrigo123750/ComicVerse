// =====================================
// COMICVERSE AI
// SERVICIO DE LIBROS Y CÓMICS
// GOOGLE BOOKS + OPEN LIBRARY
// =====================================


// =====================================
// GOOGLE BOOKS
// =====================================

async function buscarGoogleBooks(busqueda) {

    const url =
        "https://www.googleapis.com/books/v1/volumes" +
        "?q=" +
        encodeURIComponent(busqueda) +
        "&maxResults=20";


    const respuesta = await fetch(url);


    if (!respuesta.ok) {

        throw new Error(
            "Google Books HTTP " +
            respuesta.status
        );

    }


    const datos = await respuesta.json();


    if (!datos.items) {

        return [];

    }


    return datos.items.map(libro => {

        const info =
            libro.volumeInfo || {};


        const identificadores =
            info.industryIdentifiers || [];


        const isbn13 =
            identificadores.find(
                item => item.type === "ISBN_13"
            );


        const isbn10 =
            identificadores.find(
                item => item.type === "ISBN_10"
            );


        let portada = "";


        if (info.imageLinks) {

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


        return {

            id:
                libro.id || "",

            fuente:
                "Google Books",

            titulo:
                info.title || "Sin título",

            autores:
                info.authors || [],

            descripcion:
                info.description ||
                "Sin descripción",

            genero:
                info.categories?.[0] ||
                "Sin género",

            fecha:
                info.publishedDate || "",

            editorial:
                info.publisher || "",

            isbn:
                isbn13?.identifier ||
                isbn10?.identifier ||
                "",

            portada:
                portada,

            enlace:
                info.infoLink || ""

        };

    });

}


// =====================================
// OPEN LIBRARY
// =====================================

async function buscarOpenLibrary(busqueda) {

    const url =
        "https://openlibrary.org/search.json" +
        "?q=" +
        encodeURIComponent(busqueda) +
        "&limit=20";


    const respuesta = await fetch(
        url,
        {
            headers: {
                "User-Agent":
                    "ComicVerseAI/1.0"
            }
        }
    );


    if (!respuesta.ok) {

        throw new Error(
            "Open Library HTTP " +
            respuesta.status
        );

    }


    const datos =
        await respuesta.json();


    if (!datos.docs) {

        return [];

    }


    return datos.docs.map(libro => {

        let portada = "";


        if (libro.cover_i) {

            portada =
                "https://covers.openlibrary.org/b/id/" +
                libro.cover_i +
                "-L.jpg";

        }


        return {

            id:
                libro.key || "",

            fuente:
                "Open Library",

            titulo:
                libro.title || "Sin título",

            autores:
                libro.author_name || [],

            descripcion:
                "Libro encontrado en Open Library.",

            genero:
                libro.subject?.[0] ||
                "Sin género",

            fecha:
                libro.first_publish_year ||
                "",

            editorial:
                libro.publisher?.[0] ||
                "",

            isbn:
                libro.isbn?.[0] ||
                "",

            portada:
                portada,

            enlace:
                libro.key
                    ? "https://openlibrary.org" +
                      libro.key
                    : ""

        };

    });

}


// =====================================
// BUSCAR EN LAS DOS APIs
// =====================================

async function buscarLibros(busqueda) {

    console.log(
        "🔎 BUSCANDO EN APIs:",
        busqueda
    );


    let resultados = [];


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

    catch(error) {

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

    catch(error) {

        console.error(
            "❌ ERROR OPEN LIBRARY:",
            error.message
        );

    }


    return resultados;

}


// =====================================
// EXPORTAR
// =====================================

module.exports = {

    buscarLibros

};