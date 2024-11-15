const admin = require('firebase-admin');
const dotenv = require('dotenv');
dotenv.config();
const serviceAccount = require("./firebaseAdmin.json");


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://directed-racer-441009-g6-default-rtdb.firebaseio.com/",
    storageBucket: "directed-racer-441009-g6.firebasestorage.app"
});

module.exports = { admin };