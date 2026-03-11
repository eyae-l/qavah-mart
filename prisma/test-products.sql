-- Create test products for cart testing
-- Run this in Supabase SQL Editor

-- First, create a test seller
INSERT INTO "sellers" ("id", "userId", "businessName", "businessType", "verificationStatus", "rating", "totalSales", "responseTime", "joinedDate")
VALUES 
  ('test_seller_1', 'test_user_1', 'Test Electronics Store', 'business', 'verified', 4.5, 100, 24, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

-- Create test products
INSERT INTO "products" ("id", "title", "description", "price", "condition", "category", "subcategory", "brand", "images", "status", "views", "favorites", "city", "region", "country", "specifications", "sellerId")
VALUES 
  ('test_prod_1', 'Dell XPS 15 Laptop', 'High-performance laptop with Intel i7 processor, 16GB RAM, 512GB SSD', 45000.00, 'new', 'laptops', 'gaming-laptops', 'Dell', ARRAY['https://via.placeholder.com/400'], 'active', 0, 0, 'Addis Ababa', 'Addis Ababa', 'Ethiopia', '{"processor": "Intel i7", "ram": "16GB", "storage": "512GB SSD"}', 'test_seller_1'),
  ('test_prod_2', 'HP Pavilion Desktop', 'Powerful desktop computer for work and gaming', 35000.00, 'new', 'desktop-computers', 'gaming-desktops', 'HP', ARRAY['https://via.placeholder.com/400'], 'active', 0, 0, 'Addis Ababa', 'Addis Ababa', 'Ethiopia', '{"processor": "Intel i5", "ram": "8GB", "storage": "1TB HDD"}', 'test_seller_1'),
  ('test_prod_3', 'Logitech MX Master 3 Mouse', 'Ergonomic wireless mouse for productivity', 3500.00, 'new', 'peripherals', 'mice', 'Logitech', ARRAY['https://via.placeholder.com/400'], 'active', 0, 0, 'Addis Ababa', 'Addis Ababa', 'Ethiopia', '{"connectivity": "Wireless", "battery": "70 days"}', 'test_seller_1')
ON CONFLICT ("id") DO NOTHING;

-- Verify products were created
SELECT id, title, price FROM "products" WHERE "id" LIKE 'test_prod_%';
