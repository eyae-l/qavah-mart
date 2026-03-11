# Shopping Cart Guest User Fix

## Issue
Guest users (not logged in) were experiencing errors when trying to add items to cart:
- "Failed to fetch cart" 
- "Failed to save cart"
- 401 Unauthorized errors in console

## Root Cause
The `CartContext` was using `StorageManager` for all operations, which would select `DatabaseAdapter` even when `userId` was `null`. The `DatabaseAdapter` makes API calls that require authentication, causing 401 errors for guest users.

## Solution
Updated `CartContext.tsx` to explicitly use `LocalStorageAdapter` for all guest user operations:

1. **Cart Initialization**: Check if user is authenticated before selecting storage adapter
2. **Save Cart**: Use `LocalStorageAdapter` directly for guest users
3. **Clear Cart**: Use `LocalStorageAdapter` directly for guest users

## Changes Made

### File: `contexts/CartContext.tsx`

**Added Import:**
```typescript
import { LocalStorageAdapter } from '@/lib/storage/LocalStorageAdapter';
```

**Updated Cart Initialization:**
```typescript
// For guest users, use localStorage directly
if (!userId) {
  const localAdapter = new LocalStorageAdapter();
  const cartItems = await localAdapter.getCart();
  setItems(cartItems);
} else {
  // For authenticated users, use database via StorageManager
  const storage = new StorageManager(userId);
  const cartItems = await storage.getCart();
  setItems(cartItems);
}
```

**Updated Save Cart:**
```typescript
// For guest users, always use localStorage
if (!userId) {
  const localAdapter = new LocalStorageAdapter();
  await localAdapter.saveCart(newItems);
  setItems(newItems);
  return;
}
```

**Updated Clear Cart:**
```typescript
// For guest users, use localStorage directly
if (!userId) {
  const localAdapter = new LocalStorageAdapter();
  await localAdapter.clearCart();
} else {
  // For authenticated users, use database via StorageManager
  const storage = new StorageManager(userId);
  await storage.clearCart();
}
```

## Testing the Fix

### Clear Corrupted Data (if needed)
If you have corrupted cart data in localStorage, open browser console and run:
```javascript
localStorage.removeItem('qavah_cart');
```

### Test Guest User Flow
1. Make sure you're logged out
2. Browse to a product page
3. Click "Add to Cart"
4. Verify no errors in console
5. Verify cart icon shows item count
6. Navigate to `/cart` page
7. Verify cart items are displayed
8. Update quantities
9. Remove items
10. Refresh page - cart should persist

### Test Authenticated User Flow
1. Sign in with Clerk
2. Add items to cart
3. Verify cart persists in database
4. Log out and log back in
5. Verify cart items are still there

### Test Cart Migration
1. Log out
2. Add items to cart as guest
3. Sign in
4. Verify cart items are preserved

## Files Modified
- `contexts/CartContext.tsx` - Fixed guest user storage selection

## Files Created
- `scripts/clearCartStorage.ts` - Helper script for clearing localStorage
- `docs/CART_GUEST_USER_FIX.md` - This documentation

## Date Fixed
March 10, 2026
