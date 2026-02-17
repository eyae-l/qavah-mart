# Shopping Cart Feature - Implementation Tasks

## Phase 1: Foundation & Data Models

### Task 1: Define TypeScript Types and Interfaces
**Requirements:** 11
**Details:**
- Add CartItem, CartItemWithProduct, CartSummary, and CartContextState interfaces to `types/index.ts`
- Ensure types integrate with existing Product and User types
- Add StorageAdapter interface for persistence abstraction

### Task 2: Update Prisma Schema
**Requirements:** 5, 11
**Details:**
- Add Cart model to `prisma/schema.prisma` with userId, items (Json), timestamps
- Create and run migration: `npx prisma migrate dev --name add_cart_model`
- Verify schema changes in database

## Phase 2: Storage Layer

### Task 3: Implement LocalStorage Adapter
**Requirements:** 5.1, 5.3
**Details:**
- Create `lib/storage/LocalStorageAdapter.ts`
- Implement getCart(), saveCart(), clearCart() methods
- Handle localStorage quota exceeded errors
- Add cart data validation and error handling

### Task 4: Implement Database Adapter
**Requirements:** 5.2, 5.4
**Details:**
- Create `lib/storage/DatabaseAdapter.ts`
- Implement getCart(), saveCart(), clearCart() using Prisma
- Handle database connection errors with retry logic
- Add proper error handling and logging

### Task 5: Implement Storage Manager
**Requirements:** 5, 9
**Details:**
- Create `lib/storage/StorageManager.ts`
- Implement adapter selection based on authentication state
- Implement mergeCart() for guest-to-authenticated transition
- Handle cart migration when user logs in

## Phase 3: Cart Context & State Management

### Task 6: Create Cart Context
**Requirements:** 1, 2, 3, 4, 6, 7, 9
**Details:**
- Create `contexts/CartContext.tsx` with CartProvider
- Implement state: items, itemCount, subtotal, total, isLoading
- Implement addItem(), updateQuantity(), removeItem(), clearCart()
- Implement getItem(), hasItem() utility methods
- Listen to UserContext for authentication state changes
- Trigger cart migration on login/logout

### Task 7: Integrate Cart Context into Providers
**Requirements:** 11
**Details:**
- Add CartProvider to `contexts/Providers.tsx`
- Ensure CartProvider wraps app and has access to UserContext
- Verify context hierarchy is correct

## Phase 4: UI Components

### Task 8: Create Cart Icon Component
**Requirements:** 6
**Details:**
- Create `components/CartIcon.tsx`
- Display shopping cart icon with item count badge
- Show badge only when cart has items
- Add click handler to navigate to cart page
- Style with Tailwind (primary-* colors)
- Make responsive for mobile

### Task 9: Update Header with Cart Icon
**Requirements:** 6.1
**Details:**
- Add CartIcon to `components/Header.tsx`
- Position in header navigation (right side)
- Ensure visibility on all pages
- Test on mobile and desktop

### Task 10: Create Cart Item Component
**Requirements:** 2, 3, 4
**Details:**
- Create `components/CartItem.tsx`
- Display product image, name, price, quantity
- Add quantity input with +/- buttons
- Add remove button
- Calculate and display line total
- Style with Tailwind (neutral-* colors)
- Make responsive for mobile

### Task 11: Create Cart Page
**Requirements:** 2, 7, 8, 10
**Details:**
- Create `app/cart/page.tsx`
- Display all cart items using CartItem component
- Show empty state when cart is empty
- Display cart subtotal and total
- Add "Proceed to Checkout" button (disabled when empty)
- Add "Continue Shopping" link
- Make fully responsive (mobile, tablet, desktop)
- Use brown/white theme (primary-*, neutral-*)

### Task 12: Create Add to Cart Button Component
**Requirements:** 1
**Details:**
- Create `components/AddToCartButton.tsx`
- Accept productId as prop
- Show loading state during add operation
- Show success feedback (toast notification)
- Handle errors gracefully
- Style with Tailwind (primary-600 background)
- Make touch-friendly for mobile

### Task 13: Integrate Add to Cart Button in Product Detail Page
**Requirements:** 1.1
**Details:**
- Add AddToCartButton to `app/products/[productId]/page.tsx`
- Position below product details
- Pass correct productId
- Test add to cart functionality

## Phase 5: API Routes (Authenticated Users)

