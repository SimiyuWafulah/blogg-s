// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE,
  authDomain: "blogg-s.firebaseapp.com",
  projectId: "blogg-s",
  storageBucket: "blogg-s.appspot.com",
  messagingSenderId: "115989914151",
  appId: "1:115989914151:web:d85d25fa329064d272e402"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);