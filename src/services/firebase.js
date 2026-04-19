// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA6ODQ41XuVL8M4OfDJTpZE7E-7ZCBjkrw", // Your previous key was missing a character!
  authDomain: "studymate-cd172.firebaseapp.com",
  projectId: "studymate-cd172",
  storageBucket: "studymate-cd172.appspot.com",
  messagingSenderId: "39288677956",
  appId: "1:39288677956:web:b9872beb70bfc0874e3e11"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);