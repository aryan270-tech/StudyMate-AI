// src/pages/Planner.jsx
import { useState, useMemo, useCallback } from 'react'
import { Zap, Plus, CalendarDays, Trash2 } from 'lucide-react'
import AppLayout from '../components/Layout/AppLayout'
import StudySessionCard from '../components/StudySession/StudySessionCard'
import SessionForm from '../components/StudySession/SessionForm'
import Spinner from '../components/UI/Spinner'
import { useStudySessions } from '../hooks/useStudySessions'
import { useApp } from '../context/AppContext'
import { generateStudyPlan } from '../utils/aiRecommendations'
import { todayISO } from '../utils/dateHelpers'

export default function Planner() {
  const { tasks } = useApp()
  const { sessions, sessionsLoading, addSession, markDone, deleteSession } = useStudySessions()

  const [showForm, setShowForm] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState('today') // 'today' | 'upcoming' | 'all'

  // Group sessions by tab filter
  const filteredSessions = useMemo(() => {
    const today = todayISO()
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 7)
    const nextWeek = tomorrow.toISOString().split('T')[0]

    if (activeTab === 'today') return sessions.filter((s) => s.date === today)
    if (activeTab === 'upcoming') return sessions.filter((s) => s.date > today && s.date <= nextWeek)
    return sessions
  }, [sessions, activeTab])

  const handleAddSession = useCallback(
    async (form) => {
      setFormLoading(true)
      try {
        await addSession(form)
        setShowForm(false)
      } finally {
        setFormLoading(false)
      }
    },
    [addSession]
  )

  const handleGeneratePlan = useCallback(async () => {
    if (tasks.filter((t) => !t.completed && t.deadline).length === 0) {
      alert('Add tasks with deadlines first so the AI can build your plan.')
      return
    }
    setGenerating(true)
    try {
      const plan = generateStudyPlan(tasks)
      // Add all generated sessions
      for (const session of plan) {
        await addSession(session)
      }
    } finally {
      setGenerating(false)
    }
  }, [tasks, addSession])

  const todayCount = useMemo(() => sessions.filter((s) => s.date === todayISO()).length, [sessions])
  const doneToday  = useMemo(() => sessions.filter((s) => s.date === todayISO() && s.done).length, [sessions])

  const TABS = [
    { id: 'today',    label: 'Today' },
    { id: 'upcoming', label: 'Next 7 days' },
    { id: 'all',      label: 'All sessions' },
  ]

  return (
    <AppLayout>
      <div className="page-container animate-fade-in">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="section-title">Study Planner</h1>
            <p className="section-sub">
              {todayCount > 0
                ? `${doneToday}/${todayCount} sessions done today`
                : 'No sessions scheduled for today'}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleGeneratePlan}
              disabled={generating}
              className="btn-primary flex items-center gap-2"
            >
              <Zap size={14} fill="currentColor" />
              {generating ? 'Generating...' : 'AI Generate Plan'}
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="btn-ghost flex items-center gap-2"
            >
              <Plus size={14} /> Add manually
            </button>
          </div>
        </div>

        {/* AI Banner */}
        <div className="border border-acid/20 bg-acid/5 rounded-2xl px-5 py-4 mb-6 flex items-start gap-3">
          <div className="w-8 h-8 bg-acid/15 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <Zap size={15} className="text-acid" fill="currentColor" />
          </div>
          <div>
            <p className="font-display font-700 text-ink-100 text-sm mb-1">AI-Powered Scheduling</p>
            <p className="text-xs text-ink-500 font-body leading-relaxed">
              Click <strong className="text-acid">AI Generate Plan</strong> to automatically create study sessions
              based on your task deadlines and estimated effort. The AI distributes sessions
              optimally across available days. Add tasks with deadlines in the Tasks page first.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-ink-900 border border-ink-800 rounded-xl p-1 mb-5 w-fit">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-display font-600 transition-all ${
                activeTab === tab.id
                  ? 'bg-acid text-ink-950'
                  : 'text-ink-400 hover:text-ink-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sessions list */}
        {sessionsLoading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : filteredSessions.length === 0 ? (
          <div className="card text-center py-16">
            <CalendarDays size={36} className="text-ink-700 mx-auto mb-4" />
            <p className="text-ink-400 font-display font-600 mb-1">No sessions {activeTab === 'today' ? 'today' : 'here'}</p>
            <p className="text-ink-600 text-sm font-body mb-4">
              Use AI Generate to auto-create sessions from your tasks
            </p>
            <button onClick={handleGeneratePlan} className="btn-primary mx-auto flex items-center gap-2">
              <Zap size={14} fill="currentColor" /> Generate my plan
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Group by date */}
            {(() => {
              const grouped = {}
              filteredSessions.forEach((s) => {
                if (!grouped[s.date]) grouped[s.date] = []
                grouped[s.date].push(s)
              })
              return Object.entries(grouped)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([date, group]) => (
                  <div key={date}>
                    <p className="text-xs font-mono text-ink-500 mb-2 mt-4 first:mt-0">
                      {date === todayISO()
                        ? '📅 Today'
                        : new Date(date + 'T00:00:00').toLocaleDateString('en', {
                            weekday: 'long',
                            month: 'short',
                            day: 'numeric',
                          })}
                    </p>
                    <div className="space-y-2">
                      {group.map((session) => (
                        <StudySessionCard
                          key={session.id}
                          session={session}
                          onMarkDone={markDone}
                          onDelete={deleteSession}
                        />
                      ))}
                    </div>
                  </div>
                ))
            })()}
          </div>
        )}
      </div>

      {showForm && (
        <SessionForm
          onSubmit={handleAddSession}
          onClose={() => setShowForm(false)}
          loading={formLoading}
        />
      )}
    </AppLayout>
  )
}
