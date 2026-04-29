const { Pool } = require('pg');

// Common database configurations to test
const configs = [
  { user: 'postgres', password: 'postgres', database: 'postgres' },
  { user: 'postgres', password: 'password', database: 'postgres' },
  { user: 'postgres', password: '8888', database: 'postgres' },
  { user: 'postgres', password: '', database: 'postgres' },
  { user: 'postgres', password: 'admin', database: 'postgres' },
  { user: 'postgres', password: '123456', database: 'postgres' },
  { user: 'postgres', password: 'root', database: 'postgres' },
  { user: 'admin', password: 'admin', database: 'postgres' },
  { user: 'admin', password: 'password', database: 'postgres' },
];

async function testConnection(config, index) {
  const pool = new Pool({
    user: config.user,
    host: 'localhost',
    database: config.database,
    password: config.password,
    port: 5432,
    connectionTimeoutMillis: 5000,
  });

  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    console.log(`\n=== SUCCESS ===`);
    console.log(`Configuration ${index + 1} worked:`);
    console.log(`User: ${config.user}`);
    console.log(`Password: ${config.password || '(empty)'}`);
    console.log(`Database: ${config.database}`);
    console.log(`\nUpdate your .env file with:`);
    console.log(`DB_USER=${config.user}`);
    console.log(`DB_PASSWORD=${config.password}`);
    console.log(`DB_NAME=${config.database}`);
    await pool.end();
    return true;
  } catch (error) {
    console.log(`Config ${index + 1} failed: ${config.user}/${config.password || '(empty)'} - ${error.message}`);
    await pool.end();
    return false;
  }
}

async function testAllConnections() {
  console.log('Testing database connections...\n');
  
  for (let i = 0; i < configs.length; i++) {
    const success = await testConnection(configs[i], i);
    if (success) {
      console.log('\nFound working configuration!');
      process.exit(0);
    }
  }
  
  console.log('\n=== NO WORKING CONFIGURATION FOUND ===');
  console.log('Please check your pgAdmin for the correct credentials:');
  console.log('1. Open pgAdmin');
  console.log('2. Right-click your PostgreSQL server');
  console.log('3. Select Properties');
  console.log('4. Look at the connection settings');
  console.log('5. Update backend/.env with the correct credentials');
}

testAllConnections().catch(console.error);
