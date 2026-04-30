'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Script from 'next/script'
import {
  generateFloodData,
  getStateData,
  getHistoricalData,
  calculateFloodRisk,
  getRiskColor,
  getRiskLabel,
  WeatherService,
  calculateCorrelation,
  getCorrelationInsight,
  INDIAN_STATES,
  STATE_COORDINATES,
  type StateData,
  type HistoricalData
} from './flood-data-service'

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
  const [loading, setLoading] = useState(true)
  const [selectedState, setSelectedState] = useState<string>('All')
  const [floodRiskScores, setFloodRiskScores] = useState<StateData[]>([])
  const [correlationInsight, setCorrelationInsight] = useState<string>('')
  const [apiError, setApiError] = useState<string>('')

  // Generate comprehensive flood data
  const floodData = useMemo(() => generateFloodData(), [])
  const stateData = useMemo(() => getStateData(floodData), [floodData])
  const historicalData = useMemo(() => getHistoricalData(selectedState === 'All' ? undefined : selectedState), [selectedState])

  // Get top 10 states for trends chart
  const topStates = useMemo(() => stateData.slice(0, 10), [stateData])
  const stateLabels = useMemo(() => topStates.map(s => s.name), [topStates])
  const floodTrend = useMemo(() => topStates.map(s => s.totalIncidents), [topStates])
  const affectedDistricts = useMemo(() => topStates.map(s => Math.round(s.totalIncidents * 0.3)), [topStates])
  const rainfall = useMemo(() => topStates.map(s => s.avgRainfall / 10), [topStates]) // Scale for chart

  // Historical data for charts
  const historicalMonths = useMemo(() => historicalData.slice(-12).map(d => `${d.month} ${d.year % 100}`), [historicalData])
  const historicalSeries = useMemo(() => historicalData.slice(-12).map(d => d.incidents), [historicalData])
  const historicalRainfall = useMemo(() => historicalData.slice(-12).map(d => d.rainfall / 10), [historicalData]) // Scale for chart

  // Calculate correlation
  const correlation = useMemo(() => {
    const rainfallValues = topStates.map(s => s.avgRainfall)
    const incidentValues = topStates.map(s => s.totalIncidents)
    return calculateCorrelation(rainfallValues, incidentValues)
  }, [topStates])

  // Initialize flood risk scores
  useEffect(() => {
    const initializeRiskScores = async () => {
      try {
        const scores = await Promise.all(
          stateData.map(async (state) => {
            const currentRainfall = await WeatherService.getCurrentRainfall(
              state.coordinates.lat,
              state.coordinates.lng
            )
            const riskScore = calculateFloodRisk(currentRainfall, state.avgRainfall)
            return { ...state, riskScore }
          })
        )
        setFloodRiskScores(scores)
        setCorrelationInsight(getCorrelationInsight(correlation))
      } catch (error) {
        console.error('Error initializing risk scores:', error)
        setApiError('Failed to fetch live weather data. Using cached data.')
        // Fallback to calculated risk scores
        const fallbackScores = stateData.map(state => ({
          ...state,
          riskScore: Math.round((state.avgRainfall / 3000) * 100)
        }))
        setFloodRiskScores(fallbackScores)
        setCorrelationInsight(getCorrelationInsight(correlation))
      } finally {
        setLoading(false)
      }
    }

    if (stateData.length > 0) {
      initializeRiskScores()
    }
  }, [stateData, correlation])

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
        tooltip: { 
          enabled: true,
          callbacks: {
            label: function(context: any) {
              let label = context.dataset.label || ''
              if (label) {
                label += ': '
              }
              if (context.parsed.y !== null) {
                label += context.parsed.y
              }
              return label
            }
          }
        },
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
                label: 'Total Flood Incidents (2015-2024)',
                data: floodTrend,
                backgroundColor: 'rgba(0,245,255,0.22)',
                borderColor: 'rgba(0,245,255,0.8)',
                borderWidth: 1,
              },
              {
                label: 'Estimated Affected Districts',
                data: affectedDistricts,
                backgroundColor: 'rgba(255,255,255,0.12)',
                borderColor: 'rgba(255,255,255,0.35)',
                borderWidth: 1,
              },
            ],
          },
          options: {
            ...commonOptions,
            scales: {
              ...commonOptions.scales,
              y: {
                ...commonOptions.scales.y,
                title: {
                  display: true,
                  text: 'Number of Incidents/Districts',
                  color: 'rgba(255,255,255,0.7)'
                }
              }
            }
          },
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
                label: 'Annual Average Rainfall vs Total Flood Incidents',
                data: topStates.map((state, i) => ({ 
                  x: state.avgRainfall, 
                  y: state.totalIncidents,
                  state: state.name
                })),
                backgroundColor: 'rgba(0,245,255,0.7)',
                borderColor: 'rgba(0,245,255,0.8)',
                pointRadius: 6,
                pointHoverRadius: 8,
              },
            ],
          },
          options: {
            ...commonOptions,
            scales: {
              x: { 
                title: { display: true, text: 'Annual Average Rainfall (mm)', color: 'rgba(255,255,255,0.7)' }, 
                ticks: { color: 'rgba(255,255,255,0.6)' }, 
                grid: { color: 'rgba(255,255,255,0.06)' },
                min: 500
              },
              y: { 
                title: { display: true, text: 'Total Flood Incidents (2015-2024)', color: 'rgba(255,255,255,0.7)' }, 
                ticks: { color: 'rgba(255,255,255,0.6)' }, 
                grid: { color: 'rgba(255,255,255,0.06)' },
                min: 0
              },
            },
            plugins: {
              ...commonOptions.plugins,
              tooltip: {
                callbacks: {
                  label: function(context: any) {
                    const point = context.raw
                    return [
                      `State: ${point.state}`,
                      `Rainfall: ${point.x.toFixed(0)} mm`,
                      `Incidents: ${point.y}`
                    ]
                  }
                }
              }
            }
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
                label: 'Flood Incidents',
                data: historicalSeries,
                tension: 0.35,
                borderColor: 'rgba(0,245,255,0.9)',
                backgroundColor: 'rgba(0,245,255,0.12)',
                fill: true,
                pointRadius: 3,
                yAxisID: 'y',
              },
              {
                label: 'Rainfall (×10 mm)',
                data: historicalRainfall,
                tension: 0.35,
                borderColor: 'rgba(255,255,255,0.6)',
                backgroundColor: 'rgba(255,255,255,0.05)',
                fill: false,
                pointRadius: 2,
                yAxisID: 'y1',
              },
            ],
          },
          options: {
            ...commonOptions,
            scales: {
              ...commonOptions.scales,
              y: {
                ...commonOptions.scales.y,
                type: 'linear',
                display: true,
                position: 'left',
                title: {
                  display: true,
                  text: 'Flood Incidents',
                  color: 'rgba(255,255,255,0.7)'
                }
              },
              y1: {
                ...commonOptions.scales.y,
                type: 'linear',
                display: true,
                position: 'right',
                title: {
                  display: true,
                  text: 'Rainfall (×10 mm)',
                  color: 'rgba(255,255,255,0.7)'
                },
                grid: {
                  drawOnChartArea: false,
                },
              },
            },
          },
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
  }, [chartReady, floodTrend, affectedDistricts, historicalMonths, historicalSeries, historicalRainfall, stateLabels, topStates])

  return (
    <>
      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glow-border bg-space-navy/40 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-sm text-white/60">Loading...</div>
              <div className="mt-2 text-3xl font-semibold text-white">--</div>
              <div className="mt-1 text-xs text-white/45">Fetching data</div>
            </div>
          ))}
        </div>
      )}

      {/* API Error Message */}
      {apiError && (
        <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-yellow-400 text-sm">{apiError}</p>
        </div>
      )}

      {/* Real-time Stats */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="glow-border bg-space-navy/40 backdrop-blur-sm rounded-2xl p-6">
            <div className="text-sm text-white/60">High Risk States</div>
            <div className="mt-2 text-3xl font-semibold text-white">
              {floodRiskScores.filter(s => s.riskScore >= 75).length}
            </div>
            <div className="mt-1 text-xs text-white/45">Critical monitoring required</div>
          </div>
          <div className="glow-border bg-space-navy/40 backdrop-blur-sm rounded-2xl p-6">
            <div className="text-sm text-white/60">Total Incidents (2024)</div>
            <div className="mt-2 text-3xl font-semibold text-white">
              {floodData.filter(d => d.year === 2024).reduce((sum, d) => sum + d.incidents, 0)}
            </div>
            <div className="mt-1 text-xs text-white/45">Across all states</div>
          </div>
          <div className="glow-border bg-space-navy/40 backdrop-blur-sm rounded-2xl p-6">
            <div className="text-sm text-white/60">Avg Risk Score</div>
            <div className="mt-2 text-3xl font-semibold text-white" style={{ color: getRiskColor(Math.round(floodRiskScores.reduce((sum, s) => sum + s.riskScore, 0) / floodRiskScores.length)) }}>
              {Math.round(floodRiskScores.reduce((sum, s) => sum + s.riskScore, 0) / floodRiskScores.length)}
            </div>
            <div className="mt-1 text-xs text-white/45">National average</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glow-border bg-space-navy/40 backdrop-blur-sm rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-cyan-accent">Flood trends by state (2015-2024)</h2>
            <span className="text-xs text-white/50">Top 10 states</span>
          </div>
          <div className="h-[320px]">
            <canvas ref={trendRef} />
          </div>
        </div>

        <div className="glow-border bg-space-navy/40 backdrop-blur-sm rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-cyan-accent">Rainfall correlation</h2>
            <span className="text-xs text-white/50">r = {correlation.toFixed(3)}</span>
          </div>
          <div className="h-[320px]">
            <canvas ref={correlationRef} />
          </div>
          {correlationInsight && (
            <div className="mt-3 p-3 bg-white/5 rounded-lg">
              <p className="text-xs text-white/70">{correlationInsight}</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 glow-border bg-space-navy/40 backdrop-blur-sm rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-cyan-accent">Historical flood charts</h2>
            <select 
              value={selectedState} 
              onChange={(e) => setSelectedState(e.target.value)}
              className="text-xs bg-white/10 text-white border border-white/20 rounded px-2 py-1 focus:outline-none focus:border-cyan-accent"
            >
              <option value="All">All States</option>
              {INDIAN_STATES.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
          <div className="h-[320px]">
            <canvas ref={historicalRef} />
          </div>
        </div>

        {/* Flood Risk Scores */}
        {!loading && (
          <div className="lg:col-span-2 glow-border bg-space-navy/40 backdrop-blur-sm rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-cyan-accent">Current Flood Risk Scores</h2>
              <span className="text-xs text-white/50">Real-time assessment</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {floodRiskScores.slice(0, 12).map((state) => (
                <div key={state.name} className="text-center">
                  <div 
                    className="text-lg font-bold mb-1"
                    style={{ color: getRiskColor(state.riskScore) }}
                  >
                    {state.riskScore}
                  </div>
                  <div className="text-xs text-white/60">{state.name}</div>
                  <div className="text-xs text-white/40">{getRiskLabel(state.riskScore)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Script
        src="https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js"
        strategy="afterInteractive"
        onLoad={() => setChartReady(true)}
      />
    </>
  )
}

