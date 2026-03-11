-- ============================================================================
-- Qavah-Mart Product Seed Data
-- Copy and paste this entire file into Supabase SQL Editor
-- ============================================================================

-- Step 1: Create Sample Users (Sellers)
-- ============================================================================
INSERT INTO users (id, email, "firstName", "lastName", city, region, country, "isVerified", "isSeller", "createdAt", "updatedAt")
VALUES 
  ('user_seed_001', 'seller1@example.com', 'Abebe', 'Kebede', 'Addis Ababa', 'Addis Ababa', 'Ethiopia', true, true, NOW(), NOW()),
  ('user_seed_002', 'seller2@example.com', 'Tigist', 'Haile', 'Dire Dawa', 'Dire Dawa', 'Ethiopia', true, true, NOW(), NOW()),
  ('user_seed_003', 'seller3@example.com', 'Dawit', 'Tesfaye', 'Bahir Dar', 'Amhara', 'Ethiopia', true, true, NOW(), NOW()),
  ('user_seed_004', 'seller4@example.com', 'Meron', 'Alemayehu', 'Hawassa', 'Sidama', 'Ethiopia', true, true, NOW(), NOW()),
  ('user_seed_005', 'seller5@example.com', 'Yohannes', 'Bekele', 'Mekelle', 'Tigray', 'Ethiopia', true, true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Step 2: Create Seller Profiles
-- ============================================================================
INSERT INTO sellers ("userId", "businessName", "businessType", "verificationStatus", rating, "totalSales", "responseTime", "joinedDate")
VALUES 
  ('