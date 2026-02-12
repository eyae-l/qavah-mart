# Backend Implementation Plan - Qavah-mart

## Architecture Decision
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Prisma
- **Authentication**: JWT with bcryptjs
- **Image Upload**: Cloudinary
- **Mock Data Strategy**: Hybrid (keep for testing + seed database)

## Implementation Phases

### ✅ Phase 1: Setup & Configuration (COMPLETED)
- [x] Install Prisma and dependencies
- [x] Install bcryptjs and jsonwebtoken
- [x] Initialize Prisma
- [ ] Set up Supabase database
- [ ] Configure environment variables

### Phase 2: Database Schema Design
- [ ] Create Prisma schema based on TypeScript types
- [ ] Define all models (User, Seller, Product, Review, etc.)
- [ ] Set up relationships
- [ ] Run initial migration

### Phase 3: Data Abstraction Layer
- [ ] Create Prisma client singleton
- [ ] Create data access functions for products
- [ ] Create data access functions for users
- [ ] Create data access functions for reviews
- [ ] Add environment variable to toggle mock/real data

### Phase 4: Authentication System
- [ ] Create password hashing utilities
- [ ] Create JWT token utilities
- [ ] Create auth middleware
- [ ] Implement register API
- [ ] Implement login API
- [ ] Implement logout API
- [ ] Implement "get current user" API

### Phase 5: Product Management APIs
- [ ] GET /api/products - List products with filters
- [ ] GET /api/products/[id] - Get single product
- [ ] POST /api/products - Create product (authenticated)
- [ ] PUT /api/products/[id] - Update product (authenticated, owner only)
- [ ] DELETE /api/products/[id] - Delete product (authenticated, owner only)
- [ ] Set up Cloudinary for image uploads

### Phase 6: Search & Filter APIs
- [ ] Update /api/search with PostgreSQL full-text search
- [ ] Add complex filtering with Prisma
- [ ] Add pagination
- [ ] Add sorting options

### Phase 7: Review System APIs
- [ ] GET /api/reviews - Get reviews for product
- [ ] POST /api/reviews - Submit review (authenticated)
- [ ] PUT /api/reviews/[id] - Update review (authenticated, owner only)
- [ ] DELETE /api/reviews/[id] - Delete review (authenticated, owner only)
- [ ] Implement automatic rating calculation

### Phase 8: User Profile APIs
- [ ] GET /api/users/[id] - Get user profile
- [ ] PUT /api/users/[id] - Update profile (authenticated, owner only)
- [ ] GET /api/users/[id]/listings - Get user's listings

### Phase 9: Database Seeding
- [ ] Create seed script using existing mock data
- [ ] Seed users and sellers
- [ ] Seed products
- [ ] Seed reviews
- [ ] Run seed script

### Phase 10: Frontend Integration
- [ ] Update pages to use API calls instead of mock data
- [ ] Add loading states
- [ ] Add error handling
- [ ] Update authentication flow
- [ ] Test all functionality

### Phase 11: Testing & Deployment
- [ ] Test all API endpoints
- [ ] Verify all 601 tests still pass
- [ ] Deploy database (Supabase)
- [ ] Deploy application (Vercel)
- [ ] Configure production environment variables

## Database Schema Overview

### Tables
1. **User** - User accounts (buyers/sellers)
2. **Seller** - Seller-specific information
3. **Product** - Product listings
4. **Review** - Product reviews
5. **Category** - Product categories
6. **Subcategory** - Product subcategories
7. **Location** - Ethiopian locations

### Key Relationships
- User ↔ Seller (one-to-one)
- Seller → Products (one-to-many)
- Product → Reviews (one-to-many)
- User → Reviews (one-to-many)
- Product → Category (many-to-one)
- Product → Subcategory (many-to-one)

## Environment Variables Needed

```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"

# Image Upload (Cloudinary)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Development
USE_MOCK_DATA="false" # Set to "true" to use mock data instead of database
NODE_ENV="development"
```

## Next Steps

1. **Set up Supabase account** and get DATABASE_URL
2. **Create Prisma schema** based on existing TypeScript types
3. **Run migrations** to create database tables
4. **Build authentication system**
5. **Create API routes**
6. **Seed database** with mock data
7. **Update frontend** to use APIs
8. **Deploy**

## Estimated Timeline
- Total: 25-30 hours
- Can be completed in 3-4 days of focused work
- Or 1-2 weeks working part-time

## Success Criteria
✅ All API endpoints working  
✅ Authentication functional  
✅ Database seeded with realistic data  
✅ All 601 tests passing  
✅ Frontend integrated with backend  
✅ Deployed and accessible online  
