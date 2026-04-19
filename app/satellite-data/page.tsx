'use client'

import { useState } from 'react'

interface SatelliteSource {
  title: string
  description: string
  type: string
  resolution: string
  useCase: string
  metrics: {
    floodRiskScore: number
    waterExtent: number
    ndvi: number
    soilMoisture: number
    cloudCover: number
  }
}

const sources: SatelliteSource[] = [
  {
    title: 'ISRO (Indian Space Research Organisation)',
    description:
      'Primary national provider of Earth observation missions supporting disaster management, water monitoring, and environmental intelligence.',
    type: 'Government',
    resolution: 'Varies',
    useCase: 'Disaster management, water monitoring, environmental intelligence',
    metrics: {
      floodRiskScore: 85,
      waterExtent: 45.2,
      ndvi: 0.65,
      soilMoisture: 72,
      cloudCover: 15
    }
  },
  {
    title: 'Bhuvan Geoportal',
    description:
      'ISRO\'s geospatial platform providing map services and thematic layers that can support flood situational awareness.',
    type: 'Portal',
    resolution: 'Varies',
    useCase: 'Flood situational awareness, mapping services',
    metrics: {
      floodRiskScore: 78,
      waterExtent: 38.7,
      ndvi: 0.58,
      soilMoisture: 68,
      cloudCover: 22
    }
  },
  {
    title: 'RISAT',
    description:
      'Radar Imaging Satellite series enabling all-weather imaging and strong performance during cloud cover and heavy rainfall.',
    type: 'Radar Satellite',
    resolution: '1-3m',
    useCase: 'All-weather imaging, flood monitoring',
    metrics: {
      floodRiskScore: 92,
      waterExtent: 52.1,
      ndvi: 0.71,
      soilMoisture: 76,
      cloudCover: 8
    }
  },
  {
    title: 'Resourcesat',
    description:
      'Optical remote sensing mission supporting land and water monitoring with multi-spectral observations.',
    type: 'Optical Satellite',
    resolution: '5.8m-23.5m',
    useCase: 'Land and water monitoring, agricultural monitoring',
    metrics: {
      floodRiskScore: 73,
      waterExtent: 41.3,
      ndvi: 0.62,
      soilMoisture: 65,
      cloudCover: 18
    }
  },
  {
    title: 'Cartosat',
    description:
      'High-resolution optical imaging mission useful for detailed mapping and impacted-area assessment.',
    type: 'Optical Satellite',
    resolution: '0.65-2.5m',
    useCase: 'Detailed mapping, impact assessment',
    metrics: {
      floodRiskScore: 88,
      waterExtent: 47.8,
      ndvi: 0.68,
      soilMoisture: 70,
      cloudCover: 12
    }
  },
  {
    title: 'INSAT',
    description:
      'Indian National Satellite system providing meteorological observations and communication services for disaster early warning.',
    type: 'Weather Satellite',
    resolution: '1km-4km',
    useCase: 'Weather monitoring, disaster early warning',
    metrics: {
      floodRiskScore: 95,
      waterExtent: 55.6,
      ndvi: 0.74,
      soilMoisture: 78,
      cloudCover: 5
    }
  },
  {
    title: 'OMI',
    description:
      'Oceansat series for oceanographic studies and marine ecosystem monitoring supporting coastal disaster management.',
    type: 'Ocean Satellite',
    resolution: '360m',
    useCase: 'Ocean monitoring, coastal management',
    metrics: {
      floodRiskScore: 81,
      waterExtent: 49.2,
      ndvi: 0.66,
      soilMoisture: 73,
      cloudCover: 14
    }
  }
]


export default function SatelliteDataPage() {
  const [selectedSource, setSelectedSource] = useState<SatelliteSource | null>(null)

  const handleSourceClick = (source: SatelliteSource) => {
    setSelectedSource(source)
  }

  const closeDetails = () => {
    setSelectedSource(null)
  }

  return (
    <main className="pt-24 px-6 sm:px-8 lg:px-12 pb-16">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold">
            <span className="text-gradient">Satellite</span> Data Sources
          </h1>
          <p className="mt-3 text-white/70 max-w-2xl">
            TerraSentinel integrates satellite imagery pipelines aligned with Indian Earth observation ecosystems.
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sources.map((s) => (
            <div 
              key={s.title} 
              className="glow-border glow-border-hover bg-space-navy/40 backdrop-blur-sm rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:glow-border-active"
              onClick={() => handleSourceClick(s)}
            >
              <h2 className="text-lg font-semibold text-cyan-accent">{s.title}</h2>
              <p className="mt-3 text-sm text-white/70 leading-relaxed">{s.description}</p>
              <div className="mt-4 flex items-center text-xs text-cyan-accent/70">
                <span>Click for details</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Details Modal */}
        {selectedSource && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-space-navy/90 border border-cyan-accent/30 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-cyan-accent">{selectedSource.title}</h2>
                    <p className="text-white/70 mt-2">{selectedSource.description}</p>
                  </div>
                  <button
                    onClick={closeDetails}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Satellite Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-cyan-accent mb-4">Satellite Information</h3>
                    
                    <div className="bg-space-navy/50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Type</span>
                        <span className="text-cyan-accent font-medium">{selectedSource.type}</span>
                      </div>
                    </div>

                    <div className="bg-space-navy/50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Resolution</span>
                        <span className="text-cyan-accent font-medium">{selectedSource.resolution}</span>
                      </div>
                    </div>

                    <div className="bg-space-navy/50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Use Case</span>
                        <span className="text-cyan-accent font-medium text-right text-sm max-w-[60%]">{selectedSource.useCase}</span>
                      </div>
                    </div>
                  </div>

                  {/* Current Metrics */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-cyan-accent mb-4">Current Metrics</h3>
                    
                    <div className="bg-space-navy/50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Flood Risk Score</span>
                        <span className={`font-medium ${
                          selectedSource.metrics.floodRiskScore > 80 ? 'text-red-400' : 
                          selectedSource.metrics.floodRiskScore > 60 ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                          {selectedSource.metrics.floodRiskScore}%
                        </span>
                      </div>
                    </div>

                    <div className="bg-space-navy/50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Water Extent</span>
                        <span className="text-blue-400 font-medium">{selectedSource.metrics.waterExtent}%</span>
                      </div>
                    </div>

                    <div className="bg-space-navy/50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">NDVI Index</span>
                        <span className="text-green-400 font-medium">{selectedSource.metrics.ndvi}</span>
                      </div>
                    </div>

                    <div className="bg-space-navy/50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Soil Moisture</span>
                        <span className="text-orange-400 font-medium">{selectedSource.metrics.soilMoisture}%</span>
                      </div>
                    </div>

                    <div className="bg-space-navy/50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Cloud Cover</span>
                        <span className="text-gray-400 font-medium">{selectedSource.metrics.cloudCover}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-white/50 text-sm">
                    Last updated: {new Date().toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

