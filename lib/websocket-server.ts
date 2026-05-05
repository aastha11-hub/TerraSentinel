// Simple WebSocket server for satellite streaming
import { createServer } from 'http'

// Simple WebSocket server without ws module for now
const server = createServer()

// Mock WebSocket functionality for demo
const clients: any[] = []
const wss = {
  on: (event: string, callback: Function) => {
    // Mock WebSocket event handling
    console.log(`WebSocket ${event} event registered`)
  },
  broadcast: (data: any) => {
    const message = JSON.stringify(data)
    clients.forEach(client => {
      if (client.readyState === 1) { // WebSocket.OPEN
        client.send(message)
      }
    })
  }
}

// Real satellite image URLs (mock for demo)
const SATELLITE_IMAGES = {
  'ganges-raw': 'https://earthobservatory.nasa.gov/images/1024x576/1200x676/1200x676_4080/ganges_2023234_lrg.jpg',
  'ganges-ndwi': 'https://earthobservatory.nasa.gov/images/1024x576/1200x676/1200x676_4080/ganges_2023234_lrg.jpg',
  'ganges-mask': 'https://earthobservatory.nasa.gov/images/1024x576/1200x676/1200x676_4080/ganges_2023234_lrg.jpg',
  'brahmaputra-raw': 'https://earthobservatory.nasa.gov/images/1024x576/1200x676/1200x676_4080/brahmaputra_2023234_lrg.jpg',
  'brahmaputra-ndwi': 'https://earthobservatory.nasa.gov/images/1024x576/1200x676/1200x676_4080/brahmaputra_2023234_lrg.jpg',
  'brahmaputra-mask': 'https://earthobservatory.nasa.gov/images/1024x576/1200x676/1200x676_4080/brahmaputra_2023234_lrg.jpg'
}

const satelliteCards = [
  {
    id: 'sat-1',
    location: 'Ganges River Basin',
    sensor: 'Sentinel-2',
    layer: 'RAW',
    imageUrl: SATELLITE_IMAGES['ganges-raw'],
    capturedAt: 'Just Now',
    tags: ['NDWI', 'Flood Zone', 'AI Verified'],
    source: 'European Space Agency'
  },
  {
    id: 'sat-2',
    location: 'Brahmaputra Plains',
    sensor: 'Sentinel-1',
    layer: 'NDWI',
    imageUrl: SATELLITE_IMAGES['brahmaputra-ndwi'],
    capturedAt: 'Just Now',
    tags: ['NDWI', 'Flood Zone', 'AI Verified'],
    source: 'European Space Agency'
  },
  {
    id: 'sat-3',
    location: 'Maharashtra Coast',
    sensor: 'RISAT',
    layer: 'Flood Zone',
    imageUrl: SATELLITE_IMAGES['ganges-mask'],
    capturedAt: 'Just Now',
    tags: ['NDWI', 'Flood Zone', 'AI Verified'],
    source: 'ISRO Bhuvan'
  }
]

// Mock WebSocket connection handling
server.on('upgrade', (request, socket, head) => {
  console.log('Client connected to satellite stream')
  
  // Send initial data
  satelliteCards.forEach((card, index) => {
    setTimeout(() => {
      socket.write(JSON.stringify({
        type: 'satellite_update',
        card: card
      }))
    }, index * 1000) // Stagger initial cards
  })

  // Stream updates every 2-5 seconds
  const streamInterval = setInterval(() => {
    const randomCard = satelliteCards[Math.floor(Math.random() * satelliteCards.length)]
    const updatedCard = {
      ...randomCard,
      capturedAt: new Date().toLocaleTimeString()
    }
    
    socket.write(JSON.stringify({
      type: 'satellite_update',
      card: updatedCard
    }))
  }, 2000 + Math.random() * 3000) // 2-5 second intervals

  socket.on('close', () => {
    console.log('Client disconnected from satellite stream')
    clearInterval(streamInterval)
  })

  socket.on('error', (error) => {
    console.error('WebSocket error:', error)
  })
})

console.log('Satellite WebSocket server running on port 8080')
server.listen(8080, () => {
  console.log('WebSocket server running on port 8080')
})
