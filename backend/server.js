const express = require("express");
const cors = require("cors");
require('dotenv').config();

const { pool, testConnection } = require('./db');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Database connection status
let dbConnected = false;

// Test database connection on startup
const initializeDatabase = async () => {
  try {
    dbConnected = await testConnection();
    if (dbConnected) {
      console.log('Database connected successfully');
    } else {
      console.log('Database connection failed, using mock data');
    }
  } catch (error) {
    console.error('Database initialization error:', error);
    dbConnected = false;
  }
};

// Initialize database
initializeDatabase();

// Mock data for fallback
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
    let result;
    
    if (dbConnected) {
      // Try to fetch from database
      try {
        result = await pool.query('SELECT * FROM satellite_sources ORDER BY name');
        console.log(`Successfully fetched ${result.rows.length} sources from database`);
      } catch (dbError) {
        console.error('Database query failed, falling back to mock data:', dbError.message);
        result = { rows: mockSources };
      }
    } else {
      // Use mock data if database is not connected
      console.log('Using mock data (database not connected)');
      result = { rows: mockSources };
    }
    
    res.json({ 
      success: true, 
      data: result.rows,
      message: `Successfully fetched satellite sources (${dbConnected ? 'from database' : 'from mock data'})`
    });
    
  } catch (error) {
    console.error('Error fetching sources:', error);
    throw error;
  }
}));

// GET /api/flood-alerts - Get all flood alerts
app.get("/api/flood-alerts", asyncHandler(async (req, res) => {
  console.log('GET /api/flood-alerts - Fetching flood alerts');
  
  try {
    let result;
    
    if (dbConnected) {
      try {
        result = await pool.query('SELECT * FROM flood_alerts ORDER BY created_at DESC');
        console.log(`Successfully fetched ${result.rows.length} flood alerts from database`);
      } catch (dbError) {
        console.error('Database query failed:', dbError.message);
        result = { rows: [] };
      }
    } else {
      console.log('Using empty data (database not connected)');
      result = { rows: [] };
    }
    
    res.json({ 
      success: true, 
      data: result.rows,
      message: `Successfully fetched flood alerts (${dbConnected ? 'from database' : 'from mock data'})`
    });
  } catch (error) {
    console.error('Error fetching flood alerts:', error);
    throw error;
  }
}));

// GET /api/monitoring-zones - Get all monitoring zones
app.get("/api/monitoring-zones", asyncHandler(async (req, res) => {
  console.log('GET /api/monitoring-zones - Fetching monitoring zones');
  
  try {
    let result;
    
    if (dbConnected) {
      try {
        result = await pool.query('SELECT * FROM monitoring_zones WHERE is_active = true ORDER BY name');
        console.log(`Successfully fetched ${result.rows.length} monitoring zones from database`);
      } catch (dbError) {
        console.error('Database query failed:', dbError.message);
        result = { rows: [] };
      }
    } else {
      console.log('Using empty data (database not connected)');
      result = { rows: [] };
    }
    
    res.json({ 
      success: true, 
      data: result.rows,
      message: `Successfully fetched monitoring zones (${dbConnected ? 'from database' : 'from mock data'})`
    });
  } catch (error) {
    console.error('Error fetching monitoring zones:', error);
    throw error;
  }
}));

// GET /api/dashboard/:source - Returns combined data
app.get("/api/dashboard/:source", asyncHandler(async (req, res) => {
  const sourceName = req.params.source;
  console.log(`GET /api/dashboard/${sourceName} - Fetching dashboard data`);
  
  try {
    let sourceResult, metricsResult;
    
    if (dbConnected) {
      try {
        // Get source details
        sourceResult = await pool.query(
          'SELECT * FROM satellite_sources WHERE LOWER(name) = LOWER($1)',
          [sourceName]
        );
        
        if (sourceResult.rows.length === 0) {
          return res.status(404).json({
            success: false,
            error: "Source not found",
            message: `No source found with name ${sourceName}`
          });
        }

        // Get latest metrics for this source
        metricsResult = await pool.query(
          'SELECT * FROM satellite_metrics WHERE source_id = $1 ORDER BY recorded_at DESC LIMIT 10',
          [sourceResult.rows[0].id]
        );
        
        console.log(`Successfully fetched dashboard data for ${sourceName} from database`);
      } catch (dbError) {
        console.error('Database query failed, falling back to mock data:', dbError.message);
        sourceResult = { rows: mockSources.filter(s => s.name.toLowerCase() === sourceName.toLowerCase()) };
        metricsResult = { rows: [] };
      }
    } else {
      console.log('Using mock data (database not connected)');
      sourceResult = { rows: mockSources.filter(s => s.name.toLowerCase() === sourceName.toLowerCase()) };
      metricsResult = { rows: [] };
    }
    
    if (sourceResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Source not found",
        message: `No source found with name ${sourceName}`
      });
    }
    
    const dashboardData = {
      source: sourceResult.rows[0],
      metrics: metricsResult.rows,
      lastUpdated: metricsResult.rows[0]?.recorded_at || null
    };
    
    console.log(`Successfully generated dashboard data for ${sourceName}`);
    res.json({ 
      success: true, 
      data: dashboardData,
      message: `Successfully fetched dashboard data (${dbConnected ? 'from database' : 'from mock data'})`
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
}));

// Health check endpoint
app.get("/api/health", async (req, res) => {
  const dbStatus = dbConnected ? 'connected' : 'disconnected';
  res.json({ 
    success: true, 
    message: "TerraSentinel API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    database: {
      status: dbStatus,
      connected: dbConnected
    },
    endpoints: [
      "GET /api/sources",
      "GET /api/flood-alerts",
      "GET /api/monitoring-zones",
      "GET /api/dashboard/:source",
      "GET /api/health"
    ]
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`TerraSentinel API running on port ${PORT}`);
  console.log(`Health Check: http://localhost:${PORT}/api/health`);
  console.log(`Sources API: http://localhost:${PORT}/api/sources`);
  console.log(`Database Status: ${dbConnected ? 'Connected' : 'Using Mock Data'}`);
});
