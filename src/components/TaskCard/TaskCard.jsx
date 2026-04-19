// src/components/TaskCard/TaskCard.jsx
import { useMemo } from 'react'
import { Trash2, Edit2, Check } from 'lucide-react'
import { daysUntil, urgencyLabel, formatDate } from '../../utils/dateHelpers'
import { getSubjectColor } from '../../utils/aiRecommendations'

const PRIORITY_BADGE = {
  high:   'bg-coral/15 text-coral',
  medium: 'bg-yellow-400/15 text-yellow-400',
  low:    'bg-ink-700 text-ink-400',
}

export default function TaskCard({ task, onToggle, onDelete, onEdit }) {
  const days = useMemo(() => daysUntil(task.deadline), [task.deadline])
  const urgency = useMemo(() => urgencyLabel(days), [days])
  const color = useMemo(() => getSubjectColor(task.subject), [task.subject])

  return (
    <div
      className={`card flex items-start gap-4 transition-all duration-200 hover:-translate-y-0.5 group ${
        task.completed ? 'opacity-50' : ''
      }`}
    >
      {/* Subject accent bar */}
      <div
        className="w-1 self-stretch rounded-full flex-shrink-0"
        style={{ backgroundColor: color }}
      />

      {/* Checkbox */}
      <button
        onClick={() => onToggle(task)}
        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
          task.completed
            ? 'bg-acid border-acid'
            : 'border-ink-600 hover:border-acid'
        }`}
      >
        {task.completed && <Check size={12} className="text-ink-950" strokeWidth={3} />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <p className={`font-display font-600 text-sm ${task.completed ? 'line-through text-ink-500' : 'text-ink-100'}`}>
            {task.title}
          </p>
          <span className={`badge ${PRIORITY_BADGE[task.priority] || PRIORITY_BADGE.low}`}>
            {task.priority}
          </span>
        </div>

        {task.description && (
          <p className="text-xs text-ink-500 mb-2 font-body line-clamp-2">{task.description}</p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <span
            className="badge text-xs"
            style={{ backgroundColor: color + '18', color }}
          >
            {task.subject}
          </span>

          {task.deadline && (
            <span className={`badge ${urgency.bg} ${urgency.color} text-xs`}>
              {urgency.label}
            </span>
          )}

          {task.deadline && (
            <span className="text-xs text-ink-600 font-mono">
              {formatDate(task.deadline)}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button
          onClick={() => onEdit(task)}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-ink-500 hover:text-acid hover:bg-acid/10 transition-all"
        >
          <Edit2 size={13} />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-ink-500 hover:text-coral hover:bg-coral/10 transition-all"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  )
}
