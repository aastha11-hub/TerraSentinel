const { pool, testConnection } = require('./db');

async function setupDatabase() {
  try {
    console.log('Setting up TerraSentinel database...');
    
    // Test connection first
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Cannot connect to database');
    }
    
    // Create satellite_sources table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS satellite_sources (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        type VARCHAR(50),
        resolution VARCHAR(50),
        use_case TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('satellite_sources table created/verified');

    // Create satellite_metrics table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS satellite_metrics (
        id SERIAL PRIMARY KEY,
        source_name VARCHAR(100) NOT NULL REFERENCES satellite_sources(name),
        flood_risk_score INTEGER CHECK (flood_risk_score >= 0 AND flood_risk_score <= 100),
        water_extent DECIMAL(5,2) CHECK (water_extent >= 0 AND water_extent <= 100),
        ndvi DECIMAL(5,3) CHECK (ndvi >= -1 AND ndvi <= 1),
        soil_moisture DECIMAL(5,2) CHECK (soil_moisture >= 0 AND soil_moisture <= 100),
        cloud_cover DECIMAL(5,2) CHECK (cloud_cover >= 0 AND cloud_cover <= 100),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (source_name) REFERENCES satellite_sources(name) ON DELETE CASCADE
      )
    `);
    console.log('satellite_metrics table created/verified');

    // Check if data exists
    const countResult = await pool.query('SELECT COUNT(*) FROM satellite_sources');
    const sourceCount = parseInt(countResult.rows[0].count);
    
    if (sourceCount === 0) {
      // Insert sample satellite sources
      await pool.query(`
        INSERT INTO satellite_sources (name, description, type, resolution, use_case) VALUES
        ('ISRO', 'Primary national provider of Earth observation missions supporting disaster management, water monitoring, and environmental intelligence.', 'Government', 'Varies', 'Disaster management, water monitoring, environmental intelligence'),
        ('Bhuvan Geoportal', 'ISRO''s geospatial platform providing map services and thematic layers that can support flood situational awareness.', 'Portal', 'Varies', 'Flood situational awareness, mapping services'),
        ('RISAT', 'Radar Imaging Satellite series enabling all-weather imaging and strong performance during cloud cover and heavy rainfall.', 'Radar Satellite', '1-3m', 'All-weather imaging, flood monitoring'),
        ('Resourcesat', 'Optical remote sensing mission supporting land and water monitoring with multi-spectral observations.', 'Optical Satellite', '5.8m-23.5m', 'Land and water monitoring, agricultural monitoring'),
        ('Cartosat', 'High-resolution optical imaging mission useful for detailed mapping and impacted-area assessment.', 'Optical Satellite', '0.65-2.5m', 'Detailed mapping, impact assessment')
      `);
      console.log('Sample satellite sources inserted');
      
      // Insert sample metrics for each source
      const sources = ['ISRO', 'Bhuvan Geoportal', 'RISAT', 'Resourcesat', 'Cartosat'];
      for (const sourceName of sources) {
        await pool.query(`
          INSERT INTO satellite_metrics (source_name, flood_risk_score, water_extent, ndvi, soil_moisture, cloud_cover) VALUES
          ($1, $2, $3, $4, $5, $6)
        `, [
          sourceName,
          Math.floor(Math.random() * 40) + 60, // flood_risk_score: 60-100
          Math.random() * 30 + 30, // water_extent: 30-60
          Math.random() * 0.4 + 0.4, // ndvi: 0.4-0.8
          Math.random() * 20 + 60, // soil_moisture: 60-80
          Math.random() * 30 + 10 // cloud_cover: 10-40
        ]);
      }
      console.log('Sample metrics data inserted');
    }

    console.log('Database setup complete!');
    console.log(`Tables created: satellite_sources (${sourceCount} records), satellite_metrics`);
    
  } catch (error) {
    console.error('Database setup failed:', error);
    throw error;
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('Setup completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupDatabase };
