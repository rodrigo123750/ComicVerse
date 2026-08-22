// =====================================
// COMICVERSE AI
// REGISTRO + FIRESTORE
// =====================================


import { auth, db } from "../firebase/firebase.js";


import {
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";


import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";





const formulario = document.getElementById("registerForm");





formulario.addEventListener("submit", async (e)=>{


    e.preventDefault();



    const nombre =
    document.getElementById("nombre").value.trim();



    const email =
    document.getElementById("email").value.trim();



    const password =
    document.getElementById("password").value;



    const confirmar =
    document.getElementById("confirmPassword").value;





    if(password !== confirmar){


        alert("❌ Las contraseñas no coinciden");

        return;

    }






    try{



        // Crear usuario en Authentication

        const usuario =
        await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );





        // Guardar nombre en Authentication

        await updateProfile(usuario.user,{

            displayName:nombre

        });







        // Crear perfil en Firestore

        await setDoc(

            doc(
                db,
                "usuarios",
                usuario.user.uid
            ),

            {

                nombre:nombre,

                correo:email,

                fechaRegistro:
                serverTimestamp()

            }

        );







        alert(
            "🎉 Cuenta creada correctamente"
        );



        window.location.href =
        "login.html";






    }catch(error){



        console.error(error);



        if(error.code === "auth/email-already-in-use"){


            alert(
                "⚠️ Este correo ya está registrado"
            );


        }else{


            alert(
                "❌ Error: " + error.message
            );


        }



    }



});