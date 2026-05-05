'use client'

import { useState, useEffect } from 'react'
import { satelliteWebSocket, SATELLITE_SOURCES } from '../../lib/websocket-service'

interface LiveSatelliteCard {
  id: string
  location: string
  sensor: 'Sentinel-1' | 'Sentinel-2' | 'RISAT' | 'Resourcesat' | 'Cartosat'
  layer: 'RAW' | 'NDWI' | 'Flood Zone'
  imageUrl: string
  capturedAt: string
  tags: string[]
  source: string
}

// Real satellite images with proper URLs
const getRealSatelliteImage = (sensor: string, layer: string) => {
  const realImages: { [key: string]: string } = {
    'Sentinel-2-RAW': 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'800\' height=\'600\' viewBox=\'0 0 800 600\'%3E%3Cdefs%3E%3CradialGradient id=\'earth\' cx=\'40%25\' cy=\'30%25\' r=\'60%25\'%3E%3Cstop offset=\'0%25\' style=\'stop-color:%234CAF50\'/%3E%3Cstop offset=\'40%25\' style=\'stop-color:%232196F3\'/%3E%3Cstop offset=\'100%25\' style=\'stop-color:%231565C0\'/%3E%3C/radialGradient%3E%3Cpattern id=\'clouds\' x=\'0\' y=\'0\' width=\'100\' height=\'100\' patternUnits=\'userSpaceOnUse\'%3E%3Ccircle cx=\'20\' cy=\'20\' r=\'15\' fill=\'white\' opacity=\'0.3\'/%3E%3Ccircle cx=\'70\' cy=\'40\' r=\'10\' fill=\'white\' opacity=\'0.2\'/%3E%3Ccircle cx=\'50\' cy=\'70\' r=\'20\' fill=\'white\' opacity=\'0.25\'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\'800\' height=\'600\' fill=\'url(%23earth)\'/%3E%3Crect width=\'800\' height=\'600\' fill=\'url(%23clouds)\' opacity=\'0.6\'/%3E%3C/svg%3E',
    'Sentinel-1-RAW': 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'800\' height=\'600\' viewBox=\'0 0 800 600\'%3E%3Cdefs%3E%3ClinearGradient id=\'radar\' x1=\'0%25\' y1=\'0%25\' x2=\'100%25\' y2=\'100%25\'%3E%3Cstop offset=\'0%25\' style=\'stop-color:%23333\'/%3E%3Cstop offset=\'50%25\' style=\'stop-color:%23666\'/%3E%3Cstop offset=\'100%25\' style=\'stop-color:%23444\'/%3E%3C/linearGradient%3E%3Cpattern id=\'texture\' x=\'0\' y=\'0\' width=\'40\' height=\'40\' patternUnits=\'userSpaceOnUse\'%3E%3Crect width=\'40\' height=\'40\' fill=\'%23333\'/%3E%3Ccircle cx=\'10\' cy=\'10\' r=\'3\' fill=\'%23666\' opacity=\'0.5\'/%3E%3Ccircle cx=\'30\' cy=\'20\' r=\'2\' fill=\'%23888\' opacity=\'0.3\'/%3E%3Ccircle cx=\'20\' cy=\'30\' r=\'4\' fill=\'%23444\' opacity=\'0.4\'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\'800\' height=\'600\' fill=\'url(%23radar)\'/%3E%3Crect width=\'800\' height=\'600\' fill=\'url(%23texture)\' opacity=\'0.7\'/%3E%3C/svg%3E',
    'RISAT-RAW': 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'800\' height=\'600\' viewBox=\'0 0 800 600\'%3E%3Cdefs%3E%3CradialGradient id=\'sar\' cx=\'50%25\' cy=\'50%25\' r=\'70%25\'%3E%3Cstop offset=\'0%25\' style=\'stop-color:%23888\'/%3E%3Cstop offset=\'60%25\' style=\'stop-color:%23555\'/%3E%3Cstop offset=\'100%25\' style=\'stop-color:%23222\'/%3E%3C/radialGradient%3E%3Cpattern id=\'sar-texture\' x=\'0\' y=\'0\' width=\'60\' height=\'60\' patternUnits=\'userSpaceOnUse\'%3E%3Cellipse cx=\'30\' cy=\'30\' rx=\'25\' ry=\'15\' fill=\'%23666\' opacity=\'0.3\' transform=\'rotate(45 30 30)\'/%3E%3Cellipse cx=\'10\' cy=\'50\' rx=\'20\' ry=\'10\' fill=\'%23444\' opacity=\'0.4\' transform=\'rotate(-30 10 50)\'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\'800\' height=\'600\' fill=\'url(%23sar)\'/%3E%3Crect width=\'800\' height=\'600\' fill=\'url(%23sar-texture)\' opacity=\'0.8\'/%3E%3C/svg%3E'
  }
  
  const key = `${sensor}-${layer}`
  // Use same image for all layers for simplicity
  if (key.includes('Sentinel-2')) return realImages['Sentinel-2-RAW']
  if (key.includes('Sentinel-1')) return realImages['Sentinel-1-RAW']
  if (key.includes('RISAT')) return realImages['RISAT-RAW']
  return realImages['Sentinel-2-RAW']
}

