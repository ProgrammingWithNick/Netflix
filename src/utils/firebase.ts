// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { Analytics, getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCO3OPdf2PQiXTkeG8chINIqrXBAYfnpoM",
    authDomain: "netflix-7f07f.firebaseapp.com",
    projectId: "netflix-7f07f",
    storageBucket: "netflix-7f07f.appspot.com",
    messagingSenderId: "722345426341",
    appId: "1:722345426341:web:a57e185bc5f39d75bf3c4c",
    measurementId: "G-W8YJ4BVWGK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const firebaseAuth = getAuth(app);