CREATE DATABASE IF NOT EXISTS sales_analytics;
USE sales_analytics;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','analyst','viewer') DEFAULT 'analyst',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(40) NOT NULL,
  order_date DATETIME NOT NULL,
  order_status VARCHAR(30) NOT NULL,
  customer_id VARCHAR(40) NOT NULL,
  customer_unique_id VARCHAR(40) NOT NULL,
  customer_city VARCHAR(100),
  customer_state CHAR(2),
  region VARCHAR(30),
  product_id VARCHAR(40) NOT NULL,
  category VARCHAR(120),
  price DECIMAL(12,2) NOT NULL DEFAULT 0,
  freight_value DECIMAL(12,2) NOT NULL DEFAULT 0,
  sales DECIMAL(12,2) NOT NULL DEFAULT 0,
  quantity INT NOT NULL DEFAULT 1,
  INDEX idx_order_date (order_date),
  INDEX idx_region (region),
  INDEX idx_category (category),
  INDEX idx_product (product_id),
  INDEX idx_customer (customer_unique_id),
  INDEX idx_order (order_id),
  INDEX idx_status (order_status)
);
