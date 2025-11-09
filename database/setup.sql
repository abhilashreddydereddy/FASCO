-- Create the USERS table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(200) NOT NULL
);

-- Create the PRODUCTS table
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

-- Create the CUSTOMERS table (with the "phone" and "payment_method" columns)
CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  payment_method VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the ORDERS table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_id INT REFERENCES customers(id) ON DELETE SET NULL,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  subtotal NUMERIC(10, 2),
  tax NUMERIC(10, 2),
  total_amount NUMERIC(10, 2)
);

-- Create the ORDER_ITEMS table
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id) ON DELETE SET NULL,
  quantity INT NOT NULL,
  price_per_unit NUMERIC(10, 2),
  subtotal NUMERIC(10, 2)
);

-- Create the INVOICES table
CREATE TABLE IF NOT EXISTS invoices (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id) ON DELETE CASCADE,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  invoice_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  payment_method VARCHAR(50),
  payment_status VARCHAR(50) DEFAULT 'Paid'
);

ALTER TABLE users ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'staff';
UPDATE users SET role = 'admin' WHERE id = 1;

INSERT INTO products (code, name, category, stock, unit, price, min_stock, description) 
VALUES
('FE-ABC-001', 'ABC Powder Fire Extinguisher 4kg', 'Fire Extinguisher', 45, 'pcs', 1250, 10, ''),
('FE-CO2-002', 'CO2 Fire Extinguisher 5kg', 'Fire Extinguisher', 32, 'pcs', 2100, 10, ''),
('FA-SMK-001', 'Smoke Detector Alarm', 'Fire Alarm', 8, 'pcs', 850, 15, ''),
('SE-HMT-001', 'Fire Safety Helmet', 'Safety Equipment', 67, 'pcs', 450, 20, ''),
('SS-SPR-001', 'Sprinkler Head Assembly', 'Sprinkler System', 0, 'set', 3200, 5, ''),
('EL-LED-001', 'Emergency LED Exit Light', 'Emergency Light', 28, 'pcs', 1890, 10, ''),
('FE-FOAM-001', 'Foam Type Fire Extinguisher 9L', 'Fire Extinguisher', 15, 'pcs', 3500, 8, ''),
('FA-HEAT-001', 'Heat Detector Alarm', 'Fire Alarm', 42, 'pcs', 920, 15, ''),
('SE-SUIT-001', 'Fire Resistant Suit', 'Safety Equipment', 12, 'pcs', 8500, 5, ''),
('SS-PIPE-001', 'Fire Sprinkler Pipe 2inch', 'Sprinkler System', 89, 'unit', 450, 30, ''),

-- 30 additional unique products (codes checked to avoid duplicates)
('FE-WAT-003', 'Water Type Fire Extinguisher 9L', 'Fire Extinguisher', 20, 'pcs', 2800, 8, ''),
('FE-MTL-004', 'Metal Fire Extinguisher 10kg', 'Fire Extinguisher', 10, 'pcs', 4200, 5, ''),
('FE-ABC-005', 'ABC Dry Powder Fire Extinguisher 6kg', 'Fire Extinguisher', 34, 'pcs', 1650, 10, ''),
('FA-CNTRL-006', 'Fire Alarm Control Panel 4 Zone', 'Fire Alarm', 5, 'unit', 9800, 2, ''),
('FA-MCP-007', 'Manual Call Point (Break Glass Unit)', 'Fire Alarm', 25, 'pcs', 640, 10, ''),
('FA-SIRN-008', 'Fire Alarm Siren with Strobe', 'Fire Alarm', 18, 'pcs', 1200, 10, ''),
('EL-EMB-009', 'Emergency Light Rechargeable 2xLED', 'Emergency Light', 30, 'pcs', 1450, 10, ''),
('EL-EXS-010', 'Exit Sign Board - Single Face', 'Emergency Light', 25, 'pcs', 950, 10, ''),
('EL-EXD-011', 'Exit Sign Board - Double Face', 'Emergency Light', 10, 'pcs', 1250, 5, ''),
('SE-GLV-012', 'Heat Resistant Safety Gloves', 'Safety Equipment', 55, 'pair', 650, 15, ''),
('SE-BELT-013', 'Safety Belt Full Body Harness', 'Safety Equipment', 40, 'pcs', 2200, 10, ''),
('SE-SHOE-014', 'Fire Safety Boots', 'Safety Equipment', 30, 'pair', 1850, 8, ''),
('SE-MSK-015', 'Smoke Protection Mask', 'Safety Equipment', 100, 'pcs', 280, 20, ''),
('SE-GOG-016', 'Protective Safety Goggles', 'Safety Equipment', 80, 'pcs', 190, 25, ''),
('SS-VLV-017', 'Sprinkler Control Valve 2inch', 'Sprinkler System', 10, 'unit', 4800, 5, ''),
('SS-VLV-018', 'Butterfly Valve 4inch', 'Sprinkler System', 6, 'unit', 6200, 3, ''),
('SS-PRS-019', 'Pressure Gauge for Sprinkler Line', 'Sprinkler System', 25, 'pcs', 550, 10, ''),
('SS-TNK-020', 'Overhead Water Storage Tank 1000L', 'Sprinkler System', 4, 'unit', 9500, 2, ''),
('SS-HDR-021', 'Fire Hydrant Valve 63mm', 'Sprinkler System', 12, 'pcs', 2400, 5, ''),
('HY-HSE-022', 'Fire Hose Pipe 30m', 'Hydrant System', 14, 'roll', 1800, 5, ''),
('HY-RL-023', 'Hose Reel Drum 20m', 'Hydrant System', 10, 'unit', 3200, 3, ''),
('HY-NOZ-024', 'Branch Pipe Nozzle Gunmetal', 'Hydrant System', 18, 'pcs', 750, 10, ''),
('HY-CAB-025', 'Fire Hose Cabinet SS Double Door', 'Hydrant System', 5, 'unit', 7200, 2, ''),
('HY-LUG-026', 'Hose Coupling and Lug Set', 'Hydrant System', 20, 'set', 980, 8, ''),
('SG-BRD-027', 'Safety Sign Board – Fire Exit', 'Signage', 60, 'pcs', 180, 20, ''),
('SG-BRD-028', 'Safety Sign Board – No Smoking', 'Signage', 75, 'pcs', 120, 25, ''),
('SG-BRD-029', 'Safety Sign Board – Assembly Point', 'Signage', 50, 'pcs', 220, 20, ''),
('SE-APR-030', 'Fire Retardant Apron', 'Safety Equipment', 22, 'pcs', 750, 5, ''),
('EL-BAT-031', 'Rechargeable Emergency Light Battery Pack', 'Emergency Light', 12, 'pcs', 1250, 5, ''),
('FA-CABL-032', 'Fire Resistant Cable 2-Core 1.5mm', 'Fire Alarm', 200, 'm', 45, 50, ''),
('FA-BELL-033', 'Fire Alarm Bell 6inch', 'Fire Alarm', 15, 'pcs', 1350, 8, '');

