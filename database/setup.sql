-- 1. DROP ALL TABLES (in reverse order to avoid errors)
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS customers; 
DROP TABLE IF EXISTS product_suppliers;
DROP TABLE IF EXISTS suppliers;
DROP TABLE IF EXISTS products; 
DROP TABLE IF EXISTS users; 

-- 2. (RE)CREATE ALL TABLES (in correct order)

-- Create the USERS table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(200) NOT NULL,
  role VARCHAR(20) DEFAULT 'staff' NOT NULL
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

-- Create the CUSTOMERS table
CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  payment_method VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --- UPDATED ORDERS TABLE ---
-- Removed 'subtotal' and 'tax' columns
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_id INT REFERENCES customers(id) ON DELETE SET NULL,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total_amount NUMERIC(10, 2) -- This is the final price (no tax)
);

-- Create the ORDER_ITEMS table
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id) ON DELETE SET NULL,
  quantity INT NOT NULL,
  price_per_unit NUMERIC(10, 2),
  subtotal NUMERIC(10, 2) -- This is (quantity * price_per_unit)
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

-- Create the SUPPLIERS table
CREATE TABLE IF NOT EXISTS suppliers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  contact_person VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the PRODUCT_SUPPLIERS (join) table
CREATE TABLE IF NOT EXISTS product_suppliers (
  product_id INT REFERENCES products(id) ON DELETE CASCADE,
  supplier_id INT REFERENCES suppliers(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, supplier_id)
);

-- 3. INSERT ALL DUMMY DATA (in correct order)

-- PRODUCTS
INSERT INTO products (code, name, category, stock, unit, price, min_stock) VALUES
('FE-ABC-001', 'ABC Powder Fire Extinguisher 4kg', 'Fire Extinguisher', 45, 'pcs', 1250, 10),
('FE-CO2-002', 'CO2 Fire Extinguisher 5kg', 'Fire Extinguisher', 32, 'pcs', 2100, 10),
('FA-SMK-001', 'Smoke Detector Alarm', 'Fire Alarm', 8, 'pcs', 850, 15);
-- (Add your other product inserts here)

-- USERS
INSERT INTO users (username, email, password, role) VALUES
('gaury', 'gaury@fasco.com', '$2b$10$WqT.s.w.X.z.A.T.V.B.R.Z.z.S.o.w.p.k.C.e.B.e.u.x.y.w.O.I', 'admin');
-- (Add your other user inserts here)

-- CUSTOMERS
INSERT INTO customers (name, phone, payment_method) VALUES
('Ramesh Fire Solutions', '9876543210', 'Credit'),
('Metro Mall Security', '9765432109', 'Cash');
-- (Add your other customer inserts here)

-- ORDERS (Note: 'total_amount' is now the only amount)
INSERT INTO orders (customer_id, order_date, total_amount) VALUES
(1, NOW() - INTERVAL '10 days', 8500.00),
(2, NOW() - INTERVAL '7 days', 4200.00);
-- (Add your other order inserts here)

-- ORDER ITEMS
INSERT INTO order_items (order_id, product_id, quantity, price_per_unit, subtotal) VALUES
(1, 1, 3, 1250.00, 3750.00),
(1, 2, 2, 2100.00, 4200.00),
(2, 3, 2, 850.00, 1700.00);
-- (Add your other order_item inserts here)

-- INVOICES
INSERT INTO invoices (order_id, invoice_number, invoice_date, payment_method, payment_status) VALUES
(1, 'INV-2024-001', NOW() - INTERVAL '9 days', 'Credit Card', 'Paid'),
(2, 'INV-2024-002', NOW() - INTERVAL '6 days', 'Cash', 'Paid');
-- (Add your other invoice inserts here)

-- SUPPLIERS
INSERT INTO suppliers (name, contact_person, phone) VALUES
('FireSafe Inc.', 'John Doe', '+1-555-1234'),
('SecureTech Solutions', 'Jane Smith', '+1-555-5678');

-- PRODUCT_SUPPLIERS
INSERT INTO product_suppliers (product_id, supplier_id) VALUES
(1, 1),
(2, 1),
(3, 2);