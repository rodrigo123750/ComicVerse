// =====================================
// COMICVERSE AI SERVER
// =====================================

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

app.use(
    "/api/books",
    booksRoutes
);


// =====================================
// PÁGINA PRINCIPAL
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

// Render proporciona PORT.
// En tu PC utilizará 3000.

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
            `🚀 ComicVerse Server funcionando en puerto ${PORT}`
        );

        console.log(
            "🤖 Gemini API disponible en /api/gemini"
        );

        console.log(
            "📚 Books API disponible en /api/books"
        );

        console.log(
            "📖 Comics API disponible en /api/comics"
        );

    }
);