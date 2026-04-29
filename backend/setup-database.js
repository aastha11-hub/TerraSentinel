require('dotenv').config();
const fs = require('fs');
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
    
    // Read the SQL file
    const sqlFile = fs.readFileSync('./setup-flood-schema.sql', 'utf8');
    
    // Split into individual statements (basic approach)
    const statements = sqlFile
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`Executing ${statements.length} SQL statements...`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      try {
        await pool.query(statement);
        console.log(`Statement ${i + 1}/${statements.length}: \x1b[32mSUCCESS\x1b[0m`);
      } catch (error) {
        // Some statements might fail due to existing objects, that's okay
        if (error.message.includes('already exists') || 
            error.message.includes('duplicate key') ||
            error.message.includes('does not exist')) {
          console.log(`Statement ${i + 1}/${statements.length}: \x1b[33mSKIPPED\x1b[0m (${error.message.split(':')[0]})`);
        } else {
          console.log(`Statement ${i + 1}/${statements.length}: \x1b[31mERROR\x1b[0m: ${error.message}`);
        }
      }
    }

    // Test the setup by querying the data
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
