// src/services/taskService.js
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

function tasksRef(uid) {
  return collection(db, 'users', uid, 'tasks')
}

export function subscribeToTasks(uid, callback) {
  const q = query(tasksRef(uid), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snap) => {
    const tasks = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    callback(tasks)
  })
}

export async function addTask(uid, task) {
  return addDoc(tasksRef(uid), {
    ...task,
    completed: false,
    createdAt: serverTimestamp(),
  })
}

export async function updateTask(uid, taskId, updates) {
  return updateDoc(doc(db, 'users', uid, 'tasks', taskId), updates)
}

export async function deleteTask(uid, taskId) {
  return deleteDoc(doc(db, 'users', uid, 'tasks', taskId))
}
