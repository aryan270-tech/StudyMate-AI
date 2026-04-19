// src/services/sessionService.js
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'

function sessionsRef(uid) {
  return collection(db, 'users', uid, 'sessions')
}

export function subscribeToSessions(uid, callback) {
  const q = query(sessionsRef(uid), orderBy('date', 'asc'))
  return onSnapshot(q, (snap) => {
    const sessions = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    callback(sessions)
  })
}

export async function addSession(uid, session) {
  return addDoc(sessionsRef(uid), {
    ...session,
    done: false,
    createdAt: serverTimestamp(),
  })
}

export async function updateSession(uid, sessionId, updates) {
  return updateDoc(doc(db, 'users', uid, 'sessions', sessionId), updates)
}

export async function deleteSession(uid, sessionId) {
  return deleteDoc(doc(db, 'users', uid, 'sessions', sessionId))
}
