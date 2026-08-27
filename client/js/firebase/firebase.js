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

import {
    getStorage
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-storage.js";


// =====================================
// CONFIGURACIÓN DEL PROYECTO FIREBASE
// =====================================

const firebaseConfig = {

    apiKey: "AIzaSyD3nhx80Ysf0IeJzDIkX9GP-5aBqqNK9F8",

    authDomain: "comicverse-db0c3.firebaseapp.com",

    projectId: "comicverse-db0c3",

    storageBucket: "comicverse-db0c3.firebasestorage.app",

    messagingSenderId: "405099393315",

    appId: "1:405099393315:web:681512f447bcfa57845c96",

    measurementId: "G-G0PDWHYQ1S"

};


// =====================================
// INICIALIZAR FIREBASE
// =====================================

const app = initializeApp(firebaseConfig);


// =====================================
// AUTHENTICATION
// =====================================

const auth = getAuth(app);


// =====================================
// FIRESTORE DATABASE
// =====================================

const db = getFirestore(app);


// =====================================
// FIREBASE STORAGE
// =====================================

const storage = getStorage(app);


// =====================================
// EXPORTAR SERVICIOS
// =====================================

export {

    auth,

    db,

    storage

};