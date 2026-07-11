
-- Using PostgreSQL pgcrypto extension for UUID generation
-- Ensure pgcrypto is enabled in your PostgreSQL database

CREATE TABLE organizations (
    organization_id SERIAL PRIMARY KEY,
    organization_name VARCHAR(150) NOT NULL,
    organization_type VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    organization_id INT REFERENCES organizations(organization_id),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'administrator',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMPTZ
);

CREATE TABLE devices (
    device_id SERIAL PRIMARY KEY,
    device_code VARCHAR(50) UNIQUE NOT NULL,
    organization_id INT REFERENCES organizations(organization_id),
    water_body_name VARCHAR(150),
    location_description TEXT,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    installation_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sensor_readings (
    reading_id BIGSERIAL PRIMARY KEY,
    device_id INT NOT NULL REFERENCES devices(device_id),
    reading_timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    raw_ph_value INTEGER,
    raw_tds_value INTEGER,
    raw_turbidity_value INTEGER,
    raw_temperature_value INTEGER,
    ph_value DECIMAL(5,2),
    tds_value DECIMAL(10,2),
    turbidity_value DECIMAL(10,2),
    temperature_celsius DECIMAL(5,2),
    ec_value DECIMAL(10,2),
    is_alert BOOLEAN DEFAULT FALSE,
    alert_reason TEXT,
    is_synced BOOLEAN DEFAULT TRUE,
    packet_id UUID UNIQUE DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE alerts (
    alert_id BIGSERIAL PRIMARY KEY,
    reading_id BIGINT REFERENCES sensor_readings(reading_id),
    device_id INT REFERENCES devices(device_id),
    alert_type VARCHAR(100),
    alert_message TEXT,
    severity VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active',
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE offline_sync_queue_log (
    sync_id BIGSERIAL PRIMARY KEY,
    device_id INT REFERENCES devices(device_id),
    packet_id UUID,
    sync_attempt_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    sync_status VARCHAR(30),
    notes TEXT
);

CREATE INDEX idx_sensor_device_time ON sensor_readings(device_id, reading_timestamp DESC);
CREATE INDEX idx_alerts_device ON alerts(device_id);
CREATE INDEX idx_alert_status ON alerts(resolved);
CREATE INDEX idx_sync_packet ON offline_sync_queue_log(packet_id);

CREATE TABLE thresholds (
    threshold_id SERIAL PRIMARY KEY,
    device_id INT REFERENCES devices(device_id),
    parameter VARCHAR(20) NOT NULL,
    min_value DECIMAL(10,2),
    max_value DECIMAL(10,2),
    warning_value DECIMAL(10,2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(device_id, parameter)
);

CREATE TABLE settings (
    setting_id SERIAL PRIMARY KEY,
    organization_id INT REFERENCES organizations(organization_id),
    setting_key VARCHAR(50) NOT NULL,
    setting_value TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(organization_id, setting_key)
);

CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    title VARCHAR(255),
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

