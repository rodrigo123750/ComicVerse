// =====================================
// COMICVERSE AI
// CONTROLADOR GEMINI AI
// CON HISTORIAL DE CONVERSACIÓN
// =====================================


const {
    preguntarGemini
} = require("../services/geminiService");


// =====================================
// CHAT CON GEMINI
// =====================================

async function chat(req, res) {

    try {

        // ================================
        // RECIBIR DATOS
        // ================================

        const {
            pregunta,
            comic,
            historial
        } = req.body;


        console.log(
            "🤖 PREGUNTA RECIBIDA:",
            pregunta
        );


        console.log(
            "💬 HISTORIAL RECIBIDO:",
            historial
        );


        // ================================
        // COMPROBAR PREGUNTA
        // ================================

        if (
            !pregunta ||
            typeof pregunta !== "string" ||
            !pregunta.trim()
        ) {

            return res.status(400).json({

                ok: false,

                error:
                    "Debes escribir una pregunta."

            });

        }


        // ================================
        // COMPROBAR HISTORIAL
        // ================================

        let historialSeguro = [];


        if (Array.isArray(historial)) {

            historialSeguro =
                historial.filter(mensaje => {

                    return (

                        mensaje &&

                        typeof mensaje === "object" &&

                        (
                            mensaje.rol === "user" ||
                            mensaje.rol === "model"
                        ) &&

                        typeof mensaje.texto === "string" &&

                        mensaje.texto.trim()

                    );

                });

        }


        // ================================
        // LIMITAR HISTORIAL
        // ================================

        // Evita enviar una conversación
        // demasiado grande a Gemini.

        historialSeguro =
            historialSeguro.slice(-10);


        console.log(
            "💬 HISTORIAL SEGURO:",
            historialSeguro
        );


        // ================================
        // ENVIAR A GEMINI
        // ================================

        const respuesta =
            await preguntarGemini(

                pregunta.trim(),

                comic || null,

                historialSeguro

            );


        // ================================
        // RESPONDER AL CLIENTE
        // ================================

        return res.json({

            ok: true,

            pregunta:
                pregunta.trim(),

            respuesta:
                respuesta

        });

    }


    // =================================
    // ERROR
    // =================================

    catch (error) {

        console.error(
            "❌ ERROR GEMINI CONTROLLER:"
        );

        console.error(
            error
        );


        // ================================
        // DETECTAR ERROR 429
        // ================================

        const codigo =
            error?.status ||
            error?.code;


        const mensajeError =
            String(
                error?.message || ""
            );


        if (
            codigo === 429 ||
            mensajeError.includes("429") ||
            mensajeError.includes(
                "RESOURCE_EXHAUSTED"
            ) ||
            mensajeError.includes(
                "quota"
            )
        ) {

            return res.status(429).json({

                ok: false,

                error:
                    "⏳ ComicVerse AI alcanzó temporalmente el límite de solicitudes de Gemini. Intenta nuevamente más tarde."

            });

        }


        // ================================
        // ERROR GENERAL
        // ================================

        return res.status(500).json({

            ok: false,

            error:
                "No se pudo obtener una respuesta de ComicVerse AI."

        });

    }

}


// =====================================
// EXPORTAR
// =====================================

module.exports = {

    chat

};