# Cart Fix - Clear Cache Instructions

## The Problem
You're seeing "Failed to fetch cart" error because the browser is using cached JavaScript code from before the fix.

## Solution: Clear Browser Cache and Rebuild

### Step 1: Stop the Development Server
Press `Ctrl+C` in your terminal to stop the Next.js dev server.

### Step 2: Clear Next.js Cache
Run these commands:
```bash
rmdir /s /q .next
```

### Step 3: Clear Browser Cache
In your browser:
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

OR

1. Press `Ctrl+Shift+Delete`
2. Select "Cached images and files"
3. Click "Clear data"

### Step 4: Clear localStorage (Important!)
In browser console, run:
```javascript
localStorage.removeItem('qavah_cart');
localStorage.clear();
```

### Step 5: Restart Development Server
```bash
npm run dev
```

### Step 6: Test
1. Make sure you're logged out
2. Go to a product page
3. Click "Add to Cart"
4. Should work without errors now

## What Was Fixed

The `CartContext.tsx` now properly checks authentication state before selecting storage:
- Guest users (not logged in) → Uses `LocalStorageAdapter` directly
- Authenticated users → Uses `DatabaseAdapter` via `StorageManager`

The old code was trying to use the database for everyone, causing 401 errors for guests.

## If Still Not Working

1. Check that you're on the latest code (the fix was just applied)
2. Make sure the dev server restarted after the fix
3. Verify browser cache is completely cleared
4. Check browser console for any other errors
5. Try in an incognito/private window
