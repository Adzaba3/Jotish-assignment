import React from 'react'
import { Employee } from '../../types/employee'

type GeoMapProps = {
  data: Employee[]
}

type CityPoint = {
  city: string
  lat: number
  lon: number
}

const CITY_COORDS: CityPoint[] = [
  { city: 'Edinburgh', lat: 55.9533, lon: -3.1883 },
  { city: 'Tokyo', lat: 35.6762, lon: 139.6503 },
  { city: 'San Francisco', lat: 37.7749, lon: -122.4194 },
  { city: 'New York', lat: 40.7128, lon: -74.006 },
  { city: 'London', lat: 51.5074, lon: -0.1278 },
  { city: 'Singapore', lat: 1.3521, lon: 103.8198 },
  { city: 'Sidney', lat: -33.8688, lon: 151.2093 },
  { city: 'Sydney', lat: -33.8688, lon: 151.2093 },
]

const cityCounts = (rows: Employee[]) => {
  const counts = new Map<string, number>()
  rows.forEach((row) => {
    const city = row.city || 'Unknown'
    counts.set(city, (counts.get(city) ?? 0) + 1)
  })
  return counts
}

const project = (lat: number, lon: number, width: number, height: number) => {
  const x = ((lon + 180) / 360) * width
  const y = ((90 - lat) / 180) * height
  return { x, y }
}

export const GeoMap: React.FC<GeoMapProps> = ({ data }) => {
  const width = 720
  const height = 300
  const counts = cityCounts(data)

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="map">
      <rect x="0" y="0" width={width} height={height} rx="16" fill="#0b1120" />
      <path
        d="M40 110 L120 70 L220 90 L300 120 L360 140 L420 130 L520 110 L620 120 L690 160 L690 220 L620 240 L520 230 L420 250 L300 230 L220 200 L140 190 L60 170 Z"
        fill="#111827"
        opacity="0.8"
      />
      <text x="24" y="32" fill="#e2e8f0" fontSize="14" fontWeight="600">
        City distribution (simple projection)
      </text>

      {CITY_COORDS.map((point) => {
        const count = counts.get(point.city)
        if (!count) return null
        const { x, y } = project(point.lat, point.lon, width, height)
        const radius = Math.min(18, 4 + count * 0.8)
        return (
          <g key={point.city}>
            <circle cx={x} cy={y} r={radius} fill="#22d3ee" opacity="0.85" />
            <text x={x + 10} y={y - 6} fill="#cbd5f5" fontSize="11">
              {point.city}
            </text>
          </g>
        )
      })}
      <text x="24" y={height - 14} fill="#94a3b8" fontSize="10">
        Projection: lat/lon to x/y using linear mapping
      </text>
    </svg>
  )
}
