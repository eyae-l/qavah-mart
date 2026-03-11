# How to Update Your Deployed Site

## Current Status
Your app now has working cart functionality that needs to be deployed to Vercel.

## Steps to Deploy Updates

### 1. Check What Changed
```bash
git status
```

### 2. Add All Changes
```bash
git add .
```

### 3. Commit Changes
```bash
git commit -m "Add shopping cart functionality with database integration"
```

### 4. Push to GitHub
```bash
git push origin main
```

### 5. Vercel Auto-Deploy
Vercel will automatically detect the push and start deploying. You can watch the progress at:
- https://vercel.com/dashboard

## What Will Be Deployed

### New Features ✅
- Shopping cart icon in header with item count
- Add to cart functionality on product pages
- Cart page showing all items with quantities
- Update quantity and remove items
- Cart persists after page refresh
- Guest users: cart saved in localStorage
- Authenticated users: cart saved to database

### New Files Added
- `app/cart/page.tsx` - Cart page
- `components/CartIcon.tsx` - Cart icon component
- `components/CartItem.tsx` - Individual cart item
- `components/AddToCartButton.tsx` - Add to cart button
- `contexts/CartContext.tsx` - Cart state management
- `lib/storage/` - Storage adapters for cart persistence
- `app/api/cart/route.ts` - Cart API endpoint
- `middleware.ts` - Clerk authentication middleware

### Modified Files
- `app/page.tsx` - Now fetches from database
- `app/products/[productId]/page.tsx` - Fixed location structure
- `components/Header.tsx` - Added cart icon
- `app/layout.tsx` - Added Clerk provider
- And more...

## Environment Variables

Make sure these are set in Vercel:

### Required (Already Set)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `DATABASE_URL`
- `DIRECT_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Optional (For Production)
- `NEXT_PUBLIC_BASE_URL` - Your Vercel URL (e.g., https://qavah-mart.vercel.app)

## After Deployment

### Test These Features
1. Visit your site: https://your-site.vercel.app
2. Browse products on homepage
3. Click a product to view details
4. Click "Add to Cart" button
5. Check cart icon shows item count
6. Visit cart page
7. Update quantities
8. Remove items
9. Refresh page - cart should persist

### If Cart Doesn't Work
The cart table might not exist in your production database. You can:

**Option 1: Let it fail gracefully**
- Cart will use localStorage only
- Works fine for guest users
- No database errors shown to users

**Option 2: Create cart table**
Run this SQL in Supabase (production):
```sql
CREATE TABLE IF NOT EXISTS "Cart" (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE INDEX IF NOT EXISTS "Cart_userId_idx" ON "Cart"("userId");
```

## Troubleshooting

### Build Fails
- Check Vercel build logs
- Look for TypeScript errors
- Ensure all dependencies are in package.json

### Cart Not Working
- Check browser console for errors
- Verify environment variables are set
- Test localStorage in browser (guest mode)

### Products Not Showing
- Verify database has products (run seed SQL)
- Check Supabase connection
- Look at Network tab for API errors

## Quick Commands

```bash
# See what changed
git status

# Add everything
git add .

# Commit with message
git commit -m "Add cart functionality"

# Push to GitHub (triggers Vercel deploy)
git push origin main

# Check deployment status
# Visit: https://vercel.com/dashboard
```

## Notes

- Vercel deploys automatically when you push to GitHub
- Build takes 2-3 minutes usually
- You'll get email when deployment completes
- Old deployment stays live until new one succeeds
- Can rollback to previous deployment in Vercel dashboard
