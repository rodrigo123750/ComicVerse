// =====================================
// COMICVERSE AI
// BIBLIOTECA
// =====================================


// =====================================
// ELEMENTOS
// =====================================

const buscador =
    document.getElementById("buscadorBiblioteca");

const btnBuscar =
    document.getElementById("btnBuscar");

const resultados =
    document.getElementById("resultadosBiblioteca");

const estado =
    document.getElementById("estadoBusqueda");

const contador =
    document.getElementById("contadorResultados");

const filtros =
    document.querySelectorAll(".filtro");


// =====================================
// VARIABLES
// =====================================

let todosLosLibros = [];

let filtroActual = "todos";


// =====================================
// BUSCAR LIBROS
// =====================================

async function buscarLibros() {

    const texto =
        buscador.value.trim();


    // ---------------------------------
    // COMPROBAR BÚSQUEDA VACÍA
    // ---------------------------------

    if (!texto) {

        estado.innerHTML = `
            <p>
                🔎 Escribe algo para comenzar
                una búsqueda.
            </p>
        `;

        resultados.innerHTML = "";

        contador.innerHTML = "";

        return;

    }


    // ---------------------------------
    // MOSTRAR CARGANDO
    // ---------------------------------

    estado.innerHTML = `
        <p>
            🔄 Buscando
            <strong>${escaparHTML(texto)}</strong>...
        </p>
    `;

    resultados.innerHTML = "";

    contador.innerHTML = "";


    try {

        // ---------------------------------
        // CONSULTAR NUESTRO SERVIDOR
        // ---------------------------------

        const respuesta =
            await fetch(
                `/api/books/buscar?q=${encodeURIComponent(texto)}`
            );


        if (!respuesta.ok) {

            throw new Error(
                "Error en la API de libros."
            );

        }


        const datos =
            await respuesta.json();


        console.log(
            "📚 RESULTADOS:",
            datos
        );


        // ---------------------------------
        // GUARDAR RESULTADOS
        // ---------------------------------

        todosLosLibros =
            datos.resultados || [];


        // ---------------------------------
        // COMPROBAR RESULTADOS
        // ---------------------------------

        if (!todosLosLibros.length) {

            estado.innerHTML = `
                <p>
                    😕 No encontramos resultados
                    para
                    <strong>
                        ${escaparHTML(texto)}
                    </strong>.
                </p>
            `;

            contador.innerHTML = "";

            resultados.innerHTML = "";

            return;

        }


        estado.innerHTML = `
            <p>
                ✅ Resultados encontrados para
                <strong>
                    ${escaparHTML(texto)}
                </strong>
            </p>
        `;


        mostrarResultados();


    }

    catch (error) {

        console.error(
            "❌ ERROR BIBLIOTECA:",
            error
        );


        estado.innerHTML = `
            <p>
                ❌ No se pudieron obtener
                los resultados.
            </p>
        `;


        resultados.innerHTML = "";

        contador.innerHTML = "";

    }

}


// =====================================
// MOSTRAR RESULTADOS
// =====================================

