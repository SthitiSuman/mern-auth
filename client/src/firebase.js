// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-6cfb9.firebaseapp.com",
  projectId: "mern-auth-6cfb9",
  storageBucket: "mern-auth-6cfb9.appspot.com",
  messagingSenderId: "691658573054",
  appId: "1:691658573054:web:401fde6969c6ed1ba451af",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
