# Database Seeding Guide

This guide explains how to populate your Supabase database with sample data for testing and development.

## Overview

We have two seed scripts:

1. **Categories Seed** (`prisma/seed.ts`) - Seeds categories and subcategories
2. **Products Seed** (`prisma/seedProducts.ts`) - Seeds users, sellers, products, and reviews

## Prerequisites

- Supabase database is set up and accessible
- Environment variables are configured in `.env.local`
- Categories have been seeded (run step 1 first)

## Step-by-Step Instructions

### Step 1: Seed Categories (Required First)

Since your network blocks direct database connections, you'll need to use the Supabase SQL Editor:

1. **Generate the SQL script**:
   ```bash
   npm run db:seed
   ```
   
   This will fail to connect, but that's okay - we just need to see what data it would create.

2. **Manually run in Supabase SQL Editor**:
   - Open your Supabase project dashboard
   - Go to SQL Editor
   - The categories are already seeded from before (7 categories, 38 subcategories)
   - Skip to Step 2

### Step 2: Seed Products, Sellers, and Reviews

This is the main seeding step that adds realistic data to your database.

#### Option A: Generate SQL Script (Recommended for your setup)

Since direct database connection doesn't work from your machine, we'll generate SQL and run it in Supabase:

1. **Create a SQL generation script**:

Create `prisma/generateSeedSQL.ts`:

```typescript
// This script generates SQL INSERT statements for seeding
// Run this locally, then copy the SQL to Supabase SQL Editor

const SAMPLE_USERS = [
  { id: 'user_seed_001', email: 'seller1@example.com', firstName: 'Abebe', lastName: 'Kebede', city: 'Addis Ababa', region: 'Addis Ababa' },
  { id: 'user_seed_002', email: 'seller2@example.com', firstName: 'Tigist', lastName: 'Haile', city: 'Dire Dawa', region: 'Dire Dawa' },
  { id: 'user_seed_003', email: 'seller3@example.com', firstName: 'Dawit', lastName: 'Tesfaye', city: 'Bahir Dar', region: 'Amhara' },
  { id: 'user_seed_004', email: 'seller4@example.com', firstName: 'Meron', lastName: 'Alemayehu', city: 'Hawassa', region: 'Sidama' },
  { id: 'user_seed_005', email: 'seller5@example.com', firstName: 'Yohannes', lastName: 'Bekele', city: 'Mekelle', region: 'Tigray' },
];

console.log('-- Seed Users');
SAMPLE_USERS.forEach(user => {
  console.log(`INSERT INTO users (id, email, "firstName", "lastName", city, region, "isVerified", "isSeller", "createdAt", "updatedAt")
VALUES ('${user.id}', '${user.email}', '${user.firstName}', '${user.lastName}', '${user.city}', '${user.region}', true, true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;`);
});

console.log('\n-- Seed Sellers');
SAMPLE_USERS.forEach((user, i) => {
  const rating = (4.5 + Math.random() * 0.5).toFixed(1);
  const sales = Math.floor(Math.random() * 50) + 10;
  console.log(`INSERT INTO sellers ("userId", "businessName", "businessType", "verificationStatus", rating, "totalSales", "responseTime", "joinedDate")
VALUES ('${user.id}', '${user.firstName}''s Tech Store', 'individual', 'verified', ${rating}, ${sales}, ${Math.floor(Math.random() * 12) + 1}, NOW())
ON CONFLICT ("userId") DO NOTHING;`);
});
```

2. **Run the generator**:
   ```bash
   npx ts-node prisma/generateSeedSQL.ts > seed_data.sql
   ```

3. **Copy and run in Supabase SQL Editor**

#### Option B: Try Direct Seeding (May not work due to network)

```bash
npm run db:seed:products
```

If this fails with connection errors, use Option A above.

## What Gets Seeded

### Users & Sellers (5 total)
- Abebe Kebede - Addis Ababa
- Tigist Haile - Dire Dawa  
- Dawit Tesfaye - Bahir Dar
- Meron Alemayehu - Hawassa
- Yohannes Bekele - Mekelle

Each seller has:
- Verified status
- 4.5-5.0 star rating
- 10-60 total sales
- 1-12 hour response time

### Products (~40-50 total)
Products across all categories:
- **Laptops**: Dell XPS, HP Pavilion, Lenovo ThinkPad, ASUS ROG, Acer Aspire
- **Desktops**: Dell OptiPlex, HP EliteDesk, Custom Gaming PCs
- **Components**: Intel/AMD CPUs, NVIDIA GPUs, RAM, SSDs
- **Peripherals**: Keyboards, mice, monitors, webcams

Each product has:
- Realistic pricing (adjusted by condition)
- Condition: new, used, or refurbished
- Specifications (processor, RAM, storage, etc.)
- Location (Ethiopian cities)
- Sample images
- Random view counts

### Reviews (~15-20 total)
- 30% of products have 1-3 reviews
- Mostly 4-5 star ratings
- Realistic comments
- Some marked as verified purchases

## Verification

After seeding, verify the data in Supabase:

1. Go to Table Editor in Supabase
2. Check these tables:
   - `users` - Should have 5 seed users + your Clerk user
   - `sellers` - Should have 5 sellers
   - `products` - Should have 40-50 products
   - `reviews` - Should have 15-20 reviews

## Testing the Seeded Data

Once seeded, test your app:

1. **Start dev server**:
   ```bash
   npm run dev
   ```

2. **Browse products**:
   - Visit `http://localhost:3000`
   - You should see real products from the database
   - Try filtering by category, price, location

3. **View product details**:
   - Click on any product
   - Should show full details, specs, and reviews

4. **Test API endpoints**:
   ```bash
   # Get all products
   curl http://localhost:3000/api/products
   
   # Get products by category
   curl http://localhost:3000/api/products?category=laptops
   
   # Search products
   curl http://localhost:3000/api/search?q=dell
   ```

## Troubleshooting

### Connection Errors
If you get `P1001: Can't reach database server`:
- Your network blocks direct database connections
- Use the SQL generation method (Option A above)
- Run SQL manually in Supabase SQL Editor

### Duplicate Key Errors
If you get unique constraint violations:
- The seed users already exist
- Either clear the database first or modify the user IDs in the script

### No Products Showing
If products don't appear in your app:
- Check Supabase Table Editor to verify data exists
- Check browser console for API errors
- Verify `.env.local` has correct DATABASE_URL

## Clearing Seed Data

To remove all seed data and start fresh:

```sql
-- Run in Supabase SQL Editor
DELETE FROM reviews WHERE "userId" LIKE 'user_seed_%';
DELETE FROM products WHERE "sellerId" IN (SELECT id FROM sellers WHERE "userId" LIKE 'user_seed_%');
DELETE FROM sellers WHERE "userId" LIKE 'user_seed_%';
DELETE FROM users WHERE id LIKE 'user_seed_%';
```

## Next Steps

After seeding:
1. Test browsing products in your app
2. Test creating new products (requires Clerk login)
3. Test adding reviews to products
4. Test search and filtering
5. Consider deploying to production
