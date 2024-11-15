const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } = require('firebase/auth');
const { initializeApp } = require('firebase/app');

const firebaseConfig = require("../firebaseClient.json");

const http = require('https');
const fs = require('fs');

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

const storage = require('firebase/storage');
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');

const firebaseStorage = getStorage();

console.log(firebaseStorage);

async function uploadFile() {
    const storageRef = ref(firebaseStorage, 'template.wav');
    await uploadBytes(storageRef, 'Hello, World!');
    console.log('File uploaded');
}

async function downloadFile() {
    const storageRef = ref(firebaseStorage, 'template.wav');
    const url = await getDownloadURL(storageRef);
    console.log('File available at', url);
    download(url, 'template.wav');
    console.log('File downloaded');
}


var download = function(url, dest, cb) {
    var file = fs.createWriteStream(dest);
    http.get(url, function(response) {
        response.pipe(file);
        file.on('finish', function() {
            file.close(cb);
        });
    });
}