// =====================================
// COMICVERSE AI
// RUTAS GEMINI AI
// =====================================

const express = require("express");

const router = express.Router();

// =====================================
// CONTROLADOR GEMINI
// =====================================

const {
    chat
} = require("../controllers/geminiController");

// =====================================
// POST PREGUNTA GEMINI
// =====================================

router.post(
    "/preguntar",
    chat
);

// =====================================
// EXPORTAR
// =====================================

module.exports = router;