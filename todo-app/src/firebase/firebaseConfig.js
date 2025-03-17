// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBEO5_ejh3rf7xYVxY2Ga2zmrxN_bSKXqE",
  authDomain: "todo-app-f1ff6.firebaseapp.com",
  projectId: "todo-app-f1ff6",
  storageBucket: "todo-app-f1ff6.firebasestorage.app",
  messagingSenderId: "868851425947",
  appId: "1:868851425947:web:2016b419392a1b18979c3e",
  measurementId: "G-3ZHD0JTC2P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };
