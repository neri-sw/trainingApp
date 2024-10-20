// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCsg0JkL7vLk0lr0p2odXU6lZkkkkbZtcM",
  authDomain: "mytrainingapp-1412.firebaseapp.com",
  projectId: "mytrainingapp-1412",
  storageBucket: "mytrainingapp-1412.appspot.com",
  messagingSenderId: "119344095758",
  appId: "1:119344095758:web:0e2af13e42f370d91ed25f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, googleProvider, db };