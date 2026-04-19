// src/pages/Tasks.jsx
import { useState, useMemo, useCallback } from 'react'
import { Plus, Search, Filter, CheckSquare } from 'lucide-react'
import AppLayout from '../components/Layout/AppLayout'
import TaskCard from '../components/TaskCard/TaskCard'
import TaskForm from '../components/TaskCard/TaskForm'
import Spinner from '../components/UI/Spinner'
import { useTasks } from '../hooks/useTasks'
import { SUBJECTS } from '../utils/aiRecommendations'

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 }

export default function Tasks() {
  const { tasks, tasksLoading, addTask, updateTask, deleteTask, toggleTask } = useTasks()

  const [showForm, setShowForm]       = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [search, setSearch]           = useState('')
  const [filterSubject, setFilterSubject] = useState('All')
  const [filterStatus, setFilterStatus]   = useState('all')
  const [sortBy, setSortBy]               = useState('deadline')

  // Filtered and sorted tasks — memoized
  const filteredTasks = useMemo(() => {
    let result = [...tasks]

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.subject?.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q)
      )
    }

    if (filterSubject !== 'All') {
      result = result.filter((t) => t.subject === filterSubject)
    }

    if (filterStatus === 'active') result = result.filter((t) => !t.completed)
    if (filterStatus === 'done')   result = result.filter((t) => t.completed)

    result.sort((a, b) => {
      if (sortBy === 'deadline') {
        if (!a.deadline && !b.deadline) return 0
        if (!a.deadline) return 1
        if (!b.deadline) return -1
        return new Date(a.deadline) - new Date(b.deadline)
      }
      if (sortBy === 'priority') {
        return (PRIORITY_ORDER[a.priority] ?? 2) - (PRIORITY_ORDER[b.priority] ?? 2)
      }
      if (sortBy === 'subject') return (a.subject || '').localeCompare(b.subject || '')
      return 0
    })

    return result
  }, [tasks, search, filterSubject, filterStatus, sortBy])

  const openNew = useCallback(() => {
    setEditingTask(null)
    setShowForm(true)
  }, [])

  const openEdit = useCallback((task) => {
    setEditingTask(task)
    setShowForm(true)
  }, [])

  const handleSubmit = useCallback(
    async (form) => {
      setFormLoading(true)
      try {
        if (editingTask) {
          await updateTask(editingTask.id, form)
        } else {
          await addTask(form)
        }
        setShowForm(false)
        setEditingTask(null)
      } finally {
        setFormLoading(false)
      }
    },
    [editingTask, addTask, updateTask]
  )

  const counts = useMemo(() => ({
    total: tasks.length,
    active: tasks.filter((t) => !t.completed).length,
    done:   tasks.filter((t) => t.completed).length,
  }), [tasks])

  return (
    <AppLayout>
      <div className="page-container animate-fade-in">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="section-title">Task Manager</h1>
            <p className="section-sub">
              {counts.active} active · {counts.done} completed
            </p>
          </div>
          <button onClick={openNew} className="btn-primary flex items-center gap-2">
            <Plus size={15} /> New Task
          </button>
        </div>

        {/* Filters bar */}
        <div className="card mb-5">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tasks..."
                className="input-field pl-9 py-2.5"
              />
            </div>

            {/* Subject filter */}
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="input-field sm:w-44"
            >
              <option value="All">All subjects</option>
              {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>

            {/* Status filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field sm:w-36"
            >
              <option value="all">All status</option>
              <option value="active">Active</option>
              <option value="done">Completed</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field sm:w-40"
            >
              <option value="deadline">Sort: Deadline</option>
              <option value="priority">Sort: Priority</option>
              <option value="subject">Sort: Subject</option>
            </select>
          </div>
        </div>

        {/* Task list */}
        {tasksLoading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : filteredTasks.length === 0 ? (
          <div className="card text-center py-16">
            <CheckSquare size={36} className="text-ink-700 mx-auto mb-4" />
            <p className="text-ink-400 font-display font-600 mb-1">
              {search || filterSubject !== 'All' ? 'No tasks match your filters' : 'No tasks yet'}
            </p>
            <p className="text-ink-600 text-sm font-body mb-4">
              {search ? 'Try different keywords' : 'Add your first task to get started'}
            </p>
            {!search && (
              <button onClick={openNew} className="btn-primary mx-auto">
                + Add first task
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={deleteTask}
                onEdit={openEdit}
              />
            ))}
          </div>
        )}
      </div>

      {/* Task form modal */}
      {showForm && (
        <TaskForm
          initial={editingTask}
          onSubmit={handleSubmit}
          onClose={() => { setShowForm(false); setEditingTask(null) }}
          loading={formLoading}
        />
      )}
    </AppLayout>
  )
}
