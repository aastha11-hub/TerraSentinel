// Integrated Data Service - Connecting Satellite Data + Flood Analytics
// Shared data source for complete ISRO/NASA-style pipeline

import { 
  INDIAN_STATES, 
  type StateData,
  type FloodData,
  calculateFloodRisk,
  getStateData,
  generateFloodData,
  getHistoricalData
} from './flood-data-service'

// Pipeline Step Types
export type PipelineStep = 'capture' | 'processing' | 'detection' | 'analysis'

export interface PipelineStatus {
  currentStep: PipelineStep
  stepName: string
  status: 'idle' | 'processing' | 'completed' | 'error'
  progress: number
  timestamp: string
  message: string
}

// Satellite Frame with State Association
export interface SatelliteFrame {
  id: string
  tile: string
  state: string
  captureDate: string
  resolution: string
  sensor: 'Sentinel-1' | 'Sentinel-2' | 'RISAT' | 'Resourcesat' | 'Cartosat'
  rawImage: string
  processedImage?: string
  floodMask?: string
  detectionResult?: {
    floodPixels: number
    confidence: number
    area: number
  }
  metrics: {
    cloudCover: number
    ndwi: number
    ndvi: number
    soilMoisture: number
  }
  stateData?: StateData
  processingStatus: 'raw' | 'processing' | 'completed' | 'failed'
}

// Integrated Analysis Result
export interface IntegratedAnalysis {
  stateName: string
  frameId: string
  timestamp: string
  floodRiskScore: number
  rainfall: number
  historicalIncidents: number
  satelliteMetrics: {
    waterExtent: number
    floodPixels: number
    detectionConfidence: number
  }
  recommendations: string[]
  alertLevel: 'critical' | 'high' | 'medium' | 'low'
}

// Generate satellite frames linked to states
export function generateSatelliteFrames(): SatelliteFrame[] {
  const sensors: SatelliteFrame['sensor'][] = ['Sentinel-1', 'Sentinel-2', 'RISAT', 'Resourcesat', 'Cartosat']
  const tiles = ['44RPU', '43RQP', '45RTQ', '46RUV', '42PQQ', '41PRR', '47RST', '48RSU']
  
  return INDIAN_STATES.slice(0, 16).map((state, index) => {
    const tile = tiles[index % tiles.length]
    const sensor = sensors[index % sensors.length]
    const captureDate = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    
    // Generate realistic metrics based on state characteristics
    const baseFloodRisk = Math.random()
    const cloudCover = Math.floor(Math.random() * 30)
    const ndwi = 0.2 + Math.random() * 0.6
    
    return {
      id: `SAT-${tile}-${state.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 1000)}`,
      tile,
      state,
      captureDate,
      resolution: sensor === 'Sentinel-2' ? '10m' : sensor === 'RISAT' ? '1-3m' : '5-30m',
      sensor,
      rawImage: `/satellite/raw/${tile}_${captureDate.split('T')[0]}.tif`,
      metrics: {
        cloudCover,
        ndwi: parseFloat(ndwi.toFixed(3)),
        ndvi: parseFloat((0.3 + Math.random() * 0.5).toFixed(3)),
        soilMoisture: Math.floor(40 + Math.random() * 50)
      },
      processingStatus: 'raw'
    }
  })
}

// Link satellite frame with flood analytics data
export function linkFrameWithAnalytics(
  frame: SatelliteFrame, 
  stateData: StateData[],
  floodData: FloodData[]
): SatelliteFrame & { stateData: StateData; linkedFloodData: FloodData[] } {
  const matchedState = stateData.find(s => s.name === frame.state) || stateData[0]
  const linkedFloodData = floodData.filter(d => d.state === frame.state)
  
  return {
    ...frame,
    stateData: matchedState,
    linkedFloodData
  }
}

// Simulate AI flood detection
export async function runFloodDetection(frame: SatelliteFrame): Promise<SatelliteFrame> {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000))
  
  const baseConfidence = 85 + Math.random() * 12
  const floodPixels = Math.floor(5000 + Math.random() * 20000)
  const area = parseFloat((floodPixels * 0.0001 * (frame.resolution.includes('10') ? 10 : 1)).toFixed(2))
  
  return {
    ...frame,
    processingStatus: 'completed',
    processedImage: `/satellite/processed/${frame.tile}_NDWI.tif`,
    floodMask: `/satellite/mask/${frame.tile}_FLOOD.tif`,
    detectionResult: {
      floodPixels,
      confidence: parseFloat(baseConfidence.toFixed(1)),
      area
    }
  }
}

