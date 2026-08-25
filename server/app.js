// =====================================
// COMICVERSE AI SERVER
// =====================================

// Cargar variables .env
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();


// =====================================
// MIDDLEWARES
// =====================================

app.use(cors());

app.use(express.json());


// =====================================
// SERVIR CLIENT
// =====================================

app.use(
    express.static(
        path.join(__dirname, "../client")
    )
);


// =====================================
// API COMICS
// =====================================

const comicRoutes =
    require("./routes/comicRoutes");

app.use(
    "/api/comics",
    comicRoutes
);


// =====================================
// API GEMINI AI
// =====================================

const geminiRoutes =
    require("./routes/geminiRoutes");

app.use(
    "/api/gemini",
    geminiRoutes
);


// =====================================
// API LIBROS Y CÓMICS EXTERNOS
// GOOGLE BOOKS + OPEN LIBRARY
// =====================================

const booksRoutes =
    require("./routes/booksRoutes");

console.log(
    "📚 BOOKS ROUTES CARGADO:",
    booksRoutes
);

app.use(
    "/api/books",
    booksRoutes
);


// =====================================
// COMPROBAR RUTA DE LIBROS
// =====================================

console.log(
    "📚 Ruta de libros cargada: /api/books"
);


// =====================================
// INICIO
// =====================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../client/index.html"
        )
    );

});


// =====================================
// SERVIDOR
// =====================================

// Render proporciona PORT automáticamente.
// En local utilizaremos 3000.

const PORT =
    process.env.PORT || 3000;


// =====================================
// INICIAR SERVIDOR
// =====================================

app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            `Servidor ComicVerse activo en puerto ${PORT} 🚀`
        );

    }
);