'use client'

import React, { useState, useEffect } from 'react'

// Types for operational interface
interface SystemStatus {
  lastUpdated: string
  activeZones: number
  processingScenes: number
  alertLevel: 'normal' | 'warning' | 'critical'
}

interface ModelMetrics {
  accuracy: number
  precision: number
  recall: number
  f1Score: number
  iou: number
}

// Visual Data Flow Component
const VisualDataFlow = ({ 
  title, 
  stages 
}: { 
  title: string
  stages: { label: string; status: 'raw' | 'processed' | 'result'; data?: string }[]
}) => (
  <div className="mb-6">
    <h3 className="text-sm font-semibold text-cyan-accent mb-3">{title}</h3>
    <div className="flex items-center gap-2">
      {stages.map((stage, idx) => (
        <React.Fragment key={idx}>
          <div className={`flex-1 p-3 rounded-lg border ${
            stage.status === 'raw' ? 'bg-black/40 border-white/10' :
            stage.status === 'processed' ? 'bg-cyan-500/10 border-cyan-500/30' :
            'bg-green-500/10 border-green-500/30'
          }`}>
            <div className="text-xs text-white/50 mb-1">{stage.label}</div>
            <div className="h-16 bg-gradient-to-br from-white/5 to-white/10 rounded flex items-center justify-center">
              <div className={`w-12 h-12 rounded ${
                stage.status === 'raw' ? 'bg-gray-600/50' :
                stage.status === 'processed' ? 'bg-cyan-500/30' :
                'bg-green-500/30'
              }`} />
            </div>
            {stage.data && (
              <div className="text-xs text-white/70 mt-1 font-mono">{stage.data}</div>
            )}
          </div>
          {idx < stages.length - 1 && (
            <div className="text-cyan-accent text-lg">{'->'}</div>
          )}
        </React.Fragment>
      ))}
    </div>
  </div>
)

