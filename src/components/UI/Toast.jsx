// src/components/UI/Toast.jsx
import { useEffect } from 'react'
import { X, AlertCircle } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function Toast() {
  const { error, clearError } = useApp()

  useEffect(() => {
    if (!error) return
    const timer = setTimeout(clearError, 5000)
    return () => clearTimeout(timer)
  }, [error, clearError])

  if (!error) return null

  return (
    <div className="fixed top-5 right-5 z-50 animate-slide-up">
      <div className="flex items-start gap-3 bg-coral/10 border border-coral/30 text-coral rounded-xl px-4 py-3 max-w-sm shadow-xl">
        <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
        <p className="text-sm font-body flex-1">{error}</p>
        <button onClick={clearError} className="text-coral/60 hover:text-coral transition-colors">
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
