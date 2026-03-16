import React from 'react'
import { Employee } from '../../types/employee'

type SalaryChartProps = {
  data: Employee[]
}

type CityStat = {
  city: string
  avgSalary: number
}

const toCityStats = (rows: Employee[]): CityStat[] => {
  const map = new Map<string, { total: number; count: number }>()
  rows.forEach((row) => {
    const city = row.city || 'Unknown'
    const entry = map.get(city) ?? { total: 0, count: 0 }
    entry.total += row.salary || 0
    entry.count += 1
    map.set(city, entry)
  })
  return Array.from(map.entries())
    .map(([city, { total, count }]) => ({
      city,
      avgSalary: count ? total / count : 0,
    }))
    .sort((a, b) => b.avgSalary - a.avgSalary)
}

export const SalaryChart: React.FC<SalaryChartProps> = ({ data }) => {
  const stats = toCityStats(data)
  const width = 720
  const height = 260
  const padding = { top: 20, right: 20, bottom: 60, left: 60 }
  const max = Math.max(1, ...stats.map((s) => s.avgSalary))
  const barWidth = stats.length ? (width - padding.left - padding.right) / stats.length : 0

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="chart">
      <rect x="0" y="0" width={width} height={height} rx="16" fill="#0f172a" />
      <text x={padding.left} y={32} fill="#e2e8f0" fontSize="14" fontWeight="600">
        Average salary by city
      </text>

      {stats.map((stat, index) => {
        const barHeight = (stat.avgSalary / max) * (height - padding.top - padding.bottom)
        const x = padding.left + index * barWidth
        const y = height - padding.bottom - barHeight
        return (
          <g key={stat.city}>
            <rect
              x={x + 8}
              y={y}
              width={Math.max(12, barWidth - 16)}
              height={barHeight}
              rx="8"
              fill="#38bdf8"
            />
            <text
              x={x + barWidth / 2}
              y={height - padding.bottom + 20}
              fill="#cbd5f5"
              fontSize="11"
              textAnchor="middle"
            >
              {stat.city}
            </text>
          </g>
        )
      })}

      <text
        x={padding.left}
        y={height - 12}
        fill="#94a3b8"
        fontSize="10"
      >
        Higher bar = higher average salary
      </text>
    </svg>
  )
}
