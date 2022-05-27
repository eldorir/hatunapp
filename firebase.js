// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBviuswuoRVENeSSSM3M8VXrqDAVp1rDes",
  authDomain: "wolf3-f02ae.firebaseapp.com",
  databaseURL: "https://wolf3-f02ae-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "wolf3-f02ae",
  storageBucket: "wolf3-f02ae.appspot.com",
  messagingSenderId: "203177296146",
  appId: "1:203177296146:web:0f86960b101fb6beb0b3cb",
  measurementId: "G-EZXKQRNE97"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app