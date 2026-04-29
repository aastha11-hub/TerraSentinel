require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'postgres',
  password: process.env.DB_PASSWORD || '8888',
  port: process.env.DB_PORT || 5432,
});

async function executeComprehensiveData() {
  try {
    console.log('🚀 Executing comprehensive TerraSentinel data population...\n');
    
    // Insert comprehensive satellite sources data
    console.log('📡 Inserting satellite sources...');
    const sources = [
      ['ISRO (Indian Space Research Organisation)', 'Primary national provider of Earth observation missions supporting disaster management, water monitoring, and environmental intelligence.', 'Optical', '5-10m', 'Flood monitoring and water resource management'],
      ['Bhuvan Geoportal', 'ISRO\'s geospatial platform providing map services and thematic layers that can support flood situational awareness.', 'Geospatial Portal', 'Various', 'Flood mapping and situational awareness'],
      ['RISAT', 'Radar Imaging Satellite series enabling all-weather imaging and strong performance during cloud cover and heavy rainfall.', 'Radar', '3-50m', 'All-weather flood monitoring'],
      ['Resourcesat', 'Optical remote sensing mission supporting land and water monitoring with multi-spectral observations.', 'Optical', '5.8-23.5m', 'Land and water monitoring'],
      ['Cartosat', 'High-resolution optical imaging mission useful for detailed mapping and impacted-area assessment.', 'Optical', '0.25-2.5m', 'High-resolution flood impact assessment'],
      ['Sentinel-1', 'ESA radar constellation providing all-weather day-and-night imaging for flood monitoring.', 'Radar', '5x20m', 'Flood extent mapping'],
      ['Sentinel-2', 'ESA optical constellation providing high-resolution imagery for vegetation and water monitoring.', 'Optical', '10-20m', 'Vegetation health and water bodies'],
      ['Landsat 8', 'USGS optical satellite providing multispectral imagery for land and water monitoring.', 'Optical', '15-30m', 'Land cover and water detection'],
      ['MODIS', 'NASA sensor providing daily global coverage for rapid flood detection.', 'Optical', '250-500m', 'Rapid flood detection'],
      ['GOES', 'NOAA geostationary satellites providing real-time weather and flood monitoring.', 'Weather', '1-4km', 'Real-time weather monitoring'],
      ['INSAT', 'Indian geostationary satellites providing weather and flood monitoring.', 'Weather', '2-4km', 'Weather and flood monitoring'],
      ['SARAL', 'Altimeter satellite for water level monitoring in rivers and lakes.', 'Altimeter', '300m', 'Water level monitoring'],
      ['Jason-3', 'Satellite altimeter for precise sea level and water body monitoring.', 'Altimeter', '300m', 'Sea level and water monitoring'],
      ['GPM', 'Global Precipitation Measurement mission for rainfall monitoring.', 'Precipitation', '10km', 'Rainfall and flood prediction'],
      ['TRMM', 'Tropical Rainfall Measuring Mission for precipitation monitoring.', 'Precipitation', '5-25km', 'Tropical rainfall monitoring']
    ];

    for (const [name, description, type, resolution, use_case] of sources) {
      await pool.query(
        'INSERT INTO satellite_sources (name, description, type, resolution, use_case, is_active) VALUES ($1, $2, $3, $4, $5, true) ON CONFLICT (name) DO NOTHING',
        [name, description, type, resolution, use_case]
      );
    }
    console.log(`✅ Inserted ${sources.length} satellite sources`);

    // Insert monitoring zones
    console.log('🗺️ Inserting monitoring zones...');
    const zones = [
      ['Mumbai Metropolitan Region', 'Comprehensive flood monitoring for Mumbai and surrounding areas', 18.8940, 19.2760, 72.7750, 73.0800],
      ['National Capital Region', 'Flood monitoring for Delhi NCR region', 28.4040, 28.8800, 76.8400, 77.3400],
      ['Bangalore Urban', 'Urban flood monitoring for Bangalore city', 12.8340, 13.1430, 77.4600, 77.7840],
      ['Chennai Metropolitan', 'Coastal flood monitoring for Chennai region', 12.8440, 13.2340, 80.1440, 80.3420],
      ['Kolkata Region', 'Flood monitoring for Kolkata and surrounding areas', 22.4750, 22.7000, 88.2000, 88.4500],
      ['Hyderabad Urban', 'Urban flood monitoring for Hyderabad city', 17.2250, 17.6250, 78.3500, 78.6500],
      ['Pune Metropolitan', 'Flood monitoring for Pune and surrounding areas', 18.4000, 18.6500, 73.7500, 74.1000],
      ['Ahmedabad Region', 'Flood monitoring for Ahmedabad area', 22.9900, 23.1500, 72.5000, 72.7000],
      ['Surat Urban', 'Coastal flood monitoring for Surat city', 21.1000, 21.3000, 72.7500, 73.1000],
      ['Jaipur Region', 'Flood monitoring for Jaipur and surrounding areas', 26.8000, 27.1000, 75.7500, 76.1500],
      ['Lucknow Region', 'Flood monitoring for Lucknow area', 26.7500, 27.1000, 80.8500, 81.1000],
      ['Kanpur Urban', 'Flood monitoring for Kanpur city', 26.3500, 26.5500, 80.2000, 80.4500],
      ['Nagpur Region', 'Flood monitoring for Nagpur and surrounding areas', 21.0000, 21.3000, 78.9500, 79.2500],
      ['Indore Urban', 'Flood monitoring for Indore city', 22.6500, 22.8000, 75.8000, 76.1000],
      ['Bhopal Region', 'Flood monitoring for Bhopal area', 23.1500, 23.3500, 77.3000, 77.5500],
      ['Coimbatore Urban', 'Flood monitoring for Coimbatore city', 10.9000, 11.1500, 76.9000, 77.1500],
      ['Kochi Coastal', 'Coastal flood monitoring for Kochi region', 9.9000, 10.2000, 76.2000, 76.5500],
      ['Thiruvananthapuram', 'Coastal flood monitoring for Thiruvananthapuram', 8.4000, 8.7000, 76.8500, 77.1500],
      ['Vadodara Urban', 'Flood monitoring for Vadodara city', 22.2500, 22.4500, 73.1500, 73.4500],
      ['Agra Region', 'Flood monitoring for Agra and surrounding areas', 27.1000, 27.3000, 77.9500, 78.2500],
      ['Nashik Urban', 'Flood monitoring for Nashik city', 19.9000, 20.1500, 73.7000, 74.0000],
      ['Aurangabad Region', 'Flood monitoring for Aurangabad area', 19.8000, 20.1000, 75.2500, 75.5500],
      ['Amritsar Urban', 'Flood monitoring for Amritsar city', 31.5500, 31.7500, 74.8500, 75.1500],
      ['Jodhpur Region', 'Flood monitoring for Jodhpur area', 26.2000, 26.4500, 72.9500, 73.2500],
      ['Guwahati Region', 'Flood monitoring for Guwahati and surrounding areas', 26.1000, 26.3500, 91.6500, 91.9500],
      ['Patna Urban', 'Flood monitoring for Patna city', 25.5500, 25.7500, 85.1000, 85.3500]
    ];

    for (const [name, description, lat_min, lat_max, lng_min, lng_max] of zones) {
      await pool.query(
        'INSERT INTO monitoring_zones (name, description, boundary_lat_min, boundary_lat_max, boundary_lng_min, boundary_lng_max, is_active) VALUES ($1, $2, $3, $4, $5, $6, true)',
        [name, description, lat_min, lat_max, lng_min, lng_max]
      );
    }
    console.log(`✅ Inserted ${zones.length} monitoring zones`);

    // Insert comprehensive flood alerts
    console.log('🚨 Inserting flood alerts...');
    const cities = [
      { name: 'Mumbai', lat: 19.0760, lng: 72.8777, base_pop: 150000 },
      { name: 'Delhi', lat: 28.6139, lng: 77.2090, base_pop: 50000 },
      { name: 'Bangalore', lat: 12.9716, lng: 77.5946, base_pop: 25000 },
      { name: 'Chennai', lat: 13.0827, lng: 80.2707, base_pop: 75000 },
      { name: 'Kolkata', lat: 22.5726, lng: 88.3639, base_pop: 100000 },
      { name: 'Hyderabad', lat: 17.3850, lng: 78.4867, base_pop: 35000 },
      { name: 'Pune', lat: 18.5204, lng: 73.8567, base_pop: 40000 },
      { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714, base_pop: 60000 },
      { name: 'Surat', lat: 21.1702, lng: 72.8311, base_pop: 80000 },
      { name: 'Jaipur', lat: 26.9124, lng: 75.7873, base_pop: 30000 },
      { name: 'Lucknow', lat: 26.8467, lng: 80.9462, base_pop: 45000 },
      { name: 'Kanpur', lat: 26.4499, lng: 80.3319, base_pop: 55000 },
      { name: 'Nagpur', lat: 21.1458, lng: 79.0882, base_pop: 20000 },
      { name: 'Indore', lat: 22.7196, lng: 75.8577, base_pop: 25000 },
      { name: 'Bhopal', lat: 23.2599, lng: 77.4126, base_pop: 18000 },
      { name: 'Coimbatore', lat: 10.9909, lng: 76.9455, base_pop: 15000 },
      { name: 'Kochi', lat: 9.9312, lng: 76.2673, base_pop: 35000 },
      { name: 'Thiruvananthapuram', lat: 8.5241, lng: 76.9366, base_pop: 28000 },
      { name: 'Vadodara', lat: 22.3072, lng: 73.1806, base_pop: 22000 },
      { name: 'Agra', lat: 27.1767, lng: 78.0081, base_pop: 15000 },
      { name: 'Nashik', lat: 19.9975, lng: 73.7898, base_pop: 25000 },
      { name: 'Aurangabad', lat: 19.8762, lng: 75.3422, base_pop: 12000 },
      { name: 'Amritsar', lat: 31.6340, lng: 74.8723, base_pop: 18000 },
      { name: 'Jodhpur', lat: 26.2389, lng: 73.0243, base_pop: 8000 },
      { name: 'Guwahati', lat: 26.1445, lng: 91.7362, base_pop: 65000 },
      { name: 'Patna', lat: 25.5941, lng: 85.1376, base_pop: 70000 }
    ];

    const severities = ['High', 'Medium', 'Low'];
    const severity_levels = ['Severe', 'Moderate', 'Minor'];
    const descriptions = [
      'Heavy rainfall causing flooding in low-lying areas',
      'Water level rising in nearby rivers',
      'Flash floods in several areas due to heavy rains',
      'Coastal flooding due to cyclonic activity',
      'River flooding in main water bodies',
      'Urban flooding in several localities',
      'Water logging in main roads',
      'Traffic disruption due to water logging',
      'Minor flooding in residential areas',
      'Water accumulation in low-lying areas'
    ];

    let alertCount = 0;
    for (let i = 0; i < 150; i++) {
      const city = cities[i % cities.length];
      const severityIndex = Math.floor(i / 50) % 3;
      const severity = severities[severityIndex];
      const level = severity_levels[severityIndex];
      const description = descriptions[Math.floor(Math.random() * descriptions.length)];
      const population = Math.floor(city.base_pop * (0.5 + Math.random() * 0.5));
      
      await pool.query(
        'INSERT INTO flood_alerts (alert_level, severity, location_lat, location_lng, region, description, affected_population, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT DO NOTHING',
        [severity, level, city.lat, city.lng, city.name, description, population, 'active']
      );
      alertCount++;
    }
    console.log(`✅ Inserted ${alertCount} flood alerts`);

    // Insert satellite metrics
    console.log('📊 Inserting satellite metrics...');
    const metricTypes = ['flood_risk_score', 'water_extent', 'ndvi', 'soil_moisture', 'cloud_cover'];
    const units = ['percentage', 'sq_km', 'index', 'percentage', 'percentage'];
    
    let metricsCount = 0;
    for (let sourceId = 1; sourceId <= 15; sourceId++) {
      for (let day = 0; day < 30; day++) {
        for (let cityIndex = 0; cityIndex < Math.min(cities.length, 10); cityIndex++) {
          const city = cities[cityIndex];
          const date = new Date();
          date.setDate(date.getDate() - day);
          
          for (let metricIndex = 0; metricIndex < metricTypes.length; metricIndex++) {
            let value;
            switch (metricTypes[metricIndex]) {
              case 'flood_risk_score':
                value = 60 + Math.random() * 35;
                break;
              case 'water_extent':
                value = 20 + Math.random() * 40;
                break;
              case 'ndvi':
                value = 0.4 + Math.random() * 0.4;
                break;
              case 'soil_moisture':
                value = 60 + Math.random() * 25;
                break;
              case 'cloud_cover':
                value = 10 + Math.random() * 25;
                break;
            }
            
            await pool.query(
              'INSERT INTO satellite_metrics (source_id, metric_type, value, unit, recorded_at, location_lat, location_lng, region) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT DO NOTHING',
              [sourceId, metricTypes[metricIndex], value, units[metricIndex], date.toISOString(), city.lat, city.lng, city.name]
            );
            metricsCount++;
          }
        }
      }
    }
    console.log(`✅ Inserted ${metricsCount} satellite metrics`);

    // Insert users
    console.log('👥 Inserting users...');
    const names = [
      'Admin User', 'John Doe', 'Jane Smith', 'Robert Johnson', 'Emily Williams',
      'Michael Brown', 'Sarah Davis', 'David Miller', 'Lisa Wilson', 'James Moore',
      'Mary Taylor', 'William Anderson', 'Patricia Thomas', 'Christopher Jackson', 'Jennifer White',
      'Richard Harris', 'Linda Martin', 'Thompson Thompson', 'Joseph Garcia', 'Martha Rodriguez',
      'Daniel Lewis', 'Nancy Lee', 'Paul Walker', 'Karen Hall', 'Mark Allen',
      'Betty Young', 'Steven King', 'Sandra Wright', 'Donald Scott', 'Helen Green',
      'Ronald Baker', 'Carol Adams', 'Kevin Nelson', 'Sharon Carter', 'George Mitchell',
      'Barbara Perez', 'Edward Roberts', 'Diane Turner', 'Paul Phillips', 'Jennifer Campbell',
      'Richard Parker', 'Mary Evans', 'James Edwards', 'Linda Collins', 'William Stewart',
      'Susan Sanchez', 'Joseph Morris', 'Margaret Rogers'
    ];

    let userCount = 0;
    for (let i = 0; i < names.length; i++) {
      const name = names[i];
      const email = name.toLowerCase().replace(' ', '.') + '@terrasentinel.com';
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${Math.floor(Math.random() * 16777215).toString(16)}&color=fff`;
      const lastLogin = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
      
      await pool.query(
        'INSERT INTO users (email, name, password_hash, avatar_url, is_active, last_login) VALUES ($1, $2, $3, $4, true, $5) ON CONFLICT (email) DO NOTHING',
        [email, name, '$2b$10$example_hash_' + i.toString(), avatarUrl, lastLogin.toISOString()]
      );
      userCount++;
    }
    console.log(`✅ Inserted ${userCount} users`);

    // Final verification
    console.log('\n🔍 Final data verification:');
    const tables = ['satellite_sources', 'flood_alerts', 'monitoring_zones', 'satellite_metrics', 'users'];
    
    for (const table of tables) {
      const result = await pool.query(`SELECT COUNT(*) as count FROM ${table}`);
      const count = result.rows[0].count;
      const status = count >= 100 ? '✅' : count >= 50 ? '📊' : count >= 10 ? '📈' : '⚠️';
      console.log(`  ${status} ${table}: ${count} records`);
    }
    
    console.log('\n🎉 Comprehensive data population complete!');
    console.log('\n📋 Summary:');
    console.log(`- Satellite Sources: ${sources.length} records`);
    console.log(`- Monitoring Zones: ${zones.length} records`);
    console.log(`- Flood Alerts: ${alertCount} records`);
    console.log(`- Satellite Metrics: ${metricsCount} records`);
    console.log(`- Users: ${userCount} records`);
    console.log(`\n📊 Total: ${sources.length + zones.length + alertCount + metricsCount + userCount}+ records`);
    
    console.log('\n🚀 Next steps:');
    console.log('1. Start/restart your backend server');
    console.log('2. Test API endpoints: http://localhost:5000/api/health');
    console.log('3. Verify data appears in TerraSentinel dashboard');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

executeComprehensiveData();
