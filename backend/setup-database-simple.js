require('dotenv').config();
const { Pool } = require('pg');

async function setupDatabase() {
  const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'postgres',
    password: process.env.DB_PASSWORD || '8888',
    port: process.env.DB_PORT || 5432,
  });

  try {
    console.log('Setting up TerraSentinel flood monitoring database...');
    
    // Create tables one by one
    const tables = [
      {
        name: 'satellite_sources',
        sql: `
          CREATE TABLE IF NOT EXISTS satellite_sources (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE,
            description TEXT,
            type VARCHAR(100) NOT NULL,
            resolution VARCHAR(100),
            use_case TEXT,
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `
      },
      {
        name: 'satellite_metrics',
        sql: `
          CREATE TABLE IF NOT EXISTS satellite_metrics (
            id SERIAL PRIMARY KEY,
            source_id INTEGER REFERENCES satellite_sources(id) ON DELETE CASCADE,
            metric_type VARCHAR(100) NOT NULL,
            value DECIMAL(10, 2),
            unit VARCHAR(50),
            recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            location_lat DECIMAL(10, 8),
            location_lng DECIMAL(11, 8),
            region VARCHAR(100)
          )
        `
      },
      {
        name: 'flood_alerts',
        sql: `
          CREATE TABLE IF NOT EXISTS flood_alerts (
            id SERIAL PRIMARY KEY,
            alert_level VARCHAR(50) NOT NULL,
            severity VARCHAR(50) NOT NULL,
            location_lat DECIMAL(10, 8) NOT NULL,
            location_lng DECIMAL(11, 8) NOT NULL,
            region VARCHAR(100) NOT NULL,
            description TEXT,
            affected_population INTEGER,
            status VARCHAR(50) DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `
      },
      {
        name: 'monitoring_zones',
        sql: `
          CREATE TABLE IF NOT EXISTS monitoring_zones (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            boundary_lat_min DECIMAL(10, 8),
            boundary_lat_max DECIMAL(10, 8),
            boundary_lng_min DECIMAL(11, 8),
            boundary_lng_max DECIMAL(11, 8),
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `
      },
      {
        name: 'users',
        sql: `
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            name VARCHAR(255) NOT NULL,
            password_hash VARCHAR(255),
            avatar_url VARCHAR(500),
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_login TIMESTAMP
          )
        `
      }
    ];

    // Create tables
    for (const table of tables) {
      try {
        await pool.query(table.sql);
        console.log(`Table '${table.name}': \x1b[32mCREATED\x1b[0m`);
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`Table '${table.name}': \x1b[33mEXISTS\x1b[0m`);
        } else {
          console.log(`Table '${table.name}': \x1b[31mERROR\x1b[0m: ${error.message}`);
        }
      }
    }

    // Insert sample data
    console.log('\nInserting sample data...');
    
    // Satellite sources
    const satelliteData = [
      ['ISRO (Indian Space Research Organisation)', 'Primary national provider of Earth observation missions supporting disaster management, water monitoring, and environmental intelligence.', 'Optical', '5-10m', 'Flood monitoring and water resource management'],
      ['Bhuvan Geoportal', 'ISRO\'s geospatial platform providing map services and thematic layers that can support flood situational awareness.', 'Geospatial Portal', 'Various', 'Flood mapping and situational awareness'],
      ['RISAT', 'Radar Imaging Satellite series enabling all-weather imaging and strong performance during cloud cover and heavy rainfall.', 'Radar', '3-50m', 'All-weather flood monitoring'],
      ['Resourcesat', 'Optical remote sensing mission supporting land and water monitoring with multi-spectral observations.', 'Optical', '5.8-23.5m', 'Land and water monitoring'],
      ['Cartosat', 'High-resolution optical imaging mission useful for detailed mapping and impacted-area assessment.', 'Optical', '0.25-2.5m', 'High-resolution flood impact assessment']
    ];

    for (const [name, description, type, resolution, use_case] of satelliteData) {
      try {
        await pool.query(
          'INSERT INTO satellite_sources (name, description, type, resolution, use_case) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (name) DO NOTHING',
          [name, description, type, resolution, use_case]
        );
      } catch (error) {
        console.log(`Error inserting ${name}: ${error.message}`);
      }
    }

    // Flood alerts
    const alertData = [
      ['High', 'Severe', 19.0760, 72.8777, 'Mumbai', 'Heavy rainfall causing flooding in low-lying areas', 150000],
      ['Medium', 'Moderate', 28.6139, 77.2090, 'Delhi', 'Water level rising in Yamuna river', 50000],
      ['Low', 'Minor', 12.9716, 77.5946, 'Bangalore', 'Minor flooding in some areas due to heavy rains', 25000]
    ];

    for (const [level, severity, lat, lng, region, description, population] of alertData) {
      try {
        await pool.query(
          'INSERT INTO flood_alerts (alert_level, severity, location_lat, location_lng, region, description, affected_population) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [level, severity, lat, lng, region, description, population]
        );
      } catch (error) {
        console.log(`Error inserting alert for ${region}: ${error.message}`);
      }
    }

    // Monitoring zones
    const zoneData = [
      ['Mumbai Metropolitan Region', 'Comprehensive flood monitoring for Mumbai and surrounding areas', 18.8940, 19.2760, 72.7750, 73.0800],
      ['National Capital Region', 'Flood monitoring for Delhi NCR region', 28.4040, 28.8800, 76.8400, 77.3400],
      ['Bangalore Urban', 'Urban flood monitoring for Bangalore city', 12.8340, 13.1430, 77.4600, 77.7840]
    ];

    for (const [name, description, lat_min, lat_max, lng_min, lng_max] of zoneData) {
      try {
        await pool.query(
          'INSERT INTO monitoring_zones (name, description, boundary_lat_min, boundary_lat_max, boundary_lng_min, boundary_lng_max) VALUES ($1, $2, $3, $4, $5, $6)',
          [name, description, lat_min, lat_max, lng_min, lng_max]
        );
      } catch (error) {
        console.log(`Error inserting zone ${name}: ${error.message}`);
      }
    }

    // Test the setup
    console.log('\nTesting database setup...');
    
    const sourcesResult = await pool.query('SELECT COUNT(*) as count FROM satellite_sources');
    const alertsResult = await pool.query('SELECT COUNT(*) as count FROM flood_alerts');
    const zonesResult = await pool.query('SELECT COUNT(*) as count FROM monitoring_zones');
    
    console.log(`\x1b[32mDatabase setup complete!\x1b[0m`);
    console.log(`- Satellite sources: ${sourcesResult.rows[0].count}`);
    console.log(`- Flood alerts: ${alertsResult.rows[0].count}`);
    console.log(`- Monitoring zones: ${zonesResult.rows[0].count}`);

  } catch (error) {
    console.error('Database setup failed:', error.message);
  } finally {
    await pool.end();
  }
}

setupDatabase().catch(console.error);
