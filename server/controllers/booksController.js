// =====================================
// COMICVERSE AI
// CONTROLADOR DE LIBROS Y CÓMICS
// =====================================

const {
    buscarLibros
} = require("../services/booksService");


// =====================================
// BUSCAR
// =====================================

async function buscar(req, res) {

    try {

        const busqueda = req.query.q;


        if (!busqueda || !busqueda.trim()) {

            return res.status(400).json({

                ok: false,

                error:
                    "Debes escribir algo para buscar."

            });

        }


        console.log(
            "BUSCANDO:",
            busqueda
        );


        const resultados =
            await buscarLibros(
                busqueda.trim()
            );


        res.json({

            ok: true,

            cantidad:
                resultados.length,

            resultados:
                resultados

        });

    }
    catch(error) {

        console.error(
            "ERROR BUSCANDO:",
            error
        );


        res.status(500).json({

            ok: false,

            error:
                "No se pudieron obtener los resultados."

        });

    }

}


// =====================================
// EXPORTAR
// =====================================

module.exports = {

    buscar

};