function mostrarResultados() {

    resultados.innerHTML = "";


    // ---------------------------------
    // APLICAR FILTRO
    // ---------------------------------

    let librosFiltrados =
        todosLosLibros;


    if (filtroActual !== "todos") {

        librosFiltrados =
            todosLosLibros.filter(
                libro =>
                    libro.fuente === filtroActual
            );

    }


    // ---------------------------------
    // CONTADOR
    // ---------------------------------

    contador.innerHTML = `
        <p>
            📚
            <strong>
                ${librosFiltrados.length}
            </strong>
            resultados encontrados
        </p>
    `;


    // ---------------------------------
    // SIN RESULTADOS
    // ---------------------------------

    if (!librosFiltrados.length) {

        resultados.innerHTML = `
            <div class="sin-resultados">

                <h2>
                    😕 Sin resultados
                </h2>

                <p>
                    No encontramos libros
                    de esta fuente.
                </p>

            </div>
        `;

        return;

    }


    // ---------------------------------
    // CREAR TARJETAS
    // ---------------------------------

    librosFiltrados.forEach(
        libro => {

            const tarjeta =
                document.createElement("article");


            tarjeta.className =
                "libro-card";


            // -----------------------------
            // AUTORES
            // -----------------------------

            const autores =
                libro.autores &&
                libro.autores.length
                    ? libro.autores.join(", ")
                    : "Autor desconocido";


            // -----------------------------
            // PORTADA
            // -----------------------------

            const portada =
                libro.portada ||
                "img/portada/default-book.jpg";


            // -----------------------------
            // DATOS
            // -----------------------------

            tarjeta.innerHTML = `

                <div class="libro-portada">

                    <img
                        src="${escaparHTML(portada)}"
                        alt="${escaparHTML(
                            libro.titulo ||
                            "Libro"
                        )}"
                        onerror="
                            this.src='img/portada/default-book.jpg'
                        "
                    >

                </div>


                <div class="libro-info">

                    <span class="fuente">

                        ${escaparHTML(
                            libro.fuente ||
                            "Biblioteca"
                        )}

                    </span>


                    <h2>

                        ${escaparHTML(
                            libro.titulo ||
                            "Sin título"
                        )}

                    </h2>


                    <p>

                        👤
                        ${escaparHTML(
                            autores
                        )}

                    </p>


                    <p>

                        📅
                        ${libro.fecha ||
                        "Fecha desconocida"}

                    </p>


                    <p>

                        📚
                        ${escaparHTML(
                            libro.genero ||
                            "Sin género"
                        )}

                    </p>


                    <button
                        class="btn-leer"
                        data-id="${escaparHTML(
                            libro.id || ""
                        )}"
                    >

                        📖 Leer en ComicVerse

                    </button>

                </div>

            `;


            resultados.appendChild(
                tarjeta
            );

        }
    );


    // =================================
    // BOTONES LEER
    // =================================

    const botones =
        resultados.querySelectorAll(
            ".btn-leer"
        );


    botones.forEach(
        boton => {

            boton.addEventListener(
                "click",
                () => {

                    const id =
                        boton.dataset.id;


                    if (!id) {

                        alert(
                            "Este libro no tiene un identificador disponible."
                        );

                        return;

                    }


                    // -------------------------
                    // BUSCAR LIBRO
                    // -------------------------

                    const libro =
                        todosLosLibros.find(
                            elemento =>
                                elemento.id === id
                        );


                    if (!libro) {

                        alert(
                            "No se pudo encontrar la información del libro."
                        );

                        return;

                    }


                    // -------------------------
                    // GUARDAR LIBRO
                    // -------------------------

                    try {

                        sessionStorage.setItem(
                            "comicverseLibro",
                            JSON.stringify(libro)
                        );

                    }

                    catch (error) {

                        console.error(
                            "❌ No se pudo guardar el libro:",
                            error
                        );

                    }


                    // -------------------------
                    // ABRIR LECTOR INTERNO
                    // -------------------------

                    window.location.href =
                        `lector-libro.html?id=${encodeURIComponent(id)}`;

                }
            );

        }
    );

}


// =====================================
// FILTROS
// =====================================

filtros.forEach(
    filtro => {

        filtro.addEventListener(
            "click",
            () => {

                // -------------------------
                // QUITAR ACTIVO
                // -------------------------

                filtros.forEach(
                    elemento =>
                        elemento.classList.remove(
                            "activo"
                        )
                );


                // -------------------------
                // ACTIVAR ACTUAL
                // -------------------------

                filtro.classList.add(
                    "activo"
                );


                // -------------------------
                // GUARDAR FILTRO
                // -------------------------

                filtroActual =
                    filtro.dataset.fuente;


                // -------------------------
                // MOSTRAR
                // -------------------------

                if (
                    todosLosLibros.length
                ) {

                    mostrarResultados();

                }

            }
        );

    }
);


// =====================================
// BOTÓN BUSCAR
// =====================================

if (btnBuscar) {

    btnBuscar.addEventListener(
        "click",
        buscarLibros
    );

}


// =====================================
// BUSCAR CON ENTER
// =====================================

if (buscador) {

    buscador.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                buscarLibros();

            }

        }
    );

}


// =====================================
// PROTECCIÓN HTML
// =====================================

function escaparHTML(texto) {

    const elemento =
        document.createElement("div");

    elemento.textContent =
        String(texto);

    return elemento.innerHTML;

}