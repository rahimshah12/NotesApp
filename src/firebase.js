// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase config (same jo tumhare console ne diya tha)
const firebaseConfig = {
  apiKey: "AIzaSyCPkvddaIDQ3Gxghv9CjRSxrZH217EbktA",
  authDomain: "notes-f6498.firebaseapp.com",
  projectId: "notes-f6498",
  storageBucket: "notes-f6498.firebasestorage.app",
  messagingSenderId: "339847863412",
  appId: "1:339847863412:web:87515a1123247b27704521",
  measurementId: "G-D9QEVSBBR8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth & Firestore instances
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
