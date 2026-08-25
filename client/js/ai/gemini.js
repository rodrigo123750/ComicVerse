// =====================================
// COMICVERSE AI
// CHAT FRONTEND
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    // =================================
    // CREAR INTERFAZ DEL CHAT
    // =================================

    const chatHTML = `
        <div id="comicverseAI">

            <button
                id="aiToggle"
                class="ai-toggle"
                type="button"
                aria-label="Abrir ComicVerse AI"
            >
                🤖
            </button>

            <div
                id="aiChat"
                class="ai-chat"
                aria-hidden="true"
            >

                <div class="ai-header">

                    <div>
                        <strong>🤖 ComicVerse AI</strong>
                        <span>Asistente de cómics</span>
                    </div>

                    <button
                        id="aiCerrar"
                        type="button"
                        aria-label="Cerrar chat"
                    >
                        ✕
                    </button>

                </div>


                <div
                    id="aiMensajes"
                    class="ai-mensajes"
                >

                    <div class="ai-mensaje ai">
                        <div class="ai-avatar">
                            🤖
                        </div>

                        <div class="ai-burbuja">
                            ¡Hola! 👋 Soy ComicVerse AI.
                            <br><br>
                            Puedo ayudarte a buscar cómics,
                            recomendar historias o responder
                            preguntas sobre personajes.
                        </div>
                    </div>

                </div>


                <div
                    id="aiEscribiendo"
                    class="ai-escribiendo"
                    hidden
                >
                    🤖 ComicVerse AI está pensando...
                </div>


                <form
                    id="aiFormulario"
                    class="ai-formulario"
                >

                    <input
                        id="aiInput"
                        type="text"
                        placeholder="Escribe tu pregunta..."
                        autocomplete="off"
                        maxlength="1000"
                    >

                    <button
                        id="aiEnviar"
                        type="submit"
                    >
                        ➤
                    </button>

                </form>

            </div>

        </div>
    `;


    document.body.insertAdjacentHTML(
        "beforeend",
        chatHTML
    );


    // =================================
    // ELEMENTOS
    // =================================

    const toggle =
        document.getElementById("aiToggle");

    const chat =
        document.getElementById("aiChat");

    const cerrar =
        document.getElementById("aiCerrar");

    const mensajes =
        document.getElementById("aiMensajes");

    const formulario =
        document.getElementById("aiFormulario");

    const input =
        document.getElementById("aiInput");

    const escribiendo =
        document.getElementById("aiEscribiendo");

    const enviar =
        document.getElementById("aiEnviar");


    // =================================
    // ABRIR CHAT
    // =================================

    toggle.addEventListener(
        "click",
        () => {

            chat.classList.toggle("abierto");

            const abierto =
                chat.classList.contains("abierto");

            chat.setAttribute(
                "aria-hidden",
                String(!abierto)
            );

            if (abierto) {
                input.focus();
            }

        }
    );


    // =================================
    // CERRAR CHAT
    // =================================

    cerrar.addEventListener(
        "click",
        () => {

            chat.classList.remove(
                "abierto"
            );

            chat.setAttribute(
                "aria-hidden",
                "true"
            );

        }
    );


    // =================================
    // ENVIAR MENSAJE
    // =================================

    formulario.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const pregunta =
                input.value.trim();


            if (!pregunta) {
                return;
            }


            // -----------------------------
            // MOSTRAR MENSAJE DEL USUARIO
            // -----------------------------

            agregarMensaje(
                pregunta,
                "usuario"
            );


            input.value = "";

            input.disabled = true;

            enviar.disabled = true;


            // -----------------------------
            // MOSTRAR CARGANDO
            // -----------------------------

            escribiendo.hidden = false;

            desplazarAbajo();


            try {

                // =========================
                // OBTENER CÓMIC ACTUAL
                // =========================

                const comic =
                    obtenerComicActual();


                // =========================
                // ENVIAR AL SERVIDOR
                // =========================

                const respuesta =
                    await fetch(
                        "/api/gemini/preguntar",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                pregunta: pregunta,

                                comic: comic

                            })

                        }
                    );


                // =========================
                // COMPROBAR RESPUESTA HTTP
                // =========================

                if (!respuesta.ok) {

                    throw new Error(
                        `Error HTTP ${respuesta.status}`
                    );

                }


                const datos =
                    await respuesta.json();


                // =========================
                // COMPROBAR API
                // =========================

                if (
                    !datos.ok ||
                    !datos.respuesta
                ) {

                    throw new Error(
                        datos.error ||
                        "Gemini no devolvió una respuesta."
                    );

                }


                // =========================
                // MOSTRAR RESPUESTA
                // =========================

                agregarMensaje(
                    datos.respuesta,
                    "ai"
                );


            }

            catch (error) {

                console.error(
                    "❌ ERROR CHAT GEMINI:",
                    error
                );


                agregarMensaje(
                    "Lo siento 😔, no pude conectarme con ComicVerse AI. Intenta nuevamente.",
                    "ai"
                );

            }

            finally {

                escribiendo.hidden = true;

                input.disabled = false;

                enviar.disabled = false;

                input.focus();

                desplazarAbajo();

            }

        }
    );


    // =================================
    // AGREGAR MENSAJE
    // =================================

    function agregarMensaje(
        texto,
        tipo
    ) {

        const mensaje =
            document.createElement("div");


        mensaje.className =
            `ai-mensaje ${tipo}`;


        const avatar =
            document.createElement("div");


        avatar.className =
            "ai-avatar";


        avatar.textContent =
            tipo === "usuario"
                ? "👤"
                : "🤖";


        const burbuja =
            document.createElement("div");


        burbuja.className =
            "ai-burbuja";


        // ---------------------------------
        // SEGURIDAD
        // ---------------------------------

        burbuja.textContent =
            String(texto);


        mensaje.appendChild(
            avatar
        );


        mensaje.appendChild(
            burbuja
        );


        mensajes.appendChild(
            mensaje
        );


        desplazarAbajo();

    }


    // =================================
    // OBTENER CÓMIC ACTUAL
    // =================================

    function obtenerComicActual() {

        /*
         * Intentamos obtener información
         * de un cómic si la página actual
         * la tiene disponible.
         */

        const titulo =
            document.querySelector(
                "[data-comic-titulo]"
            );

        const genero =
            document.querySelector(
                "[data-comic-genero]"
            );

        const descripcion =
            document.querySelector(
                "[data-comic-descripcion]"
            );

        const autor =
            document.querySelector(
                "[data-comic-autor]"
            );


        // Si la página no tiene
        // información de cómic,
        // simplemente no enviamos datos.

        if (
            !titulo &&
            !genero &&
            !descripcion &&
            !autor
        ) {

            return null;

        }


        return {

            titulo:
                titulo?.textContent?.trim() ||
                "",

            genero:
                genero?.textContent?.trim() ||
                "",

            descripcion:
                descripcion?.textContent?.trim() ||
                "",

            autor:
                autor?.textContent?.trim() ||
                ""

        };

    }


    // =================================
    // DESPLAZAR CHAT
    // =================================

    function desplazarAbajo() {

        mensajes.scrollTop =
            mensajes.scrollHeight;

    }


});