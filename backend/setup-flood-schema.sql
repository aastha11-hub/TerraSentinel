-- TerraSentinel Flood Monitoring Database Schema
-- This script creates the necessary tables for flood monitoring data

-- Create satellite sources table
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
);

-- Create satellite metrics table
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
);

-- Create flood alerts table
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
);

-- Create monitoring zones table
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
);

-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255),
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Insert sample satellite data
INSERT INTO satellite_sources (name, description, type, resolution, use_case) VALUES
('ISRO (Indian Space Research Organisation)', 'Primary national provider of Earth observation missions supporting disaster management, water monitoring, and environmental intelligence.', 'Optical', '5-10m', 'Flood monitoring and water resource management'),
('Bhuvan Geoportal', 'ISRO''s geospatial platform providing map services and thematic layers that can support flood situational awareness.', 'Geospatial Portal', 'Various', 'Flood mapping and situational awareness'),
('RISAT', 'Radar Imaging Satellite series enabling all-weather imaging and strong performance during cloud cover and heavy rainfall.', 'Radar', '3-50m', 'All-weather flood monitoring'),
('Resourcesat', 'Optical remote sensing mission supporting land and water monitoring with multi-spectral observations.', 'Optical', '5.8-23.5m', 'Land and water monitoring'),
('Cartosat', 'High-resolution optical imaging mission useful for detailed mapping and impacted-area assessment.', 'Optical', '0.25-2.5m', 'High-resolution flood impact assessment')
ON CONFLICT (name) DO NOTHING;

-- Insert sample flood alerts
INSERT INTO flood_alerts (alert_level, severity, location_lat, location_lng, region, description, affected_population) VALUES
('High', 'Severe', 19.0760, 72.8777, 'Mumbai', 'Heavy rainfall causing flooding in low-lying areas', 150000),
('Medium', 'Moderate', 28.6139, 77.2090, 'Delhi', 'Water level rising in Yamuna river', 50000),
('Low', 'Minor', 12.9716, 77.5946, 'Bangalore', 'Minor flooding in some areas due to heavy rains', 25000)
ON CONFLICT DO NOTHING;

-- Insert sample monitoring zones
INSERT INTO monitoring_zones (name, description, boundary_lat_min, boundary_lat_max, boundary_lng_min, boundary_lng_max) VALUES
('Mumbai Metropolitan Region', 'Comprehensive flood monitoring for Mumbai and surrounding areas', 18.8940, 19.2760, 72.7750, 73.0800),
('National Capital Region', 'Flood monitoring for Delhi NCR region', 28.4040, 28.8800, 76.8400, 77.3400),
('Bangalore Urban', 'Urban flood monitoring for Bangalore city', 12.8340, 13.1430, 77.4600, 77.7840)
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_satellite_metrics_source_id ON satellite_metrics(source_id);
CREATE INDEX IF NOT EXISTS idx_satellite_metrics_recorded_at ON satellite_metrics(recorded_at);
CREATE INDEX IF NOT EXISTS idx_flood_alerts_region ON flood_alerts(region);
CREATE INDEX IF NOT EXISTS idx_flood_alerts_created_at ON flood_alerts(created_at);
CREATE INDEX IF NOT EXISTS idx_monitoring_zones_active ON monitoring_zones(is_active);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_satellite_sources_updated_at BEFORE UPDATE ON satellite_sources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_flood_alerts_updated_at BEFORE UPDATE ON flood_alerts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions (adjust as needed)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
