-- STEP 4: Create Products (Ready to run - IDs already filled in)
-- ============================================================================

INSERT INTO products (id, title, description, price, condition, category, subcategory, brand, images, status, views, favorites, city, region, country, specifications, "sellerId", "createdAt", "updatedAt")
VALUES
  -- Product 1 - Dell XPS Laptop
  (gen_random_uuid()::text,
   'Dell XPS 15 9520 - High Performance Laptop', 
   'Powerful laptop with Intel i7-12700H, 16GB RAM, 512GB SSD. Perfect for professionals.',
   85000, 'new', 'laptops', 'business-laptops', 'Dell',
   ARRAY['https://images.unsplash.com/photo-1593642632823-8f785ba67e45'],
   'active', 45, 8, 'Addis Ababa', 'Addis Ababa', 'Ethiopia',
   '{"processor": "Intel Core i7-12700H", "ram": "16GB DDR5", "storage": "512GB NVMe SSD"}'::jsonb,
   '472b66bc-c2b2-4c16-87fc-f99951d4e119', NOW(), NOW()),
  
  -- Product 2 - HP Gaming Laptop
  (gen_random_uuid()::text,
   'HP Pavilion Gaming 15',
   'Gaming laptop with AMD Ryzen 5, GTX 1650, 8GB RAM. Great for gaming.',
   45000, 'used', 'laptops', 'gaming-laptops', 'HP',
   ARRAY['https://images.unsplash.com/photo-1603302576837-37561b2e2302'],
   'active', 67, 12, 'Dire Dawa', 'Dire Dawa', 'Ethiopia',
   '{"processor": "AMD Ryzen 5 5600H", "ram": "8GB DDR4", "graphics": "NVIDIA GTX 1650"}'::jsonb,
   '9968cafe-2da2-4d6c-a98c-d2d3a1997854', NOW(), NOW()),
  
  -- Product 3 - Lenovo ThinkPad
  (gen_random_uuid()::text,
   'Lenovo ThinkPad X1 Carbon Gen 9',
   'Ultra-portable business laptop. Intel i5, 16GB RAM, 256GB SSD.',
   72000, 'refurbished', 'laptops', 'ultrabooks', 'Lenovo',
   ARRAY['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed'],
   'active', 34, 6, 'Bahir Dar', 'Amhara', 'Ethiopia',
   '{"processor": "Intel Core i5-1135G7", "ram": "16GB", "storage": "256GB SSD"}'::jsonb,
   'a6ee9bc1-a403-4467-9fd2-f2651bca1950a', NOW(), NOW()),
  
  -- Product 4 - Gaming Desktop
  (gen_random_uuid()::text,
   'Custom Gaming PC - RTX 3070',
   'High-performance gaming PC. Ryzen 7, RTX 3070, 32GB RAM.',
   125000, 'new', 'desktop-computers', 'gaming-desktops', 'ASUS',
   ARRAY['https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea'],
   'active', 102, 18, 'Addis Ababa', 'Addis Ababa', 'Ethiopia',
   '{"processor": "AMD Ryzen 7 5800X", "ram": "32GB DDR4", "graphics": "NVIDIA RTX 3070"}'::jsonb,
   '472b66bc-c2b2-4c16-87fc-f99951d4e119', NOW(), NOW()),
  
  -- Product 5 - Intel Processor
  (gen_random_uuid()::text,
   'Intel Core i5-12400F Processor',
   'Latest gen Intel processor, 6 cores 12 threads. Brand new, sealed.',
   18000, 'new', 'computer-components', 'processors-cpus', 'Intel',
   ARRAY['https://images.unsplash.com/photo-1555617981-dac3880eac6e'],
   'active', 78, 14, 'Dire Dawa', 'Dire Dawa', 'Ethiopia',
   '{"cores": "6", "threads": "12", "socket": "LGA1700"}'::jsonb,
   '9968cafe-2da2-4d6c-a98c-d2d3a1997854', NOW(), NOW());
