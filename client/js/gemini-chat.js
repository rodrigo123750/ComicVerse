// =====================================
// COMICVERSE AI
// CHAT GEMINI
// CON HISTORIAL DE CONVERSACIÓN
// LÍMITE DE 20 PREGUNTAS
// =====================================


// =====================================
// ELEMENTOS
// =====================================

const chatMensajes =
    document.getElementById("chatMensajes");

const preguntaGemini =
    document.getElementById("preguntaGemini");

const btnGemini =
    document.getElementById("btnGemini");


// =====================================
// CONFIGURACIÓN
// =====================================

// Máximo de preguntas permitidas
// en una conversación.

const MAX_PREGUNTAS = 20;


// Número de preguntas que realmente
// fueron respondidas correctamente.

let preguntasRealizadas = 0;


// =====================================
// HISTORIAL DEL CHAT
// =====================================

const historialChat = [];


// =====================================
// COMPROBAR ELEMENTOS
// =====================================

if (
    !chatMensajes ||
    !preguntaGemini ||
    !btnGemini
) {

    console.error(
        "❌ No se encontraron los elementos del chat Gemini."
    );

}


// =====================================
// ENVIAR PREGUNTA
// =====================================

async function enviarPreguntaGemini() {


    // =================================
    // COMPROBAR LÍMITE DE PREGUNTAS
    // =================================

    if (
        preguntasRealizadas >= MAX_PREGUNTAS
    ) {

        agregarMensaje(

            "⚠️ Has alcanzado el límite de " +
            MAX_PREGUNTAS +
            " preguntas en esta conversación.",

            "ia"

        );

        return;

    }


    // =================================
    // OBTENER PREGUNTA
    // =================================

    const pregunta =
        preguntaGemini.value.trim();


    // =================================
    // PREGUNTA VACÍA
    // =================================

    if (!pregunta) {

        return;

    }


    // =================================
    // MOSTRAR MENSAJE DEL USUARIO
    // =================================

    agregarMensaje(
        pregunta,
        "usuario"
    );


    // =================================
    // GUARDAR PREGUNTA EN HISTORIAL
    // =================================

    historialChat.push({

        rol: "user",

        texto: pregunta

    });


    // =================================
    // LIMPIAR INPUT
    // =================================

    preguntaGemini.value = "";


    // =================================
    // DESACTIVAR BOTÓN
    // =================================

    btnGemini.disabled = true;


    // =================================
    // MOSTRAR CARGANDO
    // =================================

    const cargando =
        document.createElement("div");


    cargando.className =
        "mensaje ia chat-cargando";


    cargando.id =
        "geminiCargando";


    cargando.innerHTML = `

        <strong>
            🤖 ComicVerse AI
        </strong>

        <p>
            ....... 🤔
        </p>

        <small>
            Pregunta ${
                preguntasRealizadas + 1
            } de ${MAX_PREGUNTAS}
        </small>

    `;


    chatMensajes.appendChild(
        cargando
    );


    desplazarChat();


    // =====================================
    // VARIABLES DE PETICIÓN
    // =====================================

    let datos = null;

    let ultimoError = null;


    try {


        // =================================
        // 3 INTENTOS
        // =================================

        for (
            let intento = 1;
            intento <= 3;
            intento++
        ) {


            try {

                console.log(
                    `🤖 Intento ${intento}/3`
                );


                console.log(
                    `💬 Pregunta ${
                        preguntasRealizadas + 1
                    }/${MAX_PREGUNTAS}`
                );


                // =================================
                // CONSULTAR SERVIDOR
                // =================================

                const respuesta =
                    await fetch(

                        "/api/gemini/preguntar",

                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json; charset=utf-8"

                            },

                            body: JSON.stringify({

                                pregunta:
                                    pregunta,

                                historial:
                                    historialChat

                            })

                        }

                    );


                // =================================
                // LEER RESPUESTA
                // =================================

                const textoRespuesta =
                    await respuesta.text();


                console.log(
                    "📡 HTTP:",
                    respuesta.status
                );


                console.log(
                    "📦 RESPUESTA SERVIDOR:",
                    textoRespuesta
                );


                // =================================
                // CONVERTIR JSON
                // =================================

                let json;


                try {

                    json =
                        JSON.parse(
                            textoRespuesta
                        );

                }

                catch (errorJSON) {

                    throw new Error(

                        "El servidor no devolvió " +
                        "JSON válido."

                    );

                }


                // =================================
                // COMPROBAR HTTP
                // =================================

                if (
                    !respuesta.ok
                ) {

                    throw new Error(

                        json?.error ||
                        `Error HTTP ${respuesta.status}`

                    );

                }


                // =================================
                // COMPROBAR RESPUESTA
                // =================================

                if (

                    !json ||

                    !json.ok ||

                    !json.respuesta

                ) {

                    throw new Error(

                        json?.error ||

                        "Gemini no devolvió " +
                        "una respuesta."

                    );

                }


                // =================================
                // RESPUESTA CORRECTA
                // =================================

                datos = json;


                console.log(
                    "✅ GEMINI RESPONDIÓ CORRECTAMENTE."
                );


                // =================================
                // SALIR DEL BUCLE
                // =================================

                break;

            }


            catch (error) {


                ultimoError =
                    error;


                console.error(

                    `❌ ERROR INTENTO ${intento}:`,

                    error

                );


                // =================================
                // REINTENTAR
                // =================================

                if (
                    intento < 3
                ) {

                    console.log(
                        "⏳ Reintentando..."
                    );


                    await new Promise(

                        resolve =>

                            setTimeout(

                                resolve,

                                1200

                            )

                    );

                }

            }

        }


        // =================================
        // COMPROBAR SI FALLARON LOS 3
        // =================================

        if (!datos) {

            throw (

                ultimoError ||

                new Error(

                    "No se pudo obtener " +
                    "respuesta de Gemini."

                )

            );

        }


        // =================================
        // QUITAR CARGANDO
        // =================================

        const elementoCargando =
            document.getElementById(
                "geminiCargando"
            );


        if (
            elementoCargando
        ) {

            elementoCargando.remove();

        }


        // =================================
        // CONTAR PREGUNTA
        // =================================

        preguntasRealizadas++;


        console.log(

            `📊 Preguntas utilizadas: ` +

            `${preguntasRealizadas}/` +

            `${MAX_PREGUNTAS}`

        );


        // =================================
        // GUARDAR RESPUESTA EN HISTORIAL
        // =================================

        historialChat.push({

            rol: "model",

            texto:
                datos.respuesta

        });


        // =================================
        // MOSTRAR RESPUESTA
        // =================================

        agregarMensaje(

            datos.respuesta,

            "ia"

        );


        // =================================
        // COMPROBAR SI LLEGÓ A 20
        // =================================

        if (
            preguntasRealizadas >=
            MAX_PREGUNTAS
        ) {

            agregarMensaje(

                "🎉 Has utilizado tus " +
                MAX_PREGUNTAS +
                " preguntas disponibles " +
                "en esta conversación.",

                "ia"

            );


            preguntaGemini.disabled = true;

            btnGemini.disabled = true;


            preguntaGemini.placeholder =
                "Límite de 20 preguntas alcanzado";

        }


    }


    // =================================
    // ERROR GENERAL
    // =================================

    catch (error) {


        console.error(
            "❌ ERROR CHAT GEMINI:",
            error
        );


        // =================================
        // QUITAR CARGANDO
        // =================================

        const elementoCargando =
            document.getElementById(
                "geminiCargando"
            );


        if (
            elementoCargando
        ) {

            elementoCargando.remove();

        }


        // =================================
        // QUITAR PREGUNTA DEL HISTORIAL
        // =================================
        // Como la pregunta falló después
        // de los 3 intentos, la eliminamos
        // para que no quede como una
        // pregunta respondida.

        if (
            historialChat.length > 0
        ) {

            const ultimo =
                historialChat[
                    historialChat.length - 1
                ];


            if (

                ultimo.rol === "user" &&

                ultimo.texto === pregunta

            ) {

                historialChat.pop();

            }

        }


        // =================================
        // OBTENER MENSAJE DE ERROR
        // =================================

        let mensajeError =

            "Lo siento 😔, no pude " +
            "conectarme con ComicVerse AI.";


        // =================================
        // ERROR DE CONEXIÓN
        // =================================

        if (
            error?.message
        ) {

            const mensaje =
                error.message.toLowerCase();


            if (

                mensaje.includes(
                    "failed to fetch"
                ) ||

                mensaje.includes(
                    "networkerror"
                ) ||

                mensaje.includes(
                    "fetch"
                )

            ) {

                mensajeError =

                    "🌐 No se pudo conectar " +
                    "con el servidor de " +
                    "ComicVerse AI. " +
                    "Comprueba tu conexión " +
                    "a Internet e inténtalo " +
                    "nuevamente.";

            }

        }


        // =================================
        // MOSTRAR ERROR
        // =================================

        agregarMensaje(

            mensajeError,

            "ia"

        );

    }


    // =================================
    // FINALMENTE
    // =================================

    finally {


        // =================================
        // SI NO LLEGÓ A 20
        // =================================

        if (
            preguntasRealizadas <
            MAX_PREGUNTAS
        ) {

            btnGemini.disabled =
                false;

            preguntaGemini.disabled =
                false;

            preguntaGemini.focus();

        }


        // =================================
        // DESPLAZAR CHAT
        // =================================

        desplazarChat();

    }

}


