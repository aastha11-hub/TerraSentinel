require('dotenv').config();
const { pool } = require('./db');

async function verifyDatabase() {
  try {
    console.log('🔍 Verifying TerraSentinel Database Setup...\n');
    
    // Check tables
    const tablesResult = await pool.query(`
      SELECT table_name, 
             (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name AND table_schema = 'public') as column_count
      FROM information_schema.tables t 
      WHERE table_schema = 'public' AND table_type = 'base table' 
      ORDER BY table_name
    `);
    
    console.log('📊 Tables found:');
    tablesResult.rows.forEach(row => {
      console.log(`  ✓ ${row.table_name} (${row.column_count} columns)`);
    });
    
    // Check data counts
    console.log('\n📈 Data counts:');
    const countQueries = [
      'satellite_sources',
      'flood_alerts', 
      'monitoring_zones',
      'satellite_metrics',
      'users'
    ];
    
    for (const table of countQueries) {
      try {
        const result = await pool.query(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`  ${table}: ${result.rows[0].count} records`);
      } catch (error) {
        console.log(`  ${table}: Table not found or error`);
      }
    }
    
    // Test sample data
    console.log('\n🧪 Sample data verification:');
    try {
      const sources = await pool.query('SELECT name, type FROM satellite_sources LIMIT 3');
      console.log('  Sample satellite sources:');
      sources.rows.forEach(row => {
        console.log(`    - ${row.name} (${row.type})`);
      });
    } catch (error) {
      console.log('  No satellite sources found');
    }
    
    try {
      const alerts = await pool.query('SELECT region, alert_level, severity FROM flood_alerts LIMIT 3');
      console.log('  Sample flood alerts:');
      alerts.rows.forEach(row => {
        console.log(`    - ${row.region}: ${row.alert_level} (${row.severity})`);
      });
    } catch (error) {
      console.log('  No flood alerts found');
    }
    
    console.log('\n✅ Database verification complete!');
    
  } catch (error) {
    console.error('❌ Database verification failed:', error.message);
  } finally {
    await pool.end();
  }
}

verifyDatabase();
