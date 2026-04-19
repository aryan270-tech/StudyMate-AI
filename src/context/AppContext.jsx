// src/context/AppContext.jsx
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
} from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../services/firebase'
import { subscribeToTasks } from '../services/taskService'
import { subscribeToSessions } from '../services/sessionService'
import { computeStats } from '../utils/aiRecommendations'

// ─── State shape ─────────────────────────────────────────────────────────────
const initialState = {
  user: null,
  authLoading: true,
  tasks: [],
  sessions: [],
  tasksLoading: true,
  sessionsLoading: true,
  error: null,
}

// ─── Reducer ─────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, authLoading: false }
    case 'SET_TASKS':
      return { ...state, tasks: action.payload, tasksLoading: false }
    case 'SET_SESSIONS':
      return { ...state, sessions: action.payload, sessionsLoading: false }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    case 'RESET':
      return { ...initialState, authLoading: false }
    default:
      return state
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────
const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      dispatch({ type: 'SET_USER', payload: user })
      if (!user) {
        dispatch({ type: 'RESET' })
      }
    })
    return unsub
  }, [])

  // Subscribe to tasks when user is available
  useEffect(() => {
    if (!state.user) return
    const unsub = subscribeToTasks(state.user.uid, (tasks) =>
      dispatch({ type: 'SET_TASKS', payload: tasks })
    )
    return unsub
  }, [state.user])

  // Subscribe to sessions when user is available
  useEffect(() => {
    if (!state.user) return
    const unsub = subscribeToSessions(state.user.uid, (sessions) =>
      dispatch({ type: 'SET_SESSIONS', payload: sessions })
    )
    return unsub
  }, [state.user])

  const setError = useCallback((msg) => dispatch({ type: 'SET_ERROR', payload: msg }), [])
  const clearError = useCallback(() => dispatch({ type: 'CLEAR_ERROR' }), [])

  // Memoized computed stats — only recalculate when tasks/sessions change
  const stats = useMemo(
    () => computeStats(state.tasks, state.sessions),
    [state.tasks, state.sessions]
  )

  const value = useMemo(
    () => ({ ...state, stats, setError, clearError }),
    [state, stats, setError, clearError]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
