// WebSocket service for real-time satellite streaming
class SatelliteWebSocketService {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 2000
  private listeners: Map<string, Set<(data: any) => void>> = new Map()

  constructor(private url: string) {}

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url)
        
        this.ws.onopen = () => {
          console.log('WebSocket connected')
          this.reconnectAttempts = 0
          this.broadcast('connection', { status: 'connected' })
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            this.broadcast('message', data)
          } catch (error) {
            console.error('Error parsing WebSocket message:', error)
          }
        }

        this.ws.onclose = () => {
          console.log('WebSocket disconnected')
          this.broadcast('connection', { status: 'disconnected' })
          this.attemptReconnect()
        }

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error)
          this.broadcast('connection', { status: 'error' })
          // Don't reject immediately, allow fallback to work
          setTimeout(() => {
            this.broadcast('connection', { status: 'failed' })
          }, 2000)
        }
      } catch (error) {
        console.error('WebSocket connection failed:', error)
        // Broadcast failed status but don't reject to allow fallback
        setTimeout(() => {
          this.broadcast('connection', { status: 'failed' })
        }, 1000)
      }
    })
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      this.broadcast('connection', { status: 'reconnecting' })
      
      setTimeout(() => {
        this.connect().catch(console.error)
      }, this.reconnectDelay * this.reconnectAttempts)
    } else {
      this.broadcast('connection', { status: 'failed' })
    }
  }

  subscribe(event: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(callback)

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(callback)
    }
  }

  private broadcast(event: string, data: any): void {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      callbacks.forEach(callback => callback(data))
    }
  }

  send(data: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  getConnectionStatus(): 'connected' | 'disconnected' | 'reconnecting' | 'failed' {
    if (!this.ws) return 'disconnected'
    switch (this.ws.readyState) {
      case WebSocket.OPEN: return 'connected'
      case WebSocket.CONNECTING: return 'reconnecting'
      case WebSocket.CLOSING:
      case WebSocket.CLOSED: 
      default: return 'disconnected'
    }
  }
}

// Real satellite image sources
export const SATELLITE_SOURCES = {
  NASA: {
    name: 'NASA Earth Observatory',
    baseUrl: 'https://earthobservatory.nasa.gov/images',
    endpoints: {
      raw: '/latest',
      ndwi: '/water',
      mask: '/flood'
    }
  },
  ESA: {
    name: 'European Space Agency',
    baseUrl: 'https://www.esa.int/var/esa/storage/images',
    endpoints: {
      raw: '/sentinel2/latest',
      ndwi: '/sentinel2/water',
      mask: '/sentinel2/flood'
    }
  },
  ISRO: {
    name: 'ISRO Bhuvan',
    baseUrl: 'https://bhuvan.nrsc.gov.in/data',
    endpoints: {
      raw: '/latest',
      ndwi: '/water',
      mask: '/flood'
    }
  }
}

// Singleton instance
export const satelliteWebSocket = new SatelliteWebSocketService('ws://localhost:8080/satellite-stream')

export default SatelliteWebSocketService
