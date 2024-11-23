// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "telegram-bot-56ad0.firebaseapp.com",
  projectId: "telegram-bot-56ad0",
  storageBucket: "telegram-bot-56ad0.firebasestorage.app",
  messagingSenderId: "366119952304",
  appId: "1:366119952304:web:e8ab0941b9f92d43b38075",
  measurementId: "G-SZFK0ZQ4C0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
console.log("Firebase Config:", firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };