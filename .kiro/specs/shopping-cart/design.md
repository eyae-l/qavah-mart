# Design Document: Shopping Cart Feature

## Overview

The Shopping Cart feature provides a comprehensive cart management system for the Qavah-mart e-commerce platform. It supports both guest users (with localStorage persistence) and authenticated users (with database persistence), enabling seamless shopping experiences across sessions and devices.

The design follows a dual-storage architecture where guest carts are stored in browser localStorage and authenticated user carts are persisted to the PostgreSQL database via Prisma. When a guest user authenticates, their cart is automatically migrated and merged with any existing database cart.

The cart integrates with the existing Next.js 13+ App Router architecture, TypeScript type system, Tailwind CSS styling, and UserContext for authentication state management.

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

3. **Storage Manager**
   - Abstract interface for cart persistence
   - `LocalStorageAdapter`: Implements localStorage operations for guest users
   - `DatabaseAdapter`: Implements Prisma operations for authenticated users
   - Handles cart migration when authentication state changes

4. **API Routes**
   - `POST /api/cart`: Create or update cart for authenticated users
   - `GET /api/cart`: Retrieve cart for authenticated users
   - `DELETE /api/cart/items/:itemId`: Remove item from cart
   - `PUT /api/cart/items/:itemId`: Update item quantity

## Components and Interfaces

### Cart Context Interface

```typescript
interface CartContextState {
  // State
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  total: number;
  isLoading: boolean;
  
  // Operations
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  
  // Utility
  getItem: (productId: string) => CartItem | undefined;
  hasItem: (productId: string) => boolean;
}
```

### Storage Manager Interface

```typescript
interface StorageAdapter {
  getCart(): Promise<CartItem[]>;
  saveCart(items: CartItem[]): Promise<void>;
  clearCart(): Promise<void>;
  mergeCart(localItems: CartItem[], remoteItems: CartItem[]): CartItem[];
}
```

### Component Props

```typescript
interface CartPageProps {
  // No props - uses CartContext
}

interface CartIconProps {
  className?: string;
}

interface AddToCartButtonProps {
  productId: string;
  productTitle: string;
  disabled?: boolean;
  className?: string;
}

interface CartItemProps {
  item: CartItem;
  product: Product;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}
```

## Data Models

### Cart Item Model

```typescript
interface CartItem {
  productId: string;
  quantity: number;
  addedAt: Date;
}
```

### Extended Cart Item (with Product Data)

```typescript
interface CartItemWithProduct extends CartItem {
  product: Product;
  lineTotal: number; // price × quantity
}
```

### Cart Summary

```typescript
interface CartSummary {
  itemCount: number;      // Sum of all quantities
  subtotal: number;       // Sum of all line totals
  total: number;          // Subtotal (extensible for taxes/fees)
}
```

### Database Schema Addition

Add to `prisma/schema.prisma`:

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

## Correctness Properties


*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Adding new product creates cart item with quantity 1

*For any* product that is not in the cart, when added to the cart, the cart should contain that product with quantity 1.

**Validates: Requirements 1.1**

### Property 2: Adding existing product increments quantity

*For any* product that already exists in the cart with quantity Q, when added again, the cart should contain that product with quantity Q+1.

**Validates: Requirements 1.2**

### Property 3: Cart icon count reflects total item quantity

*For any* cart state, the cart icon count should equal the sum of all item quantities in the cart.

**Validates: Requirements 1.3, 4.3, 6.2, 6.4**

### Property 4: Guest user cart persists to localStorage

*For any* cart operation (add, update, remove) performed by a guest user, the cart state should be immediately persisted to localStorage and retrievable.

**Validates: Requirements 1.5, 3.5, 4.4, 5.1**

### Property 5: Authenticated user cart persists to database

*For any* cart operation (add, update, remove) performed by an authenticated user, the cart state should be immediately persisted to the database and retrievable.

**Validates: Requirements 1.6, 3.6, 4.5, 5.2**

