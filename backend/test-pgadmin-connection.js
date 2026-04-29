require('dotenv').config();
const { Pool } = require('pg');

// Test different common pgAdmin configurations
const configs = [
  {
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '8888',
    port: 5432,
    name: 'Current Config'
  },
  {
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '',
    port: 5432,
    name: 'Empty Password'
  },
  {
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'postgres',
    port: 5432,
    name: 'Default Password'
  },
  {
    user: 'postgres',
    host: 'localhost',
    database: 'terrasentinel',
    password: '8888',
    port: 5432,
    name: 'TerraSentinel DB'
  },
  {
    user: 'postgres',
    host: 'localhost',
    database: 'flood_monitoring',
    password: '8888',
    port: 5432,
    name: 'Flood Monitoring DB'
  }
];

async function testConnection(config) {
  const pool = new Pool(config);
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT version(), current_database(), current_user');
    client.release();
    await pool.end();
    return {
      success: true,
      version: result.rows[0].version,
      database: result.rows[0].current_database,
      user: result.rows[0].current_user
    };
  } catch (error) {
    await pool.end();
    return {
      success: false,
      error: error.message
    };
  }
}

async function testAllConnections() {
  console.log('Testing pgAdmin database connections...\n');
  
  for (const config of configs) {
    console.log(`Testing: ${config.name}`);
    console.log(`  Database: ${config.database}`);
    console.log(`  User: ${config.user}`);
    console.log(`  Host: ${config.host}:${config.port}`);
    
    const result = await testConnection(config);
    if (result.success) {
      console.log(`  \x1b[32mSUCCESS\x1b[0m`);
      console.log(`  Database: ${result.database}`);
      console.log(`  User: ${result.user}`);
      console.log(`  Version: ${result.version.split(' ')[0]} ${result.version.split(' ')[1]}`);
    } else {
      console.log(`  \x1b[31mFAILED\x1b[0m: ${result.error}`);
    }
    console.log('');
  }
}

testAllConnections().catch(console.error);
