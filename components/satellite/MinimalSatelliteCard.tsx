'use client'

import { useState } from 'react'

interface MinimalSatelliteCardProps {
  frame: {
    id: string
    tile: string
    state: string
    sensor: 'Sentinel-1' | 'Sentinel-2' | 'RISAT' | 'Resourcesat' | 'Cartosat'
    processingStage: 'receiving' | 'processing' | 'detecting' | 'completed'
    metrics: {
      floodRisk: number
      waterSpread: number
      cloudCover: number
      aiConfidence: number
      ndwi: number
      ndvi: number
      soilMoisture: number
    }
    streamData: {
      source: string
      orbit: string
      latency: string
    }
  }
  isSelected: boolean
  onSelect: () => void
}

export default function MinimalSatelliteCard({ frame, isSelected, onSelect }: MinimalSatelliteCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getStatusColor = (stage: string) => {
    switch (stage) {
      case 'receiving': return 'text-yellow-400'
      case 'processing': return 'text-blue-400'
      case 'detecting': return 'text-purple-400'
      case 'completed': return 'text-green-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusBg = (stage: string) => {
    switch (stage) {
      case 'receiving': return 'bg-yellow-400/10 border-yellow-400/30'
      case 'processing': return 'bg-blue-400/10 border-blue-400/30'
      case 'detecting': return 'bg-purple-400/10 border-purple-400/30'
      case 'completed': return 'bg-green-400/10 border-green-400/30'
      default: return 'bg-gray-400/10 border-gray-400/30'
    }
  }

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative cursor-pointer transition-all duration-300 rounded-xl border ${
        isSelected 
          ? 'border-cyan-accent bg-cyan-accent/5 scale-[1.02]' 
          : 'border-white/10 bg-black/40 hover:border-cyan-accent/50 hover:bg-black/60'
      } ${isHovered ? 'shadow-lg shadow-cyan-accent/20' : ''}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-xs text-white/50 font-mono">{frame.tile}</div>
            <div className="text-lg font-bold text-cyan-accent">{frame.state}</div>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBg(frame.processingStage)}`}>
            <span className={getStatusColor(frame.processingStage)}>
              {frame.processingStage.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="p-4 space-y-3">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-xs text-white/50 mb-1">Flood Risk</div>
            <div className="text-xl font-bold text-white">{frame.metrics.floodRisk}%</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-xs text-white/50 mb-1">Water Spread</div>
            <div className="text-xl font-bold text-cyan-accent">{frame.metrics.waterSpread} km²</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-xs text-white/50 mb-1">Cloud Cover</div>
            <div className="text-xl font-bold text-white">{frame.metrics.cloudCover}%</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-xs text-white/50 mb-1">AI Confidence</div>
            <div className="text-xl font-bold text-green-400">{frame.metrics.aiConfidence}%</div>
          </div>
        </div>

        {/* Stream Data */}
        <div className="border-t border-white/10 pt-3 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-white/50">Source</span>
            <span className="text-cyan-accent font-mono">{frame.streamData.source}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-white/50">Orbit</span>
            <span className="text-white font-mono">{frame.streamData.orbit}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-white/50">Latency</span>
            <span className="text-yellow-400 font-mono">{frame.streamData.latency}</span>
          </div>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-accent/10 to-transparent rounded-xl" />
          <div className="absolute inset-0 border-2 border-cyan-accent/50 rounded-xl animate-pulse" />
        </div>
      )}
    </div>
  )
}
