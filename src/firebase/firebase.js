// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth,GoogleAuthProvider,  RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCDIyKbfACYR0r4D2F3pJD1xnFPOjhcHPk",
  authDomain: "intern-area-f8a69.firebaseapp.com",
  projectId: "intern-area-f8a69",
  storageBucket: "intern-area-f8a69.appspot.com",
  messagingSenderId: "777076215432",
  appId: "1:777076215432:web:a4d1afda1be444997d993d",
  measurementId: "G-B497P0K9VR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();


export { auth, provider };