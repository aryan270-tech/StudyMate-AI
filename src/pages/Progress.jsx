// src/pages/Progress.jsx
import { useMemo } from 'react'
import { TrendingUp, Award, Target, Clock } from 'lucide-react'
import AppLayout from '../components/Layout/AppLayout'
import WeeklyChart from '../components/ProgressChart/WeeklyChart'
import SubjectChart from '../components/ProgressChart/SubjectChart'
import Spinner from '../components/UI/Spinner'
import { useApp } from '../context/AppContext'
import { formatMinutes } from '../utils/dateHelpers'

function ProgressBar({ value, color = '#b4ff4e', label, sub }) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-display font-600 text-ink-200">{label}</span>
        <span className="text-xs font-mono text-ink-400">{sub}</span>
      </div>
      <div className="h-2 bg-ink-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${Math.min(value, 100)}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

export default function Progress() {
  const { stats, tasks, sessions, tasksLoading, sessionsLoading } = useApp()

  const isLoading = tasksLoading || sessionsLoading

  // Completion by subject
  const subjectCompletion = useMemo(() => {
    const map = {}
    tasks.forEach((t) => {
      if (!map[t.subject]) map[t.subject] = { total: 0, done: 0 }
      map[t.subject].total++
      if (t.completed) map[t.subject].done++
    })
    return Object.entries(map).map(([subject, { total, done }]) => ({
      subject,
      rate: total === 0 ? 0 : Math.round((done / total) * 100),
      total,
      done,
    }))
  }, [tasks])

  // Monthly study hours (last 4 weeks by week)
  const weeklyTotals = useMemo(() => {
    const result = []
    for (let w = 3; w >= 0; w--) {
      const start = new Date()
      start.setDate(start.getDate() - w * 7 - 6)
      const end = new Date()
      end.setDate(end.getDate() - w * 7)
      const label = `W${4 - w}`
      const mins = sessions
        .filter((s) => {
          if (!s.done || !s.date) return false
          const d = new Date(s.date)
          return d >= start && d <= end
        })
        .reduce((acc, s) => acc + (s.duration || 0), 0)
      result.push({ day: label, minutes: mins, hours: Math.round((mins / 60) * 10) / 10 })
    }
    return result
  }, [sessions])

  if (isLoading) {
    return (
      <AppLayout>
        <div className="page-container flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="page-container animate-fade-in">
        <div className="mb-8">
          <h1 className="section-title">Progress Analytics</h1>
          <p className="section-sub">Track your study habits and performance</p>
        </div>

        {/* Top stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { icon: <Award size={18} />, label: 'Streak', value: `${stats.streak} days`, color: 'text-yellow-400' },
            { icon: <Clock size={18} />, label: 'Total study', value: `${stats.totalHours}h`, color: 'text-acid' },
            { icon: <Target size={18} />, label: 'Completion', value: `${stats.completionRate}%`, color: 'text-sky-soft' },
            { icon: <TrendingUp size={18} />, label: 'Tasks done', value: `${stats.completedTasks}/${stats.totalTasks}`, color: 'text-acid' },
          ].map((s) => (
            <div key={s.label} className="card text-center">
              <div className={`flex justify-center mb-2 ${s.color}`}>{s.icon}</div>
              <p className={`font-display font-800 text-2xl ${s.color}`}>{s.value}</p>
              <p className="text-xs text-ink-500 font-body mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly activity */}
          <div className="card">
            <h2 className="font-display font-700 text-ink-100 mb-1">Weekly Activity</h2>
            <p className="text-xs text-ink-500 font-body mb-5">Study hours per day (last 7 days)</p>
            <WeeklyChart data={stats.weekly} />
          </div>

          {/* Subject breakdown */}
          <div className="card">
            <h2 className="font-display font-700 text-ink-100 mb-1">Subject Breakdown</h2>
            <p className="text-xs text-ink-500 font-body mb-5">Time distribution across subjects</p>
            <SubjectChart data={stats.subjects} />
          </div>
        </div>

        {/* Monthly chart */}
        <div className="card mb-8">
          <h2 className="font-display font-700 text-ink-100 mb-1">Monthly Overview</h2>
          <p className="text-xs text-ink-500 font-body mb-5">Study hours by week (last 4 weeks)</p>
          <WeeklyChart data={weeklyTotals} />
        </div>

        {/* Subject completion rates */}
        {subjectCompletion.length > 0 && (
          <div className="card">
            <h2 className="font-display font-700 text-ink-100 mb-1">Completion by Subject</h2>
            <p className="text-xs text-ink-500 font-body mb-6">Task completion rate per subject</p>
            {subjectCompletion
              .sort((a, b) => b.rate - a.rate)
              .map((s) => (
                <ProgressBar
                  key={s.subject}
                  label={s.subject}
                  value={s.rate}
                  sub={`${s.done}/${s.total} tasks · ${s.rate}%`}
                  color={s.rate === 100 ? '#b4ff4e' : s.rate >= 50 ? '#7dd3fc' : '#ff6b6b'}
                />
              ))}
          </div>
        )}

        {/* Study sessions log */}
        <div className="card mt-6">
          <h2 className="font-display font-700 text-ink-100 mb-1">Recent Study Sessions</h2>
          <p className="text-xs text-ink-500 font-body mb-4">
            {sessions.filter((s) => s.done).length} completed sessions ·{' '}
            {formatMinutes(sessions.filter((s) => s.done).reduce((a, s) => a + (s.duration || 0), 0))} total
          </p>
          {sessions.filter((s) => s.done).length === 0 ? (
            <p className="text-ink-600 text-sm font-body text-center py-6">
              No completed sessions yet. Start studying!
            </p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {sessions
                .filter((s) => s.done)
                .slice()
                .reverse()
                .slice(0, 20)
                .map((s) => (
                  <div key={s.id} className="flex items-center justify-between py-2 border-b border-ink-800 last:border-0">
                    <div>
                      <p className="text-sm font-display font-600 text-ink-200">{s.taskTitle}</p>
                      <p className="text-xs text-ink-600 font-body">{s.subject} · {s.date}</p>
                    </div>
                    <span className="text-xs font-mono text-acid bg-acid/10 px-2.5 py-1 rounded-lg">
                      {formatMinutes(s.duration)}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
