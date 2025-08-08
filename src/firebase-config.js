// Import the functions you need from the Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Firebase Authentication
import { getFirestore } from "firebase/firestore"; // Firebase Firestore (Database)

// Your Firebase configuration object
// Replace these values with your project's Firebase config (keep them private in production)
const firebaseConfig = {
  apiKey: "AIzaSyApAshUEHu5icm5ryYCXxAUOqCRQF_vm2g",
  authDomain: "intrusion-detector-3dd54.firebaseapp.com",
  projectId: "intrusion-detector-3dd54",
  storageBucket: "intrusion-detector-3dd54.firebasestorage.app",
  messagingSenderId: "948307940974",
  appId: "1:948307940974:web:0e0bab861bebb9e79db87f",
};

// Initialize the Firebase app instance
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase services using the app instance
const auth = getAuth(firebaseApp); // Authentication
const db = getFirestore(firebaseApp); // Firestore database

// Export the initialized services for use in other parts of your app
// - These are exported so you can use them like: import { auth, db } from './firebase-config.js';
export { firebaseApp, auth, db };
