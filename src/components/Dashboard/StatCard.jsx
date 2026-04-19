// src/components/Dashboard/StatCard.jsx
export default function StatCard({ icon, label, value, sub, accent = false }) {
  return (
    <div className={`card relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 ${accent ? 'border-acid/30 glow-acid' : ''}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="label">{label}</p>
          <p className={`font-display font-700 text-3xl mt-1 ${accent ? 'text-acid' : 'text-ink-50'}`}>
            {value}
          </p>
          {sub && <p className="text-xs text-ink-500 mt-1 font-body">{sub}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${accent ? 'bg-acid/15' : 'bg-ink-800'}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}
