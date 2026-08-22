// =====================================
// FIREBASE - COMICVERSE AI
// CONFIGURACIÓN GENERAL
// =====================================


import { 
    initializeApp 
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";


import { 
    getAuth 
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";


import { 
    getFirestore 
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";





// Configuración del proyecto Firebase

const firebaseConfig = {

    apiKey: "AIzaSyD3nhx80Ysf0IeJzDIkX9GP-5aBqqNK9F8",

    authDomain: "comicverse-db0c3.firebaseapp.com",

    projectId: "comicverse-db0c3",

    storageBucket: "comicverse-db0c3.firebasestorage.app",

    messagingSenderId: "405099393315",

    appId: "1:405099393315:web:681512f447bcfa57845c96",

    measurementId: "G-G0PDWHYQ1S"

};





// Inicializar Firebase

const app = initializeApp(firebaseConfig);





// Authentication

const auth = getAuth(app);





// Firestore Database

const db = getFirestore(app);





// Exportar servicios para ComicVerse

export { 

    auth, 

    db 

};