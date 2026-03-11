# Quick Start Guide - Backend Setup

## 🎯 Goal
Get your Qavah-mart backend up and running in 20 minutes!

## ✅ What's Already Done
- Dependencies installed
- Prisma schema created
- Database models defined
- Documentation ready

## 🚀 What You Need to Do Now

### Step 1: Create Supabase Account (5 min)
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up (GitHub/Google/Email)

### Step 2: Create Database (5 min)
1. Click "New Project"
2. Enter:
   - Name: `qavah-mart`
   - Password: (create strong password - SAVE IT!)
   - Region: Choose closest to you
3. Click "Create new project"
4. Wait 2-3 minutes

### Step 3: Get Connection String (2 min)
1. Go to Settings → Database
2. Find "Connection string" section
3. Copy the URI (looks like `postgresql://postgres:...`)
4. Replace `[YOUR-PASSWORD]` with your actual password

### Step 4: Configure Environment (3 min)
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your DATABASE_URL:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres"
   JWT_SECRET="qavah-mart-secret-key-2024"
   ```

### Step 5: Create Database Tables (5 min)
Run these commands:

```bash
# Generate Prisma Client
npx prisma generate

# Create all database tables
npx prisma migrate dev --name init

# (Optional) View your database
npx prisma studio
```

## ✅ Verification

After running the commands, you should see:
- ✅ "Migration applied successfully"
- ✅ Tables created in Supabase dashboard
- ✅ Prisma Studio opens (if you ran it)

## 🛒 Shopping Cart Setup

The shopping cart feature is already integrated and works out of the box:

### For Guest Users
- Cart automatically saves to browser localStorage
- No setup required
- Cart persists across page reloads

### For Authenticated Users
- Cart automatically saves to database
- Requires Clerk authentication (see below)
- Cart syncs across devices

### Cart Migration
When a guest user logs in:
1. Guest cart (localStorage) is automatically merged with user cart (database)
2. Duplicate items have quantities summed
3. All items preserved in database

For detailed cart documentation, see [CART_IMPLEMENTATION.md](./CART_IMPLEMENTATION.md)

## 🔐 Authentication Setup (Optional)

The app uses Clerk for authentication. To enable authenticated user features:

1. Create account at https://clerk.com
2. Create new application
3. Copy API keys to `.env`:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

Without Clerk, the app works in guest mode with localStorage cart persistence.

## 🎉 Success!

If everything worked, you should see these tables in Supabase:
- users
- sellers
- products
- reviews
- categories
- subcategories
- sessions
- carts (for shopping cart feature)

## ❌ Troubleshooting

### "Can't reach database server"
- Check internet connection
- Verify DATABASE_URL is correct
- Make sure password is correct

### "SSL connection required"
Add `?sslmode=require` to your DATABASE_URL:
```
DATABASE_URL="postgresql://...?sslmode=require"
```

### "Password authentication failed"
- Double-check your password
- Reset in Supabase: Settings → Database → Reset password

## 📞 Need Help?

If you're stuck:
1. Check `docs/SUPABASE_SETUP_GUIDE.md` for detailed instructions
2. Check `docs/BACKEND_PROGRESS.md` for current status
3. Ask me for help!

## ➡️ What's Next?

Once you complete these steps, let me know and I'll:
1. ✅ Create authentication system
2. ✅ Build all API routes
3. ✅ Seed database with mock data
4. ✅ Integrate with frontend
5. ✅ Deploy everything

**Ready? Let's do this!** 🚀
