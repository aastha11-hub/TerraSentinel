'use client'

import React, { useState, useEffect } from 'react'

interface ApiResponse {
  status: string
  data: any
  timestamp: string
}

interface Endpoint {
  method: string
  route: string
  description: string
  parameters?: string[]
}

const mockApiResponses: Record<string, any> = {
  '/api/flood-data': {
    status: 'success',
    data: {
      flood_events: [
        {
          id: 'FLD-2024-089',
          location: 'Kerala, India',
          severity: 'high',
          affected_area: '1247.5 km²',
          timestamp: '2024-07-15T14:30:00Z',
          coordinates: [76.2711, 10.8505],
          water_level: '+3.2m',
          population_affected: 45230
        },
        {
          id: 'FLD-2024-090',
          location: 'Assam, India',
          severity: 'moderate',
          affected_area: '892.3 km²',
          timestamp: '2024-07-16T09:15:00Z',
          coordinates: [92.9376, 26.2006],
          water_level: '+1.8m',
          population_affected: 28450
        }
      ],
      total_events: 2,
      last_updated: '2024-07-16T15:45:00Z'
    }
  },
  '/api/rainfall': {
    status: 'success',
    data: {
      rainfall_data: [
        {
          region: 'Maharashtra',
          current_rainfall: 127.3,
          forecast_24h: 85.6,
          forecast_72h: 45.2,
          threshold_exceeded: true,
          risk_level: 'high'
        },
        {
          region: 'Gujarat',
          current_rainfall: 45.8,
          forecast_24h: 32.1,
          forecast_72h: 18.9,
          threshold_exceeded: false,
          risk_level: 'low'
        }
      ],
      national_average: 86.55,
      monsoon_status: 'active',
      last_updated: '2024-07-16T15:45:00Z'
    }
  },
  '/api/flood-risk': {
    status: 'success',
    data: {
      risk_assessment: [
        {
          district: 'Ernakulam',
          state: 'Kerala',
          risk_score: 8.7,
          risk_level: 'critical',
          factors: ['heavy_rainfall', 'river_overflow', 'dam_release'],
          evacuation_recommended: true,
          estimated_impact: 'high'
        },
        {
          district: 'Kamrup',
          state: 'Assam',
          risk_score: 6.2,
          risk_level: 'moderate',
          factors: ['moderate_rainfall', 'soil_saturation'],
          evacuation_recommended: false,
          estimated_impact: 'medium'
        }
      ],
      national_risk_index: 7.45,
      alert_count: 12,
      last_updated: '2024-07-16T15:45:00Z'
    }
  }
}

const endpoints: Endpoint[] = [
  {
    method: 'GET',
    route: '/api/flood-data',
    description: 'Retrieve real-time flood event data including location, severity, affected area, and population impact',
    parameters: ['state', 'severity', 'date_from', 'date_to', 'limit']
  },
  {
    method: 'GET',
    route: '/api/rainfall',
    description: 'Access rainfall measurements, forecasts, and threshold alerts for monitoring regions',
    parameters: ['region', 'timespan', 'threshold_only', 'include_forecast']
  },
  {
    method: 'GET',
    route: '/api/flood-risk',
    description: 'Get comprehensive flood risk assessments with scoring and evacuation recommendations',
    parameters: ['district', 'state', 'risk_threshold', 'include_factors']
  },
  {
    method: 'GET',
    route: '/api/satellite-data',
    description: 'Retrieve satellite imagery metadata and processing status for flood detection',
    parameters: ['satellite', 'date', 'processing_level', 'bbox']
  },
  {
    method: 'POST',
    route: '/api/alerts/subscribe',
    description: 'Subscribe to real-time flood alerts for specific regions or risk thresholds',
    parameters: ['email', 'regions', 'alert_types', 'risk_threshold']
  }
]

