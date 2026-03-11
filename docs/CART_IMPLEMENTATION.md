# Shopping Cart Implementation

## Overview

The Shopping Cart feature provides a comprehensive cart management system for the Qavah-mart e-commerce platform. It supports both guest users (with localStorage persistence) and authenticated users (with database persistence), enabling seamless shopping experiences across sessions and devices.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Cart UI Layer                            │
│  (Cart Page, Cart Icon, Add to Cart Button)                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   Cart Context                               │
│  (State Management, Business Logic)                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                 Storage Manager                              │
│  (Abstraction Layer for Persistence)                         │
└──────────┬──────────────────────────────────┬───────────────┘
           │                                  │
           ▼                                  ▼
┌──────────────────────┐         ┌──────────────────────────┐
│  LocalStorage        │         │  Database (Prisma)       │
│  (Guest Users)       │         │  (Authenticated Users)   │
└──────────────────────┘         └──────────────────────────┘
```

### Component Breakdown

1. **Cart UI Components**
   - `CartPage`: Full cart view with item list, totals, and checkout button
   - `CartIcon`: Header icon showing item count with badge
   - `AddToCartButton`: Product detail page button for adding items
   - `CartItem`: Individual cart item row with quantity controls and remove button

2. **Cart Context (`CartContext`)**
   - Manages cart state (items, totals, loading states)
   - Provides cart operations (add, update, remove, clear)
   - Handles storage delegation via Storage Manager
   - Listens to authentication state changes for cart migration

3. **Storage Layer**
   - `LocalStorageAdapter`: Implements localStorage operations for guest users
   - `DatabaseAdapter`: Implements Prisma operations for authenticated users
   - `StorageManager`: Coordinates between adapters based on auth state

## Data Flow

### Guest User Flow

1. User adds product to cart
2. CartContext calls `addItem(productId)`
3. StorageManager detects guest user (no userId)
4. LocalStorageAdapter saves to `localStorage` at key `qavah_cart`
5. Cart state updates and UI reflects changes

### Authenticated User Flow

1. User adds product to cart
2. CartContext calls `addItem(productId)`
3. StorageManager detects authenticated user (has userId)
4. DatabaseAdapter makes POST request to `/api/cart`
5. API route saves cart to PostgreSQL database
6. Cart state updates and UI reflects changes

### Cart Migration on Login

1. Guest user has items in localStorage
2. User logs in via Clerk
3. CartContext detects auth state change
4. StorageManager loads guest cart from localStorage
5. StorageManager loads user cart from database
6. StorageManager merges both carts (sums quantities for duplicates)
7. Merged cart saved to database
8. localStorage cleared
9. Cart state updates with merged items

## Storage Strategy

### LocalStorage Schema

Stored at key `qavah_cart`:

```json
{
  "items": [
    {
      "productId": "product-123",
      "quantity": 2,
      "addedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Database Schema

```prisma
model Cart {
  id        String   @id @default(cuid())
  userId    String   @unique
  items     Json     @default("[]") // Array of CartItem objects
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([userId])
  @@map("carts")
}
```

The `items` field stores a JSON array of cart items with the same structure as localStorage.

## Cart Merging Logic

When a guest user logs in, their localStorage cart is merged with their database cart:

```typescript
mergeCart(localItems: CartItem[], remoteItems: CartItem[]): CartItem[] {
  const merged = new Map<string, CartItem>();

  // Add all local items
  localItems.forEach(item => {
    merged.set(item.productId, { ...item });
  });

  // Merge remote items
  remoteItems.forEach(item => {
    const existing = merged.get(item.productId);
    if (existing) {
      // Sum quantities for duplicates
      merged.set(item.productId, {
        ...existing,
        quantity: existing.quantity + item.quantity,
        addedAt: existing.addedAt < item.addedAt ? existing.addedAt : item.addedAt,
      });
    } else {
      merged.set(item.productId, { ...item });
    }
  });

  return Array.from(merged.values());
}
```

**Rules:**
- Unique items from both carts are preserved
- Duplicate items (same productId) have quantities summed
- Earlier `addedAt` timestamp is kept for duplicates

## API Endpoints

### GET /api/cart

Retrieves the cart for the authenticated user.

**Authentication:** Required (Clerk)

**Response:**
```json
{
  "items": [
    {
      "productId": "product-123",
      "quantity": 2,
      "addedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**Status Codes:**
- `200`: Success
- `401`: Unauthorized (not logged in)
- `500`: Server error

### POST /api/cart

Creates or updates the cart for the authenticated user.

**Authentication:** Required (Clerk)

**Request Body:**
```json
{
  "items": [
    {
      "productId": "product-123",
      "quantity": 2,
      "addedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**Response:**
```json
{
  "success": true
}
```

**Status Codes:**
- `200`: Success
- `401`: Unauthorized (not logged in)
- `500`: Server error

## Usage Examples

### Using Cart Context in Components

```typescript
import { useCart } from '@/contexts/CartContext';

function MyComponent() {
  const { 
    items, 
    itemCount, 
    subtotal, 
    addItem, 
    updateQuantity, 
    removeItem 
  } = useCart();

  const handleAddToCart = async () => {
    await addItem('product-123');
  };

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    await updateQuantity(productId, quantity);
  };

  const handleRemove = async (productId: string) => {
    await removeItem(productId);
  };

  return (
    <div>
      <p>Cart has {itemCount} items</p>
      <p>Subtotal: ${subtotal.toFixed(2)}</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
}
```

### Adding Cart Icon to Header

```typescript
import CartIcon from '@/components/CartIcon';

function Header() {
  return (
    <header>
      <nav>
        {/* Other nav items */}
        <CartIcon />
      </nav>
    </header>
  );
}
```

### Creating a Product Page with Add to Cart

```typescript
import AddToCartButton from '@/components/AddToCartButton';

function ProductPage({ product }) {
  return (
    <div>
      <h1>{product.title}</h1>
      <p>${product.price}</p>
      <AddToCartButton 
        productId={product.id} 
        productTitle={product.title}
      />
    </div>
  );
}
```

## Testing

The cart feature has comprehensive test coverage:

- **Unit Tests**: 158 tests covering CartContext, storage adapters, and UI components
- **Property-Based Tests**: 33 tests validating universal properties across random inputs
- **Integration Tests**: 10 tests covering complete user flows

Run all cart tests:
```bash
npm test -- __tests__/cart/
```

Run specific test suites:
```bash
# Unit tests
npm test -- contexts/CartContext.test.tsx
npm test -- lib/storage/

# Property-based tests
npm test -- __tests__/cart/properties/

# Integration tests
npm test -- __tests__/cart/integration/
```

## Performance Considerations

### Cart Operations

All cart operations are optimized for performance:

- **Add to Cart**: < 50ms (localStorage) or < 200ms (database)
- **Update Quantity**: < 50ms (localStorage) or < 200ms (database)
- **Remove Item**: < 50ms (localStorage) or < 200ms (database)
- **Load Cart**: < 100ms (localStorage) or < 300ms (database)

### Optimization Techniques

1. **Debouncing**: Quantity updates are debounced to prevent excessive API calls
2. **Optimistic Updates**: UI updates immediately before API confirmation
3. **Memoization**: Cart calculations are memoized to prevent unnecessary recalculations
4. **Lazy Loading**: Product details are fetched only when needed

## Error Handling

### Storage Failures

**localStorage Full:**
- Error message: "Unable to save cart. Please clear browser data."
- Fallback: Continue with in-memory cart (not persisted)

**localStorage Disabled:**
- Warning: "Cart will not persist across sessions"
- Fallback: Use in-memory cart only

**Database Connection Failure:**
- Error message: "Unable to save cart. Please try again."
- Retry: Exponential backoff (3 attempts)
- Fallback: Save to localStorage temporarily

### Invalid Inputs

**Negative Quantity:**
- Rejected with error: "Quantity must be positive"
- Cart state unchanged

**Zero Quantity:**
- Treated as remove operation
- Item removed from cart

**Non-numeric Input:**
- Rejected with error: "Please enter a valid number"
- Cart state unchanged

### Network Failures

**API Timeout:**
- Retry up to 3 times with exponential backoff
- Show error message after final failure

**Network Offline:**
- Show offline indicator
- Queue operations for later sync
- Sync when connection restored

## Accessibility

The cart feature is fully accessible:

- **Keyboard Navigation**: All cart operations accessible via keyboard
- **Screen Readers**: ARIA labels on all interactive elements
- **Focus Management**: Proper focus handling for modals and dialogs
- **Color Contrast**: WCAG AA compliant color contrast ratios
- **Touch Targets**: Minimum 44x44px touch targets on mobile

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Known Limitations

1. **Maximum Cart Size**: 99 items per product (enforced by UI)
2. **localStorage Quota**: ~5MB limit (approximately 1000 cart items)
3. **Concurrent Updates**: Last write wins (no conflict resolution)
4. **Offline Support**: Limited to localStorage only (database sync requires connection)

## Future Enhancements

Potential improvements for future releases:

1. **Cart Expiration**: Auto-remove items after 30 days
2. **Save for Later**: Move items to wishlist
3. **Cart Sharing**: Share cart via URL
4. **Price Tracking**: Notify when prices drop
5. **Stock Alerts**: Notify when out-of-stock items return
6. **Bulk Operations**: Add/remove multiple items at once
7. **Cart Analytics**: Track cart abandonment and conversion rates

## Troubleshooting

### Cart Not Persisting

**Problem**: Cart items disappear on page reload

**Solutions**:
1. Check if localStorage is enabled in browser
2. Check if browser is in private/incognito mode
3. Check browser console for errors
4. Clear browser cache and try again

### Cart Not Syncing After Login

**Problem**: Guest cart doesn't merge with user cart after login

**Solutions**:
1. Check network tab for API errors
2. Verify Clerk authentication is working
3. Check database connection
4. Review browser console for errors

### Duplicate Items in Cart

**Problem**: Same product appears multiple times

**Solutions**:
1. This should not happen - cart consolidates duplicates
2. If it occurs, clear cart and re-add items
3. Report bug with reproduction steps

## Support

For issues or questions:

1. Check this documentation
2. Review test files for usage examples
3. Check browser console for errors
4. Contact development team

## Related Documentation

- [Quick Start Guide](./QUICK_START.md)
- [Database Setup](./SUPABASE_SETUP_GUIDE.md)
- [Backend Implementation](./BACKEND_IMPLEMENTATION_PLAN.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
