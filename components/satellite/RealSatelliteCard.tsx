'use client'

import { useState, useEffect, useRef } from 'react'
import SatelliteImage from '../SatelliteImage'

// Processing stages for live animation
type ProcessingStage = 'receiving' | 'processing' | 'detecting' | 'completed'

// Image view types
type ImageView = 'raw' | 'ndwi' | 'mask'

// Enhanced satellite frame data with hybrid image sources
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
  // Hybrid image sources (API + local fallback)
  imageSources: {
    raw: {
      api?: string
      local: string
    }
    ndwi: {
      api?: string
      local: string
    }
    mask: {
      api?: string
      local: string
    }
  }
}

interface RealSatelliteCardProps {
  frame: EnhancedSatelliteFrame
  isSelected: boolean
  onSelect: () => void
}

// Get hybrid image sources for satellite
const getSatelliteImageSources = (sensor: string) => {
  // Mock API endpoints (replace with real satellite APIs)
  const apiEndpoints = {
    'Sentinel-1': {
      raw: 'https://api.sentinel-hub.com/v1/process/sentinel-1-raw',
      ndwi: 'https://api.sentinel-hub.com/v1/process/sentinel-1-ndwi',
      mask: 'https://api.sentinel-hub.com/v1/process/sentinel-1-mask'
    },
    'Sentinel-2': {
      raw: 'https://api.sentinel-hub.com/v1/process/sentinel-2-raw',
      ndwi: 'https://api.sentinel-hub.com/v1/process/sentinel-2-ndwi',
      mask: 'https://api.sentinel-hub.com/v1/process/sentinel-2-mask'
    },
    'RISAT': {
      raw: 'https://api.isro.gov.in/v1/process/risat-raw',
      ndwi: 'https://api.isro.gov.in/v1/process/risat-ndwi',
      mask: 'https://api.isro.gov.in/v1/process/risat-mask'
    },
    'Resourcesat': {
      raw: 'https://api.isro.gov.in/v1/process/resourcesat-raw',
      ndwi: 'https://api.isro.gov.in/v1/process/resourcesat-ndwi',
      mask: 'https://api.isro.gov.in/v1/process/resourcesat-mask'
    },
    'Cartosat': {
      raw: 'https://api.isro.gov.in/v1/process/cartosat-raw',
      ndwi: 'https://api.isro.gov.in/v1/process/cartosat-ndwi',
      mask: 'https://api.isro.gov.in/v1/process/cartosat-mask'
    }
  }

  // Local fallback paths
  const localPaths = {
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

  const apiSources = apiEndpoints[sensor as keyof typeof apiEndpoints] || apiEndpoints['Sentinel-2']
  const localSources = localPaths[sensor as keyof typeof localPaths] || localPaths['Sentinel-2']

  return {
    raw: {
      api: apiSources.raw,
      local: localSources.raw
    },
    ndwi: {
      api: apiSources.ndwi,
      local: localSources.ndwi
    },
    mask: {
      api: apiSources.mask,
      local: localSources.mask
    }
  }
}

// Get satellite mode type
const getSatelliteMode = (sensor: string) => {
  const sarSensors = ['Sentinel-1', 'RISAT']
  return sarSensors.includes(sensor) ? 'SAR' : 'Optical'
}

// Generate random coordinates for realistic positioning
const generateCoordinates = () => {
  const lat = (Math.random() * 10 + 15).toFixed(4) // 15-25°N (India region)
  const lon = (Math.random() * 20 + 70).toFixed(4) // 70-90°E (India region)
  return { lat, lon }
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

// Enhanced scanning overlay component (ON TOP of image)
const EnhancedScanningOverlay = ({ active }: { active: boolean }) => {
  const [scanPosition, setScanPosition] = useState(0)
  const [blinkPoints, setBlinkPoints] = useState<{ x: number; y: number; id: number }[]>([])
  const [gridOpacity, setGridOpacity] = useState(0.15)

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
      setGridOpacity(prev => 0.05 + Math.random() * 0.1)
    }, 2000)

    return () => {
      clearInterval(scanInterval)
      clearInterval(pointsInterval)
      clearInterval(gridInterval)
    }
  }, [active])

  if (!active) return null

  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      {/* Corner brackets (targeting UI) */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-accent" />
      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-accent" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-accent" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-accent" />

      {/* Grid overlay (low opacity) */}
      <div className="absolute inset-0" style={{ opacity: gridOpacity }}>
        <svg className="w-full h-full">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="cyan" strokeWidth="0.3"/>
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
        <div className="absolute left-0 right-0 h-4 bg-gradient-to-r from-transparent via-cyan-accent/20 to-transparent -top-2" />
      </div>

      {/* Blinking tracking dots */}
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
      <div className="absolute top-2 left-2 bg-red-600/90 text-white text-xs px-2 py-1 rounded flex items-center gap-1 z-40">
        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
        LIVE SATELLITE FEED
      </div>
    </div>
  )
}

