# Database Schema for PAPIS Retail

This file contains the SQL commands to initialize the database for the PAPIS retail application.
It is designed to be compatible with standard SQL (PostgreSQL, MySQL).

## 1. Create Tables

```sql
-- 1. Users / Employees Table (Implicit in app as cashierId)
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'cashier',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Products Table
CREATE TABLE products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'Électronique', 'Accessoires', 'Services', 'Snacks'
    stock INTEGER NOT NULL DEFAULT 0,
    min_stock INTEGER NOT NULL DEFAULT 0,
    sku VARCHAR(50) UNIQUE NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Transactions Table
CREATE TABLE transactions (
    id VARCHAR(50) PRIMARY KEY,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- 'Espèces', 'Carte', 'Mobile', 'Crédit Magasin'
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cashier_id VARCHAR(50) NOT NULL
    -- FOREIGN KEY (cashier_id) REFERENCES users(id) -- Uncomment if users table is populated
);

-- 4. Transaction Items Table (Link table for Sale Items)
CREATE TABLE transaction_items (
    id SERIAL PRIMARY KEY,
    transaction_id VARCHAR(50) NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL,
    price_at_sale DECIMAL(10, 2) NOT NULL, -- Snapshot of price at time of sale
    
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

## 2. Seed Data

Based on `constants.ts`.

```sql
-- Seed default User
INSERT INTO users (id, username, role) VALUES ('EMP-001', 'Sarah J.', 'cashier');

-- Seed Products
INSERT INTO products (id, name, price, category, stock, min_stock, sku, image_url) VALUES
('1', 'Casque Sans Fil Réduction de Bruit', 299.99, 'Électronique', 12, 5, 'AUD-001', 'https://picsum.photos/200/200?random=1'),
('2', 'Montre Connectée Série 5', 399.50, 'Électronique', 8, 3, 'WBL-002', 'https://picsum.photos/200/200?random=2'),
('3', 'Chargeur Rapide USB-C', 29.99, 'Accessoires', 45, 10, 'ACC-003', 'https://picsum.photos/200/200?random=3'),
('4', 'Housse Ordinateur 13"', 45.00, 'Accessoires', 20, 5, 'ACC-004', 'https://picsum.photos/200/200?random=4'),
('5', 'Installation Protection Écran', 15.00, 'Services', 999, 0, 'SVC-005', 'https://picsum.photos/200/200?random=5'),
('6', 'Barre Énergétique', 2.50, 'Snacks', 3, 10, 'SNK-006', 'https://picsum.photos/200/200?random=6');

-- Example Transaction (Simulating a sale)
-- 1. Create Transaction Header
INSERT INTO transactions (id, total_amount, payment_method, timestamp, cashier_id) 
VALUES ('TRX-DEMO-001', 329.98, 'Carte', NOW(), 'EMP-001');

-- 2. Add Items to Transaction
-- Item 1: 1x Headphones
INSERT INTO transaction_items (transaction_id, product_id, quantity, price_at_sale) 
VALUES ('TRX-DEMO-001', '1', 1, 299.99);

-- Item 2: 1x Charger
INSERT INTO transaction_items (transaction_id, product_id, quantity, price_at_sale) 
VALUES ('TRX-DEMO-001', '3', 1, 29.99);
```

## 3. Useful Queries

```sql
-- Get low stock items
SELECT * FROM products WHERE stock <= min_stock;

-- Get daily sales total
SELECT DATE(timestamp) as sale_date, SUM(total_amount) as daily_revenue 
FROM transactions 
GROUP BY DATE(timestamp) 
ORDER BY sale_date DESC;

-- Get best selling products
SELECT p.name, SUM(ti.quantity) as total_sold
FROM transaction_items ti
JOIN products p ON ti.product_id = p.id
GROUP BY p.name
ORDER BY total_sold DESC;
```