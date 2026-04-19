// src/components/TaskCard/TaskForm.jsx
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { SUBJECTS } from '../../utils/aiRecommendations'

const EMPTY = {
  title: '',
  description: '',
  subject: 'Mathematics',
  priority: 'medium',
  deadline: '',
  effort: 3,
}

export default function TaskForm({ initial, onSubmit, onClose, loading }) {
  const [form, setForm] = useState(initial || EMPTY)

  useEffect(() => {
    setForm(initial || EMPTY)
  }, [initial])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    onSubmit(form)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-sm">
      <div className="bg-ink-900 border border-ink-700 rounded-2xl w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-ink-800">
          <h2 className="font-display font-700 text-lg text-ink-50">
            {initial ? 'Edit Task' : 'New Task'}
          </h2>
          <button onClick={onClose} className="text-ink-500 hover:text-ink-200 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="label">Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g. Complete Chapter 5 problems"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="input-field resize-none"
              rows={2}
              placeholder="Optional notes..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Subject</label>
              <select
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="input-field"
              >
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Priority</label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="input-field"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Deadline</label>
              <input
                type="date"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
                className="input-field"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <label className="label">Effort (hours)</label>
              <input
                type="number"
                name="effort"
                value={form.effort}
                onChange={handleChange}
                className="input-field"
                min={0.5}
                max={20}
                step={0.5}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1" disabled={loading}>
              {loading ? 'Saving...' : initial ? 'Update Task' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