// Image metadata overlay component
const ImageMetadataOverlay = ({ frame, processingStage }: { frame: EnhancedSatelliteFrame, processingStage: ProcessingStage }) => {
  const coordinates = generateCoordinates()
  const mode = getSatelliteMode(frame.sensor)
  
  return (
    <div className="absolute inset-0 pointer-events-none z-25">
      {/* Top-left: Satellite name and mode */}
      <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm rounded px-2 py-1 text-xs text-white z-40">
        <div className="font-medium">{frame.sensor}</div>
        <div className="text-white/70 text-[10px]">{mode}</div>
      </div>

      {/* Top-right: Status */}
      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded px-2 py-1 text-xs z-40">
        <div className={`font-medium ${
          processingStage === 'completed' ? 'text-green-400' :
          processingStage === 'detecting' ? 'text-yellow-400' :
          processingStage === 'processing' ? 'text-blue-400' :
          'text-cyan-accent animate-pulse'
        }`}>
          {processingStage.charAt(0).toUpperCase() + processingStage.slice(1)}
        </div>
      </div>

      {/* Bottom-left: Captured time */}
      <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm rounded px-2 py-1 text-xs text-white/70 z-40">
        Captured: {Math.floor((Date.now() - frame.captureTime.getTime()) / 60000)} mins ago
      </div>

      {/* Bottom-right: Coordinates */}
      <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm rounded px-2 py-1 text-xs text-white/70 z-40">
        <div>{coordinates.lat}°N</div>
        <div>{coordinates.lon}°E</div>
      </div>
    </div>
  )
}

// Multi-layer image stack component with hybrid loading
const MultiLayerImageStack = ({ frame, currentView }: { frame: EnhancedSatelliteFrame, currentView: ImageView }) => {
  const [baseLoaded, setBaseLoaded] = useState(false)
  const [ndwiLoaded, setNdwiLoaded] = useState(false)
  const [maskLoaded, setMaskLoaded] = useState(false)

  const rawSources = frame.imageSources.raw
  const ndwiSources = frame.imageSources.ndwi
  const maskSources = frame.imageSources.mask

  return (
    <div className="absolute inset-0">
      {/* Base layer: RAW satellite image with hybrid loading */}
      <div className="absolute inset-0">
        <SatelliteImage
          apiSrc={rawSources.api}
          localSrc={rawSources.local}
          alt={`${frame.sensor} RAW view`}
          className="w-full h-full"
          onLoad={() => setBaseLoaded(true)}
        />
      </div>

      {/* Overlay layer: NDWI (semi-transparent blue) with hybrid loading */}
      {(currentView === 'ndwi' || currentView === 'mask') && (
        <div className="absolute inset-0" style={{ opacity: currentView === 'ndwi' ? 0.4 : 0.2 }}>
          <SatelliteImage
            apiSrc={ndwiSources.api}
            localSrc={ndwiSources.local}
            alt={`${frame.sensor} NDWI overlay`}
            className="w-full h-full"
            onLoad={() => setNdwiLoaded(true)}
          />
        </div>
      )}

      {/* Top layer: AI Mask (highlight flood regions) with hybrid loading */}
      {currentView === 'mask' && (
        <div className="absolute inset-0" style={{ opacity: 0.6 }}>
          <SatelliteImage
            apiSrc={maskSources.api}
            localSrc={maskSources.local}
            alt={`${frame.sensor} AI mask`}
            className="w-full h-full"
            onLoad={() => setMaskLoaded(true)}
          />
        </div>
      )}

      {/* Noise/grain layer for live feed effect */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="w-full h-full bg-black" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px'
          }}
        />
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
  const [processingStage, setProcessingStage] = useState<ProcessingStage>(frame.processingStage)
  const [brightness, setBrightness] = useState(100)
  const [scale, setScale] = useState(1)
  const [lastRefresh, setLastRefresh] = useState(Date.now())

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

  // Real-time image effects
  useEffect(() => {
    // Slight zoom animation (scale 1 -> 1.05 loop)
    const scaleInterval = setInterval(() => {
      setScale(prev => {
        const newScale = prev + 0.001
        return newScale > 1.05 ? 1 : newScale
      })
    }, 50)

    // Subtle brightness flicker (like feed fresh)
    const brightnessInterval = setInterval(() => {
      setBrightness(prev => {
        const flicker = Math.random() * 4 - 2 // -2 to +2
        return Math.max(95, Math.min(105, 100 + flicker))
      })
    }, 2000)

    return () => {
      clearInterval(scaleInterval)
      clearInterval(brightnessInterval)
    }
  }, [])

  // Auto-refresh for live feed feel (refresh every 30 seconds)
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      setLastRefresh(Date.now())
      // Trigger a subtle refresh effect
      setBrightness(95)
      setTimeout(() => setBrightness(100), 200)
    }, 30000)

    return () => clearInterval(refreshInterval)
  }, [])

  return (
    <div 
      onClick={onSelect}
      className={`relative cursor-pointer transition-all duration-300 rounded-xl overflow-hidden ${
        isSelected ? 'ring-2 ring-cyan-accent scale-[1.02]' : 'hover:scale-[1.01]'
      }`}
    >
      {/* Main image container with multi-layer stack */}
      <div className="h-48 relative">
        {/* Multi-layer image stack */}
        <div 
          className="absolute inset-0 transition-transform duration-1000 ease-in-out"
          style={{ 
            transform: `scale(${scale})`,
            filter: `brightness(${brightness}%)`
          }}
        >
          <MultiLayerImageStack frame={frame} currentView={currentView} />
        </div>

        {/* Image metadata overlay */}
        <ImageMetadataOverlay frame={frame} processingStage={processingStage} />

        {/* Scanning overlay (ON TOP of image) */}
        <EnhancedScanningOverlay active={processingStage !== 'completed'} />

        {/* Image switch */}
        <ImageSwitch 
          currentView={currentView} 
          onViewChange={setCurrentView}
          processingStage={processingStage}
        />

        {/* Processing status */}
        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm rounded-lg p-2 max-w-[140px] z-40">
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
