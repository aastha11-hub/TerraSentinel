'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    L?: any
  }
}

type FloodRegion = {
  name: string
  bounds: [[number, number], [number, number]]
}

const FLOOD_REGIONS: FloodRegion[] = [
  { name: 'Assam (Brahmaputra Basin)', bounds: [[26.0, 90.0], [27.8, 95.2]] },
  { name: 'Bihar (Ganga Plains)', bounds: [[25.0, 83.0], [26.8, 87.7]] },
  { name: 'Gujarat (Sabarmati Basin)', bounds: [[22.5, 71.0], [24.1, 73.2]] },
]

export default function LiveMapClient() {
  const mapDivRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<any>(null)
  const layersRef = useRef<{ flood?: any; satellite?: any }>({})

  const [isSatelliteOn, setIsSatelliteOn] = useState(false)
  const [query, setQuery] = useState('')
  const [timestamp] = useState(() => new Date().toLocaleString())

  const match = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return null
    return FLOOD_REGIONS.find((r) => r.name.toLowerCase().includes(q)) ?? null
  }, [query])

  useEffect(() => {
    if (!window.L) return
    if (!mapDivRef.current) return
    if (mapRef.current) return

    const L = window.L
    const map = L.map(mapDivRef.current, {
      zoomControl: true,
      attributionControl: true,
    }).setView([22.5, 79.0], 5)

    const base = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    })
    base.addTo(map)

    const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
    })

    const floodLayer = L.layerGroup()
    FLOOD_REGIONS.forEach((region) => {
      const rect = L.rectangle(region.bounds, {
        color: '#00F5FF',
        weight: 2,
        fillColor: '#00F5FF',
        fillOpacity: 0.12,
      }).bindPopup(`<b>${region.name}</b><br/>Flood-affected region (demo overlay)`)
      rect.addTo(floodLayer)
    })
    floodLayer.addTo(map)

    mapRef.current = map
    layersRef.current = { flood: floodLayer, satellite }

    return () => {
      try {
        map.remove()
      } catch {}
      mapRef.current = null
      layersRef.current = {}
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    const satellite = layersRef.current.satellite
    if (!map || !satellite) return
    if (isSatelliteOn) satellite.addTo(map)
    else map.removeLayer(satellite)
  }, [isSatelliteOn])

  useEffect(() => {
    if (!match) return
    const map = mapRef.current
    if (!map) return
    const [[south, west], [north, east]] = match.bounds
    map.fitBounds(
      [
        [south, west],
        [north, east],
      ],
      { padding: [40, 40] },
    )
  }, [match])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
      <div className="glow-border bg-space-navy/40 backdrop-blur-sm rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between gap-4">
          <div className="text-sm text-white/70">
            Satellite timestamp: <span className="text-white font-mono">{timestamp}</span>
          </div>
          <label className="inline-flex items-center gap-2 text-sm text-white/80">
            <input
              type="checkbox"
              checked={isSatelliteOn}
              onChange={(e) => setIsSatelliteOn(e.target.checked)}
              className="accent-cyan-accent"
            />
            Satellite layer
          </label>
        </div>

        <div ref={mapDivRef} className="h-[520px] w-full" />
      </div>

      <aside className="glow-border bg-space-navy/40 backdrop-blur-sm rounded-2xl p-5">
        <h2 className="text-lg font-semibold text-cyan-accent mb-4">Search</h2>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search state / region (e.g., Assam, Bihar, Gujarat)"
          className="w-full px-4 py-3 bg-black/30 border border-white/10 focus:border-cyan-accent/50 outline-none text-white placeholder:text-white/40"
        />
        <div className="mt-4 text-sm text-white/70">
          {match ? (
            <>
              Match: <span className="text-white">{match.name}</span>
            </>
          ) : query.trim() ? (
            <>No match found. Try “Assam”, “Bihar”, or “Gujarat”.</>
          ) : (
            <>Type to zoom to a highlighted region.</>
          )}
        </div>

        <div className="mt-8">
          <h3 className="text-sm font-semibold text-white/90 mb-3">Flood overlays</h3>
          <ul className="space-y-2 text-sm text-white/70">
            {FLOOD_REGIONS.map((r) => (
              <li key={r.name} className="flex items-center justify-between gap-3">
                <span>{r.name}</span>
                <button
                  className="text-cyan-accent hover:text-white transition-colors"
                  onClick={() => setQuery(r.name.split(' ')[0])}
                >
                  Zoom
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <Script
        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        strategy="afterInteractive"
        onLoad={() => {
          // Leaflet is initialized by effect once window.L is available.
        }}
      />
    </div>
  )
}

