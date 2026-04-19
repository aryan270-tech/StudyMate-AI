// src/pages/Landing.jsx
import { Link } from 'react-router-dom'
import { Zap, CheckCircle2, BarChart2, CalendarDays, ArrowRight } from 'lucide-react'

const FEATURES = [
  {
    icon: <CalendarDays size={20} />,
    title: 'AI Study Planner',
    desc: 'Automatically generates optimized study sessions based on your deadlines and estimated effort.',
  },
  {
    icon: <CheckCircle2 size={20} />,
    title: 'Smart Task Manager',
    desc: 'Track assignments with priority levels, subject tags, and deadline urgency indicators.',
  },
  {
    icon: <BarChart2 size={20} />,
    title: 'Progress Analytics',
    desc: 'Visual charts of weekly study hours, subject breakdown, and streak tracking.',
  },
  {
    icon: <Zap size={20} />,
    title: 'AI Recommendations',
    desc: 'Personalized study tips based on your workload, completion rate, and upcoming deadlines.',
  },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-ink-950 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-acid rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-ink-950" fill="currentColor" />
          </div>
          <span className="font-display font-700 text-ink-50 text-lg">StudyMate AI</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-ghost text-sm">Sign in</Link>
          <Link to="/signup" className="btn-primary text-sm">Get started</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <div className="inline-flex items-center gap-2 bg-acid/10 border border-acid/25 rounded-full px-4 py-1.5 mb-8">
          <Zap size={12} className="text-acid" fill="currentColor" />
          <span className="text-xs font-display font-600 text-acid tracking-wide">AI-Powered Study Companion</span>
        </div>

        <h1 className="font-display font-800 text-5xl sm:text-7xl text-ink-50 leading-none mb-6 max-w-3xl">
          Study smarter,{' '}
          <span className="text-acid">not harder</span>
        </h1>

        <p className="text-ink-400 text-lg max-w-xl mb-10 font-body leading-relaxed">
          StudyMate AI builds personalized study plans, tracks your progress, and gives
          intelligent recommendations — so you stay ahead of every deadline.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link to="/signup" className="btn-primary flex items-center gap-2 text-base px-7 py-3.5">
            Start for free <ArrowRight size={16} />
          </Link>
          <Link to="/login" className="btn-ghost text-base px-7 py-3.5">Sign in</Link>
        </div>

        {/* Floating badge */}
        <div className="mt-16 flex items-center gap-6 flex-wrap justify-center">
          {['Firebase Auth', 'Firestore', 'React 18', 'AI Planner'].map((t) => (
            <span key={t} className="text-xs font-mono text-ink-600 bg-ink-900 border border-ink-800 px-3 py-1.5 rounded-lg">
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto w-full px-6 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="card hover:-translate-y-1 transition-all duration-300">
              <div className="w-10 h-10 bg-acid/10 rounded-xl flex items-center justify-center text-acid mb-4">
                {f.icon}
              </div>
              <h3 className="font-display font-700 text-ink-100 mb-2">{f.title}</h3>
              <p className="text-xs text-ink-500 font-body leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-ink-900 py-6 text-center">
        <p className="text-xs text-ink-700 font-body">
          Built for Batch 2029 · React + Firebase + AI · Portfolio Project
        </p>
      </footer>
    </div>
  )
}
