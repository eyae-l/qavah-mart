-- Seed script for Qavah-Mart database
-- Run this in Supabase SQL Editor

-- Clear existing data (in reverse order of dependencies)
DELETE FROM reviews;
DELETE FROM products;
DELETE FROM sellers;
DELETE FROM subcategories;
DELETE FROM categories;

-- Seed Categories
INSERT INTO categories (id, name, slug, description, "featuredBrands", specifications, "createdAt", "updatedAt") VALUES
('cat_laptops', 'Laptops', 'laptops', 'Portable computers for work, gaming, and everyday use', ARRAY['Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'MSI', 'Apple'], '[]'::jsonb, NOW(), NOW()),
('cat_desktops', 'Desktop Computers', 'desktop-computers', 'Complete desktop systems and custom builds', ARRAY['Dell', 'HP', 'Lenovo', 'ASUS'], '[]'::jsonb, NOW(), NOW()),
('cat_components', 'Computer Components', 'computer-components', 'Build or upgrade your PC with quality components', ARRAY['Intel', 'AMD', 'NVIDIA', 'Corsair', 'Kingston', 'Samsung'], '[]'::jsonb, NOW(), NOW()),
('cat_peripherals', 'Peripherals', 'peripherals', 'Keyboards, mice, monitors, and more', ARRAY['Logitech', 'Razer', 'SteelSeries', 'Corsair', 'Dell', 'HP', 'Samsung'], '[]'::jsonb, NOW(), NOW()),
('cat_networking', 'Networking Equipment', 'networking-equipment', 'Routers, switches, and network accessories', ARRAY['TP-Link', 'Netgear', 'ASUS', 'Linksys'], '[]'::jsonb, NOW(), NOW()),
('cat_software', 'Software & Licenses', 'software-licenses', 'Operating systems and software licenses', ARRAY['Microsoft', 'Adobe', 'Autodesk'], '[]'::jsonb, NOW(), NOW()),
('cat_accessories', 'Computer Accessories', 'computer-accessories', 'Cables, adapters, and other accessories', ARRAY['Anker', 'Belkin', 'Cable Matters'], '[]'::jsonb, NOW(), NOW());

-- Seed Subcategories for Laptops
INSERT INTO subcategories (id, name, slug, specifications, "categoryId", "createdAt", "updatedAt") VALUES
('sub_gaming_laptops', 'Gaming Laptops', 'gaming-laptops', '[]'::jsonb, 'cat_laptops', NOW(), NOW()),
('sub_business_laptops', 'Business Laptops', 'business-laptops', '[]'::jsonb, 'cat_laptops', NOW(), NOW()),
('sub_ultrabooks', 'Ultrabooks', 'ultrabooks', '[]'::jsonb, 'cat_laptops', NOW(), NOW()),
('sub_budget_laptops', 'Budget Laptops', 'budget-laptops', '[]'::jsonb, 'cat_laptops', NOW(), NOW());

-- Seed Subcategories for Desktop Computers
INSERT INTO subcategories (id, name, slug, specifications, "categoryId", "createdAt", "updatedAt") VALUES
('sub_gaming_desktops', 'Gaming Desktops', 'gaming-desktops', '[]'::jsonb, 'cat_desktops', NOW(), NOW()),
('sub_workstations', 'Workstations', 'workstations', '[]'::jsonb, 'cat_desktops', NOW(), NOW()),
('sub_all_in_one', 'All-in-One PCs', 'all-in-one-pcs', '[]'::jsonb, 'cat_desktops', NOW(), NOW()),
('sub_mini_pcs', 'Mini PCs', 'mini-pcs', '[]'::jsonb, 'cat_desktops', NOW(), NOW());

-- Seed Subcategories for Computer Components
INSERT INTO subcategories (id, name, slug, specifications, "categoryId", "createdAt", "updatedAt") VALUES
('sub_cpus', 'Processors (CPUs)', 'processors-cpus', '[]'::jsonb, 'cat_components', NOW(), NOW()),
('sub_gpus', 'Graphics Cards (GPUs)', 'graphics-cards-gpus', '[]'::jsonb, 'cat_components', NOW(), NOW()),
('sub_ram', 'RAM Memory', 'ram-memory', '[]'::jsonb, 'cat_components', NOW(), NOW()),
('sub_storage', 'Storage Drives', 'storage-drives', '[]'::jsonb, 'cat_components', NOW(), NOW()),
('sub_motherboards', 'Motherboards', 'motherboards', '[]'::jsonb, 'cat_components', NOW(), NOW()),
('sub_psus', 'Power Supplies', 'power-supplies', '[]'::jsonb, 'cat_components', NOW(), NOW()),
('sub_cases', 'PC Cases', 'pc-cases', '[]'::jsonb, 'cat_components', NOW(), NOW()),
('sub_cooling', 'Cooling Systems', 'cooling-systems', '[]'::jsonb, 'cat_components', NOW(), NOW());

-- Seed Subcategories for Peripherals
INSERT INTO subcategories (id, name, slug, specifications, "categoryId", "createdAt", "updatedAt") VALUES
('sub_keyboards', 'Keyboards', 'keyboards', '[]'::jsonb, 'cat_peripherals', NOW(), NOW()),
('sub_mice', 'Mice', 'mice', '[]'::jsonb, 'cat_peripherals', NOW(), NOW()),
('sub_monitors', 'Monitors', 'monitors', '[]'::jsonb, 'cat_peripherals', NOW(), NOW()),
('sub_webcams', 'Webcams', 'webcams', '[]'::jsonb, 'cat_peripherals', NOW(), NOW()),
('sub_headsets', 'Headsets', 'headsets', '[]'::jsonb, 'cat_peripherals', NOW(), NOW()),
('sub_speakers', 'Speakers', 'speakers', '[]'::jsonb, 'cat_peripherals', NOW(), NOW());

-- Seed Subcategories for Networking Equipment
INSERT INTO subcategories (id, name, slug, specifications, "categoryId", "createdAt", "updatedAt") VALUES
('sub_routers', 'Routers', 'routers', '[]'::jsonb, 'cat_networking', NOW(), NOW()),
('sub_switches', 'Switches', 'switches', '[]'::jsonb, 'cat_networking', NOW(), NOW()),
('sub_network_adapters', 'Network Adapters', 'network-adapters', '[]'::jsonb, 'cat_networking', NOW(), NOW()),
('sub_modems', 'Modems', 'modems', '[]'::jsonb, 'cat_networking', NOW(), NOW());

-- Seed Subcategories for Software & Licenses
INSERT INTO subcategories (id, name, slug, specifications, "categoryId", "createdAt", "updatedAt") VALUES
('sub_os', 'Operating Systems', 'operating-systems', '[]'::jsonb, 'cat_software', NOW(), NOW()),
('sub_office', 'Office Software', 'office-software', '[]'::jsonb, 'cat_software', NOW(), NOW()),
('sub_antivirus', 'Antivirus', 'antivirus', '[]'::jsonb, 'cat_software', NOW(), NOW()),
('sub_design', 'Design Software', 'design-software', '[]'::jsonb, 'cat_software', NOW(), NOW());

-- Seed Subcategories for Computer Accessories
INSERT INTO subcategories (id, name, slug, specifications, "categoryId", "createdAt", "updatedAt") VALUES
('sub_cables', 'Cables', 'cables', '[]'::jsonb, 'cat_accessories', NOW(), NOW()),
('sub_adapters', 'Adapters', 'adapters', '[]'::jsonb, 'cat_accessories', NOW(), NOW()),
('sub_usb_hubs', 'USB Hubs', 'usb-hubs', '[]'::jsonb, 'cat_accessories', NOW(), NOW()),
('sub_laptop_bags', 'Laptop Bags', 'laptop-bags', '[]'::jsonb, 'cat_accessories', NOW(), NOW()),
('sub_cleaning', 'Cleaning Kits', 'cleaning-kits', '[]'::jsonb, 'cat_accessories', NOW(), NOW()),
('sub_stands', 'Stands', 'stands', '[]'::jsonb, 'cat_accessories', NOW(), NOW());

-- Verify the data
SELECT 'Categories created:' as info, COUNT(*) as count FROM categories
UNION ALL
SELECT 'Subcategories created:' as info, COUNT(*) as count FROM subcategories;