// Metric Card Component
const MetricCard = ({ label, value, unit, trend }: { label: string; value: number; unit?: string; trend?: 'up' | 'down' }) => (
  <div className="bg-black/30 border border-white/10 rounded-lg p-3">
    <div className="text-xs text-white/50 mb-1">{label}</div>
    <div className="flex items-baseline gap-1">
      <span className="text-lg font-bold text-white">{value}</span>
      {unit && <span className="text-xs text-white/50">{unit}</span>}
      {trend && (
        <span className={`text-xs ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
          {trend === 'up' ? '↑' : '↓'}
        </span>
      )}
    </div>
  </div>
)

// Status Indicator Component
const StatusIndicator = ({ status, label }: { status: 'operational' | 'warning' | 'critical'; label: string }) => (
  <div className="flex items-center gap-2">
    <div className={`w-2 h-2 rounded-full ${
      status === 'operational' ? 'bg-green-400 animate-pulse' :
      status === 'warning' ? 'bg-yellow-400' :
      'bg-red-400'
    }`} />
    <span className="text-xs text-white/70">{label}</span>
  </div>
)

export default function ResearchClient() {
  const [systemStatus] = useState<SystemStatus>({
    lastUpdated: new Date().toISOString(),
    activeZones: 847,
    processingScenes: 12,
    alertLevel: 'normal'
  })

  const [modelMetrics] = useState<ModelMetrics>({
    accuracy: 96.3,
    precision: 94.8,
    recall: 91.2,
    f1Score: 92.9,
    iou: 87.1
  })

  return (
    <>
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold">
          <span className="text-gradient">Research</span> / Technology
        </h1>
        <p className="mt-3 text-white/70 max-w-2xl">
          Operational Flood Intelligence System (OFIS) v2.4 - Real-time satellite-based flood detection and monitoring
        </p>
      </header>

      {/* Real-time Monitoring Status */}
      <div className="mb-10 glow-border bg-space-navy/40 backdrop-blur-sm rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-cyan-accent">System Status</h2>
          <StatusIndicator status="operational" label="All Systems Operational" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label="Active Zones" value={systemStatus.activeZones} />
          <MetricCard label="Processing" value={systemStatus.processingScenes} unit="scenes" />
          <MetricCard label="Last Update" value={new Date(systemStatus.lastUpdated).toLocaleTimeString()} />
          <MetricCard label="Alert Level" value={systemStatus.alertLevel === 'normal' ? 0 : systemStatus.alertLevel === 'warning' ? 1 : 2} unit={systemStatus.alertLevel} />
        </div>
      </div>

      {/* Detection Algorithms - Visual Data Flow */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {/* NDWI Card */}
        <div className="glow-border glow-border-hover bg-space-navy/40 backdrop-blur-sm rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-cyan-accent mb-2">NDWI Detection</h2>
          <p className="text-xs text-white/50 mb-4">Optical Water Index Analysis</p>
          
          <VisualDataFlow 
            title="Processing Pipeline"
            stages={[
              { label: 'Raw Data', status: 'raw', data: 'Sentinel-2 L1C' },
              { label: 'Processed', status: 'processed', data: 'NDWI Calc' },
              { label: 'Flood Result', status: 'result', data: 'Water Mask' }
            ]}
          />
          
          <ul className="text-xs text-white/70 space-y-1 mt-4">
            <li>- Bands: Green + NIR (Sentinel-2)</li>
            <li>- Resolution: 10m per pixel</li>
            <li>- Threshold: NDWI {'>'} 0.3</li>
            <li>- Coverage: All-weather optical</li>
          </ul>
        </div>

        {/* SAR Card */}
        <div className="glow-border glow-border-hover bg-space-navy/40 backdrop-blur-sm rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-cyan-accent mb-2">SAR Detection</h2>
          <p className="text-xs text-white/50 mb-4">Radar Backscatter Analysis</p>
          
          <VisualDataFlow 
            title="Processing Pipeline"
            stages={[
              { label: 'Raw Data', status: 'raw', data: 'Sentinel-1 SAR' },
              { label: 'Processed', status: 'processed', data: 'Sigma0 Calc' },
              { label: 'Flood Result', status: 'result', data: 'Flood Mask' }
            ]}
          />
          
          <ul className="text-xs text-white/70 space-y-1 mt-4">
            <li>- Frequency: C-band (5.4 GHz)</li>
            <li>- Polarization: HH/HV</li>
            <li>- Cloud penetration: 100%</li>
            <li>- Day/Night operation</li>
          </ul>
        </div>

        {/* AI Model Card */}
        <div className="glow-border glow-border-hover bg-space-navy/40 backdrop-blur-sm rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-cyan-accent mb-2">AI Classification</h2>
          <p className="text-xs text-white/50 mb-4">Deep Learning Inference</p>
          
          <VisualDataFlow 
            title="Processing Pipeline"
            stages={[
              { label: 'Input', status: 'raw', data: '12-Channel' },
              { label: 'U-Net++', status: 'processed', data: '256x256' },
              { label: 'Output', status: 'result', data: 'Flood Map' }
            ]}
          />
          
          <ul className="text-xs text-white/70 space-y-1 mt-4">
            <li>- Architecture: U-Net++</li>
            <li>- Backbone: ResNet-50</li>
            <li>- Params: 23.5M</li>
            <li>- Inference: {'<'} 2s/scene</li>
          </ul>
        </div>
      </div>

      {/* Model Performance Dashboard */}
      <div className="mb-10 glow-border bg-space-navy/40 backdrop-blur-sm rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-cyan-accent mb-4">Model Performance Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <MetricCard label="Accuracy" value={modelMetrics.accuracy} unit="%" trend="up" />
          <MetricCard label="Precision" value={modelMetrics.precision} unit="%" trend="up" />
          <MetricCard label="Recall" value={modelMetrics.recall} unit="%" trend="up" />
          <MetricCard label="F1-Score" value={modelMetrics.f1Score} unit="%" trend="up" />
          <MetricCard label="IoU" value={modelMetrics.iou} unit="%" trend="up" />
        </div>
        <div className="mt-4 text-xs text-white/50">
          Validation: 1,247 scenes | Training: 50,000+ events | Last evaluated: 2024-07-15
        </div>
      </div>

      {/* AI Architecture Flow */}
      <div className="mb-10 glow-border bg-space-navy/40 backdrop-blur-sm rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-cyan-accent mb-4">AI Architecture Flow</h2>
        <div className="flex items-center justify-between">
          <div className="flex-1 text-center p-4 bg-black/30 rounded-lg border border-white/10">
            <div className="text-xs text-white/50 mb-2">INPUT</div>
            <div className="text-sm text-cyan-accent font-medium">Multi-Source Data</div>
            <ul className="text-xs text-white/70 mt-2 space-y-1">
              <li>- NDWI / NDVI / SAR</li>
              <li>- Rainfall / DEM</li>
              <li>- Temporal Stack</li>
            </ul>
          </div>
          <div className="text-cyan-accent text-2xl px-4">{'->'}</div>
          <div className="flex-1 text-center p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
            <div className="text-xs text-white/50 mb-2">MODEL</div>
            <div className="text-sm text-cyan-accent font-medium">U-Net++ ResNet-50</div>
            <ul className="text-xs text-white/70 mt-2 space-y-1">
              <li>- Encoder: ResNet-50</li>
              <li>- Decoder: U-Net++</li>
              <li>- 23.5M Parameters</li>
            </ul>
          </div>
          <div className="text-cyan-accent text-2xl px-4">{'->'}</div>
          <div className="flex-1 text-center p-4 bg-green-500/10 rounded-lg border border-green-500/30">
            <div className="text-xs text-white/50 mb-2">OUTPUT</div>
            <div className="text-sm text-green-400 font-medium">Flood Prediction</div>
            <ul className="text-xs text-white/70 mt-2 space-y-1">
              <li>- Probability Map</li>
              <li>- Risk Classification</li>
              <li>- Alert Triggers</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Multi-Source Data Fusion */}
      <div className="mb-10 glow-border bg-space-navy/40 backdrop-blur-sm rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-cyan-accent mb-4">Multi-Source Data Fusion</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-black/30 p-3 rounded-lg border border-white/10">
            <div className="text-sm text-cyan-accent font-medium mb-2">Sentinel-1/2</div>
            <ul className="text-xs text-white/70 space-y-1">
              <li>- SAR + Optical</li>
              <li>- 6-12 day revisit</li>
              <li>- 10-20m resolution</li>
            </ul>
          </div>
          <div className="bg-black/30 p-3 rounded-lg border border-white/10">
            <div className="text-sm text-cyan-accent font-medium mb-2">GPM IMERG</div>
            <ul className="text-xs text-white/70 space-y-1">
              <li>- Rainfall data</li>
              <li>- Global coverage</li>
              <li>- 30-min intervals</li>
            </ul>
          </div>
          <div className="bg-black/30 p-3 rounded-lg border border-white/10">
            <div className="text-sm text-cyan-accent font-medium mb-2">ERA5 Reanalysis</div>
            <ul className="text-xs text-white/70 space-y-1">
              <li>- Climate data</li>
              <li>- 1950-present</li>
              <li>- 0.25° resolution</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Flood Risk Classification Logic */}
      <div className="mb-10 glow-border bg-space-navy/40 backdrop-blur-sm rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-cyan-accent mb-4">Risk Classification Logic</h2>
        <div className="flex items-center gap-4">
          <div className="flex-1 p-3 bg-black/30 rounded-lg border border-white/10 text-center">
            <div className="text-xs text-white/50 mb-1">INPUTS</div>
            <div className="text-xs text-white/70">
              Rainfall {'>'} 150mm/24h<br/>
              NDWI {'>'} 0.3<br/>
              Soil Saturation {'>'} 80%
            </div>
          </div>
          <div className="text-cyan-accent">{'->'}</div>
          <div className="flex-1 p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/30 text-center">
            <div className="text-xs text-white/50 mb-1">WEIGHTED SCORE</div>
            <div className="text-xs text-white/70">
              Rainfall (40%)<br/>
              Water Index (35%)<br/>
              Topography (25%)
            </div>
          </div>
          <div className="text-cyan-accent">{'->'}</div>
          <div className="flex-1 p-3 bg-green-500/10 rounded-lg border border-green-500/30 text-center">
            <div className="text-xs text-white/50 mb-1">RISK LEVEL</div>
            <div className="text-xs text-white/70 space-y-1">
              <span className="text-green-400">Low (0-3)</span><br/>
              <span className="text-yellow-400">Moderate (4-6)</span><br/>
              <span className="text-red-400">High (7-10)</span>
            </div>
          </div>
        </div>
      </div>

      {/* System Capabilities */}
      <div className="mb-10 glow-border bg-space-navy/40 backdrop-blur-sm rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-cyan-accent mb-4">System Capabilities</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-black/30 rounded-lg border border-white/10">
            <div className="text-2xl font-bold text-cyan-accent">3.2M</div>
            <div className="text-xs text-white/50">km² Coverage</div>
          </div>
          <div className="text-center p-3 bg-black/30 rounded-lg border border-white/10">
            <div className="text-2xl font-bold text-cyan-accent">{'<'} 4h</div>
            <div className="text-xs text-white/50">Detection Latency</div>
          </div>
          <div className="text-center p-3 bg-black/30 rounded-lg border border-white/10">
            <div className="text-2xl font-bold text-cyan-accent">10m</div>
            <div className="text-xs text-white/50">Spatial Resolution</div>
          </div>
          <div className="text-center p-3 bg-black/30 rounded-lg border border-white/10">
            <div className="text-2xl font-bold text-cyan-accent">72h</div>
            <div className="text-xs text-white/50">Prediction Window</div>
          </div>
        </div>
      </div>

      {/* Before/After Comparison */}
      <div className="mb-10 glow-border bg-space-navy/40 backdrop-blur-sm rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-cyan-accent mb-4">Flood Detection Results</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="text-center">
            <div className="text-sm text-white/70 mb-2">Before Detection</div>
            <div className="h-32 bg-gradient-to-br from-gray-700 to-gray-600 rounded-lg flex items-center justify-center border border-white/10">
              <span className="text-white/50 text-xs">Raw Satellite Scene</span>
            </div>
            <div className="text-xs text-white/50 mt-2">Sentinel-2 L1C • 2024-07-15 • 44RPU</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-cyan-accent mb-2">After Detection</div>
            <div className="h-32 bg-gradient-to-br from-cyan-500/20 to-green-500/20 rounded-lg flex items-center justify-center border border-cyan-500/30">
              <div className="text-center">
                <div className="text-green-400 text-sm font-medium">Flood Detected</div>
                <div className="text-white/70 text-xs">12,847 water pixels</div>
                <div className="text-white/70 text-xs">Area: 128.5 km²</div>
              </div>
            </div>
            <div className="text-xs text-white/50 mt-2">Confidence: 96.3% • Processing: 47min</div>
          </div>
        </div>
      </div>

      {/* Processing Pipeline */}
      <div className="glow-border bg-space-navy/40 backdrop-blur-sm rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-cyan-accent mb-4">Operational Pipeline</h2>
        <div className="flex items-center justify-between text-center">
          {['Acquisition', 'Preprocessing', 'Detection', 'Validation', 'Alert'].map((step, idx) => (
            <React.Fragment key={step}>
              <div className="flex-1">
                <div className="w-12 h-12 mx-auto rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-accent font-bold">
                  {idx + 1}
                </div>
                <div className="text-xs text-white/70 mt-2">{step}</div>
              </div>
              {idx < 4 && <div className="text-cyan-accent">{'->'}</div>}
            </React.Fragment>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-white/70">
          <div><span className="text-cyan-accent">Sources:</span> Sentinel, Landsat, MODIS</div>
          <div><span className="text-cyan-accent">Throughput:</span> 500+ scenes/day</div>
          <div><span className="text-cyan-accent">Latency:</span> 2-4 hours NRT</div>
          <div><span className="text-cyan-accent">Accuracy:</span> 94.2% validated</div>
        </div>
      </div>
    </>
  )
}
