const admin = require('firebase-admin');
const dotenv = require('dotenv');
dotenv.config();
const serviceAccount = require("../firebaseAdmin.json");


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://directed-racer-441009-g6-default-rtdb.firebaseio.com/" // Remplacez par l'URL de votre base de données
});

module.exports = admin;
