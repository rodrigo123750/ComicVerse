// =====================================
// COMICVERSE AI
// RUTAS GEMINI AI
// =====================================


const express = require("express");


const router = express.Router();




// Controlador Gemini

const {
    enviarPregunta
} = require("../controllers/geminiController");




// ================================
// POST PREGUNTA GEMINI
// ================================


router.post(
    "/preguntar",
    enviarPregunta
);





module.exports = router;