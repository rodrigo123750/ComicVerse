// =====================================
// COMICVERSE AI
// CONTROLADOR GEMINI AI
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
    // RECIBIR DATOS DEL USUARIO
    // ================================

    const {
        pregunta,
        comic
    } = req.body;


    console.log(
        "🤖 PREGUNTA RECIBIDA:",
        pregunta
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
    // ENVIAR A GEMINI
    // ================================

    const respuesta =
        await preguntarGemini(
            pregunta.trim(),
            comic || null
        );


    // ================================
    // RESPONDER AL CLIENTE
    // ================================

    res.json({

        ok: true,

        pregunta:
            pregunta.trim(),

        respuesta:
            respuesta

    });


}

catch (error) {

    console.error(
        "❌ ERROR GEMINI CONTROLLER:",
        error
    );


    res.status(500).json({

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