// =========================================================
// COMICVERSE AI - CHAT GEMINI
// Ventana flotante exclusiva del chat
// No modifica las demás IAs del proyecto
// =========================================================


// =========================================================
// ELEMENTOS EXCLUSIVOS DE ESTA VENTANA
// =========================================================

const btnAbrirGemini =
    document.getElementById("btnAbrirGemini");

const geminiVentana =
    document.getElementById("geminiVentana");

const btnCerrarGemini =
    document.getElementById("btnCerrarGemini");

const geminiMensajes =
    document.getElementById("geminiMensajesFlotante");

const geminiForm =
    document.getElementById("geminiFormFlotante");

const preguntaGemini =
    document.getElementById("preguntaGeminiFlotante");

const btnGemini =
    document.getElementById("btnGeminiFlotante");


// =========================================================
// CONFIGURACIÓN
// =========================================================

const MAX_PREGUNTAS =
    20;

let historialChatGemini = [];

let cantidadPreguntas =
    0;

let procesandoPregunta =
    false;


// =========================================================
// COMPROBAR ELEMENTOS
// =========================================================

// Si por alguna razón este HTML no está presente,
// el archivo simplemente no hace nada.
//
// Esto evita errores si otro archivo utiliza
// una página diferente.

if (
    btnAbrirGemini &&
    geminiVentana &&
    btnCerrarGemini &&
    geminiMensajes &&
    geminiForm &&
    preguntaGemini &&
    btnGemini
) {

    iniciarGeminiFlotante();

}


// =========================================================
// INICIAR
// =========================================================

function iniciarGeminiFlotante() {

    // -----------------------------------------------------
    // ABRIR
    // -----------------------------------------------------

    btnAbrirGemini.addEventListener(
        "click",
        abrirGemini
    );


    // -----------------------------------------------------
    // CERRAR
    // -----------------------------------------------------

    btnCerrarGemini.addEventListener(
        "click",
        cerrarGemini
    );


    // -----------------------------------------------------
    // FORMULARIO
    // -----------------------------------------------------

    geminiForm.addEventListener(
        "submit",
        async evento => {

            evento.preventDefault();

            await enviarPreguntaGemini();

        }
    );


    // -----------------------------------------------------
    // ESCAPE PARA CERRAR
    // -----------------------------------------------------

    document.addEventListener(
        "keydown",
        evento => {

            if (
                evento.key === "Escape" &&
                !geminiVentana.classList.contains(
                    "oculto"
                )
            ) {

                cerrarGemini();

            }

        }
    );

}


// =========================================================
// ABRIR VENTANA
// =========================================================

function abrirGemini() {

    geminiVentana.classList.remove(
        "oculto"
    );

    preguntaGemini.focus();

    desplazarGeminiAlFinal();

}


// =========================================================
// CERRAR VENTANA
// =========================================================

function cerrarGemini() {

    geminiVentana.classList.add(
        "oculto"
    );

}


// =========================================================
// ENVIAR PREGUNTA
// =========================================================

async function enviarPreguntaGemini() {

    if (procesandoPregunta) {
        return;
    }


    const pregunta =
        preguntaGemini.value.trim();


    // -----------------------------------------------------
    // VALIDAR TEXTO
    // -----------------------------------------------------

    if (!pregunta) {

        preguntaGemini.focus();

        return;
    }


    // -----------------------------------------------------
    // LÍMITE
    // -----------------------------------------------------

    if (
        cantidadPreguntas >=
        MAX_PREGUNTAS
    ) {

        mostrarLimiteGemini();

        return;
    }


    procesandoPregunta =
        true;

    btnGemini.disabled =
        true;

    preguntaGemini.disabled =
        true;


    // -----------------------------------------------------
    // MOSTRAR PREGUNTA DEL USUARIO
    // -----------------------------------------------------

    agregarMensajeGemini(
        pregunta,
        "usuario"
    );


    preguntaGemini.value =
        "";


    // -----------------------------------------------------
    // INDICADOR
    // -----------------------------------------------------

    const indicador =
        agregarIndicadorGemini();


    try {

        const respuesta =
            await preguntarAlBackend(
                pregunta
            );


        indicador.remove();


        agregarMensajeGemini(
            respuesta,
            "ia"
        );


        cantidadPreguntas++;


        historialChatGemini.push({

            rol: "user",

            texto: pregunta

        });


        historialChatGemini.push({

            rol: "model",

            texto: respuesta

        });


        // -------------------------------------------------
        // MOSTRAR CONTADOR
        // -------------------------------------------------

        actualizarContadorGemini();


    } catch (error) {

        console.error(
            "Error con ComicVerse AI:",
            error
        );


        indicador.remove();


        agregarMensajeGemini(
            "⚠️ No pude responder en este momento. Intenta nuevamente.",
            "ia"
        );

    } finally {

        procesandoPregunta =
            false;

        btnGemini.disabled =
            false;

        preguntaGemini.disabled =
            false;

        preguntaGemini.focus();

    }

}


