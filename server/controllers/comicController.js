// =====================================
// CONTROLADOR DE COMICS
// =====================================


const comics = [


{

id:1,

titulo:"El Héroe Perdido",

genero:"Aventura",

imagen:"heroe.jpg",

rating:"4.9",

descripcion:
"Un joven descubre poderes ocultos y debe salvar su mundo."

},



{

id:2,

titulo:"Viaje Espacial",

genero:"Ciencia ficción",

imagen:"espacio.jpg",

rating:"4.7",

descripcion:
"Una misión espacial cambia la historia de la humanidad."

},



{

id:3,

titulo:"El Último Dragón",

genero:"Fantasía",

imagen:"dragon.jpg",

rating:"4.8",

descripcion:
"Un héroe busca al último dragón de una antigua leyenda."

}


];





// Mostrar todos

exports.obtenerComics = (req,res)=>{


    res.json(comics);


};





// Mostrar uno

exports.obtenerComic = (req,res)=>{


    const id = req.params.id;



    const comic = comics.find(

        c => c.id == id

    );



    if(!comic){


        return res.status(404).json({

            mensaje:"Cómic no encontrado"

        });


    }



    res.json(comic);


};