INSERT INTO users (username, email, password) VALUES
('admin', 'admin@fasco.com', '$2b$10$fakehash.A.3j4/lB1/X6c8.uO/jB.1gA/0jC/mB.2'),
('manager', 'manager@fasco.com', '$2b$10$fakehash.B.4k5/lC2/X7c9.uO/kC.2hB/1kD/nC.3'),
('staff', 'staff@fasco.com', '$2b$10$fakehash.C.5l6/lD3/X8d0.uO/lD.3iC/2lE/oD.4');

INSERT INTO customers (name, phone, payment_method) VALUES
('Ramesh Fire Solutions', '9876543210', 'Credit'),
('Metro Mall Security', '9765432109', 'Cash'),
('Green Heights Apartments', '9123456780', 'Online'),
('BrightWorks Pvt Ltd', '9988776655', 'Credit'),
('SafeZone Systems', '9090909090', 'Online');

INSERT INTO orders (customer_id, order_date, subtotal, tax, total_amount) VALUES
(1, NOW() - INTERVAL '10 days', 8500.00, 765.00, 9265.00),
(2, NOW() - INTERVAL '7 days', 4200.00, 378.00, 4578.00),
(3, NOW() - INTERVAL '5 days', 12750.00, 1147.50, 13897.50),
(4, NOW() - INTERVAL '3 days', 5400.00, 486.00, 5886.00),
(5, NOW() - INTERVAL '1 day', 3100.00, 279.00, 3379.00);

INSERT INTO order_items (order_id, product_id, quantity, price_per_unit, subtotal) VALUES
(1, 1, 3, 1250.00, 3750.00),
(1, 2, 2, 2100.00, 4200.00),
(1, 4, 1, 450.00, 450.00),
(2, 8, 2, 920.00, 1840.00),
(2, 6, 1, 1890.00, 1890.00),
(2, 10, 1, 450.00, 450.00),
(3, 3, 5, 850.00, 4250.00),
(3, 5, 2, 3200.00, 6400.00),
(3, 9, 1, 8500.00, 8500.00),
(4, 7, 1, 3500.00, 3500.00),
(4, 8, 2, 920.00, 1840.00),
(4, 4, 1, 450.00, 450.00),
(5, 6, 1, 1890.00, 1890.00),
(5, 1, 1, 1250.00, 1250.00);

INSERT INTO invoices (order_id, invoice_number, invoice_date, payment_method, payment_status) VALUES
(1, 'INV-2024-001', NOW() - INTERVAL '9 days', 'Credit Card', 'Paid'),
(2, 'INV-2024-002', NOW() - INTERVAL '6 days', 'Cash', 'Paid'),
(3, 'INV-2024-003', NOW() - INTERVAL '4 days', 'UPI', 'Paid'),
(4, 'INV-2024-004', NOW() - INTERVAL '2 days', 'Credit', 'Pending'),
(5, 'INV-2024-005', NOW(), 'Online', 'Paid');