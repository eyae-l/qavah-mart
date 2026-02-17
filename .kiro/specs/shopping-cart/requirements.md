# Requirements Document: Shopping Cart Feature

## Introduction

The Shopping Cart feature enables users to add products to a cart, manage quantities, view totals, and proceed to checkout on the Qavah-mart e-commerce platform. The cart supports both guest users (with localStorage persistence) and authenticated users (with database persistence), providing a seamless shopping experience across devices and sessions.

## Glossary

- **Cart**: A collection of products that a user intends to purchase
- **Cart_Item**: A single product entry in the cart with quantity information
- **Guest_User**: A user who has not authenticated with the system
- **Authenticated_User**: A user who has logged in with valid credentials
- **Cart_Service**: The system component responsible for cart operations
- **Storage_Manager**: The system component that handles persistence (localStorage or database)
- **Cart_Icon**: The visual indicator in the header showing cart item count
- **Subtotal**: The sum of all cart item prices before taxes and fees
- **Total**: The final amount including all applicable charges

## Requirements

### Requirement 1: Add Products to Cart

**User Story:** As a user, I want to add products to my cart from product detail pages, so that I can collect items I wish to purchase.

#### Acceptance Criteria

1. WHEN a user clicks the "Add to Cart" button on a product detail page, THE Cart_Service SHALL add the product to the cart with quantity 1
2. WHEN a user adds a product that already exists in the cart, THE Cart_Service SHALL increment the existing item's quantity by 1
3. WHEN a product is added to the cart, THE Cart_Icon SHALL update to reflect the new item count
4. WHEN a product is added to the cart, THE Cart_Service SHALL provide visual feedback confirming the addition
5. WHERE the user is a Guest_User, THE Storage_Manager SHALL persist the cart to localStorage immediately
6. WHERE the user is an Authenticated_User, THE Storage_Manager SHALL persist the cart to the database immediately

### Requirement 2: View Cart Contents

**User Story:** As a user, I want to view all items in my cart, so that I can review what I'm planning to purchase.

#### Acceptance Criteria

1. WHEN a user navigates to the cart page, THE Cart_Service SHALL display all cart items with product details
2. WHEN displaying cart items, THE Cart_Service SHALL show product name, image, price, and quantity for each item
3. WHEN the cart is empty, THE Cart_Service SHALL display an empty state message with a link to continue shopping
4. WHEN displaying the cart, THE Cart_Service SHALL show the subtotal for each line item (price × quantity)
5. WHEN displaying the cart, THE Cart_Service SHALL show the cart subtotal (sum of all line items)
6. WHEN displaying the cart, THE Cart_Service SHALL show the cart total
7. WHILE viewing the cart on mobile devices, THE Cart_Service SHALL display a responsive layout optimized for small screens

### Requirement 3: Update Cart Item Quantities

**User Story:** As a user, I want to update quantities of items in my cart, so that I can purchase the correct amount of each product.

#### Acceptance Criteria

1. WHEN a user changes the quantity of a cart item, THE Cart_Service SHALL update the item quantity to the new value
2. WHEN a quantity is updated, THE Cart_Service SHALL recalculate all totals immediately
3. WHEN a user sets quantity to zero, THE Cart_Service SHALL remove the item from the cart
4. IF a user enters an invalid quantity (negative or non-numeric), THEN THE Cart_Service SHALL reject the input and maintain the current quantity
5. WHERE the user is a Guest_User, THE Storage_Manager SHALL persist the updated cart to localStorage immediately
6. WHERE the user is an Authenticated_User, THE Storage_Manager SHALL persist the updated cart to the database immediately

### Requirement 4: Remove Items from Cart

**User Story:** As a user, I want to remove items from my cart, so that I can eliminate products I no longer wish to purchase.

#### Acceptance Criteria

1. WHEN a user clicks the remove button for a cart item, THE Cart_Service SHALL remove that item from the cart
2. WHEN an item is removed, THE Cart_Service SHALL recalculate all totals immediately
3. WHEN an item is removed, THE Cart_Icon SHALL update to reflect the new item count
4. WHERE the user is a Guest_User, THE Storage_Manager SHALL persist the updated cart to localStorage immediately
5. WHERE the user is an Authenticated_User, THE Storage_Manager SHALL persist the updated cart to the database immediately

### Requirement 5: Cart Persistence

**User Story:** As a user, I want my cart to persist across sessions, so that I don't lose my selections when I close the browser or log out.

#### Acceptance Criteria