// =========================================================
// PETICIÓN AL BACKEND
// =========================================================

async function preguntarAlBackend(
    pregunta
) {

    let ultimoError =
        null;


    // -----------------------------------------------------
    // HASTA 3 INTENTOS
    // -----------------------------------------------------

    for (
        let intento = 1;
        intento <= 3;
        intento++
    ) {

        try {

            const respuesta =
                await fetch(
                    "/api/gemini/preguntar",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({

                                pregunta,

                                historial:
                                    historialChatGemini

                            })

                    }
                );


            // ------------------------------------------------
            // ERROR HTTP
            // ------------------------------------------------

            if (!respuesta.ok) {

                let mensajeError =
                    `Error HTTP ${respuesta.status}`;

                try {

                    const errorData =
                        await respuesta.json();

                    if (
                        errorData?.error
                    ) {

                        mensajeError =
                            errorData.error;

                    }

                } catch {

                    // No hay JSON de error.
                }


                throw new Error(
                    mensajeError
                );
            }


            const datos =
                await respuesta.json();


            // ------------------------------------------------
            // EXTRAER RESPUESTA
            // ------------------------------------------------

            const texto =
                datos.respuesta ||
                datos.texto ||
                datos.mensaje ||
                datos.response;


            if (!texto) {

                throw new Error(
                    "El servidor no devolvió una respuesta válida."
                );
            }


            return String(
                texto
            );


        } catch (error) {

            ultimoError =
                error;

            console.warn(
                `Intento ${intento}/3 fallido:`,
                error
            );


            // ------------------------------------------------
            // ESPERAR ANTES DE REINTENTAR
            // ------------------------------------------------

            if (
                intento <
                3
            ) {

                await esperar(
                    1200
                );

            }

        }

    }


    throw (
        ultimoError ||
        new Error(
            "No se pudo conectar con ComicVerse AI."
        )
    );

}


// =========================================================
// AGREGAR MENSAJE
// =========================================================

function agregarMensajeGemini(
    texto,
    tipo
) {

    const burbuja =
        document.createElement(
            "div"
        );

    burbuja.className =
        `gemini-burbuja ${tipo}`;


    // -----------------------------------------------------
    // TEXTO SEGURO
    // -----------------------------------------------------

    burbuja.innerHTML =
        escaparHTMLGemini(
            texto
        ).replace(
            /\n/g,
            "<br>"
        );


    geminiMensajes.appendChild(
        burbuja
    );


    desplazarGeminiAlFinal();


    return burbuja;
}


// =========================================================
// INDICADOR "PENSANDO"
// =========================================================

function agregarIndicadorGemini() {

    const indicador =
        document.createElement(
            "div"
        );

    indicador.className =
        "gemini-burbuja ia";

    indicador.innerHTML =
        "🤖 Pensando...";


    geminiMensajes.appendChild(
        indicador
    );


    desplazarGeminiAlFinal();


    return indicador;
}


// =========================================================
// CONTADOR
// =========================================================

function actualizarContadorGemini() {

    let contador =
        document.getElementById(
            "contadorGeminiFlotante"
        );


    if (!contador) {

        contador =
            document.createElement(
                "div"
            );

        contador.id =
            "contadorGeminiFlotante";


        contador.style.cssText = `
            text-align: center;
            padding: 6px 10px;
            color: #6f9abb;
            font-size: 0.68rem;
            border-top: 1px solid rgba(0,157,255,.12);
            background: rgba(3,14,28,.7);
        `;


        geminiVentana.insertBefore(
            contador,
            geminiForm
        );

    }


    contador.textContent =
        `${cantidadPreguntas}/${MAX_PREGUNTAS} preguntas utilizadas`;
}


// =========================================================
// MENSAJE DE LÍMITE
// =========================================================

function mostrarLimiteGemini() {

    const yaExiste =
        document.getElementById(
            "limiteGeminiFlotante"
        );


    if (yaExiste) {
        return;
    }


    const mensaje =
        document.createElement(
            "div"
        );

    mensaje.id =
        "limiteGeminiFlotante";

    mensaje.className =
        "gemini-burbuja ia";

    mensaje.textContent =
        "✨ Has llegado al límite de 20 preguntas de esta conversación.";


    geminiMensajes.appendChild(
        mensaje
    );


    desplazarGeminiAlFinal();

}


// =========================================================
// ESCAPAR HTML
// =========================================================

function escaparHTMLGemini(
    texto = ""
) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        String(texto);

    return div.innerHTML;
}


// =========================================================
// SCROLL
// =========================================================

function desplazarGeminiAlFinal() {

    requestAnimationFrame(
        () => {

            geminiMensajes.scrollTop =
                geminiMensajes.scrollHeight;

        }
    );

}


// =========================================================
// ESPERAR
// =========================================================

function esperar(
    milisegundos
) {

    return new Promise(
        resolver => {

            setTimeout(
                resolver,
                milisegundos
            );

        }
    );

}