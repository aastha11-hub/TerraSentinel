'use client'

import { useState, useEffect, useRef } from 'react'

// Processing stages for live animation
type ProcessingStage = 'receiving' | 'processing' | 'detecting' | 'completed'

// Image view types
type ImageView = 'raw' | 'ndwi' | 'mask'

// Enhanced satellite frame data
interface EnhancedSatelliteFrame {
  id: string
  tile: string
  state: string
  sensor: 'Sentinel-1' | 'Sentinel-2' | 'RISAT' | 'Resourcesat' | 'Cartosat'
  processingStage: ProcessingStage
  captureTime: Date
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

interface RealSatelliteCardProps {
  frame: EnhancedSatelliteFrame
  isSelected: boolean
  onSelect: () => void
}

// Real satellite image paths based on sensor type
const getSatelliteImage = (sensor: string, view: ImageView) => {
  const imageMap = {
    'Sentinel-1': {
      raw: '/images/satellite/sentinel1-raw.jpg',
      ndwi: '/images/satellite/sentinel1-ndwi.jpg',
      mask: '/images/satellite/sentinel1-mask.jpg'
    },
    'Sentinel-2': {
      raw: '/images/satellite/sentinel2-raw.jpg',
      ndwi: '/images/satellite/sentinel2-ndwi.jpg',
      mask: '/images/satellite/sentinel2-mask.jpg'
    },
    'RISAT': {
      raw: '/images/satellite/risat-raw.jpg',
      ndwi: '/images/satellite/risat-ndwi.jpg',
      mask: '/images/satellite/risat-mask.jpg'
    },
    'Resourcesat': {
      raw: '/images/satellite/resourcesat-raw.jpg',
      ndwi: '/images/satellite/resourcesat-ndwi.jpg',
      mask: '/images/satellite/resourcesat-mask.jpg'
    },
    'Cartosat': {
      raw: '/images/satellite/cartosat-raw.jpg',
      ndwi: '/images/satellite/cartosat-ndwi.jpg',
      mask: '/images/satellite/cartosat-mask.jpg'
    }
  }
  
  return imageMap[sensor as keyof typeof imageMap]?.[view] || imageMap['Sentinel-2'][view]
}

// Image switch component
const ImageSwitch = ({ 
  currentView, 
  onViewChange, 
  processingStage 
}: { 
  currentView: ImageView
  onViewChange: (view: ImageView) => void
  processingStage: ProcessingStage
}) => {
  return (
    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-lg p-1 flex gap-1 z-20">
      {(['raw', 'ndwi', 'mask'] as ImageView[]).map((view) => (
        <button
          key={view}
          onClick={() => onViewChange(view)}
          disabled={processingStage !== 'completed'}
          className={`px-2 py-1 rounded text-xs font-medium transition-all ${
            currentView === view
              ? 'bg-cyan-accent text-black'
              : processingStage === 'completed'
              ? 'bg-white/10 text-white/70 hover:bg-white/20'
              : 'bg-white/5 text-white/30 cursor-not-allowed'
          }`}
        >
          {view.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

// Enhanced scanning overlay component
const EnhancedScanningOverlay = ({ active }: { active: boolean }) => {
  const [scanPosition, setScanPosition] = useState(0)
  const [blinkPoints, setBlinkPoints] = useState<{ x: number; y: number; id: number }[]>([])
  const [gridOpacity, setGridOpacity] = useState(0.2)

  useEffect(() => {
    if (!active) return

    // Animate scan line
    const scanInterval = setInterval(() => {
      setScanPosition((prev) => (prev + 2) % 100)
    }, 50)

    // Generate random blink points
    const pointsInterval = setInterval(() => {
      setBlinkPoints(prev => {
        const newPoints = Array.from({ length: 3 }, (_, i) => ({
          x: Math.random() * 100,
          y: Math.random() * 100,
          id: Date.now() + i
        }))
        return [...prev.slice(-6), ...newPoints]
      })
    }, 800)

    // Animate grid opacity
    const gridInterval = setInterval(() => {
      setGridOpacity(prev => 0.1 + Math.random() * 0.2)
    }, 2000)

    return () => {
      clearInterval(scanInterval)
      clearInterval(pointsInterval)
      clearInterval(gridInterval)
    }
  }, [active])

  if (!active) return null

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Grid overlay */}
      <div className="absolute inset-0" style={{ opacity: gridOpacity }}>
        <svg className="w-full h-full">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="cyan" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Moving scan line */}
      <div 
        className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-accent to-transparent"
        style={{ top: `${scanPosition}%` }}
      >
        <div className="absolute left-0 right-0 h-4 bg-gradient-to-r from-transparent via-cyan-accent/30 to-transparent -top-2" />
      </div>

      {/* Blinking detection points */}
      {blinkPoints.map((point) => (
        <div
          key={point.id}
          className="absolute w-2 h-2 bg-cyan-accent rounded-full animate-pulse"
          style={{ left: `${point.x}%`, top: `${point.y}%` }}
        >
          <div className="absolute inset-0 bg-cyan-accent/50 rounded-full animate-ping" />
        </div>
      ))}

      {/* LIVE SATELLITE FEED label */}
      <div className="absolute top-2 left-2 bg-red-600/90 text-white text-xs px-2 py-1 rounded flex items-center gap-1 z-15">
        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
        LIVE SATELLITE FEED
      </div>
    </div>
  )
}

// Processing status component
const EnhancedProcessingStatus = ({ stage }: { stage: ProcessingStage }) => {
  const stages = [
    { key: 'receiving', label: 'Receiving Satellite Data...', icon: '📡' },
    { key: 'processing', label: 'Processing...', icon: '⚙️' },
    { key: 'detecting', label: 'AI Detection Running...', icon: '🤖' },
    { key: 'completed', label: 'Completed', icon: '✅' }
  ]

  const currentStageIndex = stages.findIndex(s => s.key === stage)

  return (
    <div className="space-y-1">
      {stages.map((s, index) => (
        <div 
          key={s.key}
          className={`flex items-center gap-2 text-xs transition-all duration-300 ${
            index < currentStageIndex ? 'text-green-400' :
            index === currentStageIndex ? 'text-cyan-accent animate-pulse' :
            'text-white/30'
          }`}
        >
          <span>{s.icon}</span>
          <span>{s.label}</span>
          {index === currentStageIndex && (
            <div className="w-2 h-2 border border-cyan-accent border-t-transparent rounded-full animate-spin" />
          )}
          {index < currentStageIndex && (
            <span className="text-green-400">✓</span>
          )}
        </div>
      ))}
    </div>
  )
}

export default function RealSatelliteCard({ frame, isSelected, onSelect }: RealSatelliteCardProps) {
  const [currentView, setCurrentView] = useState<ImageView>('raw')
  const [imageError, setImageError] = useState(false)
  const [processingStage, setProcessingStage] = useState<ProcessingStage>(frame.processingStage)

  // Auto-cycle processing stages
  useEffect(() => {
    const stageOrder: ProcessingStage[] = ['receiving', 'processing', 'detecting', 'completed']
    let currentIndex = stageOrder.indexOf(processingStage)

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % stageOrder.length
      setProcessingStage(stageOrder[currentIndex])
    }, 3000)

    return () => clearInterval(interval)
  }, [processingStage])

  const satelliteImage = getSatelliteImage(frame.sensor, currentView)

  return (
    <div 
      onClick={onSelect}
      className={`relative cursor-pointer transition-all duration-300 rounded-xl overflow-hidden ${
        isSelected ? 'ring-2 ring-cyan-accent scale-[1.02]' : 'hover:scale-[1.01]'
      }`}
    >
      {/* Main image container */}
      <div className="h-48 relative">
        {/* Real satellite image */}
        <div className="absolute inset-0">
          {!imageError ? (
            <img
              src={satelliteImage}
              alt={`${frame.sensor} ${currentView.toUpperCase()} view`}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className={`w-full h-full ${
              frame.sensor === 'RISAT' || frame.sensor === 'Sentinel-1' 
                ? 'bg-gradient-to-br from-gray-900 to-gray-700' 
                : currentView === 'ndwi'
                ? 'bg-gradient-to-br from-cyan-600/50 to-blue-600/50'
                : currentView === 'mask'
                ? 'bg-gradient-to-br from-red-600/30 to-cyan-600/30'
                : 'bg-gradient-to-br from-green-800/30 to-blue-800/30'
            }`} />
          )}
        </div>

        {/* Scanning overlay */}
        <EnhancedScanningOverlay active={processingStage !== 'completed'} />

        {/* Image switch */}
        <ImageSwitch 
          currentView={currentView} 
          onViewChange={setCurrentView}
          processingStage={processingStage}
        />

        {/* Timestamp */}
        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm rounded px-2 py-1 text-xs text-white/70 z-15">
          Captured: {Math.floor((Date.now() - frame.captureTime.getTime()) / 60000)} mins ago
        </div>

        {/* Processing status */}
        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm rounded-lg p-2 max-w-[140px] z-15">
          <EnhancedProcessingStatus stage={processingStage} />
        </div>
      </div>

      {/* Frame info and metrics */}
      <div className="p-3 bg-black/40">
        <div className="flex items-center justify-between mb-2">
          <span className="text-cyan-accent text-sm font-medium">{frame.tile}</span>
          <span className={`text-xs px-2 py-1 rounded ${
            processingStage === 'completed' ? 'bg-green-500/20 text-green-400' :
            processingStage === 'detecting' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-white/10 text-white/50'
          }`}>
            {processingStage.toUpperCase()}
          </span>
        </div>

        {/* Stream info */}
        <div className="text-xs text-white/50 mb-2 space-y-1">
          <div>Source: {frame.streamData.source}</div>
          <div>Orbit: {frame.streamData.orbit}</div>
          <div>Latency: {frame.streamData.latency}</div>
        </div>

        {/* Real-time metrics */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-white/5 rounded p-1">
            <div className="text-white/50">Flood Risk</div>
            <div className="text-white font-medium">{frame.metrics.floodRisk}%</div>
          </div>
          <div className="bg-white/5 rounded p-1">
            <div className="text-white/50">Water Spread</div>
            <div className="text-cyan-accent font-medium">{frame.metrics.waterSpread} km²</div>
          </div>
          <div className="bg-white/5 rounded p-1">
            <div className="text-white/50">Cloud Cover</div>
            <div className="text-white font-medium">{frame.metrics.cloudCover}%</div>
          </div>
          <div className="bg-white/5 rounded p-1">
            <div className="text-white/50">AI Conf</div>
            <div className="text-green-400 font-medium">{frame.metrics.aiConfidence}%</div>
          </div>
        </div>

        {/* System indicators */}
        <div className="mt-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400">ACTIVE</span>
          </div>
          <span className="text-white/50">{frame.state}</span>
        </div>
      </div>
    </div>
  )
}
