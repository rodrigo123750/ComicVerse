// =====================================
// COMICVERSE AI
// CHAT GEMINI
// CON HISTORIAL DE CONVERSACIÓN
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

    `;


    chatMensajes.appendChild(
        cargando
    );


    desplazarChat();


    try {

        // =================================
        // VARIABLES
        // =================================

        let datos = null;

        let ultimoError = null;


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


                // =================================
                // CONSULTAR SERVIDOR
                // =================================

                const respuesta =
                    await fetch(
                        "http://localhost:3000/api/gemini/preguntar",
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
                        "El servidor no devolvió JSON válido."
                    );

                }


                // =================================
                // COMPROBAR HTTP
                // =================================

                if (!respuesta.ok) {

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
                        "Gemini no devolvió una respuesta."
                    );

                }


                // =================================
                // RESPUESTA CORRECTA
                // =================================

                datos = json;


                console.log(
                    "✅ GEMINI RESPONDIÓ CORRECTAMENTE."
                );


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
                    "No se pudo obtener respuesta de Gemini."
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


        if (elementoCargando) {

            elementoCargando.remove();

        }


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

    }


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


        if (elementoCargando) {

            elementoCargando.remove();

        }


        // =================================
        // QUITAR PREGUNTA DEL HISTORIAL
        // SI LA PETICIÓN FALLÓ
        // =================================

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
        // MOSTRAR ERROR
        // =================================

        agregarMensaje(

            "Lo siento 😔, no pude conectarme " +
            "con ComicVerse AI. TRISTE",

            "ia"

        );

    }


    finally {

        // =================================
        // ACTIVAR BOTÓN
        // =================================

        btnGemini.disabled = false;


        // =================================
        // VOLVER AL INPUT
        // =================================

        preguntaGemini.focus();

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