// Generate integrated analysis
export function generateIntegratedAnalysis(
  frame: SatelliteFrame,
  stateData: StateData
): IntegratedAnalysis {
  const rainfall = stateData.avgRainfall
  const floodRiskScore = calculateFloodRisk(rainfall, stateData.avgRainfall)
  
  let alertLevel: 'critical' | 'high' | 'medium' | 'low' = 'low'
  if (floodRiskScore >= 75) alertLevel = 'critical'
  else if (floodRiskScore >= 50) alertLevel = 'high'
  else if (floodRiskScore >= 25) alertLevel = 'medium'
  
  const recommendations = []
  if (alertLevel === 'critical') {
    recommendations.push('Immediate evacuation advised')
    recommendations.push('Activate emergency response teams')
    recommendations.push('Monitor river levels continuously')
  } else if (alertLevel === 'high') {
    recommendations.push('Issue flood warnings')
    recommendations.push('Prepare relief materials')
    recommendations.push('Alert local authorities')
  } else {
    recommendations.push('Continue monitoring')
    recommendations.push('Update assessments every 6 hours')
    recommendations.push('Maintain preparedness levels')
  }
  
  return {
    stateName: stateData.name,
    frameId: frame.id,
    timestamp: new Date().toISOString(),
    floodRiskScore,
    rainfall,
    historicalIncidents: stateData.totalIncidents,
    satelliteMetrics: {
      waterExtent: frame.metrics.ndwi * 100,
      floodPixels: frame.detectionResult?.floodPixels || 0,
      detectionConfidence: frame.detectionResult?.confidence || 0
    },
    recommendations,
    alertLevel
  }
}

// Pipeline step configurations
export const PIPELINE_STEPS: Record<PipelineStep, { name: string; duration: number; description: string }> = {
  capture: {
    name: 'Satellite Capture',
    duration: 0,
    description: 'Raw satellite imagery acquisition'
  },
  processing: {
    name: 'Data Processing',
    duration: 2000,
    description: 'NDWI calculation and cloud masking'
  },
  detection: {
    name: 'AI Detection',
    duration: 3000,
    description: 'U-Net++ flood classification'
  },
  analysis: {
    name: 'Risk Analysis',
    duration: 1000,
    description: 'Flood risk scoring and recommendations'
  }
}

// Initial pipeline status
export function getInitialPipelineStatus(): PipelineStatus {
  return {
    currentStep: 'capture',
    stepName: 'Satellite Capture',
    status: 'idle',
    progress: 0,
    timestamp: new Date().toISOString(),
    message: 'Ready to start analysis pipeline'
  }
}

// Mock integrated report data for download
export interface IntegratedReport {
  reportId: string
  generatedAt: string
  stateName: string
  frameId: string
  satelliteData: {
    tile: string
    sensor: string
    captureDate: string
    resolution: string
    processedImage: string
    floodMask: string
  }
  analyticsData: {
    floodRiskScore: number
    rainfall: number
    historicalIncidents: number
    riskLevel: string
  }
  detectionResults: {
    floodPixels: number
    confidence: number
    area: number
    processingTime: string
  }
  recommendations: string[]
  pipelineSteps: PipelineStatus[]
}

export function generateIntegratedReport(
  frame: SatelliteFrame,
  analysis: IntegratedAnalysis
): IntegratedReport {
  return {
    reportId: `RPT-${Date.now()}-${frame.tile}`,
    generatedAt: new Date().toISOString(),
    stateName: analysis.stateName,
    frameId: frame.id,
    satelliteData: {
      tile: frame.tile,
      sensor: frame.sensor,
      captureDate: frame.captureDate,
      resolution: frame.resolution,
      processedImage: frame.processedImage || 'N/A',
      floodMask: frame.floodMask || 'N/A'
    },
    analyticsData: {
      floodRiskScore: analysis.floodRiskScore,
      rainfall: analysis.rainfall,
      historicalIncidents: analysis.historicalIncidents,
      riskLevel: analysis.alertLevel
    },
    detectionResults: {
      floodPixels: frame.detectionResult?.floodPixels || 0,
      confidence: frame.detectionResult?.confidence || 0,
      area: frame.detectionResult?.area || 0,
      processingTime: '4.2 seconds'
    },
    recommendations: analysis.recommendations,
    pipelineSteps: [
      { currentStep: 'capture', stepName: 'Satellite Capture', status: 'completed', progress: 100, timestamp: frame.captureDate, message: 'Image acquired successfully' },
      { currentStep: 'processing', stepName: 'Data Processing', status: 'completed', progress: 100, timestamp: new Date().toISOString(), message: 'NDWI processed, clouds masked' },
      { currentStep: 'detection', stepName: 'AI Detection', status: 'completed', progress: 100, timestamp: new Date().toISOString(), message: `Flood detected with ${frame.detectionResult?.confidence.toFixed(1)}% confidence` },
      { currentStep: 'analysis', stepName: 'Risk Analysis', status: 'completed', progress: 100, timestamp: new Date().toISOString(), message: 'Risk assessment complete' }
    ]
  }
}
