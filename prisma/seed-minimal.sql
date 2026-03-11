-- ============================================================================
-- Qavah-Mart Minimal Product Seed - Step by Step
-- Run each section separately in Supabase SQL Editor
-- ============================================================================

-- STEP 1: Create Users (Run this first)
-- ============================================================================
INSERT INTO users (id, email, "firstName", "lastName", city, region, country, "isVerified", "isSeller", "createdAt", "updatedAt")
VALUES 
  ('user_seed_001', 'seller1@qavahmart.com', 'Abebe', 'Kebede', 'Addis Ababa', 'Addis Ababa', 'Ethiopia', true, true, NOW(), NOW()),
  ('user_seed_002', 'seller2@qavahmart.com', 'Tigist', 'Haile', 'Dire Dawa', 'Dire Dawa', 'Ethiopia', true, true, NOW(), NOW()),
  ('user_seed_003', 'seller3@qavahmart.com', 'Dawit', 'Tesfaye', 'Bahir Dar', 'Amhara', 'Ethiopia', true, true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- STEP 2: Create Sellers (Run this second)
-- ============================================================================
INSERT INTO sellers ("userId", "businessName", "businessType", "verificationStatus", rating, "totalSales", "responseTime", "joinedDate")
VALUES 
  ('user_seed_001', 'Abebe''s Tech Store', 'individual', 'verified', 4.8, 45, 2, NOW() - INTERVAL '6 months'),
  ('user_seed_002', 'Tigist Electronics', 'business', 'verified', 4.9, 62, 1, NOW() - INTERVAL '1 year'),
  ('user_seed_003', 'Dawit Computer Shop', 'individual', 'verified', 4.7, 38, 3, NOW() - INTERVAL '8 months')
ON CONFLICT ("userId") DO NOTHING;

-- STEP 3: Get Seller IDs (Run this to see the IDs)
-- ============================================================================
SELECT id, "userId", "businessName" FROM sellers WHERE "userId" LIKE 'user_seed_%';

-- STEP 4: Create Products (Replace 'SELLER_ID_HERE' with actual IDs from step 3)
-- ============================================================================
-- After running step 3, you'll see seller IDs like 'clxxx...'
-- Copy those IDs and replace 'SELLER_ID_1', 'SELLER_ID_2', 'SELLER_ID_3' below

-- Example: If seller 1's ID is 'clxxx123', replace 'SELLER_ID_1' with 'clxxx123'

INSERT INTO products (title, description, price, condition, category, subcategory, brand, images, status, views, favorites, city, region, country, specifications, "sellerId", "createdAt", "updatedAt")
VALUES
  -- Product 1 - Dell XPS Laptop
  ('Dell XPS 15 9520 - High Performance Laptop', 
   'Powerful laptop with Intel i7-12700H, 16GB RAM, 512GB SSD. Perfect for professionals.',
   85000, 'new', 'laptops', 'business-laptops', 'Dell',
   ARRAY['https://images.unsplash.com/photo-1593642632823-8f785ba67e45'],
   'active', 45, 8, 'Addis Ababa', 'Addis Ababa', 'Ethiopia',
   '{"processor": "Intel Core i7-12700H", "ram": "16GB DDR5", "storage": "512GB NVMe SSD"}'::jsonb,
   'SELLER_ID_1', NOW(), NOW()),
  
  -- Product 2 - HP Gaming Laptop
  ('HP Pavilion Gaming 15',
   'Gaming laptop with AMD Ryzen 5, GTX 1650, 8GB RAM. Great for gaming.',
   45000, 'used', 'laptops', 'gaming-laptops', 'HP',
   ARRAY['https://images.unsplash.com/photo-1603302576837-37561b2e2302'],
   'active', 67, 12, 'Dire Dawa', 'Dire Dawa', 'Ethiopia',
   '{"processor": "AMD Ryzen 5 5600H", "ram": "8GB DDR4", "graphics": "NVIDIA GTX 1650"}'::jsonb,
   'SELLER_ID_2', NOW(), NOW()),
  
  -- Product 3 - Lenovo ThinkPad
  ('Lenovo ThinkPad X1 Carbon Gen 9',
   'Ultra-portable business laptop. Intel i5, 16GB RAM, 256GB SSD.',
   72000, 'refurbished', 'laptops', 'ultrabooks', 'Lenovo',
   ARRAY['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed'],
   'active', 34, 6, 'Bahir Dar', 'Amhara', 'Ethiopia',
   '{"processor": "Intel Core i5-1135G7", "ram": "16GB", "storage": "256GB SSD"}'::jsonb,
   'SELLER_ID_3', NOW(), NOW()),
  
  -- Product 4 - Gaming Desktop
  ('Custom Gaming PC - RTX 3070',
   'High-performance gaming PC. Ryzen 7, RTX 3070, 32GB RAM.',
   125000, 'new', 'desktop-computers', 'gaming-desktops', 'ASUS',
   ARRAY['https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea'],
   'active', 102, 18, 'Addis Ababa', 'Addis Ababa', 'Ethiopia',
   '{"processor": "AMD Ryzen 7 5800X", "ram": "32GB DDR4", "graphics": "NVIDIA RTX 3070"}'::jsonb,
   'SELLER_ID_1', NOW(), NOW()),
  
  -- Product 5 - Intel Processor
  ('Intel Core i5-12400F Processor',
   'Latest gen Intel processor, 6 cores 12 threads. Brand new, sealed.',
   18000, 'new', 'computer-components', 'processors-cpus', 'Intel',
   ARRAY['https://images.unsplash.com/photo-1555617981-dac3880eac6e'],
   'active', 78, 14, 'Dire Dawa', 'Dire Dawa', 'Ethiopia',
   '{"cores": "6", "threads": "12", "socket": "LGA1700"}'::jsonb,
   'SELLER_ID_2', NOW(), NOW());

-- STEP 5: Verify (Run this to check)
-- ============================================================================
SELECT 
  title,
  price,
  condition,
  category,
  brand
FROM products
WHERE "sellerId" IN (SELECT id FROM sellers WHERE "userId" LIKE 'user_seed_%')
ORDER BY "createdAt" DESC;