### Property 6: All cart items are displayed with required fields

*For any* cart with items, when rendered, each item should display product name, image, price, and quantity.

**Validates: Requirements 2.1, 2.2**

### Property 7: Line item subtotal calculation

*For any* cart item with price P and quantity Q, the line item subtotal should equal P × Q.

**Validates: Requirements 2.4, 7.1**

### Property 8: Cart subtotal and total calculation

*For any* cart with items, the cart subtotal should equal the sum of all line item subtotals, and the cart total should equal the subtotal.

**Validates: Requirements 2.5, 2.6, 7.2, 7.3**

### Property 9: Quantity updates change cart state

*For any* cart item, when its quantity is updated to a new valid value N (where N > 0), the cart should contain that item with quantity N.

**Validates: Requirements 3.1**

### Property 10: Totals recalculate after cart changes

*For any* cart modification (add, update quantity, remove), all totals (line item subtotals, cart subtotal, cart total) should be recalculated immediately to reflect the new state.

**Validates: Requirements 3.2, 4.2, 7.4**

### Property 11: Invalid quantity inputs are rejected

*For any* invalid quantity input (negative, zero, non-numeric), the cart should reject the input and maintain the current quantity unchanged.

**Validates: Requirements 3.4**

### Property 12: Guest user cart restoration round-trip

*For any* guest user cart state, saving to localStorage then loading from localStorage should restore the identical cart state (same items and quantities).

**Validates: Requirements 5.3**

### Property 13: Authenticated user cart restoration round-trip

*For any* authenticated user cart state, saving to database then loading from database should restore the identical cart state (same items and quantities).

**Validates: Requirements 5.4**

### Property 14: Cart merging combines items correctly

*For any* guest user with localStorage cart L and database cart D, when authenticating, the merged cart should contain all unique items from both carts, with quantities summed for duplicate items.

**Validates: Requirements 5.5, 5.6, 9.3, 9.4**

### Property 15: Cart persists across logout

*For any* authenticated user cart state, logging out then logging back in should restore the identical cart state.

**Validates: Requirements 5.7**

### Property 16: Removing item eliminates it from cart

*For any* cart item, when removed, the cart should no longer contain that item.

**Validates: Requirements 4.1**

### Property 17: Currency formatting consistency

*For any* monetary value displayed in the cart (prices, line totals, subtotal, total), the value should be formatted as currency with exactly two decimal places.

**Validates: Requirements 7.5**

### Property 18: Checkout button visibility based on cart state

*For any* cart with one or more items, the "Proceed to Checkout" button should be visible; for an empty cart, the button should be hidden.

**Validates: Requirements 8.1, 8.2**

### Property 19: Cart data available during checkout navigation

*For any* cart with items, when navigating to checkout, the complete cart data (items, quantities, totals) should be available to the checkout flow.

**Validates: Requirements 8.4**

## Error Handling

### Invalid Quantity Inputs

- **Negative quantities**: Reject and show error message "Quantity must be positive"
- **Zero quantity**: Treat as remove operation (see Property 11 edge case)
- **Non-numeric input**: Reject and show error message "Please enter a valid number"
- **Decimal quantities**: Round down to nearest integer or reject based on product type

### Product Not Found

- **Product deleted**: Show error message "This product is no longer available" and offer to remove from cart
- **Product out of stock**: Show warning "This product is currently out of stock" but keep in cart

### Storage Failures

- **localStorage full**: Show error message "Unable to save cart. Please clear browser data." and attempt to continue with in-memory cart
- **localStorage disabled**: Show warning "Cart will not persist across sessions" and use in-memory cart only
- **Database connection failure**: Show error message "Unable to save cart. Please try again." and retry with exponential backoff
- **Database write failure**: Show error message "Cart update failed. Please refresh and try again."

### Authentication State Changes

