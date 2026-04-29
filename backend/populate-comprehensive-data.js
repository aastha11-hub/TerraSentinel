require('dotenv').config();
const { pool } = require('./db');
const fs = require('fs');

async function populateComprehensiveData() {
  try {
    console.log('🚀 Populating TerraSentinel with comprehensive dashboard data...\n');
    
    // Read the comprehensive SQL file
    const sqlFile = fs.readFileSync('./comprehensive-dashboard-data.sql', 'utf8');
    
    // Split into individual statements
    const statements = sqlFile
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && !stmt.startsWith('/*') && !stmt.startsWith('*'))
      .filter(stmt => stmt.toLowerCase().includes('insert into') || stmt.toLowerCase().includes('create index'));

    console.log(`📝 Executing ${statements.length} SQL statements...`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      try {
        await pool.query(statement);
        successCount++;
        process.stdout.write(`\r✅ Progress: ${successCount}/${statements.length} statements executed`);
      } catch (error) {
        errorCount++;
        // Ignore conflicts and existing data errors
        if (error.message.includes('already exists') || 
            error.message.includes('duplicate key') ||
            error.message.includes('does not exist')) {
          // Expected errors, continue
        } else {
          console.log(`\n❌ Statement ${i + 1} failed: ${error.message}`);
        }
      }
    }
    
    console.log(`\n\n📊 Summary: ${successCount} successful, ${errorCount} errors`);
    
    // Verify final data counts
    console.log('\n🔍 Final data verification:');
    const tables = ['satellite_sources', 'flood_alerts', 'monitoring_zones', 'satellite_metrics', 'users'];
    
    for (const table of tables) {
      try {
        const result = await pool.query(`SELECT COUNT(*) as count FROM ${table}`);
        const count = result.rows[0].count;
        const status = count >= 100 ? '✅' : count >= 50 ? '📊' : '⚠️';
        console.log(`  ${status} ${table}: ${count} records`);
      } catch (error) {
        console.log(`  ❌ ${table}: Error - ${error.message}`);
      }
    }
    
    console.log('\n🎉 Comprehensive data population complete!');
    console.log('\n📋 Next steps:');
    console.log('1. Start/restart your backend server');
    console.log('2. Test the API endpoints');
    console.log('3. Verify data appears in your TerraSentinel dashboard');
    
  } catch (error) {
    console.error('❌ Data population failed:', error.message);
  } finally {
    await pool.end();
  }
}

populateComprehensiveData();
