// src/pages/Dashboard.jsx
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Flame, BookOpen, CheckSquare, Clock } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useAuth } from '../hooks/useAuth'
import { useTasks } from '../hooks/useTasks'
import { useStudySessions } from '../hooks/useStudySessions'
import AppLayout from '../components/Layout/AppLayout'
import StatCard from '../components/Dashboard/StatCard'
import AITipCard from '../components/Dashboard/AITipCard'
import TaskCard from '../components/TaskCard/TaskCard'
import Spinner from '../components/UI/Spinner'
import { getAITips } from '../utils/aiRecommendations'
import { daysUntil } from '../utils/dateHelpers'

export default function Dashboard() {
  const { user } = useAuth()
  const { stats, tasks, sessions, tasksLoading } = useApp()
  const { toggleTask, deleteTask } = useTasks()
  const { markDone } = useStudySessions()

  // AI tips — memoized so they don't regenerate on every render
  const aiTips = useMemo(() => getAITips(tasks, sessions), [tasks, sessions])

  // Upcoming tasks (next 7 days, not completed) sorted by urgency
  const upcomingTasks = useMemo(
    () =>
      tasks
        .filter((t) => {
          if (t.completed) return false
          const d = daysUntil(t.deadline)
          return d !== null && d <= 14
        })
        .sort((a, b) => daysUntil(a.deadline) - daysUntil(b.deadline))
        .slice(0, 4),
    [tasks]
  )

  // Today's sessions
  const todaySessions = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    return sessions.filter((s) => s.date === today)
  }, [sessions])

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <AppLayout>
      <div className="page-container animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <p className="text-ink-500 text-sm font-body mb-1">{greeting()},</p>
          <h1 className="font-display font-800 text-3xl text-ink-50">
            {user?.displayName || 'Student'} 👋
          </h1>
          <p className="text-ink-500 text-sm mt-1 font-body">
            {new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon="🔥" label="Study Streak" value={`${stats.streak}d`} sub="consecutive days" accent={stats.streak > 2} />
          <StatCard icon="⏱️" label="Total Hours" value={`${stats.totalHours}h`} sub="logged so far" />
          <StatCard icon="✅" label="Completion" value={`${stats.completionRate}%`} sub={`${stats.completedTasks}/${stats.totalTasks} tasks`} />
          <StatCard icon="📚" label="Today" value={`${todaySessions.filter((s) => s.done).length}/${todaySessions.length}`} sub="sessions done" />
        </div>

        {/* 2-col layout */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Upcoming Tasks */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="section-title">Upcoming Deadlines</h2>
                <p className="section-sub">Next 14 days</p>
              </div>
              <Link to="/tasks" className="text-xs text-acid flex items-center gap-1 font-display hover:gap-2 transition-all">
                All tasks <ArrowRight size={13} />
              </Link>
            </div>

            {tasksLoading ? (
              <div className="flex justify-center py-10"><Spinner /></div>
            ) : upcomingTasks.length === 0 ? (
              <div className="card text-center py-10">
                <CheckSquare size={28} className="text-ink-700 mx-auto mb-3" />
                <p className="text-ink-500 text-sm font-body">No upcoming deadlines</p>
                <Link to="/tasks" className="text-acid text-xs mt-2 inline-block font-display hover:underline">
                  + Add a task
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={toggleTask}
                    onDelete={deleteTask}
                    onEdit={() => {}}
                  />
                ))}
              </div>
            )}

            {/* Today's Sessions */}
            {todaySessions.length > 0 && (
              <div className="mt-6">
                <h2 className="section-title">Today's Sessions</h2>
                <p className="section-sub">
                  {todaySessions.filter((s) => s.done).length} of {todaySessions.length} complete
                </p>
                <div className="space-y-3">
                  {todaySessions.map((s) => (
                    <div key={s.id} className="card flex items-center gap-3">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: s.color || '#b4ff4e' }}
                      />
                      <div className="flex-1">
                        <p className={`text-sm font-display font-600 ${s.done ? 'line-through text-ink-500' : 'text-ink-100'}`}>
                          {s.taskTitle}
                        </p>
                        <p className="text-xs text-ink-500 font-mono flex items-center gap-1 mt-0.5">
                          <Clock size={11} /> {s.duration}min
                        </p>
                      </div>
                      <button
                        onClick={() => markDone(s)}
                        className={`text-xs font-display px-3 py-1.5 rounded-lg transition-all ${
                          s.done
                            ? 'bg-acid/15 text-acid'
                            : 'border border-ink-700 text-ink-500 hover:border-acid hover:text-acid'
                        }`}
                      >
                        {s.done ? 'Done ✓' : 'Mark done'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: AI Tips */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-acid/15 rounded-lg flex items-center justify-center">
                <BookOpen size={12} className="text-acid" />
              </div>
              <h2 className="font-display font-700 text-ink-100">AI Insights</h2>
            </div>
            <p className="text-xs text-ink-500 mb-4 font-body">Personalized recommendations</p>

            <div className="space-y-3">
              {aiTips.map((tip, i) => (
                <AITipCard key={i} tip={tip} />
              ))}
            </div>

            {/* Quick links */}
            <div className="mt-6 space-y-2">
              <Link
                to="/planner"
                className="flex items-center justify-between card hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <span className="text-sm font-display font-600 text-ink-200">Open Study Planner</span>
                <ArrowRight size={14} className="text-ink-500 group-hover:text-acid transition-colors" />
              </Link>
              <Link
                to="/progress"
                className="flex items-center justify-between card hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <span className="text-sm font-display font-600 text-ink-200">View Progress</span>
                <ArrowRight size={14} className="text-ink-500 group-hover:text-acid transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
