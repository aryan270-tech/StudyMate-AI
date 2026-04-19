// src/components/StudySession/StudySessionCard.jsx
import { useMemo } from 'react'
import { Clock, Check, Trash2, Zap } from 'lucide-react'
import { formatDate, formatMinutes } from '../../utils/dateHelpers'
import { getSubjectColor } from '../../utils/aiRecommendations'

export default function StudySessionCard({ session, onMarkDone, onDelete }) {
  const color = useMemo(() => getSubjectColor(session.subject), [session.subject])

  return (
    <div
      className={`card flex items-center gap-4 group transition-all duration-200 ${
        session.done ? 'opacity-60' : 'hover:-translate-y-0.5'
      }`}
    >
      {/* Color dot */}
      <div
        className="w-3 h-3 rounded-full flex-shrink-0"
        style={{ backgroundColor: color }}
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className={`font-display font-600 text-sm ${session.done ? 'line-through text-ink-500' : 'text-ink-100'}`}>
            {session.taskTitle}
          </p>
          {session.aiGenerated && (
            <span className="badge bg-acid/10 text-acid text-xs">
              <Zap size={10} fill="currentColor" /> AI
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          <span className="text-xs font-mono text-ink-500">{formatDate(session.date)}</span>
          <span className="flex items-center gap-1 text-xs text-ink-500">
            <Clock size={11} />
            {formatMinutes(session.duration)}
          </span>
          <span
            className="badge text-xs"
            style={{ backgroundColor: color + '18', color }}
          >
            {session.subject}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() => onMarkDone(session)}
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
            session.done
              ? 'bg-acid text-ink-950'
              : 'border border-ink-700 text-ink-500 hover:border-acid hover:text-acid'
          }`}
          title={session.done ? 'Mark undone' : 'Mark done'}
        >
          <Check size={14} strokeWidth={session.done ? 3 : 2} />
        </button>
        <button
          onClick={() => onDelete(session.id)}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-ink-600 hover:text-coral hover:bg-coral/10 transition-all opacity-0 group-hover:opacity-100"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  )
}
