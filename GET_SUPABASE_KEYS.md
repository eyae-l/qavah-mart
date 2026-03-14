# Get Your Complete Supabase Keys

Your current Supabase anon key appears to be incomplete. Here's how to get the correct keys:

## Step 1: Go to Supabase Dashboard
1. Visit [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Select your project: `gdsanvsbzzrtfeegplzf`

## Step 2: Get API Keys
1. In your project dashboard, go to **Settings** → **API**
2. You'll see two important keys:

### Project URL (you already have this correct):
```
https://gdsanvsbzzrtfeegplzf.supabase.co
```

### Anon Key (this is what you need to fix):
- Look for "anon public" key
- It should be a very long string (200+ characters)
- It starts with `eyJ` and looks like a JWT token
- Example format: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...` (much longer)

## Step 3: Update Your Environment Variables

### In Vercel Dashboard:
1. Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your `qavah-mart-clrk` project
3. Go to **Settings** → **Environment Variables**
4. Update `NEXT_PUBLIC_SUPABASE_ANON_KEY` with the complete anon key from Supabase

### Your current (incomplete) key:
```
sb_publishable_lLYWsz0RYayWENTY6xu0-w_0eJfWDxq
```

### Should be replaced with something like:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkczFudnNienp...
```
(The actual key will be much longer - around 200-300 characters)

## Step 4: Redeploy
After updating the environment variable in Vercel:
1. Go to your project's **Deployments** tab
2. Click **Redeploy** on the latest deployment
3. Wait for the build to complete

## Step 5: Test
Visit your deployed site: https://qavah-mart-clrk.vercel.app
- Featured products should now appear on the homepage
- Clicking on products should work correctly

---

**Note**: The key you currently have (`sb_publishable_...`) looks like it might be a new-style publishable key that got cut off. Make sure you copy the complete key from your Supabase dashboard.