1. WHERE the user is a Guest_User, THE Storage_Manager SHALL store cart data in localStorage
2. WHERE the user is an Authenticated_User, THE Storage_Manager SHALL store cart data in the database
3. WHEN a Guest_User returns to the site, THE Storage_Manager SHALL restore the cart from localStorage
4. WHEN an Authenticated_User logs in, THE Storage_Manager SHALL restore the cart from the database
5. WHEN a Guest_User with items in localStorage logs in, THE Storage_Manager SHALL merge the localStorage cart with the database cart
6. WHEN merging carts, THE Storage_Manager SHALL combine quantities for duplicate items
7. WHEN a user logs out, THE Storage_Manager SHALL preserve the cart in the database for future sessions

### Requirement 6: Cart Icon and Item Count

**User Story:** As a user, I want to see a cart icon in the header with the number of items, so that I can quickly check my cart status without navigating away.

#### Acceptance Criteria

1. THE Cart_Icon SHALL display in the header on all pages
2. WHEN the cart contains items, THE Cart_Icon SHALL display the total number of items (sum of all quantities)
3. WHEN the cart is empty, THE Cart_Icon SHALL display zero or no badge
4. WHEN the cart is updated, THE Cart_Icon SHALL update immediately without page refresh
5. WHEN a user clicks the Cart_Icon, THE Cart_Service SHALL navigate to the cart page

### Requirement 7: Cart Calculations

**User Story:** As a user, I want to see accurate price calculations in my cart, so that I know how much I will pay.

#### Acceptance Criteria

1. THE Cart_Service SHALL calculate the line item subtotal as (price × quantity) for each cart item
2. THE Cart_Service SHALL calculate the cart subtotal as the sum of all line item subtotals
3. THE Cart_Service SHALL calculate the cart total (initially equal to subtotal, extensible for taxes/fees)
4. WHEN any cart item quantity changes, THE Cart_Service SHALL recalculate all totals immediately
5. THE Cart_Service SHALL display all monetary values formatted as currency with two decimal places

### Requirement 8: Checkout Flow Integration

**User Story:** As a user, I want to proceed to checkout from my cart, so that I can complete my purchase.

#### Acceptance Criteria

1. WHEN the cart contains items, THE Cart_Service SHALL display a "Proceed to Checkout" button
2. WHEN the cart is empty, THE Cart_Service SHALL hide the "Proceed to Checkout" button
3. WHEN a user clicks "Proceed to Checkout", THE Cart_Service SHALL navigate to the checkout page
4. WHEN navigating to checkout, THE Cart_Service SHALL pass cart data to the checkout flow

### Requirement 9: Guest and Authenticated User Support

**User Story:** As a user, I want the cart to work whether I'm logged in or not, so that I can shop without being forced to create an account.

#### Acceptance Criteria

1. THE Cart_Service SHALL support cart operations for Guest_Users without requiring authentication
2. THE Cart_Service SHALL support cart operations for Authenticated_Users with full persistence
3. WHEN a Guest_User authenticates, THE Cart_Service SHALL transition the cart from localStorage to database storage
4. WHEN transitioning storage, THE Cart_Service SHALL preserve all cart items and quantities
5. THE Cart_Service SHALL provide identical cart functionality regardless of authentication status

### Requirement 10: Mobile-Responsive Cart UI

**User Story:** As a mobile user, I want the cart interface to work well on my device, so that I can manage my cart on the go.

#### Acceptance Criteria

1. WHILE viewing the cart on mobile devices (viewport < 768px), THE Cart_Service SHALL display a single-column layout
2. WHILE viewing the cart on mobile devices, THE Cart_Service SHALL display touch-friendly controls with adequate spacing
3. WHILE viewing the cart on mobile devices, THE Cart_Service SHALL display product images at appropriate sizes
4. WHILE viewing the cart on mobile devices, THE Cart_Service SHALL maintain readability of all text and prices
5. WHILE viewing the cart on tablet devices (768px ≤ viewport < 1024px), THE Cart_Service SHALL display an optimized layout for medium screens

### Requirement 11: Integration with Existing Platform

**User Story:** As a developer, I want the cart feature to integrate seamlessly with the existing Qavah-mart platform, so that it maintains consistency and leverages existing infrastructure.

#### Acceptance Criteria

1. THE Cart_Service SHALL use Next.js 13+ App Router for all cart-related pages
2. THE Cart_Service SHALL use TypeScript for type safety across all cart components
3. THE Cart_Service SHALL use Tailwind CSS with the existing brown/white theme (primary-* and neutral-* classes)
4. THE Cart_Service SHALL use Prisma for all database operations related to authenticated user carts
5. THE Cart_Service SHALL integrate with the existing UserContext for authentication state
6. THE Cart_Service SHALL follow the existing project structure and coding conventions
