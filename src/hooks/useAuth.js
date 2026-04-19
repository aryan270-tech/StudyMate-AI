// src/hooks/useAuth.js
import { useApp } from '../context/AppContext'

export function useAuth() {
  const { user, authLoading } = useApp()
  return { user, authLoading, isAuthenticated: !!user }
}
