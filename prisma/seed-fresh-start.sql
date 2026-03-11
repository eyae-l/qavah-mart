-- ============================================================================
-- FRESH START: Complete Database Seeding for Qavah-Mart
-- ============================================================================
-- Instructions: Copy and paste EACH SECTION separately into Supabase SQL Editor
-- Wait for success message before moving to the next section
-- ============================================================================

-- ============================================================================
-- SECTION 1: Create Test Users
-- ============================================================================
-- Copy and run this first:

INSERT INTO users (id, email, "firstName", "lastName", city, region, country, "isVerified", "isSeller", "createdAt", "updatedAt")
VALUES 
  ('user_test_001', 'abebe@qavahmart.com', 'Abebe', 'Kebede', 'Addis Ababa', 'Addis Ababa', 'Ethiopia', true, true, NOW(), NOW()),
  ('user_test_002', 'tigist@qavahmart.com', 'Tigist', 'Haile', 'Dire Dawa', 'Dire Dawa', 'Ethiopia', true, true, NOW(), NOW()),
  ('user_test_003', 'dawit@qavahmart.com', 'Dawit', 'Tesfaye', 'Bahir Dar', 'Amhara', 'Ethiopia', true, true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- After running, you should see: "Success. No rows returned"
-- Then proceed to SECTION 2

-- ============================================================================
-- SECTION 2: Create Sellers with Fixed IDs
-- ============================================================================
-- Copy and run this second:

INSERT INTO sellers (id, "userId", "businessName", "businessType", "verificationStatus", rating, "totalSales", "responseTime", "joinedDate")
VALUES 
  ('seller_fixed_001', 'user_test_001', 'Abebe Tech Store', 'individual', 'verified', 4.8, 45, 2, NOW() - INTERVAL '6 months'),
  ('seller_fixed_002', 'user_test_002', 'Tigist Electronics', 'business', 'verified', 4.9, 62, 1, NOW() - INTERVAL '1 year'),
  ('seller_fixed_003', 'user_test_003', 'Dawit Computer Shop', 'individual', 'verified', 4.7, 38, 3, NOW() - INTERVAL '8 months')
ON CONFLICT ("userId") DO NOTHING;

-- After running, you should see: "Success. No rows returned"
-- Then proceed to SECTION 3

-- ============================================================================
-- SECTION 3: Verify Sellers Were Created
-- ============================================================================
-- Copy and run this third (this is just to check):

SELECT id, "userId", "businessName" FROM sellers WHERE id LIKE 'seller_fixed_%';

-- You should see 3 rows with IDs: seller_fixed_001, seller_fixed_002, seller_fixed_003
-- If you see them, proceed to SECTION 4

-- ============================================================================
-- SECTION 4: Create Products (Using Fixed Seller IDs)
-- ============================================================================
-- Copy and run this fourth:

INSERT INTO products (id, title, description, price, condition, category, subcategory, brand, images, status, views, favorites, city, region, country, specifications, "sellerId", "createdAt", "updatedAt")
VALUES
  (
    'prod_laptop_001',
    'Dell XPS 15 9520 - High Performance Laptop',
    'Powerful laptop with Intel i7-12700H, 16GB RAM, 512GB SSD. Perfect for professionals and content creators. Excellent condition, barely used.',
    85000,
    'new',
    'laptops',
    'business-laptops',
    'Dell',
    ARRAY['https://images.unsplash.com/photo-1593642632823-8f785ba67e45'],
    'active',
    45,
    8,
    'Addis Ababa',
    'Addis Ababa',
    'Ethiopia',
    '{"processor": "Intel Core i7-12700H", "ram": "16GB DDR5", "storage": "512GB NVMe SSD", "display": "15.6 inch FHD", "graphics": "Intel Iris Xe"}'::jsonb,
    'seller_fixed_001',
    NOW(),
    NOW()
  ),
  (
    'prod_laptop_002',
    'HP Pavilion Gaming 15',
    'Gaming laptop with AMD Ryzen 5, GTX 1650, 8GB RAM. Great for gaming and multimedia. Used but in excellent condition.',
    45000,
    'used',
    'laptops',
    'gaming-laptops',
    'HP',
    ARRAY['https://images.unsplash.com/photo-1603302576837-37561b2e2302'],
    'active',
    67,
    12,
    'Dire Dawa',
    'Dire Dawa',
    'Ethiopia',
    '{"processor": "AMD Ryzen 5 5600H", "ram": "8GB DDR4", "storage": "512GB SSD", "graphics": "NVIDIA GTX 1650", "display": "15.6 inch FHD 144Hz"}'::jsonb,
    'seller_fixed_002',
    NOW(),
    NOW()
  ),
  (
    'prod_laptop_003',
    'Lenovo ThinkPad X1 Carbon Gen 9',
    'Ultra-portable business laptop. Intel i5, 16GB RAM, 256GB SSD. Professionally refurbished with warranty.',
    72000,
    'refurbished',
    'laptops',
    'ultrabooks',
    'Lenovo',
    ARRAY['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed'],
    'active',
    34,
    6,
    'Bahir Dar',
    'Amhara',
    'Ethiopia',
    '{"processor": "Intel Core i5-1135G7", "ram": "16GB LPDDR4x", "storage": "256GB SSD", "display": "14 inch FHD", "weight": "1.13kg"}'::jsonb,
    'seller_fixed_003',
    NOW(),
    NOW()
  ),
  (
    'prod_desktop_001',
    'Custom Gaming PC - RTX 3070',
    'High-performance gaming PC. Ryzen 7, RTX 3070, 32GB RAM. Built with premium components. Ready to dominate any game.',
    125000,
    'new',
    'desktop-computers',
    'gaming-desktops',
    'ASUS',
    ARRAY['https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea'],
    'active',
    102,
    18,
    'Addis Ababa',
    'Addis Ababa',
    'Ethiopia',
    '{"processor": "AMD Ryzen 7 5800X", "ram": "32GB DDR4 3600MHz", "storage": "1TB NVMe SSD", "graphics": "NVIDIA RTX 3070 8GB", "motherboard": "ASUS ROG Strix B550"}'::jsonb,
    'seller_fixed_001',
    NOW(),
    NOW()
  ),
  (
    'prod_cpu_001',
    'Intel Core i5-12400F Processor',
    'Latest gen Intel processor, 6 cores 12 threads. Brand new, sealed box. Perfect for mid-range gaming and productivity builds.',
    18000,
    'new',
    'computer-components',
    'processors-cpus',
    'Intel',
    ARRAY['https://images.unsplash.com/photo-1555617981-dac3880eac6e'],
    'active',
    78,
    14,
    'Dire Dawa',
    'Dire Dawa',
    'Ethiopia',
    '{"cores": "6", "threads": "12", "base_clock": "2.5GHz", "boost_clock": "4.4GHz", "socket": "LGA1700", "tdp": "65W"}'::jsonb,
    'seller_fixed_002',
    NOW(),
    NOW()
  );

-- After running, you should see: "Success. No rows returned"
-- Then proceed to SECTION 5

-- ============================================================================
-- SECTION 5: Verify Products Were Created
-- ============================================================================
-- Copy and run this fifth (final verification):

SELECT 
  id,
  title,
  price,
  condition,
  category,
  brand,
  "sellerId"
FROM products
WHERE id LIKE 'prod_%'
ORDER BY "createdAt" DESC;

-- You should see 5 products listed
-- If you see all 5 products, seeding is COMPLETE! ✅

-- ============================================================================
-- BONUS: Check Everything Together
-- ============================================================================
-- Optional - run this to see the complete picture:

SELECT 
  p.title as product,
  p.price,
  p.condition,
  s."businessName" as seller,
  u."firstName" as owner
FROM products p
JOIN sellers s ON p."sellerId" = s.id
JOIN users u ON s."userId" = u.id
WHERE p.id LIKE 'prod_%'
ORDER BY p."createdAt" DESC;

-- This shows products with their sellers and owners
