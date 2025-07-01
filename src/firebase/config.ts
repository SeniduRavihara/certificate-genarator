// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDP9_ucQZOueAdFK9Jtl_t18F6mSDRmOZo",
  authDomain: "certificate-genarator-49c05.firebaseapp.com",
  projectId: "certificate-genarator-49c05",
  storageBucket: "certificate-genarator-49c05.firebasestorage.app",
  messagingSenderId: "88491960416",
  appId: "1:88491960416:web:145328b9bac9db15563b05"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
