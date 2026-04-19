// src/App.jsx
import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import ProtectedRoute from './components/Layout/ProtectedRoute'
import Toast from './components/UI/Toast'
import Spinner from './components/UI/Spinner'

// ─── Lazy-loaded pages ────────────────────────────────────────────────────────
const Landing   = lazy(() => import('./pages/Landing'))
const Login     = lazy(() => import('./pages/Login'))
const Signup    = lazy(() => import('./pages/Signup'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Tasks     = lazy(() => import('./pages/Tasks'))
const Planner   = lazy(() => import('./pages/Planner'))
const Progress  = lazy(() => import('./pages/Progress'))

// ─── Full-screen fallback while lazy chunks load ──────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-ink-500 text-sm font-display">Loading...</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
      <BrowserRouter>
        <Toast />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public routes */}
            <Route path="/"       element={<Landing />} />
            <Route path="/login"  element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <Tasks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/planner"
              element={
                <ProtectedRoute>
                  <Planner />
                </ProtectedRoute>
              }
            />
            <Route
              path="/progress"
              element={
                <ProtectedRoute>
                  <Progress />
                </ProtectedRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
  )
}
