-- psql -U postgres -d fasco -f ../database/setup.sql


-- Create the USERS table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(200) NOT NULL
);

-- Create the new, correct PRODUCTS table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50),
  stock INT DEFAULT 0,
  unit VARCHAR(20) DEFAULT 'pcs',
  price NUMERIC(10, 2),
  min_stock INT DEFAULT 10,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INSERT INTO products (code, name, category, stock, unit, price, min_stock, description) 
-- VALUES
-- ('FE-ABC-001', 'ABC Powder Fire Extinguisher 4kg', 'Fire Extinguisher', 45, 'pcs', 1250, 10, ''),
-- ('FE-CO2-002', 'CO2 Fire Extinguisher 5kg', 'Fire Extinguisher', 32, 'pcs', 2100, 10, ''),
-- ('FA-SMK-001', 'Smoke Detector Alarm', 'Fire Alarm', 8, 'pcs', 850, 15, ''),
-- ('SE-HMT-001', 'Fire Safety Helmet', 'Safety Equipment', 67, 'pcs', 450, 20, ''),
-- ('SS-SPR-001', 'Sprinkler Head Assembly', 'Sprinkler System', 0, 'set', 3200, 5, ''),
-- ('EL-LED-001', 'Emergency LED Exit Light', 'Emergency Light', 28, 'pcs', 1890, 10, ''),
-- ('FE-FOAM-001', 'Foam Type Fire Extinguisher 9L', 'Fire Extinguisher', 15, 'pcs', 3500, 8, ''),
-- ('FA-HEAT-001', 'Heat Detector Alarm', 'Fire Alarm', 42, 'pcs', 920, 15, ''),
-- ('SE-SUIT-001', 'Fire Resistant Suit', 'Safety Equipment', 12, 'pcs', 8500, 5, ''),
-- ('SS-PIPE-001', 'Fire Sprinkler Pipe 2inch', 'Sprinkler System', 89, 'unit', 450, 30, '');
