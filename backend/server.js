const express = require("express");
const cors = require("cors");
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Mock data for testing
const mockSources = [
  { 
    id: 1, 
    name: 'ISRO', 
    description: 'Primary national provider of Earth observation missions supporting disaster management, water monitoring, and environmental intelligence.', 
    type: 'Government', 
    resolution: 'Varies', 
    use_case: 'Disaster management, water monitoring, environmental intelligence',
    created_at: new Date().toISOString() 
  },
  { 
    id: 2, 
    name: 'Bhuvan Geoportal', 
    description: 'ISRO\'s geospatial platform providing map services and thematic layers that can support flood situational awareness.', 
    type: 'Portal', 
    resolution: 'Varies', 
    use_case: 'Flood situational awareness, mapping services',
    created_at: new Date().toISOString() 
  },
  { 
    id: 3, 
    name: 'RISAT', 
    description: 'Radar Imaging Satellite series enabling all-weather imaging and strong performance during cloud cover and heavy rainfall.', 
    type: 'Radar Satellite', 
    resolution: '1-3m', 
    use_case: 'All-weather imaging, flood monitoring',
    created_at: new Date().toISOString() 
  },
  { 
    id: 4, 
    name: 'Resourcesat', 
    description: 'Optical remote sensing mission supporting land and water monitoring with multi-spectral observations.', 
    type: 'Optical Satellite', 
    resolution: '5.8m-23.5m', 
    use_case: 'Land and water monitoring, agricultural monitoring',
    created_at: new Date().toISOString() 
  },
  { 
    id: 5, 
    name: 'Cartosat', 
    description: 'High-resolution optical imaging mission useful for detailed mapping and impacted-area assessment.', 
    type: 'Optical Satellite', 
    resolution: '0.65-2.5m', 
    use_case: 'Detailed mapping, impact assessment',
    created_at: new Date().toISOString() 
  }
];

// Error handling middleware
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

function errorHandler(err, req, res, next) {
  console.error('Server Error:', err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    message: err.message
  });
}

// Routes

// GET /api/sources - List all sources
app.get("/api/sources", asyncHandler(async (req, res) => {
  console.log('GET /api/sources - Fetching all satellite sources');
  
  try {
    res.json({ 
      success: true, 
      data: mockSources,
      message: "Successfully fetched satellite sources"
    });
    console.log('Successfully returned', mockSources.length, 'satellite sources');
  } catch (error) {
    console.error('Error fetching sources:', error);
    throw error;
  }
}));

// GET /api/dashboard/:source - Returns combined data
app.get("/api/dashboard/:source", asyncHandler(async (req, res) => {
  const sourceName = req.params.source;
  console.log(`GET /api/dashboard/${sourceName} - Fetching dashboard data`);
  
  try {
    const source = mockSources.find(s => s.name.toLowerCase() === sourceName.toLowerCase());
    
    if (!source) {
      return res.status(404).json({
        success: false,
        error: "Source not found",
        message: `No source found with name ${sourceName}`
      });
    }
    
    // Generate mock metrics
    const now = new Date();
    const latestMetrics = {
      id: 1,
      source_name: sourceName,
      flood_risk_score: Math.floor(Math.random() * 40) + 60,
      water_extent: Math.random() * 30 + 30,
      ndvi: Math.random() * 0.4 + 0.4,
      soil_moisture: Math.random() * 20 + 60,
      cloud_cover: Math.random() * 30 + 10,
      updated_at: now.toISOString()
    };
    
    // Generate mock historical data
    const historicalTrends = Array.from({ length: 10 }, (_, i) => {
      const date = new Date(now.getTime() - (9 - i) * 24 * 60 * 60 * 1000);
      return {
        updated_at: date.toISOString(),
        ndvi: Math.random() * 0.4 + 0.4,
        water_extent: Math.random() * 30 + 30
      };
    });
    
    const dashboardData = {
      source: source,
      latestMetrics: latestMetrics,
      historicalTrends: historicalTrends,
      lastUpdated: latestMetrics.updated_at
    };
    
    console.log(`Successfully generated dashboard data for ${sourceName}`);
    res.json({ 
      success: true, 
      data: dashboardData,
      message: "Successfully fetched dashboard data"
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
}));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    success: true, 
    message: "TerraSentinel API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`TerraSentinel API running on port ${PORT}`);
  console.log(`Health Check: http://localhost:${PORT}/api/health`);
  console.log(`Sources API: http://localhost:${PORT}/api/sources`);
});
