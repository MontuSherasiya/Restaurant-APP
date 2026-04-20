-- =============================================
-- schema.sql — Restaurant Manager
-- Week 4: MySQL Database Schema
-- Run this file in MySQL to set up the database
-- =============================================

-- Create and select database
CREATE DATABASE IF NOT EXISTS restaurant_db;
USE restaurant_db;

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Foods table
CREATE TABLE IF NOT EXISTS foods (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(150) NOT NULL,
  price       DECIMAL(10, 2) NOT NULL,
  category_id INT NOT NULL,
  description TEXT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Seed default categories
INSERT IGNORE INTO categories (name) VALUES
  ('Starters'),
  ('Main Course'),
  ('Desserts'),
  ('Beverages'),
  ('Fast Food');

-- Seed sample food items
INSERT IGNORE INTO foods (name, price, category_id, description) VALUES
  ('Paneer Tikka',       180.00, 1, 'Grilled cottage cheese with spices'),
  ('Butter Chicken',     320.00, 2, 'Creamy tomato-based chicken curry'),
  ('Gulab Jamun',         80.00, 3, 'Deep-fried milk solids in sugar syrup'),
  ('Mango Lassi',         90.00, 4, 'Chilled yogurt drink with mango'),
  ('Veg Burger',         150.00, 5, 'Crispy veggie patty with fresh toppings');
