# Qavah-mart Deployment Guide

## Prerequisites

Before deploying, ensure you have:
- ✅ GitHub account
- ✅ Vercel account (free tier is fine)
- ✅ Supabase database already set up
- ✅ All tests passing (601 tests ✅)

---

## Step 1: Push Code to GitHub

### 1.1 Initialize Git (if not already done)
```bash
git init
git add .
git commit -m "Initial commit - Qavah-mart ready for deployment"
```

### 1.2 Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `qavah-mart`
3. Description: "Computer e-commerce platform for Ethiopia"
4. Keep it Public or Private (your choice)
5. DO NOT initialize with README (we already have one)
6. Click "Create repository"

### 1.3 Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/qavah-mart.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy to Vercel

### 2.1 Sign Up / Log In to Vercel
1. Go to https://vercel.com
2. Click "Sign Up" or "Log In"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub

### 2.2 Import Project
1. Click "Add New..." → "Project"
2. Find your `qavah-mart` repository
3. Click "Import"

### 2.3 Configure Project
**Framework Preset:** Next.js (auto-detected)
**Root Directory:** `./` (leave as default)
**Build Command:** `npm run build` (auto-detected)
**Output Directory:** `.next` (auto-detected)

### 2.4 Add Environment Variables
Click "Environment Variables" and add these:

```
DATABASE_URL=postgresql://postgres.bmbejmclcjglzswczuyh:%40newcreation7E8@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connect_timeout=300

JWT_SECRET=qavah-mart-secret-key-2024-production

NODE_ENV=production
```

**IMPORTANT:** 
- Copy your exact DATABASE_URL from `.env` file
- Copy your exact JWT_SECRET from `.env` file
- Make sure the `@` symbol is encoded as `%40` in the password

### 2.5 Deploy!
1. Click "Deploy"
2. Wait 2-3 minutes for build to complete
3. 🎉 Your site is live!

---

## Step 3: Verify Deployment

### 3.1 Check Your Live Site
Vercel will give you a URL like:
- `https://qavah-mart.vercel.app`
- Or `https://qavah-mart-YOUR_USERNAME.vercel.app`

### 3.2 Test Core Features
Visit your live site and test:
- ✅ Homepage loads
- ✅ Browse categories
- ✅ Search products
- ✅ View product details
- ✅ Register new account
- ✅ Login
- ✅ Create a listing (seller dashboard)
- ✅ View user profile

### 3.3 Check Database Connection
1. Try registering a new user
2. Check Supabase dashboard to see if user was created
3. Try creating a product listing
4. Verify it appears in database

---

## Step 4: Custom Domain (Optional)

### 4.1 Buy a Domain
- Namecheap, GoDaddy, or any domain registrar
- Suggested: `qavahmart.com` or `qavahmart.et`

### 4.2 Add to Vercel
1. Go to your project in Vercel
2. Click "Settings" → "Domains"
3. Add your domain
4. Follow DNS configuration instructions
5. Wait for DNS propagation (5-60 minutes)

---

## Step 5: Post-Deployment Checklist

### Immediate Actions:
- [ ] Test all core features on live site
- [ ] Check error logs in Vercel dashboard
- [ ] Monitor Supabase database usage
- [ ] Share link with friends for feedback

### Within 24 Hours:
- [ ] Seed database with 20-30 real products
- [ ] Create sample user accounts
- [ ] Add some reviews for credibility
- [ ] Test on mobile devices

### Within 1 Week:
- [ ] Set up error monitoring (Sentry)
- [ ] Configure analytics (Google Analytics)
- [ ] Add sitemap.xml for SEO
- [ ] Submit to Google Search Console

---

## Troubleshooting

### Build Fails
- Check Vercel build logs
- Ensure all dependencies are in `package.json`
- Run `npm run build` locally to test

### Database Connection Error
- Verify DATABASE_URL is correct
- Check Supabase connection pooler is enabled
- Ensure `%40` encoding for `@` in password

### 500 Internal Server Error
- Check Vercel function logs
- Verify environment variables are set
- Check Prisma client is generated

### Site is Slow
- Enable Vercel Edge Network
- Optimize images
- Check database query performance

---

## Continuous Deployment

Once deployed, any push to GitHub will automatically deploy:

```bash
# Make changes to code
git add .
git commit -m "Added shopping cart feature"
git push

# Vercel automatically deploys in 1-2 minutes!
```

---

## Support

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs

---

## 🎉 Congratulations!

Your Qavah-mart e-commerce platform is now live and accessible to the world!

**Next Steps:**
1. Share your site URL with friends and family
2. Gather feedback
3. Continue adding features (reviews, cart, payments)
4. Monitor usage and performance
5. Iterate and improve!

---

**Your Site:** https://qavah-mart.vercel.app (or your custom domain)
**Admin Dashboard:** https://vercel.com/dashboard
**Database:** https://supabase.com/dashboard
