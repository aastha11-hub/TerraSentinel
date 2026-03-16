'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    Chart?: any
  }
}

export default function AnalyticsClient() {
  const trendRef = useRef<HTMLCanvasElement | null>(null)
  const correlationRef = useRef<HTMLCanvasElement | null>(null)
  const historicalRef = useRef<HTMLCanvasElement | null>(null)
  const chartInstances = useRef<any[]>([])

  const [chartReady, setChartReady] = useState(false)

  const stateLabels = useMemo(() => ['Assam', 'Bihar', 'Gujarat', 'Kerala', 'Maharashtra', 'Odisha'], [])
  const floodTrend = useMemo(() => [42, 36, 18, 24, 30, 33], [])
  const affectedDistricts = useMemo(() => [12, 9, 5, 7, 8, 10], [])
  const rainfall = useMemo(() => [220, 180, 90, 160, 140, 200], [])
  const historicalMonths = useMemo(() => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'], [])
  const historicalSeries = useMemo(() => [3, 4, 4, 6, 8, 12, 16, 14, 10], [])

  useEffect(() => {
    if (!chartReady) return
    if (!window.Chart) return

    const Chart = window.Chart
    chartInstances.current.forEach((c) => {
      try {
        c.destroy()
      } catch {}
    })
    chartInstances.current = []

    const commonOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: 'rgba(255,255,255,0.75)' } },
        tooltip: { enabled: true },
      },
      scales: {
        x: { ticks: { color: 'rgba(255,255,255,0.6)' }, grid: { color: 'rgba(255,255,255,0.06)' } },
        y: { ticks: { color: 'rgba(255,255,255,0.6)' }, grid: { color: 'rgba(255,255,255,0.06)' } },
      },
    }

    if (trendRef.current) {
      chartInstances.current.push(
        new Chart(trendRef.current, {
          type: 'bar',
          data: {
            labels: stateLabels,
            datasets: [
              {
                label: 'Flood trend index',
                data: floodTrend,
                backgroundColor: 'rgba(0,245,255,0.22)',
                borderColor: 'rgba(0,245,255,0.8)',
                borderWidth: 1,
              },
              {
                label: 'Affected districts',
                data: affectedDistricts,
                backgroundColor: 'rgba(255,255,255,0.12)',
                borderColor: 'rgba(255,255,255,0.35)',
                borderWidth: 1,
              },
            ],
          },
          options: commonOptions,
        }),
      )
    }

    if (correlationRef.current) {
      chartInstances.current.push(
        new Chart(correlationRef.current, {
          type: 'scatter',
          data: {
            datasets: [
              {
                label: 'Rainfall vs Flood index',
                data: rainfall.map((r, i) => ({ x: r, y: floodTrend[i] })),
                backgroundColor: 'rgba(0,245,255,0.7)',
                borderColor: 'rgba(0,245,255,0.8)',
              },
            ],
          },
          options: {
            ...commonOptions,
            scales: {
              x: { title: { display: true, text: 'Rainfall (mm)', color: 'rgba(255,255,255,0.7)' }, ticks: { color: 'rgba(255,255,255,0.6)' }, grid: { color: 'rgba(255,255,255,0.06)' } },
              y: { title: { display: true, text: 'Flood index', color: 'rgba(255,255,255,0.7)' }, ticks: { color: 'rgba(255,255,255,0.6)' }, grid: { color: 'rgba(255,255,255,0.06)' } },
            },
          },
        }),
      )
    }

    if (historicalRef.current) {
      chartInstances.current.push(
        new Chart(historicalRef.current, {
          type: 'line',
          data: {
            labels: historicalMonths,
            datasets: [
              {
                label: 'Historical flood activity',
                data: historicalSeries,
                tension: 0.35,
                borderColor: 'rgba(0,245,255,0.9)',
                backgroundColor: 'rgba(0,245,255,0.12)',
                fill: true,
                pointRadius: 3,
              },
            ],
          },
          options: commonOptions,
        }),
      )
    }

    return () => {
      chartInstances.current.forEach((c) => {
        try {
          c.destroy()
        } catch {}
      })
      chartInstances.current = []
    }
  }, [affectedDistricts, chartReady, floodTrend, historicalMonths, historicalSeries, rainfall, stateLabels])

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {[
          { label: 'Active Flood Regions', value: '3', hint: 'Demo overlays' },
          { label: 'Affected Districts', value: '51', hint: 'Estimated' },
          { label: 'Latest Model Run', value: '2m ago', hint: 'Near real-time' },
        ].map((c) => (
          <div key={c.label} className="glow-border bg-space-navy/40 backdrop-blur-sm rounded-2xl p-6">
            <div className="text-sm text-white/60">{c.label}</div>
            <div className="mt-2 text-3xl font-semibold text-white">{c.value}</div>
            <div className="mt-1 text-xs text-white/45">{c.hint}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glow-border bg-space-navy/40 backdrop-blur-sm rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-cyan-accent">Flood trends by state</h2>
            <span className="text-xs text-white/50">Demo</span>
          </div>
          <div className="h-[320px]">
            <canvas ref={trendRef} />
          </div>
        </div>

        <div className="glow-border bg-space-navy/40 backdrop-blur-sm rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-cyan-accent">Rainfall correlation</h2>
            <span className="text-xs text-white/50">Demo</span>
          </div>
          <div className="h-[320px]">
            <canvas ref={correlationRef} />
          </div>
        </div>

        <div className="lg:col-span-2 glow-border bg-space-navy/40 backdrop-blur-sm rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-cyan-accent">Historical flood charts</h2>
            <span className="text-xs text-white/50">Demo</span>
          </div>
          <div className="h-[320px]">
            <canvas ref={historicalRef} />
          </div>
        </div>
      </div>

      <Script
        src="https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js"
        strategy="afterInteractive"
        onLoad={() => setChartReady(true)}
      />
    </>
  )
}

