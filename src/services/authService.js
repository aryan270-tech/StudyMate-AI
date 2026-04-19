// src/services/authService.js
  
 import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './firebase'

export async function signUp(email, password, displayName) {
  console.log("1. Starting Firebase Auth creation...");
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  
  console.log("2. Updating user profile...");
  await updateProfile(cred.user, { displayName })
  
  console.log("3. Writing user data to Firestore...");
  try {
    // Create user profile doc in Firestore
    await setDoc(doc(db, 'users', cred.user.uid, 'profile', 'info'), {
      displayName,
      email,
      createdAt: serverTimestamp(),
      streak: 0,
      totalStudyMinutes: 0,
    })
    console.log("4. Firestore setDoc successful!");
  } catch (err) {
    console.error("Firestore setDoc failed:", err);
    throw err;
  }
  
  return cred.user
}

export async function logIn(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password)
  return cred.user
}

export async function logOut() {
  await signOut(auth)
}

