-- Qavah-Mart Database Seed - Working Version
-- Run this in Supabase SQL Editor

-- Step 1: Create Users
INSERT INTO users (id, email, "firstName", "lastName", city, region, country, "isVerified", "isSeller", "createdAt", "updatedAt")
VALUES 
  ('user_seed_001', 'seller1@example.com', 'Abebe', 'Kebede', 'Addis Ababa', 'Addis Ababa', 'Ethiopia', true, true, NOW(), NOW()),
  ('user_seed_002', 'seller2@example.com', 'Tigist', 'Haile', 'Dire Dawa', 'Dire Dawa', 'Ethiopia', true, true, NOW(), NOW()),
  ('user_seed_003', 'seller3@example.com', 'Dawit', 'Tesfaye', 'Bahir Dar', 'Amhara', 'Ethiopia', true, true, NOW(), NOW()),
  ('user_seed_004', 'seller4@example.com', 'Meron', 'Alemayehu', 'Hawassa', 'Sidama', 'Ethiopia', true, true, NOW(), NOW()),
  ('user_seed_005', 'seller5@example.com', 'Yohannes', 'Bekele', 'Mekelle', 'Tigray', 'Ethiopia', true, true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Step 2: Create Sellers (with explicit IDs)
INSERT INTO sellers (id, "userId", "businessName", "businessType", "verificationStatus", rating, "totalSales", "responseTime", "joinedDate")
VALUES 
  ('seller_seed_001', 'user_seed_001', 'Abebe''s Tech Store', 'individual', 'verified', 4.7, 35, 3, NOW()),
  ('seller_seed_002', 'user_seed_002', 'Tigist''s Tech Store', 'individual', 'verified', 4.8, 42, 2, NOW()),
  ('seller_seed_003', 'user_seed_003', 'Dawit''s Tech Store', 'individual', 'verified', 4.6, 28, 5, NOW()),
  ('seller_seed_004', 'user_seed_004', 'Meron''s Tech Store', 'individual', 'verified', 4.9, 51, 1, NOW()),
  ('seller_seed_005', 'user_seed_005', 'Yohannes''s Tech Store', 'individual', 'verified', 4.5, 22, 4, NOW())
ON CONFLICT ("userId") DO NOTHING;

-- Step 3: Create Products

-- Dell XPS 13 Laptops
INSERT INTO products (id, title, description, price, condition, category, subcategory, brand, images, specifications, city, region, "sellerId", status, views, "createdAt", "updatedAt")
VALUES 
  ('prod_seed_001', 'Dell XPS 13', 'Dell XPS 13 in new condition. Well maintained and fully functional.', 65000, 'new', 'laptops', 'ultrabooks', 'Dell', ARRAY['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800']::text[], '{"processor": "Intel Core i7", "ram": "16GB", "storage": "512GB SSD"}'::jsonb, 'Addis Ababa', 'Addis Ababa', 'seller_seed_001', 'active', 45, NOW(), NOW()),
  ('prod_seed_002', 'Dell XPS 13', 'Dell XPS 13 in used condition. Tested and working perfectly.', 39000, 'used', 'laptops', 'ultrabooks', 'Dell', ARRAY['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800']::text[], '{"processor": "Intel Core i7", "ram": "16GB", "storage": "512GB SSD"}'::jsonb, 'Dire Dawa', 'Dire Dawa', 'seller_seed_002', 'active', 32, NOW(), NOW());

-- HP Pavilion 15
INSERT INTO products (id, title, description, price, condition, category, subcategory, brand, images, specifications, city, region, "sellerId", status, views, "createdAt", "updatedAt")
VALUES 
  ('prod_seed_003', 'HP Pavilion 15', 'HP Pavilion 15 in new condition. Perfect for work and study.', 45000, 'new', 'laptops', 'business-laptops', 'HP', ARRAY['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800']::text[], '{"processor": "Intel Core i5", "ram": "8GB", "storage": "256GB SSD"}'::jsonb, 'Bahir Dar', 'Amhara', 'seller_seed_003', 'active', 28, NOW(), NOW()),
  ('prod_seed_004', 'HP Pavilion 15', 'HP Pavilion 15 in used condition. Good for daily tasks.', 27000, 'used', 'laptops', 'business-laptops', 'HP', ARRAY['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800']::text[], '{"processor": "Intel Core i5", "ram": "8GB", "storage": "256GB SSD"}'::jsonb, 'Hawassa', 'Sidama', 'seller_seed_004', 'active', 19, NOW(), NOW());

-- Lenovo ThinkPad X1
INSERT INTO products (id, title, description, price, condition, category, subcategory, brand, images, specifications, city, region, "sellerId", status, views, "createdAt", "updatedAt")
VALUES 
  ('prod_seed_005', 'Lenovo ThinkPad X1', 'Lenovo ThinkPad X1 in new condition. Professional grade laptop.', 75000, 'new', 'laptops', 'business-laptops', 'Lenovo', ARRAY['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800']::text[], '{"processor": "Intel Core i7", "ram": "16GB", "storage": "1TB SSD"}'::jsonb, 'Mekelle', 'Tigray', 'seller_seed_005', 'active', 52, NOW(), NOW());

-- ASUS ROG Strix Gaming
INSERT INTO products (id, title, description, price, condition, category, subcategory, brand, images, specifications, city, region, "sellerId", status, views, "createdAt", "updatedAt")
VALUES 
  ('prod_seed_006', 'ASUS ROG Strix', 'ASUS ROG Strix gaming laptop in new condition. High performance gaming.', 95000, 'new', 'laptops', 'gaming-laptops', 'ASUS', ARRAY['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800']::text[], '{"processor": "Intel Core i9", "ram": "32GB", "storage": "1TB SSD", "gpu": "RTX 3070"}'::jsonb, 'Addis Ababa', 'Addis Ababa', 'seller_seed_001', 'active', 67, NOW(), NOW());

-- Dell OptiPlex Desktop
INSERT INTO products (id, title, description, price, condition, category, subcategory, brand, images, specifications, city, region, "sellerId", status, views, "createdAt", "updatedAt")
VALUES 
  ('prod_seed_007', 'Dell OptiPlex Desktop', 'Dell OptiPlex Desktop in new condition. Perfect for office work.', 40000, 'new', 'desktop-computers', 'office-desktops', 'Dell', ARRAY['https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=800']::text[], '{"processor": "Intel Core i5", "ram": "16GB", "storage": "512GB SSD"}'::jsonb, 'Dire Dawa', 'Dire Dawa', 'seller_seed_002', 'active', 23, NOW(), NOW());

-- Custom Gaming PC
INSERT INTO products (id, title, description, price, condition, category, subcategory, brand, images, specifications, city, region, "sellerId", status, views, "createdAt", "updatedAt")
VALUES 
  ('prod_seed_008', 'Custom Gaming PC', 'Custom built gaming PC in new condition. High-end components.', 100000, 'new', 'desktop-computers', 'gaming-desktops', 'Custom', ARRAY['https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=800']::text[], '{"processor": "AMD Ryzen 7", "ram": "32GB", "storage": "2TB SSD", "gpu": "RTX 4070"}'::jsonb, 'Addis Ababa', 'Addis Ababa', 'seller_seed_003', 'active', 89, NOW(), NOW());

-- Intel Core i7 Processor
INSERT INTO products (id, title, description, price, condition, category, subcategory, brand, images, specifications, city, region, "sellerId", status, views, "createdAt", "updatedAt")
VALUES 
  ('prod_seed_009', 'Intel Core i7-13700K', 'Intel Core i7-13700K processor in new condition.', 21500, 'new', 'computer-components', 'processors', 'Intel', ARRAY['https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800']::text[], '{"cores": "16", "threads": "24", "baseClock": "3.4GHz"}'::jsonb, 'Bahir Dar', 'Amhara', 'seller_seed_004', 'active', 34, NOW(), NOW());

-- NVIDIA RTX 4070
INSERT INTO products (id, title, description, price, condition, category, subcategory, brand, images, specifications, city, region, "sellerId", status, views, "createdAt", "updatedAt")
VALUES 
  ('prod_seed_010', 'NVIDIA RTX 4070', 'NVIDIA RTX 4070 graphics card in new condition.', 42500, 'new', 'computer-components', 'graphics-cards', 'NVIDIA', ARRAY['https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800']::text[], '{"memory": "12GB GDDR6X", "cuda": "5888"}'::jsonb, 'Hawassa', 'Sidama', 'seller_seed_005', 'active', 78, NOW(), NOW());

-- Corsair RAM
INSERT INTO products (id, title, description, price, condition, category, subcategory, brand, images, specifications, city, region, "sellerId", status, views, "createdAt", "updatedAt")
VALUES 
  ('prod_seed_011', 'Corsair Vengeance 32GB RAM', 'Corsair Vengeance 32GB RAM in new condition.', 7500, 'new', 'computer-components', 'memory-ram', 'Corsair', ARRAY['https://images.unsplash.com/photo-1562976540-1502c2145186?w=800']::text[], '{"capacity": "32GB", "speed": "3200MHz", "type": "DDR4"}'::jsonb, 'Mekelle', 'Tigray', 'seller_seed_001', 'active', 41, NOW(), NOW());

-- Samsung SSD
INSERT INTO products (id, title, description, price, condition, category, subcategory, brand, images, specifications, city, region, "sellerId", status, views, "createdAt", "updatedAt")
VALUES 
  ('prod_seed_012', 'Samsung 980 PRO 1TB SSD', 'Samsung 980 PRO 1TB SSD in new condition.', 6500, 'new', 'computer-components', 'storage', 'Samsung', ARRAY['https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800']::text[], '{"capacity": "1TB", "interface": "NVMe", "speed": "7000MB/s"}'::jsonb, 'Addis Ababa', 'Addis Ababa', 'seller_seed_002', 'active', 56, NOW(), NOW());

-- Logitech Mouse
INSERT INTO products (id, title, description, price, condition, category, subcategory, brand, images, specifications, city, region, "sellerId", status, views, "createdAt", "updatedAt")
VALUES 
  ('prod_seed_013', 'Logitech MX Master 3', 'Logitech MX Master 3 wireless mouse in new condition.', 5500, 'new', 'peripherals', 'mice', 'Logitech', ARRAY['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800']::text[], '{"type": "Wireless Mouse", "dpi": "4000", "battery": "70 days"}'::jsonb, 'Dire Dawa', 'Dire Dawa', 'seller_seed_003', 'active', 29, NOW(), NOW());

-- Razer Keyboard
INSERT INTO products (id, title, description, price, condition, category, subcategory, brand, images, specifications, city, region, "sellerId", status, views, "createdAt", "updatedAt")
VALUES 
  ('prod_seed_014', 'Razer BlackWidow V3', 'Razer BlackWidow V3 mechanical keyboard in new condition.', 7500, 'new', 'peripherals', 'keyboards', 'Razer', ARRAY['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800']::text[], '{"type": "Mechanical Keyboard", "switches": "Green", "backlight": "RGB"}'::jsonb, 'Bahir Dar', 'Amhara', 'seller_seed_004', 'active', 37, NOW(), NOW());

-- Dell Monitor
INSERT INTO products (id, title, description, price, condition, category, subcategory, brand, images, specifications, city, region, "sellerId", status, views, "createdAt", "updatedAt")
VALUES 
  ('prod_seed_015', 'Dell UltraSharp 27" Monitor', 'Dell UltraSharp 27" monitor in new condition.', 20000, 'new', 'peripherals', 'monitors', 'Dell', ARRAY['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800']::text[], '{"size": "27\"", "resolution": "2560x1440", "refresh": "75Hz"}'::jsonb, 'Hawassa', 'Sidama', 'seller_seed_005', 'active', 44, NOW(), NOW());

-- Logitech Webcam
INSERT INTO products (id, title, description, price, condition, category, subcategory, brand, images, specifications, city, region, "sellerId", status, views, "createdAt", "updatedAt")
VALUES 
  ('prod_seed_016', 'Logitech C920 Webcam', 'Logitech C920 HD webcam in new condition.', 4000, 'new', 'peripherals', 'webcams', 'Logitech', ARRAY['https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=800']::text[], '{"resolution": "1080p", "fps": "30", "autofocus": "Yes"}'::jsonb, 'Mekelle', 'Tigray', 'seller_seed_001', 'active', 31, NOW(), NOW());

-- Step 4: Create Reviews
INSERT INTO reviews (id, "productId", "userId", "sellerId", rating, title, comment, verified, "createdAt", "updatedAt")
VALUES 
  ('review_seed_001', 'prod_seed_001', 'user_seed_002', 'seller_seed_001', 5, 'Great product!', 'Great product! Works perfectly as described.', true, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
  ('review_seed_002', 'prod_seed_003', 'user_seed_003', 'seller_seed_003', 4, 'Good product', 'Good quality for the price. Highly recommended.', true, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
  ('review_seed_003', 'prod_seed_006', 'user_seed_004', 'seller_seed_001', 5, 'Excellent!', 'Fast delivery and excellent condition.', true, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
  ('review_seed_004', 'prod_seed_008', 'user_seed_005', 'seller_seed_003', 5, 'Perfect!', 'Exactly what I was looking for. Very satisfied.', false, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
  ('review_seed_005', 'prod_seed_010', 'user_seed_001', 'seller_seed_005', 4, 'Good seller', 'Good seller, responsive and helpful.', true, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days');

-- Seed Complete!
-- Summary: 5 sellers, 16 products, 5 reviews created
