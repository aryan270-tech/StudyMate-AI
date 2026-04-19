// src/pages/Login.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, Eye, EyeOff } from 'lucide-react'
import { logIn } from '../services/authService'
import { useApp } from '../context/AppContext'

export default function Login() {
  const [form, setForm]       = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const navigate = useNavigate()
  const { clearError } = useApp()

  function handleChange(e) {
    setError('')
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await logIn(form.email, form.password)
      clearError()
      navigate('/dashboard')
    } catch (err) {
      setError(err.code === 'auth/invalid-credential'
        ? 'Invalid email or password.'
        : err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm animate-fade-in">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-9 h-9 bg-acid rounded-xl flex items-center justify-center">
            <Zap size={18} className="text-ink-950" fill="currentColor" />
          </div>
          <span className="font-display font-700 text-ink-50 text-xl">StudyMate AI</span>
        </div>

        <div className="card">
          <h1 className="font-display font-700 text-2xl text-ink-50 mb-1">Welcome back</h1>
          <p className="text-sm text-ink-500 mb-6 font-body">Sign in to continue studying</p>

          {error && (
            <div className="bg-coral/10 border border-coral/30 text-coral text-sm rounded-xl px-4 py-3 mb-4 font-body">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="input-field"
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="input-field pr-10"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500 hover:text-ink-300 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-ink-500 mt-5 font-body">
            No account?{' '}
            <Link to="/signup" className="text-acid hover:text-acid-dim transition-colors font-display font-600">
              Create one
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-ink-700 mt-4 font-body">
          <Link to="/" className="hover:text-ink-500 transition-colors">← Back to home</Link>
        </p>
      </div>
    </div>
  )
}
