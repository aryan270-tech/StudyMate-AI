// src/components/ProgressChart/WeeklyChart.jsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-ink-800 border border-ink-700 rounded-xl px-3 py-2 text-xs font-body shadow-xl">
      <p className="text-ink-400 mb-1">{label}</p>
      <p className="text-acid font-display font-700">
        {payload[0].value}h studied
      </p>
    </div>
  )
}

export default function WeeklyChart({ data }) {
  const max = Math.max(...data.map((d) => d.hours), 1)

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} barSize={28} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
        <XAxis
          dataKey="day"
          tick={{ fill: '#6868a9', fontSize: 11, fontFamily: 'DM Sans' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#6868a9', fontSize: 11, fontFamily: 'JetBrains Mono' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}h`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(180,255,78,0.06)' }} />
        <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.hours >= max * 0.8 ? '#b4ff4e' : entry.hours > 0 ? '#3a3a72' : '#1e1e3c'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