// =====================================
// AGREGAR MENSAJE
// =====================================

function agregarMensaje(
    texto,
    tipo
) {


    const mensaje =
        document.createElement("div");


    mensaje.className =
        `mensaje ${tipo}`;


    // =================================
    // QUITAR ASTERISCOS DE RESPUESTAS IA
    // =================================

    if (
        tipo === "ia"
    ) {

        texto =
            String(texto)
                .replace(/\*/g, "");

    }


    // =================================
    // MENSAJE IA
    // =================================

    if (
        tipo === "ia"
    ) {

        mensaje.innerHTML = `

            <strong>
                🤖 ComicVerse AI
            </strong>

            <p>
                ${escaparHTML(texto)}
            </p>

        `;

    }


    // =================================
    // MENSAJE USUARIO
    // =================================

    else {

        mensaje.innerHTML = `

            <strong>
                👤 Tú
            </strong>

            <p>
                ${escaparHTML(texto)}
            </p>

        `;

    }


    // =================================
    // AÑADIR AL CHAT
    // =================================

    chatMensajes.appendChild(
        mensaje
    );


    // =================================
    // DESPLAZAR CHAT
    // =================================

    desplazarChat();

}


// =====================================
// DESPLAZAR CHAT
// =====================================

function desplazarChat() {

    chatMensajes.scrollTop =
        chatMensajes.scrollHeight;

}


// =====================================
// ESCAPAR HTML
// =====================================

function escaparHTML(
    texto
) {


    const elemento =
        document.createElement("div");


    elemento.textContent =
        String(texto);


    return elemento.innerHTML;

}


// =====================================
// BOTÓN ENVIAR
// =====================================

if (
    btnGemini
) {

    btnGemini.addEventListener(

        "click",

        enviarPreguntaGemini

    );

}


// =====================================
// ENTER PARA ENVIAR
// =====================================

if (
    preguntaGemini
) {

    preguntaGemini.addEventListener(

        "keydown",

        event => {


            if (

                event.key === "Enter" &&

                !event.shiftKey

            ) {

                event.preventDefault();


                enviarPreguntaGemini();

            }

        }

    );

}


// =====================================
// MOSTRAR CONTADOR EN CONSOLA
// =====================================

console.log(

    `🤖 ComicVerse AI listo. ` +
    `Máximo ${MAX_PREGUNTAS} preguntas ` +
    `por conversación.`

);