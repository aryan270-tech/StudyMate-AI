// src/hooks/useStudySessions.js
import { useCallback } from 'react'
import { useApp } from '../context/AppContext'
import {
  addSession as addSessionSvc,
  updateSession as updateSessionSvc,
  deleteSession as deleteSessionSvc,
} from '../services/sessionService'

export function useStudySessions() {
  const { user, sessions, sessionsLoading, setError } = useApp()

  const addSession = useCallback(
    async (session) => {
      try {
        await addSessionSvc(user.uid, session)
      } catch (e) {
        setError(e.message)
      }
    },
    [user, setError]
  )

  const updateSession = useCallback(
    async (sessionId, updates) => {
      try {
        await updateSessionSvc(user.uid, sessionId, updates)
      } catch (e) {
        setError(e.message)
      }
    },
    [user, setError]
  )

  const deleteSession = useCallback(
    async (sessionId) => {
      try {
        await deleteSessionSvc(user.uid, sessionId)
      } catch (e) {
        setError(e.message)
      }
    },
    [user, setError]
  )

  const markDone = useCallback(
    (session) => updateSession(session.id, { done: !session.done }),
    [updateSession]
  )

  return { sessions, sessionsLoading, addSession, updateSession, deleteSession, markDone }
}
