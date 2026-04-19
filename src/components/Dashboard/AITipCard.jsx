// src/components/Dashboard/AITipCard.jsx
const TYPE_STYLES = {
  warning:    'border-coral/30 bg-coral/5',
  info:       'border-sky-soft/30 bg-sky-soft/5',
  motivation: 'border-yellow-400/30 bg-yellow-400/5',
  tip:        'border-acid/30 bg-acid/5',
  success:    'border-acid/30 bg-acid/5',
}

export default function AITipCard({ tip }) {
  return (
    <div className={`border rounded-xl px-4 py-3.5 flex items-start gap-3 animate-fade-in ${TYPE_STYLES[tip.type] || TYPE_STYLES.info}`}>
      <span className="text-xl flex-shrink-0 mt-0.5">{tip.icon}</span>
      <p className="text-sm text-ink-300 font-body leading-relaxed">{tip.text}</p>
    </div>
  )
}