export default function ApiClient() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('/api/flood-data')
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState<string>('')
  const [copiedKey, setCopiedKey] = useState(false)
  const [rateLimitStatus, setRateLimitStatus] = useState({
    used: 0,
    limit: 1000,
    reset_time: '2024-07-17T00:00:00Z'
  })

  const generateApiKey = () => {
    const newKey = `TS_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    setApiKey(newKey)
    setCopiedKey(false)
  }

  const copyApiKey = async () => {
    if (apiKey) {
      await navigator.clipboard.writeText(apiKey)
      setCopiedKey(true)
      setTimeout(() => setCopiedKey(false), 2000)
    }
  }

  const tryApiCall = async (endpoint: string) => {
    setLoading(true)
    setError(null)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock response
      const mockData = mockApiResponses[endpoint] || {
        status: 'success',
        data: { message: 'Endpoint available for testing' },
        timestamp: new Date().toISOString()
      }
      
      setApiResponse({
        ...mockData,
        timestamp: new Date().toISOString()
      })
      
      // Update rate limit
      setRateLimitStatus(prev => ({
        ...prev,
        used: prev.used + 1
      }))
      
    } catch (err) {
      setError('Failed to fetch API response. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    generateApiKey()
  }, [])

  return (
    <>
      {/* API Overview Section */}
      <div className="mb-10 glow-border bg-space-navy/40 backdrop-blur-sm rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-cyan-accent mb-4">API Overview</h2>
        <div className="space-y-4 text-sm text-white/70">
          <div>
            <h3 className="font-semibold text-white mb-2">Purpose</h3>
            <p>
              TerraSentinel API provides programmatic access to near real-time flood intelligence, 
              satellite data processing, and climate analytics. Designed for researchers, 
              emergency responders, and integration with disaster management systems.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-2">Available Datasets</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-white/10 bg-black/20 p-3 rounded-lg">
                <h4 className="text-cyan-accent font-medium mb-1">Flood Data</h4>
                <p className="text-xs">Real-time flood events, severity levels, affected areas, population impact</p>
              </div>
              <div className="border border-white/10 bg-black/20 p-3 rounded-lg">
                <h4 className="text-cyan-accent font-medium mb-1">Rainfall</h4>
                <p className="text-xs">Current measurements, 24-72h forecasts, threshold monitoring</p>
              </div>
              <div className="border border-white/10 bg-black/20 p-3 rounded-lg">
                <h4 className="text-cyan-accent font-medium mb-1">Satellite</h4>
                <p className="text-xs">Sentinel-1/2 data, processing status, imagery metadata</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Endpoints List */}
      <div className="mb-10 glow-border bg-space-navy/40 backdrop-blur-sm rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-cyan-accent mb-4">API Endpoints</h2>
        <div className="space-y-4">
          {endpoints.map((endpoint, idx) => (
            <div key={idx} className="border border-white/10 bg-black/20 p-4 rounded-xl">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-mono ${
                    endpoint.method === 'GET' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {endpoint.method}
                  </span>
                  <code className="text-cyan-accent font-mono text-sm">{endpoint.route}</code>
                </div>
                <button
                  onClick={() => {
                    setSelectedEndpoint(endpoint.route)
                    tryApiCall(endpoint.route)
                  }}
                  className="px-3 py-1 bg-cyan-accent/10 hover:bg-cyan-accent/20 text-cyan-accent rounded text-xs font-medium transition-colors"
                >
                  TRY API
                </button>
              </div>
              <p className="text-white/70 text-sm mb-2">{endpoint.description}</p>
              {endpoint.parameters && (
                <div className="text-xs text-white/50">
                  <span className="font-medium">Parameters:</span> {endpoint.parameters.join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Live API Response Preview */}
      <div className="mb-10 glow-border bg-space-navy/40 backdrop-blur-sm rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-cyan-accent mb-4">Live API Response Preview</h2>
        <div className="mb-3 flex items-center gap-4">
          <select
            value={selectedEndpoint}
            onChange={(e) => setSelectedEndpoint(e.target.value)}
            className="bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-white"
          >
            {endpoints.map(ep => (
              <option key={ep.route} value={ep.route}>{ep.route}</option>
            ))}
          </select>
          <button
            onClick={() => tryApiCall(selectedEndpoint)}
            disabled={loading}
            className="px-4 py-2 bg-cyan-accent hover:bg-cyan-accent/80 disabled:opacity-50 text-black rounded text-sm font-medium transition-colors"
          >
            {loading ? 'Loading...' : 'Execute Request'}
          </button>
        </div>
        
        {loading && (
          <div className="flex items-center gap-2 text-cyan-accent text-sm">
            <div className="w-4 h-4 border-2 border-cyan-accent border-t-transparent rounded-full animate-spin"></div>
            Fetching API response...
          </div>
        )}
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded text-sm">
            Error: {error}
          </div>
        )}
        
        {apiResponse && (
          <div className="bg-black/40 border border-white/10 rounded-xl p-4 overflow-x-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/50">JSON Response</span>
              <span className="text-xs text-green-400">
                Status: {apiResponse.status} • {new Date(apiResponse.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <pre className="text-xs text-white/80 font-mono">
              <code>{JSON.stringify(apiResponse, null, 2)}</code>
            </pre>
          </div>
        )}
      </div>

      {/* API Key Section */}
      <div className="mb-10 glow-border bg-space-navy/40 backdrop-blur-sm rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-cyan-accent mb-4">API Authentication</h2>
        <div className="space-y-4">
          <div className="text-sm text-white/70">
            <p className="mb-2">Generate your API key to access TerraSentinel data services:</p>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={apiKey}
                readOnly
                placeholder="Click Generate API Key"
                className="flex-1 bg-black/40 border border-white/10 rounded px-3 py-2 text-sm font-mono text-white"
              />
              <button
                onClick={generateApiKey}
                className="px-4 py-2 bg-cyan-accent hover:bg-cyan-accent/80 text-black rounded text-sm font-medium transition-colors"
              >
                Generate
              </button>
              <button
                onClick={copyApiKey}
                disabled={!apiKey}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white rounded text-sm font-medium transition-colors"
              >
                {copiedKey ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          <div className="text-xs text-white/50">
            <p>• Include API key in Authorization header: <code className="bg-black/30 px-1 rounded">Bearer YOUR_API_KEY</code></p>
            <p>• Rate limits: 1000 requests/hour per API key</p>
            <p>• Keys are valid for 365 days from generation</p>
          </div>
        </div>
      </div>

      {/* Example Requests */}
      <div className="mb-10 glow-border bg-space-navy/40 backdrop-blur-sm rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-cyan-accent mb-4">Example Requests</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-white mb-2">JavaScript (Fetch)</h3>
            <pre className="bg-black/40 border border-white/10 rounded p-3 text-xs text-white/80 font-mono overflow-x-auto">
              <code>{`const response = await fetch('https://api.terrasentinel.in/api/flood-data', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ${apiKey}',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);`}</code>
            </pre>
          </div>
          <div>
            <h3 className="text-sm font-medium text-white mb-2">JavaScript (Axios)</h3>
            <pre className="bg-black/40 border border-white/10 rounded p-3 text-xs text-white/80 font-mono overflow-x-auto">
              <code>{`import axios from 'axios';

const response = await axios.get('https://api.terrasentinel.in/api/flood-data', {
  headers: {
    'Authorization': 'Bearer ${apiKey}'
  }
});

console.log(response.data);`}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Rate Limits + Status */}
      <div className="glow-border bg-space-navy/40 backdrop-blur-sm rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-cyan-accent mb-4">API Status & Rate Limits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-white mb-3">Current Rate Limit</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Requests Used:</span>
                <span className="text-cyan-accent">{rateLimitStatus.used} / {rateLimitStatus.limit}</span>
              </div>
              <div className="w-full bg-black/40 rounded-full h-2">
                <div 
                  className="bg-cyan-accent h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(rateLimitStatus.used / rateLimitStatus.limit) * 100}%` }}
                ></div>
              </div>
              <div className="text-xs text-white/50">
                Resets: {new Date(rateLimitStatus.reset_time).toLocaleString()}
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-white mb-3">Service Status</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-white/70">API Gateway:</span>
                <span className="text-green-400">Operational</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-white/70">Data Processing:</span>
                <span className="text-green-400">Operational</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-white/70">Satellite Feed:</span>
                <span className="text-yellow-400">Delayed (15 min)</span>
              </div>
              <div className="text-xs text-white/50 mt-2">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
