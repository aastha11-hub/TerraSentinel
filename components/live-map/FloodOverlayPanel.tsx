'use client'

import { useMemo, useState } from 'react'
import {
  filterFloodRegions,
  type FloodRegion,
} from '@/app/live-map/flood-regions'

const SUGGESTION_LIMIT = 8

type FloodOverlayPanelProps = {
  regions: FloodRegion[]
  query: string
  onQueryChange: (value: string) => void
  onRegionSelect: (region: FloodRegion) => void
  activeRegionId?: string | null
}

export default function FloodOverlayPanel({
  regions,
  query,
  onQueryChange,
  onRegionSelect,
  activeRegionId,
}: FloodOverlayPanelProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const filteredRegions = useMemo(
    () => filterFloodRegions(query, regions),
    [query, regions],
  )

  const suggestions = useMemo(() => {
    const q = query.trim()
    if (!q) return []
    return filteredRegions.slice(0, SUGGESTION_LIMIT)
  }, [query, filteredRegions])

  const showSuggestions =
    query.trim().length > 0 && suggestions.length > 0 && !activeRegionId

  return (
    <aside className="glow-border rounded-2xl bg-space-navy/40 p-5 backdrop-blur-sm">
      <h2 className="mb-1 text-lg font-semibold text-cyan-accent">Search</h2>
      <p className="mb-4 text-[11px] uppercase tracking-[0.14em] text-white/40">
        Geospatial region intelligence
      </p>

      <div className="relative">
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search state, basin, or region…"
          aria-label="Search flood monitoring regions"
          aria-autocomplete="list"
          aria-controls="flood-region-suggestions"
          className="w-full border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-colors duration-200 placeholder:text-white/40 focus:border-cyan-accent/50 focus:shadow-[0_0_12px_rgba(0,245,255,0.12)]"
        />

        {showSuggestions && (
          <ul
            id="flood-region-suggestions"
            role="listbox"
            className="absolute left-0 right-0 top-[calc(100%+4px)] z-20 max-h-52 overflow-y-auto border border-cyan-accent/20 bg-space-navy/98 shadow-[0_8px_24px_rgba(0,0,0,0.45)] overlay-scrollbar"
          >
            {suggestions.map((region) => (
              <li key={region.id} role="option">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => onRegionSelect(region)}
                  className="flex w-full flex-col gap-0.5 border-b border-white/[0.06] px-3 py-2.5 text-left transition-colors duration-200 hover:bg-cyan-accent/10 hover:text-cyan-accent"
                >
                  <span className="text-sm font-medium text-white">{region.state}</span>
                  <span className="text-[11px] text-white/50">{region.basin}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-3 min-h-[1.25rem] text-xs text-white/55">
        {query.trim() ? (
          filteredRegions.length > 0 ? (
            <span>
              <span className="font-mono text-cyan-accent/80">{filteredRegions.length}</span>
              {' '}
              region{filteredRegions.length !== 1 ? 's' : ''} matched
            </span>
          ) : (
            <span className="text-white/45">
              No match. Try Assam, Kerala, Maharashtra, or a river basin name.
            </span>
          )
        ) : (
          <span>Type to filter · Select a region to zoom the map</span>
        )}
      </div>

      <div className="mt-6 border-t border-white/[0.08] pt-5">
        <div className="mb-3 flex items-baseline justify-between gap-2">
          <h3 className="text-sm font-semibold text-white/90">Flood overlays</h3>
          <span className="font-mono text-[10px] text-white/35">
            {filteredRegions.length}/{regions.length}
          </span>
        </div>

        <ul
          className="max-h-[340px] space-y-1 overflow-y-auto pr-1 overlay-scrollbar"
          role="list"
        >
          {filteredRegions.map((region) => {
            const isActive = activeRegionId === region.id
            const isHovered = hoveredId === region.id

            return (
              <li key={region.id}>
                <div
                  onMouseEnter={() => setHoveredId(region.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={[
                    'group flex items-center justify-between gap-3 rounded border px-3 py-2 transition-all duration-200',
                    isActive
                      ? 'border-cyan-accent/40 bg-cyan-accent/10 shadow-[0_0_12px_rgba(0,245,255,0.12)]'
                      : isHovered
                        ? 'border-cyan-accent/25 bg-white/[0.04]'
                        : 'border-transparent bg-transparent hover:border-white/10 hover:bg-white/[0.03]',
                  ].join(' ')}
                >
                  <button
                    type="button"
                    onClick={() => onRegionSelect(region)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <span
                      className={[
                        'block truncate text-[13px] font-medium transition-colors duration-200',
                        isActive || isHovered ? 'text-cyan-accent' : 'text-white/75',
                      ].join(' ')}
                    >
                      {region.state}
                    </span>
                    <span className="block truncate text-[11px] text-white/45">
                      {region.basin}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onRegionSelect(region)}
                    className="shrink-0 text-[11px] font-semibold uppercase tracking-wider text-cyan-accent/80 transition-colors duration-200 hover:text-cyan-accent"
                  >
                    Zoom
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </aside>
  )
}
