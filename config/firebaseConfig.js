const admin = require('firebase-admin');
const dotenv = require('dotenv');
dotenv.config();
const serviceAccount = require("../directed-racer-441009-g6-firebase-adminsdk-c11ay-4c6ff3bb7a.json");


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://directed-racer-441009-g6-default-rtdb.firebaseio.com/" // Remplacez par l'URL de votre base de données
});

module.exports = admin;