- **Login during cart operation**: Queue the operation and retry after authentication completes
- **Logout during cart operation**: Complete the operation with database storage, then transition to localStorage
- **Session expiration**: Detect expired session, prompt re-authentication, preserve cart in localStorage during re-auth

### Cart Merging Conflicts

- **Duplicate items**: Sum quantities (covered by Property 14)
- **Quantity overflow**: Cap at reasonable maximum (e.g., 99) and show warning
- **Merge failure**: Preserve both carts separately and prompt user to resolve manually

### Network Failures

- **API timeout**: Retry up to 3 times with exponential backoff
- **Network offline**: Show offline indicator, queue operations, sync when online
- **Partial sync failure**: Show warning "Some items may not be synced" and offer manual retry

## Testing Strategy

The shopping cart feature will be tested using a dual approach combining unit tests and property-based tests to ensure comprehensive coverage.

### Unit Testing

Unit tests will focus on:

- **Specific examples**: Test concrete scenarios like adding a specific product, updating to a specific quantity
- **Edge cases**: Empty cart display, zero quantity handling, cart icon with zero items
- **Integration points**: UserContext integration, localStorage API, Prisma database operations
- **Error conditions**: Invalid inputs, storage failures, network errors
- **UI components**: Component rendering, button states, navigation behavior

Unit tests should be written using Jest and React Testing Library for component tests, and standard Jest for logic tests.

### Property-Based Testing

Property-based tests will validate universal properties across all inputs using **fast-check** (JavaScript/TypeScript property-based testing library).

**Configuration**:
- Minimum 100 iterations per property test
- Each test must reference its design document property number
- Tag format: `// Feature: shopping-cart, Property {number}: {property_text}`

**Property Test Coverage**:
- Each correctness property (Properties 1-19) must have a corresponding property-based test
- Tests should generate random cart states, products, quantities, and user types
- Tests should verify properties hold across all generated inputs

**Example Property Test Structure**:

```typescript
// Feature: shopping-cart, Property 1: Adding new product creates cart item with quantity 1
test('property: adding new product creates cart item with quantity 1', () => {
  fc.assert(
    fc.property(
      fc.record({ productId: fc.string(), /* ... */ }), // Generate random product
      (product) => {
        const cart = new Cart();
        cart.addItem(product.productId);
        const item = cart.getItem(product.productId);
        expect(item).toBeDefined();
        expect(item.quantity).toBe(1);
      }
    ),
    { numRuns: 100 }
  );
});
```

**Generators Needed**:
- `productGenerator`: Generate random Product objects
- `cartItemGenerator`: Generate random CartItem objects
- `cartStateGenerator`: Generate random cart states with multiple items
- `quantityGenerator`: Generate valid quantities (1-99)
- `invalidQuantityGenerator`: Generate invalid quantities (negative, zero, non-numeric strings)
- `userTypeGenerator`: Generate guest or authenticated user states

### Test Organization

```
__tests__/
  cart/
    unit/
      CartContext.test.tsx
      CartIcon.test.tsx
      CartPage.test.tsx
      CartItem.test.tsx
      AddToCartButton.test.tsx
      StorageManager.test.ts
      LocalStorageAdapter.test.ts
      DatabaseAdapter.test.ts
    properties/
      cart-operations.property.test.ts
      cart-calculations.property.test.ts
      cart-persistence.property.test.ts
      cart-merging.property.test.ts
    integration/
      cart-flow.integration.test.tsx
      auth-transition.integration.test.tsx
```

### Coverage Goals

- Unit test coverage: 90%+ for all cart-related code
- Property test coverage: 100% of all correctness properties
- Integration test coverage: All critical user flows (add to cart → view cart → checkout)

### Edge Cases to Test

- Empty cart display (Requirements 2.3, 8.2)
- Zero quantity handling (Requirements 3.3)
- Cart icon with zero items (Requirements 6.3)
- Cart merging with empty carts
- Cart merging with identical items
- Maximum quantity limits
- localStorage quota exceeded
- Database connection failures
- Concurrent cart operations

