// =====================================
// COMICVERSE AI
// RUTAS DE LIBROS
// =====================================

const express = require("express");

const router = express.Router();

const booksController =
    require("../controllers/booksController");

console.log(
    "BOOKS CONTROLLER:",
    booksController
);

router.get(
    "/buscar",
    booksController.buscar
);

module.exports = router;