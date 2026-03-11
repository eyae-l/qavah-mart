-- ============================================================================
-- Qavah-Mart Complete Product Seed Data
-- Run this in Supabase SQL Editor after running seed.sql
-- ============================================================================

-- Step 1: Create Sample Users (Sellers)
-- ============================================================================
INSERT INTO users (id, email, "firstName", "lastName", city, region, country, "isVerified", "isSeller", "createdAt", "updatedAt")
VALUES 
  ('user_seed_001', 'seller1@qavahmart.com', 'Abebe', 'Kebede', 'Addis Ababa', 'Addis Ababa', 'Ethiopia', true, true, NOW(), NOW()),
  ('user_seed_002', 'seller2@qavahmart.com', 'Tigist', 'Haile', 'Dire Dawa', 'Dire Dawa', 'Ethiopia', true, true, NOW(), NOW()),
  ('user_seed_003', 'seller3@qavahmart.com', 'Dawit', 'Tesfaye', 'Bahir Dar', 'Amhara', 'Ethiopia', true, true, NOW(), NOW()),
  ('user_seed_004', 'seller4@qavahmart.com', 'Meron', 'Alemayehu', 'Hawassa', 'Sidama', 'Ethiopia', true, true, NOW(), NOW()),
  ('user_seed_005', 'seller5@qavahmart.com', 'Yohannes', 'Bekele', 'Mekelle', 'Tigray', 'Ethiopia', true, true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Step 2: Create Seller Profiles
-- ============================================================================
INSERT INTO sellers ("userId", "businessName", "businessType", "verificationStatus", rating, "totalSales", "responseTime", "joinedDate")
VALUES 
  ('user_seed_001', 'Abebe''s Tech Store', 'individual', 'verified', 4.8, 45, 2, NOW() - INTERVAL '6 months'),
  ('user_seed_002', 'Tigist Electronics', 'business', 'verified', 4.9, 62, 1, NOW() - INTERVAL '1 year'),
  ('user_seed_003', 'Dawit Computer Shop', 'individual', 'verified', 4.7, 38, 3, NOW() - INTERVAL '8 months'),
  ('user_seed_004', 'Meron''s PC Parts', 'business', 'verified', 4.6, 29, 4, NOW() - INTERVAL '5 months'),
  ('user_seed_005', 'Yohannes Tech Hub', 'individual', 'verified', 4.9, 51, 2, NOW() - INTERVAL '10 months')
ON CONFLICT ("userId") DO NOTHING;

-- Step 3: Seed Products
-- ============================================================================

-- Get seller IDs for reference
DO $$
DECLARE
  seller1_id TEXT;
  seller2_id TEXT;
  seller3_id TEXT;
  seller4_id TEXT;
  seller5_id TEXT;
BEGIN
  SELECT id INTO seller1_id FROM sellers WHERE "userId" = 'user_seed_001';
  SELECT id INTO seller2_id FROM sellers WHERE "userId" = 'user_seed_002';
  SELECT id INTO seller3_id FROM sellers WHERE "userId" = 'user_seed_003';
  SELECT id INTO seller4_id FROM sellers WHERE "userId" = 'user_seed_004';
  SELECT id INTO seller5_id FROM sellers WHERE "userId" = 'user_seed_005';

  -- LAPTOPS
  INSERT INTO products (title, description, price, condition, category, subcategory, brand, images, status, views, favorites, city, region, country, specifications, "sellerId", "createdAt", "updatedAt")
  VALUES
    ('Dell XPS 15 9520 - High Performance Laptop', 'Powerful laptop with Intel i7-12700H, 16GB RAM, 512GB SSD. Perfect for professionals and content creators. Excellent condition with minimal use.', 85000, 'new', 'laptops', 'business-laptops', 'Dell', 
     ARRAY['https://images.unsplash.com/photo-1593642632823-8f785ba67e45'], 'active', 45, 8, 'Addis Ababa', 'Addis Ababa', 'Ethiopia',
     '{"processor": "Intel Core i7-12700H", "ram": "16GB DDR5", "storage": "512GB NVMe SSD", "display": "15.6 inch FHD", "graphics": "Intel Iris Xe"}'::jsonb,
     seller1_id, NOW() - INTERVAL '2 days', NOW()),
    
    ('HP Pavilion Gaming 15', 'Gaming laptop with AMD Ryzen 5, GTX 1650, 8GB RAM. Great for gaming and everyday tasks. Lightly used, like new condition.', 45000, 'used', 'laptops', 'gaming-laptops', 'HP',
     ARRAY['https://images.unsplash.com/photo-1603302576837-37561b2e2302'], 'active', 67, 12, 'Dire Dawa', 'Dire Dawa', 'Ethiopia',
     '{"processor": "AMD Ryzen 5 5600H", "ram": "8GB DDR4", "storage": "512GB SSD", "display": "15.6 inch FHD 144Hz", "graphics": "NVIDIA GTX 1650"}'::jsonb,
     seller2_id, NOW() - INTERVAL '5 days', NOW()),
    
    ('Lenovo ThinkPad X1 Carbon Gen 9', 'Ultra-portable business laptop. Intel i5-1135G7, 16GB RAM, 256GB SSD. Perfect for professionals on the go.', 72000, 'refurbished', 'laptops', 'ultrabooks', 'Lenovo',
     ARRAY['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed'], 'active', 34, 6, 'Bahir Dar', 'Amhara', 'Ethiopia',
     '{"processor": "Intel Core i5-1135G7", "ram": "16GB LPDDR4X", "storage": "256GB NVMe SSD", "display": "14 inch FHD", "weight": "1.13kg"}'::jsonb,
     seller3_id, NOW() - INTERVAL '1 day', NOW()),
    
    ('ASUS ROG Strix G15 Gaming Laptop', 'High-end gaming laptop with Ryzen 7, RTX 3060, 16GB RAM, 1TB SSD. RGB keyboard, 165Hz display. Excellent for gaming and streaming.', 95000, 'new', 'laptops', 'gaming-laptops', 'ASUS',
     ARRAY['https://images.unsplash.com/photo-1603302576837-37561b2e2302'], 'active', 89, 15, 'Hawassa', 'Sidama', 'Ethiopia',
     '{"processor": "AMD Ryzen 7 5800H", "ram": "16GB DDR4", "storage": "1TB NVMe SSD", "display": "15.6 inch FHD 165Hz", "graphics": "NVIDIA RTX 3060"}'::jsonb,
     seller4_id, NOW() - INTERVAL '3 days', NOW()),
    
    ('Acer Aspire 5 - Budget Laptop', 'Affordable laptop for students and basic tasks. Intel i3, 8GB RAM, 256GB SSD. Good condition, perfect for everyday use.', 28000, 'used', 'laptops', 'budget-laptops', 'Acer',
     ARRAY['https://images.unsplash.com/photo-1496181133206-80ce9b88a853'], 'active', 56, 9, 'Mekelle', 'Tigray', 'Ethiopia',
     '{"processor": "Intel Core i3-1115G4", "ram": "8GB DDR4", "storage": "256GB SSD", "display": "15.6 inch HD", "battery": "Up to 7 hours"}'::jsonb,
     seller5_id, NOW() - INTERVAL '4 days', NOW()),

  -- DESKTOP COMPUTERS
    ('Dell OptiPlex 7090 Desktop', 'Business desktop with Intel i7-11700, 16GB RAM, 512GB SSD. Perfect for office work and multitasking.', 65000, 'new', 'desktop-computers', 'workstations', 'Dell',
     ARRAY['https://images.unsplash.com/photo-1587831990711-23ca6441447b'], 'active', 23, 4, 'Addis Ababa', 'Addis Ababa', 'Ethiopia',
     '{"processor": "Intel Core i7-11700", "ram": "16GB DDR4", "storage": "512GB NVMe SSD", "ports": "Multiple USB, HDMI, DisplayPort"}'::jsonb,
     seller1_id, NOW() - INTERVAL '6 days', NOW()),
    
    ('Custom Gaming PC - RTX 3070', 'High-performance gaming PC. Ryzen 7 5800X, RTX 3070, 32GB RAM, 1TB NVMe + 2TB HDD. RGB lighting, liquid cooling.', 125000, 'new', 'desktop-computers', 'gaming-desktops', 'ASUS',
     ARRAY['https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea'], 'active', 102, 18, 'Dire Dawa', 'Dire Dawa', 'Ethiopia',
     '{"processor": "AMD Ryzen 7 5800X", "ram": "32GB DDR4 3600MHz", "storage": "1TB NVMe + 2TB HDD", "graphics": "NVIDIA RTX 3070 8GB", "cooling": "AIO Liquid Cooler"}'::jsonb,
     seller2_id, NOW() - INTERVAL '1 day', NOW()),

  -- COMPUTER COMPONENTS
    ('Intel Core i5-12400F Processor', 'Latest gen Intel processor, 6 cores 12 threads. Perfect for gaming and productivity builds. Brand new, sealed box.', 18000, 'new', 'computer-components', 'processors-cpus', 'Intel',
     ARRAY['https://images.unsplash.com/photo-1555617981-dac3880eac6e'], 'active', 78, 14, 'Bahir Dar', 'Amhara', 'Ethiopia',
     '{"cores": "6", "threads": "12", "base_clock": "2.5GHz", "boost_clock": "4.4GHz", "socket": "LGA1700"}'::jsonb,
     seller3_id, NOW() - INTERVAL '2 days', NOW()),
    
    ('NVIDIA GeForce RTX 3060 Ti', 'Excellent 1440p gaming GPU. 8GB GDDR6, ray tracing support. Lightly used for 6 months, works perfectly.', 42000, 'used', 'computer-components', 'graphics-cards-gpus', 'NVIDIA',
     ARRAY['https://images.unsplash.com/photo-1591488320449-011701bb6704'], 'active', 134, 22, 'Hawassa', 'Sidama', 'Ethiopia',
     '{"memory": "8GB GDDR6", "cuda_cores": "4864", "boost_clock": "1665MHz", "power": "200W TDP", "outputs": "HDMI 2.1, 3x DisplayPort"}'::jsonb,
     seller4_id, NOW() - INTERVAL '3 days', NOW()),
    
    ('Corsair Vengeance RGB 16GB RAM', 'High-performance DDR4 RAM, 3200MHz, RGB lighting. 2x8GB kit. Perfect for gaming builds.', 8500, 'new', 'computer-components', 'ram-memory', 'Corsair',
     ARRAY['https://images.unsplash.com/photo-1541348263662-e068662d82af'], 'active', 45, 7, 'Mekelle', 'Tigray', 'Ethiopia',
     '{"capacity": "16GB (2x8GB)", "type": "DDR4", "speed": "3200MHz", "latency": "CL16", "rgb": "Yes"}'::jsonb,
     seller5_id, NOW() - INTERVAL '5 days', NOW()),
    
    ('Samsung 970 EVO Plus 1TB NVMe SSD', 'Ultra-fast NVMe SSD, 3500MB/s read speed. Perfect for OS and games. Brand new, sealed.', 12000, 'new', 'computer-components', 'storage-drives', 'Samsung',
     ARRAY['https://images.unsplash.com/photo-1597872200969-2b65d56bd16b'], 'active', 67, 11, 'Addis Ababa', 'Addis Ababa', 'Ethiopia',
     '{"capacity": "1TB", "interface": "NVMe PCIe 3.0", "read_speed": "3500MB/s", "write_speed": "3300MB/s", "form_factor": "M.2 2280"}'::jsonb,
     seller1_id, NOW() - INTERVAL '4 days', NOW()),

  -- PERIPHERALS
    ('Logitech G502 HERO Gaming Mouse', 'Popular gaming mouse with 25K DPI sensor, 11 programmable buttons, RGB lighting. Like new condition.', 4500, 'used', 'peripherals', 'mice', 'Logitech',
     ARRAY['https://images.unsplash.com/photo-1527814050087-3793815479db'], 'active', 89, 16, 'Dire Dawa', 'Dire Dawa', 'Ethiopia',
     '{"dpi": "25600", "buttons": "11 programmable", "rgb": "Yes", "weight": "Adjustable", "connection": "Wired USB"}'::jsonb,
     seller2_id, NOW() - INTERVAL '7 days', NOW()),
    
    ('Razer BlackWidow V3 Mechanical Keyboard', 'Premium mechanical gaming keyboard with green switches, RGB Chroma lighting. Excellent tactile feedback.', 9500, 'new', 'peripherals', 'keyboards', 'Razer',
     ARRAY['https://images.unsplash.com/photo-1595225476474-87563907a212'], 'active', 72, 13, 'Bahir Dar', 'Amhara', 'Ethiopia',
     '{"switch_type": "Razer Green Mechanical", "rgb": "Chroma RGB", "layout": "Full-size", "wrist_rest": "Included", "connection": "Wired USB"}'::jsonb,
     seller3_id, NOW() - INTERVAL '2 days', NOW()),
    
    ('Dell 27" 4K Monitor', 'Professional 4K monitor, IPS panel, 60Hz. Perfect for productivity and content creation. Excellent color accuracy.', 35000, 'used', 'peripherals', 'monitors', 'Dell',
     ARRAY['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf'], 'active', 54, 9, 'Hawassa', 'Sidama', 'Ethiopia',
     '{"size": "27 inch", "resolution": "3840x2160 (4K)", "panel": "IPS", "refresh_rate": "60Hz", "ports": "HDMI, DisplayPort, USB-C"}'::jsonb,
     seller4_id, NOW() - INTERVAL '6 days', NOW()),
    
    ('Logitech C920 HD Webcam', 'Popular HD webcam for video calls and streaming. 1080p 30fps, stereo audio. Great for remote work.', 5500, 'new', 'peripherals', 'webcams', 'Logitech',
     ARRAY['https://images.unsplash.com/photo-1614624532983-4ce03382d63d'], 'active', 43, 8, 'Mekelle', 'Tigray', 'Ethiopia',
     '{"resolution": "1080p", "framerate": "30fps", "microphone": "Dual stereo", "mount": "Universal clip", "autofocus": "Yes"}'::jsonb,
     seller5_id, NOW() - INTERVAL '3 days', NOW());

END $$;

-- Step 4: Add Sample Reviews
-- ============================================================================
DO $$
DECLARE
  product_id TEXT;
  seller_id TEXT;
BEGIN
  -- Get a sample product and seller for reviews
  SELECT id INTO product_id FROM products WHERE title LIKE '%Dell XPS%' LIMIT 1;
  SELECT "sellerId" INTO seller_id FROM products WHERE id = product_id;
  
  -- Add reviews for Dell XPS
  INSERT INTO reviews (rating, title, comment, helpful, verified, "productId", "userId", "sellerId", "createdAt", "updatedAt")
  VALUES
    (5, 'Excellent laptop!', 'This laptop exceeded my expectations. Fast, reliable, and great build quality. Highly recommend!', 5, true, product_id, 'user_seed_002', seller_id, NOW() - INTERVAL '10 days', NOW()),
    (4, 'Good performance', 'Very good laptop for work. Battery life could be better but overall satisfied with the purchase.', 3, true, product_id, 'user_seed_003', seller_id, NOW() - INTERVAL '15 days', NOW());

  -- Get HP Pavilion Gaming
  SELECT id INTO product_id FROM products WHERE title LIKE '%HP Pavilion Gaming%' LIMIT 1;
  SELECT "sellerId" INTO seller_id FROM products WHERE id = product_id;
  
  INSERT INTO reviews (rating, title, comment, helpful, verified, "productId", "userId", "sellerId", "createdAt", "updatedAt")
  VALUES
    (5, 'Great gaming laptop', 'Runs all my games smoothly. The 144Hz display is amazing. Seller was very responsive.', 7, true, product_id, 'user_seed_001', seller_id, NOW() - INTERVAL '8 days', NOW()),
    (4, 'Good value', 'Good laptop for the price. Gets a bit warm during gaming but performance is solid.', 2, false, product_id, 'user_seed_004', seller_id, NOW() - INTERVAL '12 days', NOW());

  -- Get RTX 3060 Ti
  SELECT id INTO product_id FROM products WHERE title LIKE '%RTX 3060 Ti%' LIMIT 1;
  SELECT "sellerId" INTO seller_id FROM products WHERE id = product_id;
  
  INSERT INTO reviews (rating, title, comment, helpful, verified, "productId", "userId", "sellerId", "createdAt", "updatedAt")
  VALUES
    (5, 'Perfect condition!', 'GPU works flawlessly. No issues at all. Great seller, fast delivery.', 9, true, product_id, 'user_seed_005', seller_id, NOW() - INTERVAL '5 days', NOW());

END $$;

-- Step 5: Verification Query
-- ============================================================================
SELECT 
  'Database Seeding Complete!' as status,
  (SELECT COUNT(*) FROM users WHERE id LIKE 'user_seed_%') as seed_users,
  (SELECT COUNT(*) FROM sellers WHERE "userId" LIKE 'user_seed_%') as seed_sellers,
  (SELECT COUNT(*) FROM products WHERE "sellerId" IN (SELECT id FROM sellers WHERE "userId" LIKE 'user_seed_%')) as seed_products,
  (SELECT COUNT(*) FROM reviews WHERE "userId" LIKE 'user_seed_%') as seed_reviews;

-- Show sample products
SELECT 
  title,
  price,
  condition,
  category,
  brand,
  city
FROM products
WHERE "sellerId" IN (SELECT id FROM sellers WHERE "userId" LIKE 'user_seed_%')
ORDER BY "createdAt" DESC
LIMIT 10;
