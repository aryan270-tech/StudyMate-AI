// src/components/StudySession/SessionForm.jsx
import { useState } from 'react'
import { X } from 'lucide-react'
import { SUBJECTS } from '../../utils/aiRecommendations'
import { todayISO } from '../../utils/dateHelpers'

export default function SessionForm({ onSubmit, onClose, loading }) {
  const [form, setForm] = useState({
    taskTitle: '',
    subject: 'Mathematics',
    date: todayISO(),
    duration: 60,
  })

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.taskTitle.trim()) return
    onSubmit({ ...form, duration: Number(form.duration) })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-sm">
      <div className="bg-ink-900 border border-ink-700 rounded-2xl w-full max-w-sm animate-slide-up">
        <div className="flex items-center justify-between px-6 py-5 border-b border-ink-800">
          <h2 className="font-display font-700 text-lg text-ink-50">Add Study Session</h2>
          <button onClick={onClose} className="text-ink-500 hover:text-ink-200">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="label">Session Label *</label>
            <input
              name="taskTitle"
              value={form.taskTitle}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g. Review lecture notes"
              required
              autoFocus
            />
          </div>

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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Duration (min)</label>
              <input
                type="number"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                className="input-field"
                min={15}
                max={480}
                step={15}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1" disabled={loading}>
              {loading ? 'Adding...' : 'Add Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
