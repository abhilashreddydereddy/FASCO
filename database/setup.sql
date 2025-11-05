-- Create the USERS table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(200) NOT NULL
);

-- Create the PRODUCTS table (if it doesn't exist)
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

-- Create the USERS table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(200) NOT NULL
);

-- Create the PRODUCTS table (if it doesn't exist)
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

-- --- (RE)CREATE SALES TABLES ---

-- Create the CUSTOMERS table (with the "phone" column)
CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  pay_type VARCHAR(20), -- This is the column that was missing
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