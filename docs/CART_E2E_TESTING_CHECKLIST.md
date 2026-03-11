# Shopping Cart - End-to-End Testing Checklist

## Overview
This checklist covers manual end-to-end testing of the shopping cart feature in a browser environment.

## Prerequisites
- [ ] Development server running (`npm run dev`)
- [ ] Database connected and seeded with products
- [ ] Browser DevTools open (for localStorage inspection)

## Test 1: Guest User Shopping Flow

### 1.1 Add Items to Cart
- [ ] Navigate to homepage
- [ ] Click on a product to view details
- [ ] Click "Add to Cart" button
- [ ] Verify toast notification appears
- [ ] Verify cart icon badge shows "1"
- [ ] Add same product again
- [ ] Verify cart icon badge shows "2"
- [ ] Add a different product
- [ ] Verify cart icon badge shows "3"

### 1.2 View Cart
- [ ] Click cart icon in header
- [ ] Verify redirected to `/cart`
- [ ] Verify both products are displayed
- [ ] Verify quantities are correct (2 and 1)
- [ ] Verify product images, names, and prices display
- [ ] Verify line totals calculate correctly (price × quantity)
- [ ] Verify cart subtotal is correct
- [ ] Verify "Proceed to Checkout" button is enabled

### 1.3 Update Quantities
- [ ] Click "+" button on first product
- [ ] Verify quantity increases to 3
- [ ] Verify line total updates
- [ ] Verify cart subtotal updates
- [ ] Verify cart icon badge updates to "4"
- [ ] Click "-" button
- [ ] Verify quantity decreases to 2
- [ ] Verify all totals update correctly

### 1.4 Remove Items
- [ ] Click "Remove" button on second product
- [ ] Verify product removed from cart
- [ ] Verify cart icon badge updates to "2"
- [ ] Verify subtotal updates
- [ ] Remove remaining product
- [ ] Verify empty cart message displays
- [ ] Verify "Proceed to Checkout" button is hidden
- [ ] Verify cart icon badge is hidden

### 1.5 Cart Persistence
- [ ] Add 2-3 products to cart
- [ ] Note the cart contents
- [ ] Refresh the page (F5)
- [ ] Verify cart contents restored correctly
- [ ] Verify quantities match
- [ ] Open DevTools → Application → Local Storage
- [ ] Verify `qavah_cart` key exists with cart data

### 1.6 Navigate Away and Return
- [ ] With items in cart, navigate to homepage
- [ ] Verify cart icon badge still shows correct count
- [ ] Navigate to a category page
- [ ] Verify cart icon badge persists
- [ ] Return to cart page
- [ ] Verify all items still present

## Test 2: Authenticated User Shopping Flow

### 2.1 Login
- [ ] Clear cart (if any items present)
- [ ] Click "Sign In" or login button
- [ ] Complete authentication
- [ ] Verify redirected back to site
- [ ] Verify cart icon shows "0" (empty)

### 2.2 Add Items as Authenticated User
- [ ] Add a product to cart
- [ ] Verify toast notification
- [ ] Verify cart icon badge updates
- [ ] Open DevTools → Network tab
- [ ] Add another product
- [ ] Verify POST request to `/api/cart` in Network tab
- [ ] Verify request succeeds (200 status)

### 2.3 Cart Syncs to Database
- [ ] With items in cart, open new browser tab
- [ ] Navigate to the site in new tab
- [ ] Login with same account
- [ ] Verify cart icon shows correct count
- [ ] Navigate to cart page
- [ ] Verify all items present (synced from database)

### 2.4 Logout and Login
- [ ] With items in cart, logout
- [ ] Verify cart icon shows "0" (guest mode)
- [ ] Login again
- [ ] Verify cart restored from database
- [ ] Verify all items and quantities correct

## Test 3: Cart Migration on Login

