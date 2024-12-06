// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCme4k1H5g4TiaJUtWeJX3-E8rmncyHEJw",
  authDomain: "maps-c88b7.firebaseapp.com",
  projectId: "maps-c88b7",
  storageBucket: "maps-c88b7.firebasestorage.app",
  messagingSenderId: "401847672411",
  appId: "1:401847672411:web:b215f6692461821a90297e"
};

// Initialize Firebase
export const APP = initializeApp(firebaseConfig);
export const db = getFirestore(APP);