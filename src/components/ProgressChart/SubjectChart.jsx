// src/components/ProgressChart/SubjectChart.jsx
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { formatMinutes } from '../../utils/dateHelpers'

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-ink-800 border border-ink-700 rounded-xl px-3 py-2 text-xs font-body shadow-xl">
      <p className="text-ink-200 font-display font-600">{d.name}</p>
      <p className="font-mono" style={{ color: d.color }}>{formatMinutes(d.minutes)}</p>
    </div>
  )
}

export default function SubjectChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-ink-600 text-sm font-body">
        No study data yet
      </div>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <ResponsiveContainer width={160} height={160}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={48}
            outerRadius={72}
            paddingAngle={3}
            dataKey="minutes"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} opacity={0.9} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        {data.map((d) => (
          <div key={d.name} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
              <span className="text-xs text-ink-400 font-body truncate">{d.name}</span>
            </div>
            <span className="text-xs font-mono text-ink-300 flex-shrink-0">{formatMinutes(d.minutes)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