### Task 14: Create Cart API Routes
**Requirements:** 5.2, 5.4, 5.6, 9.2
**Details:**
- Create `app/api/cart/route.ts` with GET and POST handlers
- GET: Retrieve cart for authenticated user
- POST: Create or update cart for authenticated user
- Add authentication middleware
- Handle errors and return appropriate status codes
- Create `app/api/cart/items/[itemId]/route.ts` for DELETE and PUT
- DELETE: Remove item from cart
- PUT: Update item quantity

## Phase 6: Integration & Polish

### Task 15: Implement Cart Calculations
**Requirements:** 7
**Details:**
- Ensure line item subtotals calculate correctly (price × quantity)
- Ensure cart subtotal sums all line items
- Ensure cart total equals subtotal (extensible for taxes/fees)
- Format all currency values with 2 decimal places
- Test with various quantities and prices

### Task 16: Implement Cart Persistence
**Requirements:** 5
**Details:**
- Test localStorage persistence for guest users
- Test database persistence for authenticated users
- Test cart restoration on page reload
- Test cart migration on login
- Test cart merging with duplicate items

### Task 17: Add Checkout Navigation
**Requirements:** 8
**Details:**
- Create `app/checkout/page.tsx` (placeholder)
- Implement navigation from cart to checkout
- Pass cart data to checkout page
- Add back button to return to cart

## Phase 7: Testing

### Task 18: Write Unit Tests for Cart Context
**Requirements:** All
**Details:**
- Create `contexts/CartContext.test.tsx`
- Test addItem(), updateQuantity(), removeItem(), clearCart()
- Test cart calculations
- Test authentication state changes
- Aim for 90%+ coverage

### Task 19: Write Unit Tests for Storage Adapters
**Requirements:** 5
**Details:**
- Create `lib/storage/LocalStorageAdapter.test.ts`
- Create `lib/storage/DatabaseAdapter.test.ts`
- Test CRUD operations
- Test error handling
- Test cart merging logic

### Task 20: Write Unit Tests for UI Components
**Requirements:** 1, 2, 3, 4, 6
**Details:**
- Create `components/CartIcon.test.tsx`
- Create `components/CartItem.test.tsx`
- Create `components/AddToCartButton.test.tsx`
- Create `app/cart/page.test.tsx`
- Test rendering, interactions, and edge cases

### Task 21: Write Property-Based Tests
**Requirements:** All (Properties 1-19)
**Details:**
- Install fast-check: `npm install --save-dev fast-check`
- Create `__tests__/cart/properties/cart-operations.property.test.ts`
- Implement property tests for Properties 1-19 from design document
- Use generators for products, cart states, quantities
- Run minimum 100 iterations per property
- Tag each test with property number

### Task 22: Write Integration Tests
**Requirements:** All
**Details:**
- Create `__tests__/cart/integration/cart-flow.integration.test.tsx`
- Test complete user flows: browse → add to cart → view cart → checkout
- Test guest user flow
- Test authenticated user flow
- Test login during shopping (cart migration)

## Phase 8: Documentation

### Task 23: Create Cart Documentation
**Requirements:** All
**Details:**
- Create `docs/CART_IMPLEMENTATION.md`
- Document cart architecture and data flow
- Document storage strategy (localStorage vs database)
- Document cart merging logic
- Add usage examples for developers
- Document API endpoints

### Task 24: Update Main Documentation
**Requirements:** All
**Details:**
- Update `README.md` with cart feature
- Update `docs/QUICK_START.md` with cart setup
- Add cart to feature list

## Phase 9: Final Verification

### Task 25: End-to-End Testing
**Requirements:** All
**Details:**
- Test complete shopping flow as guest user
- Test complete shopping flow as authenticated user
- Test cart persistence across sessions
- Test cart migration on login
- Test on mobile devices
- Test on different browsers

### Task 26: Performance Optimization
**Requirements:** 11
**Details:**
- Verify cart operations are fast (<100ms)
- Optimize re-renders in CartContext
- Add memoization where needed
- Test with large carts (50+ items)

### Task 27: Accessibility Audit
**Requirements:** 10
**Details:**
- Verify keyboard navigation works
- Add ARIA labels to cart components
- Test with screen readers
- Ensure color contrast meets WCAG standards
- Test focus management

## Summary

Total Tasks: 27
Estimated Effort: 3-4 days for experienced developer

**Dependencies:**
- Tasks 1-2 must be completed first (foundation)
- Tasks 3-5 must be completed before Task 6 (storage before context)
- Task 6 must be completed before Tasks 8-13 (context before UI)
- Tasks 8-13 can be done in parallel
- Task 14 can be done in parallel with UI tasks
- Testing tasks (18-22) should be done alongside implementation
- Documentation (23-24) and verification (25-27) are final steps