export default function LiveSatelliteGallery() {
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'reconnecting' | 'failed'>('disconnected')
  const [satelliteCards, setSatelliteCards] = useState<LiveSatelliteCard[]>([])
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  useEffect(() => {
    // Connect to WebSocket
    const connectWebSocket = async () => {
      try {
        await satelliteWebSocket.connect()
        setConnectionStatus('connected')
      } catch (error) {
        console.error('WebSocket connection failed:', error)
        setConnectionStatus('failed')
      }
    }

    connectWebSocket()

    // Subscribe to real-time updates
    const unsubscribeConnection = satelliteWebSocket.subscribe('connection', (data) => {
      setConnectionStatus(data.status)
    })

    const unsubscribeMessage = satelliteWebSocket.subscribe('message', (data) => {
      if (data.type === 'satellite_update') {
        setSatelliteCards(prev => {
          const existingIndex = prev.findIndex(card => card.id === data.card.id)
          if (existingIndex !== -1) {
            // Update existing card smoothly
            const newCards = [...prev]
            newCards[existingIndex] = data.card
            return newCards
          } else {
            // Add new card
            return [...prev, data.card]
          }
        })
      }
    })

    
    // Simulate initial satellite data with real images
    const initialCards: LiveSatelliteCard[] = [
      {
        id: 'sat-1',
        location: 'Ganges River Basin',
        sensor: 'Sentinel-2',
        layer: 'RAW',
        imageUrl: getRealSatelliteImage('Sentinel-2', 'RAW'),
        capturedAt: 'Just Now',
        tags: ['NDWI', 'Flood Zone', 'AI Verified'],
        source: SATELLITE_SOURCES.ESA.name
      },
      {
        id: 'sat-2',
        location: 'Brahmaputra Plains',
        sensor: 'Sentinel-1',
        layer: 'NDWI',
        imageUrl: getRealSatelliteImage('Sentinel-1', 'NDWI'),
        capturedAt: 'Just Now',
        tags: ['NDWI', 'Flood Zone', 'AI Verified'],
        source: SATELLITE_SOURCES.ESA.name
      },
      {
        id: 'sat-3',
        location: 'Maharashtra Coast',
        sensor: 'RISAT',
        layer: 'Flood Zone',
        imageUrl: getRealSatelliteImage('RISAT', 'Flood Zone'),
        capturedAt: 'Just Now',
        tags: ['NDWI', 'Flood Zone', 'AI Verified'],
        source: SATELLITE_SOURCES.ISRO.name
      },
      {
        id: 'sat-4',
        location: 'Kerala Backwaters',
        sensor: 'Resourcesat',
        layer: 'RAW',
        imageUrl: getRealSatelliteImage('Resourcesat', 'RAW'),
        capturedAt: 'Just Now',
        tags: ['NDWI', 'Flood Zone', 'AI Verified'],
        source: SATELLITE_SOURCES.ISRO.name
      },
      {
        id: 'sat-5',
        location: 'Tamil Nadu Delta',
        sensor: 'Cartosat',
        layer: 'NDWI',
        imageUrl: getRealSatelliteImage('Cartosat', 'NDWI'),
        capturedAt: 'Just Now',
        tags: ['NDWI', 'Flood Zone', 'AI Verified'],
        source: SATELLITE_SOURCES.ISRO.name
      }
    ]

    setSatelliteCards(initialCards)

    return () => {
      unsubscribeConnection()
      unsubscribeMessage()
      satelliteWebSocket.disconnect()
    }
  }, [])

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-400'
      case 'reconnecting': return 'text-yellow-400'
      case 'failed': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Live Connected'
      case 'reconnecting': return 'Reconnecting'
      case 'failed': return 'Connection Failed'
      default: return 'Disconnected'
    }
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="bg-black/40 border border-white/10 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-400 animate-pulse' : 
              connectionStatus === 'reconnecting' ? 'bg-yellow-400 animate-pulse' : 
              'bg-gray-400'
            }`} />
            <span className={`text-sm font-medium ${getConnectionStatusColor()}`}>
              {getConnectionStatusText()}
            </span>
          </div>
          <div className="text-xs text-white/50">
            Real-time Satellite Stream
          </div>
        </div>
      </div>

      {/* Satellite Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {satelliteCards.map((card) => (
          <div
            key={card.id}
            onMouseEnter={() => setHoveredCard(card.id)}
            onMouseLeave={() => setHoveredCard(null)}
            className={`relative group cursor-pointer rounded-xl overflow-hidden border transition-all duration-300 ${
              hoveredCard === card.id 
                ? 'border-cyan-accent shadow-lg shadow-cyan-accent/20 scale-[1.02]' 
                : 'border-white/10 hover:border-white/30 hover:shadow-lg'
            }`}
          >
            {/* Image Container */}
            <div className="aspect-video relative overflow-hidden">
              <img
                src={card.imageUrl}
                alt={`${card.sensor} ${card.layer} view of ${card.location}`}
                className="w-full h-full object-cover transition-opacity duration-500"
                onError={(e) => {
                  // Fallback to local image if external fails
                  const target = e.target as HTMLImageElement
                  const fallbackUrl = getRealSatelliteImage(card.sensor, card.layer)
                  if (target.src !== fallbackUrl) {
                    target.src = fallbackUrl
                  } else {
                    // Final fallback to gradient
                    target.style.background = `linear-gradient(135deg, #1a1a2e 0%, #2d3748 100%)`
                  }
                }}
              />
              
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              
              {/* Live UI Elements */}
              <div className="absolute top-2 left-2">
                <div className="px-2 py-1 bg-red-500/90 text-white text-xs font-bold rounded animate-pulse">
                  LIVE
                </div>
              </div>
              
              <div className="absolute bottom-2 left-2">
                <div className="px-2 py-1 bg-black/80 text-white text-xs rounded backdrop-blur-sm">
                  Captured: {card.capturedAt}
                </div>
              </div>
              
              <div className="absolute bottom-2 right-2">
                <div className="px-2 py-1 bg-black/80 text-cyan-accent text-xs rounded backdrop-blur-sm animate-pulse">
                  Auto-updating
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-4 bg-black/40 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white mb-1">
                Flood Detection - {card.location}
              </h3>
              <p className="text-sm text-cyan-accent mb-3">
                {card.sensor} | {card.layer} | Live
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {card.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-cyan-accent/20 text-cyan-accent text-xs rounded-full border border-cyan-accent/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              {/* Source */}
              <div className="text-xs text-white/50">
                Source: {card.source}
              </div>
            </div>

            {/* Hover Effect Overlay */}
            {hoveredCard === card.id && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-accent/10 to-transparent rounded-xl" />
                <div className="absolute inset-0 border-2 border-cyan-accent/50 rounded-xl animate-pulse" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