### 3.1 Guest Cart + Login
- [ ] Logout (if logged in)
- [ ] Clear localStorage
- [ ] Add Product A (quantity: 2) to cart as guest
- [ ] Add Product B (quantity: 1) to cart as guest
- [ ] Verify cart icon shows "3"
- [ ] Note: You should have Product A (qty: 2) and Product B (qty: 1) in localStorage
- [ ] Login to account that has Product B (qty: 1) and Product C (qty: 1) in database
- [ ] After login, verify cart icon shows "5" (2+1+1+1)
- [ ] Navigate to cart page
- [ ] Verify Product A shows quantity 2
- [ ] Verify Product B shows quantity 2 (1 from guest + 1 from database)
- [ ] Verify Product C shows quantity 1
- [ ] Verify localStorage is cleared
- [ ] Verify cart saved to database

### 3.2 Empty Guest Cart + Login
- [ ] Logout
- [ ] Clear localStorage
- [ ] Verify cart is empty (no items)
- [ ] Login to account with items in database
- [ ] Verify cart loads from database
- [ ] Verify all database items present

## Test 4: Edge Cases

### 4.1 Maximum Quantity
- [ ] Add product to cart
- [ ] Manually set quantity to 99 (max)
- [ ] Try to increase quantity
- [ ] Verify quantity stays at 99
- [ ] Verify appropriate feedback (disabled button or message)

### 4.2 Invalid Quantity Input
- [ ] Try to enter "0" in quantity field
- [ ] Verify rejected or treated as remove
- [ ] Try to enter negative number
- [ ] Verify rejected with error message
- [ ] Try to enter non-numeric text
- [ ] Verify rejected with error message

### 4.3 Network Failure (Authenticated User)
- [ ] Login
- [ ] Open DevTools → Network tab
- [ ] Set throttling to "Offline"
- [ ] Try to add product to cart
- [ ] Verify error handling (error message or retry)
- [ ] Set throttling back to "Online"
- [ ] Verify cart operations work again

### 4.4 Rapid Clicks
- [ ] Click "Add to Cart" button rapidly 5 times
- [ ] Verify quantity increases correctly (no duplicates)
- [ ] Verify no race conditions or errors

## Test 5: Mobile Responsiveness

### 5.1 Mobile View (DevTools)
- [ ] Open DevTools → Toggle device toolbar
- [ ] Select iPhone or Android device
- [ ] Navigate to cart page
- [ ] Verify layout adapts to mobile
- [ ] Verify all buttons are touch-friendly (44x44px minimum)
- [ ] Verify quantity controls work on mobile
- [ ] Verify images scale appropriately

### 5.2 Tablet View
- [ ] Select iPad or tablet device
- [ ] Verify cart layout looks good
- [ ] Verify all functionality works

## Test 6: Cross-Browser Testing

### 6.1 Chrome
- [ ] Complete Test 1 (Guest User Flow)
- [ ] Complete Test 2 (Authenticated User Flow)
- [ ] Note any issues

### 6.2 Firefox
- [ ] Complete Test 1 (Guest User Flow)
- [ ] Complete Test 2 (Authenticated User Flow)
- [ ] Note any issues

### 6.3 Safari (if available)
- [ ] Complete Test 1 (Guest User Flow)
- [ ] Complete Test 2 (Authenticated User Flow)
- [ ] Note any issues

### 6.4 Edge
- [ ] Complete Test 1 (Guest User Flow)
- [ ] Complete Test 2 (Authenticated User Flow)
- [ ] Note any issues

## Test 7: Checkout Navigation

### 7.1 Proceed to Checkout
- [ ] Add items to cart
- [ ] Navigate to cart page
- [ ] Click "Proceed to Checkout"
- [ ] Verify redirected to `/checkout`
- [ ] Verify cart data available on checkout page

### 7.2 Continue Shopping
- [ ] From cart page, click "Continue Shopping"
- [ ] Verify redirected to homepage or previous page
- [ ] Verify cart persists

## Results Summary

### Passed Tests
- [ ] Test 1: Guest User Shopping Flow
- [ ] Test 2: Authenticated User Shopping Flow
- [ ] Test 3: Cart Migration on Login
- [ ] Test 4: Edge Cases
- [ ] Test 5: Mobile Responsiveness
- [ ] Test 6: Cross-Browser Testing
- [ ] Test 7: Checkout Navigation

### Issues Found
Document any issues discovered during testing:

1. 
2. 
3. 

### Notes
Additional observations or comments:

---

**Testing Completed By:** _______________
**Date:** _______________
**Browser/Device:** _______________
