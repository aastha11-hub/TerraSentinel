'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Map as LeafletMap, Rectangle, TileLayer } from 'leaflet'
import FloodOverlayPanel from '@/components/live-map/FloodOverlayPanel'
import { FLOOD_REGIONS, type FloodRegion } from '@/app/live-map/flood-regions'

type MapStatus = 'loading' | 'ready' | 'error'

const DEFAULT_OVERLAY_STYLE = {
  color: '#00F5FF',
  weight: 2,
  fillColor: '#00F5FF',
  fillOpacity: 0.12,
} as const

const ACTIVE_OVERLAY_STYLE = {
  color: '#00F5FF',
  weight: 3,
  fillColor: '#00F5FF',
  fillOpacity: 0.2,
} as const

function getLeafletModule(leaflet: typeof import('leaflet')) {
  return (leaflet as { default?: typeof import('leaflet') }).default ?? leaflet
}

function isValidBounds(bounds: FloodRegion['bounds']) {
  const [[south, west], [north, east]] = bounds
  const nums = [south, west, north, east]
  return nums.every((n) => Number.isFinite(n)) && south < north && west < east
}

export default function LiveMapClient() {
  const mapDivRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<LeafletMap | null>(null)
  const layersRef = useRef<{
    floodRectById?: Record<string, Rectangle>
    satellite?: TileLayer
  }>({})

  const [isSatelliteOn, setIsSatelliteOn] = useState(false)
  const [query, setQuery] = useState('')
  const [activeRegionId, setActiveRegionId] = useState<string | null>(null)
  const [timestamp] = useState(() => new Date().toLocaleString())
  const [mapStatus, setMapStatus] = useState<MapStatus>('loading')
  const [mapError, setMapError] = useState<string | null>(null)
  const [initAttempt, setInitAttempt] = useState(0)

  const renderFloodOverlays = useCallback((regionId: string | null) => {
    const map = mapRef.current
    const floodRectById = layersRef.current.floodRectById
    if (!map || !floodRectById) return

    const showAll = !regionId

    Object.entries(floodRectById).forEach(([id, rect]) => {
      const isActive = regionId === id

      if (isActive) {
        rect.setStyle(ACTIVE_OVERLAY_STYLE)
        if (!map.hasLayer(rect)) rect.addTo(map)
        return
      }

      rect.setStyle(DEFAULT_OVERLAY_STYLE)

      if (showAll) {
        if (!map.hasLayer(rect)) rect.addTo(map)
      } else if (map.hasLayer(rect)) {
        map.removeLayer(rect)
      }
    })
  }, [])

  const zoomToRegion = useCallback((region: FloodRegion) => {
    const map = mapRef.current
    if (!map || !isValidBounds(region.bounds)) return

    const [[south, west], [north, east]] = region.bounds
    try {
      map.fitBounds(
        [
          [south, west],
          [north, east],
        ],
        { padding: [40, 40], animate: true, duration: 0.5 },
      )
    } catch (err) {
      console.error('[TerraSentinel LiveMap] fitBounds failed', err)
    }
  }, [])

  const handleRegionSelect = useCallback(
    (region: FloodRegion) => {
      setQuery(region.state)
      setActiveRegionId(region.id)
      renderFloodOverlays(region.id)
      zoomToRegion(region)
    },
    [renderFloodOverlays, zoomToRegion],
  )

  const handleQueryChange = useCallback(
    (value: string) => {
      setQuery(value)
      if (activeRegionId) setActiveRegionId(null)
    },
    [activeRegionId],
  )

  const handleRetry = useCallback(() => {
    setMapError(null)
    setMapStatus('loading')
    setInitAttempt((n) => n + 1)
  }, [])

  useEffect(() => {
    let disposed = false
    let map: LeafletMap | null = null
    const container = mapDivRef.current

    if (!container) {
      setMapError('Map container not available')
      setMapStatus('error')
      return
    }

    async function initMap() {
      try {
        setMapStatus('loading')
        setMapError(null)

        const leafletModule = await import('leaflet')
        const L = getLeafletModule(leafletModule)

        if (disposed || !mapDivRef.current) return

        if (mapRef.current) {
          mapRef.current.remove()
          mapRef.current = null
          layersRef.current = {}
        }

        map = L.map(mapDivRef.current, {
          zoomControl: true,
          attributionControl: true,
          preferCanvas: true,
        }).setView([22.5937, 78.9629], 5)

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map)

        const satellite = L.tileLayer(
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          {
            maxZoom: 19,
            attribution: 'Tiles &copy; Esri',
          },
        )

        const floodRectById: Record<string, Rectangle> = {}

        FLOOD_REGIONS.forEach((region) => {
          if (!isValidBounds(region.bounds)) return

          floodRectById[region.id] = L.rectangle(region.bounds, DEFAULT_OVERLAY_STYLE).bindPopup(
            `<b>${region.name}</b><br/>${region.basin}<br/>Flood monitoring overlay`,
          )
        })

        mapRef.current = map
        layersRef.current = { floodRectById, satellite }

        requestAnimationFrame(() => {
          if (!disposed && mapRef.current) {
            mapRef.current.invalidateSize()
          }
        })

        setTimeout(() => {
          if (!disposed && mapRef.current) {
            mapRef.current.invalidateSize()
          }
        }, 150)

        if (!disposed) setMapStatus('ready')
      } catch (err) {
        if (disposed) return
        const message =
          err instanceof Error ? err.message : 'Failed to initialize flood map'
        setMapError(message)
        setMapStatus('error')
        console.error('[TerraSentinel LiveMap]', err)
      }
    }

    initMap()

    return () => {
      disposed = true
      if (map) {
        try {
          map.remove()
        } catch {
          /* ignore */
        }
      }
      mapRef.current = null
      layersRef.current = {}
    }
  }, [initAttempt])

  useEffect(() => {
    const map = mapRef.current
    const satellite = layersRef.current.satellite
    if (!map || !satellite || mapStatus !== 'ready') return

    if (isSatelliteOn) satellite.addTo(map)
    else map.removeLayer(satellite)
  }, [isSatelliteOn, mapStatus])

  useEffect(() => {
    if (mapStatus !== 'ready') return
    renderFloodOverlays(activeRegionId)
  }, [activeRegionId, mapStatus, renderFloodOverlays])

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_360px]">
      <div className="glow-border overflow-hidden rounded-2xl bg-space-navy/40 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
          <div className="text-sm text-white/70">
            Satellite timestamp: <span className="font-mono text-white">{timestamp}</span>
          </div>
          <label className="inline-flex items-center gap-2 text-sm text-white/80">
            <input
              type="checkbox"
              checked={isSatelliteOn}
              onChange={(e) => setIsSatelliteOn(e.target.checked)}
              className="accent-cyan-accent"
              disabled={mapStatus !== 'ready'}
            />
            Satellite layer
          </label>
        </div>

        <div className="relative h-[520px] w-full min-h-[520px]">
          <div
            ref={mapDivRef}
            className="live-map-container absolute inset-0 z-0 h-full w-full min-h-[520px]"
            aria-label="Live flood monitoring map"
          />

          {mapStatus === 'loading' && (
            <div
              className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-space-navy/80 text-sm text-white/60"
              role="status"
              aria-live="polite"
            >
              Initializing geospatial map…
            </div>
          )}

          {mapStatus === 'error' && (
            <div
              className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-space-navy/90 px-6 text-center"
              role="alert"
            >
              <p className="text-sm text-white/70">Map failed to load</p>
              {mapError && (
                <p className="max-w-md font-mono text-xs text-white/40">{mapError}</p>
              )}
              <button
                type="button"
                onClick={handleRetry}
                className="border border-cyan-accent/40 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-cyan-accent transition-colors duration-200 hover:border-cyan-accent/70 hover:bg-cyan-accent/10"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </div>

      <FloodOverlayPanel
        regions={FLOOD_REGIONS}
        query={query}
        onQueryChange={handleQueryChange}
        onRegionSelect={handleRegionSelect}
        activeRegionId={activeRegionId}
      />
    </div>
  )
}
