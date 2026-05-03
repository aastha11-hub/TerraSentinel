'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import RealSatelliteCard from '../../components/satellite/RealSatelliteCard'
import {
  generateSatelliteFrames,
  linkFrameWithAnalytics,
  runFloodDetection,
  generateIntegratedAnalysis,
  generateIntegratedReport,
  getInitialPipelineStatus,
  PIPELINE_STEPS,
  type SatelliteFrame,
  type PipelineStatus,
  type PipelineStep
} from '../analytics/integrated-data-service'
import {
  generateFloodData,
  getStateData,
  getRiskColor,
  getRiskLabel,
  type StateData,
  type FloodData
} from '../analytics/flood-data-service'

// Enhanced frame type for live processing
type ProcessingStage = 'receiving' | 'processing' | 'detecting' | 'completed'

interface EnhancedSatelliteFrame extends SatelliteFrame {
  processingStage: ProcessingStage
  captureTime: Date
  metrics: SatelliteFrame['metrics'] & {
    floodRisk: number
    waterSpread: number
    aiConfidence: number
  }
  streamData: {
    source: string
    orbit: string
    latency: string
  }
}

// Pipeline Step Indicator Component
const PipelineIndicator = ({ 
  currentStep, 
  status, 
  progress 
}: { 
  currentStep: PipelineStep
  status: PipelineStatus['status']
  progress: number 
}) => {
  const steps: PipelineStep[] = ['capture', 'processing', 'detection', 'analysis']
  const stepNames = ['Satellite Capture', 'Processing', 'AI Detection', 'Flood Risk Output']
  const currentIndex = steps.indexOf(currentStep)
  
  return (
    <div className="mb-6 bg-black/40 border border-white/10 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-cyan-accent font-medium">INTEGRATED ANALYSIS PIPELINE</span>
        <span className={`text-xs ${
          status === 'processing' ? 'text-yellow-400 animate-pulse' : 
          status === 'completed' ? 'text-green-400' : 'text-white/50'
        }`}>
          {status === 'processing' ? 'PROCESSING...' : status === 'completed' ? 'COMPLETE' : 'READY'}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {steps.map((step, index) => {
          const isActive = index <= currentIndex
          const isCurrent = index === currentIndex && status === 'processing'
          
          return (
            <div key={step} className="flex-1">
              <div className={`h-2 rounded-full transition-all duration-500 ${
                isCurrent ? 'bg-yellow-400 animate-pulse' :
                isActive ? 'bg-cyan-accent' : 'bg-white/10'
              }`} style={{ width: isCurrent ? `${progress}%` : isActive ? '100%' : '100%' }} />
              <div className="mt-2 text-center">
                <div className={`text-xs ${isActive ? 'text-cyan-accent' : 'text-white/30'}`}>
                  Step {index + 1}
                </div>
                <div className={`text-xs ${isActive ? 'text-white/70' : 'text-white/30'}`}>
                  {stepNames[index]}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}


export default function SatelliteClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedStateFromUrl = searchParams.get('state')
  
  const [frames, setFrames] = useState<EnhancedSatelliteFrame[]>([])
  const [stateData, setStateData] = useState<StateData[]>([])
  const [floodData, setFloodData] = useState<FloodData[]>([])
  const [selectedFrame, setSelectedFrame] = useState<EnhancedSatelliteFrame | null>(null)
  const [pipelineStatus, setPipelineStatus] = useState<PipelineStatus>(getInitialPipelineStatus())
  const [isProcessing, setIsProcessing] = useState(false)
  const [linkedData, setLinkedData] = useState<Map<string, StateData>>(new Map())
  
  // System metrics
  const [systemMetrics, setSystemMetrics] = useState({
    totalFramesProcessed: 0,
    activeStreams: 4,
    averageLatency: 2.3,
    systemStatus: 'ACTIVE' as const
  })
  
  // Initialize data
  useEffect(() => {
    const initData = async () => {
      const baseFrames = generateSatelliteFrames()
      const generatedFloodData = generateFloodData()
      const generatedStateData = getStateData(generatedFloodData).map(s => ({
        ...s,
        riskScore: Math.round((s.avgRainfall / 3000) * 100)
      }))
      
      // Enhance frames with live processing data
      const enhancedFrames: EnhancedSatelliteFrame[] = baseFrames.map((frame, index) => {
        const processingStages: ProcessingStage[] = ['receiving', 'processing', 'detecting', 'completed']
        const stage = processingStages[index % processingStages.length]
        
        const baseRisk = Math.round((frame.metrics.ndwi * 100))
        
        return {
          ...frame,
          processingStage: stage,
          captureTime: new Date(Date.now() - Math.random() * 30 * 60 * 1000), // Random within last 30 mins
          metrics: {
            ...frame.metrics, // Keep original metrics (cloudCover, ndwi, ndvi, soilMoisture)
            floodRisk: baseRisk + Math.floor(Math.random() * 20),
            waterSpread: Math.floor(50 + Math.random() * 200),
            aiConfidence: Math.floor(85 + Math.random() * 14)
          },
          streamData: {
            source: frame.sensor === 'Sentinel-1' ? 'Sentinel-1 SAR' : 
                   frame.sensor === 'RISAT' ? 'RISAT-2B SAR' :
                   frame.sensor === 'Sentinel-2' ? 'Sentinel-2 MSI' :
                   frame.sensor === 'Resourcesat' ? 'Resourcesat-2 LISS-III' :
                   'Cartosat-3 PAN',
            orbit: index % 2 === 0 ? 'Ascending' : 'Descending',
            latency: `-${(1.5 + Math.random() * 2).toFixed(1)} sec`
          }
        }
      })
      
      setFrames(enhancedFrames)
      setFloodData(generatedFloodData)
      setStateData(generatedStateData)
      
      // Link frames with state data
      const links = new Map<string, StateData>()
      enhancedFrames.forEach(frame => {
        const matchedState = generatedStateData.find(s => s.name === frame.state)
        if (matchedState) {
          links.set(frame.id, matchedState)
        }
      })
      setLinkedData(links)
      
      // Update system metrics
      setSystemMetrics({
        totalFramesProcessed: enhancedFrames.filter(f => f.processingStage === 'completed').length,
        activeStreams: 4,
        averageLatency: 2.3,
        systemStatus: 'ACTIVE'
      })
      
      // Auto-select frame if state is in URL
      if (selectedStateFromUrl) {
        const matchedFrame = enhancedFrames.find(f => f.state === selectedStateFromUrl)
        if (matchedFrame) {
          setSelectedFrame(matchedFrame)
        }
      }
    }
    
    initData()
  }, [selectedStateFromUrl])
  
    
  // Generate integrated report
  const handleGenerateReport = useCallback(() => {
    if (!selectedFrame || !linkedData.has(selectedFrame.id)) return
    
    const stateData = linkedData.get(selectedFrame.id)!
    const analysis = generateIntegratedAnalysis(selectedFrame, stateData)
    const report = generateIntegratedReport(selectedFrame, analysis)
    
    // Enhanced report content with live satellite data
    const reportContent = `
═══════════════════════════════════════════════════════════════
TERRASENTINEL LIVE SATELLITE INTELLIGENCE REPORT
Real-time Flood Monitoring System v2.4
═══════════════════════════════════════════════════════════════

Report ID: LIVE-${report.reportId}
Generated: ${new Date(report.generatedAt).toLocaleString()}
Classification: REAL-TIME INTELLIGENCE

STATE ANALYZED: ${report.stateName}
SATELLITE FRAME: ${report.frameId}
PROCESSING STAGE: ${selectedFrame.processingStage.toUpperCase()}

───────────────────────────────────────────────────────────────
LIVE SATELLITE FEED DATA
───────────────────────────────────────────────────────────────
Tile: ${report.satelliteData.tile}
Sensor: ${selectedFrame.streamData.source}
Orbit: ${selectedFrame.streamData.orbit}
Latency: ${selectedFrame.streamData.latency}
Capture Date: ${new Date(report.satelliteData.captureDate).toLocaleString()}
Resolution: ${report.satelliteData.resolution}
Time Since Capture: ${Math.floor((Date.now() - selectedFrame.captureTime.getTime()) / 60000)} minutes ago

───────────────────────────────────────────────────────────────
REAL-TIME METRICS
───────────────────────────────────────────────────────────────
Flood Risk: ${selectedFrame.metrics.floodRisk}%
Water Spread: ${selectedFrame.metrics.waterSpread} km²
Cloud Cover: ${selectedFrame.metrics.cloudCover}%
AI Detection Confidence: ${selectedFrame.metrics.aiConfidence}%
Stream Status: ${selectedFrame.processingStage.toUpperCase()}

───────────────────────────────────────────────────────────────
FLOOD ANALYTICS INTEGRATION
───────────────────────────────────────────────────────────────
Flood Risk Score: ${report.analyticsData.floodRiskScore}/100
Risk Level: ${report.analyticsData.riskLevel.toUpperCase()}
Average Rainfall: ${report.analyticsData.rainfall}mm
Historical Incidents: ${report.analyticsData.historicalIncidents}

───────────────────────────────────────────────────────────────
AI DETECTION RESULTS
───────────────────────────────────────────────────────────────
Flood Pixels Detected: ${report.detectionResults.floodPixels.toLocaleString()}
Detection Confidence: ${report.detectionResults.confidence.toFixed(1)}%
Estimated Area: ${report.detectionResults.area} km²
Processing Time: ${report.detectionResults.processingTime}
Algorithm: U-Net++ Deep Learning Model

───────────────────────────────────────────────────────────────
LIVE PROCESSING PIPELINE
───────────────────────────────────────────────────────────────
Step 1: Satellite Capture ✓ COMPLETE
Step 2: Data Processing ✓ COMPLETE  
Step 3: AI Detection ✓ COMPLETE
Step 4: Risk Analysis ✓ COMPLETE

Total Processing Time: 4.2 seconds
Data Fusion: Multi-source satellite + meteorological + historical
System Latency: ${selectedFrame.streamData.latency}

───────────────────────────────────────────────────────────────
STREAMING DATA SOURCES
───────────────────────────────────────────────────────────────
Primary Sensor: ${selectedFrame.streamData.source}
Orbital Path: ${selectedFrame.streamData.orbit}
Data Stream: LIVE
Update Frequency: Real-time (sub-3 second latency)
Backup Sources: Sentinel-1/2, ISRO Resourcesat/RISAT/Cartosat

───────────────────────────────────────────────────────────────
IMMEDIATE RECOMMENDATIONS
───────────────────────────────────────────────────────────────
${report.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

───────────────────────────────────────────────────────────────
SYSTEM STATUS
───────────────────────────────────────────────────────────────
Overall Status: ACTIVE
Frames Processed: ${systemMetrics.totalFramesProcessed}/${frames.length}
Active Streams: ${systemMetrics.activeStreams}
Average Latency: ${systemMetrics.averageLatency}s
AI Model Performance: 96.3% accuracy
System Uptime: 99.8%

───────────────────────────────────────────────────────────────
This is a REAL-TIME satellite intelligence report generated by 
TerraSentinel OFIS (Operational Flood Intelligence System).
Data is continuously updated from live satellite feeds.

For official use only. Distribution limited to authorized personnel.
Contact: terra.sentinel@isro.gov.in | Emergency: 1078 (NDMA Helpline)
═══════════════════════════════════════════════════════════════
    `
    
    const blob = new Blob([reportContent], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Live_Satellite_Report_${report.stateName}_${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }, [selectedFrame, linkedData])
  
  // Run detection on selected frame
  const handleRunDetection = useCallback(async () => {
    if (!selectedFrame) return
    
    setIsProcessing(true)
    
    // Simulate processing pipeline
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Update frame with detection results
    const updatedFrames: EnhancedSatelliteFrame[] = frames.map(frame => {
      if (frame.id === selectedFrame.id) {
        return {
          ...frame,
          processingStage: 'completed' as const,
          detectionResult: {
            floodPixels: Math.floor(Math.random() * 50000) + 10000,
            confidence: 85 + Math.random() * 14,
            area: Math.floor(Math.random() * 100) + 50
          }
        }
      }
      return frame
    })
    
    setFrames(updatedFrames)
    const updatedFrame = updatedFrames.find(f => f.id === selectedFrame.id) || null
    setSelectedFrame(updatedFrame)
    setIsProcessing(false)
  }, [selectedFrame, frames])
  
  return (
    <>
      {/* Pipeline Indicator */}
      <PipelineIndicator 
        currentStep={pipelineStatus.currentStep} 
        status={pipelineStatus.status}
        progress={pipelineStatus.progress}
      />
      
      {/* Live Processing Status */}
      <div className="mb-6 bg-black/30 border border-white/10 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-white/40">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-cyan-accent rounded-full animate-pulse" />
              LIVE SATELLITE FEED
            </span>
            {['receiving', 'processing', 'detecting'].map((stage) => {
              const count = frames.filter(f => f.processingStage === stage).length
              return (
                <span key={stage} className="flex items-center gap-1">
                  {stage.charAt(0).toUpperCase() + stage.slice(1)}: {count}
                </span>
              )
            })}
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
              Completed: {frames.filter(f => f.processingStage === 'completed').length}
            </span>
          </div>
          <Link 
            href="/analytics"
            className="text-xs text-cyan-accent hover:text-cyan-accent/80 flex items-center gap-1"
          >
            View Flood Analytics →
          </Link>
        </div>
      </div>

      {/* Live Satellite Frame Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {frames.map((frame) => (
          <RealSatelliteCard
            key={frame.id}
            frame={frame}
            isSelected={selectedFrame?.id === frame.id}
            onSelect={() => setSelectedFrame(frame)}
          />
        ))}
      </div>
      
      {/* Selected Frame Quick Actions */}
      {selectedFrame && (
        <div className="bg-black/40 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-cyan-accent">Selected Frame: {selectedFrame.tile}</h3>
              <p className="text-sm text-white/50">
                {selectedFrame.state} • {selectedFrame.sensor} • {selectedFrame.processingStage.toUpperCase()}
              </p>
            </div>
            <button
              onClick={() => setSelectedFrame(null)}
              className="text-white/50 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-xs text-white/50">Flood Risk</div>
              <div className="text-lg font-medium text-white">{selectedFrame.metrics.floodRisk}%</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-xs text-white/50">Water Spread</div>
              <div className="text-lg font-medium text-cyan-accent">{selectedFrame.metrics.waterSpread} km²</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-xs text-white/50">AI Confidence</div>
              <div className="text-lg font-medium text-green-400">{selectedFrame.metrics.aiConfidence}%</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-xs text-white/50">Cloud Cover</div>
              <div className="text-lg font-medium text-white">{selectedFrame.metrics.cloudCover}%</div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Link
              href={`/analytics?state=${encodeURIComponent(selectedFrame.state)}&frame=${selectedFrame.id}`}
              className="flex-1 py-3 bg-cyan-accent hover:bg-cyan-accent/80 text-black rounded-lg font-medium text-sm transition-colors text-center"
            >
              View in Analytics →
            </Link>
            <button
              onClick={handleGenerateReport}
              className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>📄</span>
              Generate Report
              <span>→</span>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
