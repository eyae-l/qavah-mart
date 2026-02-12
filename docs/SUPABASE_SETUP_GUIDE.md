# Supabase Setup Guide for Qavah-mart

## Step 1: Create Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub, Google, or email
4. Verify your email if needed

## Step 2: Create a New Project

1. Click "New Project" in your dashboard
2. Fill in the project details:
   - **Name**: `qavah-mart` (or any name you prefer)
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: Choose closest to Ethiopia (e.g., `eu-central-1` or `ap-south-1`)
   - **Pricing Plan**: Select "Free" tier
3. Click "Create new project"
4. Wait 2-3 minutes for the project to be provisioned

## Step 3: Get Your Database URL

1. Once the project is ready, go to **Settings** (gear icon in sidebar)
2. Click on **Database** in the left menu
3. Scroll down to **Connection string**
4. Select **URI** tab
5. Copy the connection string - it looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
6. Replace `[YOUR-PASSWORD]` with the database password you created in Step 2

## Step 4: Configure Your Project

1. In your Qavah-mart project, create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and paste your DATABASE_URL:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.xxxxx.supabase.co:5432/postgres"
   ```

3. Generate a JWT secret (or use any random string):
   ```bash
   # On Windows PowerShell:
   -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
   
   # Or just use a random string like:
   JWT_SECRET="qavah-mart-super-secret-key-2024-change-in-production"
   ```

4. Add the JWT secret to `.env`:
   ```env
   JWT_SECRET="your-generated-secret-here"
   ```

## Step 5: Run Database Migrations

Now that your database is configured, run the Prisma migrations:

```bash
# Generate Prisma Client
npx prisma generate

# Create database tables
npx prisma migrate dev --name init

# Open Prisma Studio to view your database (optional)
npx prisma studio
```

## Step 6: Verify Setup

1. Go back to Supabase dashboard
2. Click on **Table Editor** in the sidebar
3. You should see all your tables:
   - users
   - sellers
   - products
   - reviews
   - categories
   - subcategories
   - sessions

## Troubleshooting

### Error: "Can't reach database server"
- Check your internet connection
- Verify the DATABASE_URL is correct
- Make sure you replaced `[YOUR-PASSWORD]` with your actual password
- Check if your IP is allowed (Supabase free tier allows all IPs by default)

### Error: "SSL connection required"
- Add `?sslmode=require` to the end of your DATABASE_URL:
  ```
  DATABASE_URL="postgresql://...?sslmode=require"
  ```

### Error: "Password authentication failed"
- Double-check your database password
- Reset password in Supabase: Settings → Database → Reset database password

## Next Steps

After successful setup:
1. ✅ Database is ready
2. ✅ Tables are created
3. ➡️ Next: Seed the database with mock data
4. ➡️ Next: Build authentication APIs
5. ➡️ Next: Build product APIs

## Supabase Dashboard Features

While you're in the Supabase dashboard, explore these useful features:

- **Table Editor**: View and edit data directly
- **SQL Editor**: Run custom SQL queries
- **Database**: View connection details and settings
- **API**: Auto-generated REST and GraphQL APIs (we won't use these, but they're there!)
- **Authentication**: Built-in auth (we're building our own, but you could use this later)

## Free Tier Limits

Supabase free tier includes:
- ✅ 500MB database space (plenty for development)
- ✅ Unlimited API requests
- ✅ 50,000 monthly active users
- ✅ 2GB file storage
- ✅ 5GB bandwidth

This is more than enough for development and testing!

## Support

If you need help:
- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- Prisma Docs: https://www.prisma.io/docs
