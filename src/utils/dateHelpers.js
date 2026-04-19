// src/utils/dateHelpers.js

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function daysUntil(dateStr) {
  if (!dateStr) return null
  const target = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24))
}

export function urgencyLabel(days) {
  if (days === null) return { label: 'No deadline', color: 'text-ink-500', bg: 'bg-ink-800' }
  if (days < 0) return { label: 'Overdue', color: 'text-coral', bg: 'bg-coral/10' }
  if (days === 0) return { label: 'Due today', color: 'text-yellow-400', bg: 'bg-yellow-400/10' }
  if (days <= 3) return { label: `${days}d left`, color: 'text-coral', bg: 'bg-coral/10' }
  if (days <= 7) return { label: `${days}d left`, color: 'text-yellow-400', bg: 'bg-yellow-400/10' }
  return { label: `${days}d left`, color: 'text-acid', bg: 'bg-acid/10' }
}

export function todayISO() {
  return new Date().toISOString().split('T')[0]
}

export function formatMinutes(min) {
  if (min < 60) return `${min}m`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}
