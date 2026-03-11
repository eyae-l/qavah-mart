# Shopping Cart - Accessibility Audit Checklist

## Overview
This checklist ensures the shopping cart feature meets WCAG 2.1 Level AA accessibility standards.

## Tools Needed
- [ ] Browser with DevTools
- [ ] Screen reader (NVDA, JAWS, or VoiceOver)
- [ ] Keyboard only (no mouse)
- [ ] Color contrast checker (built into DevTools or WebAIM)

## 1. Keyboard Navigation

### 1.1 Cart Icon
- [ ] Tab to cart icon in header
- [ ] Verify visible focus indicator
- [ ] Press Enter or Space to activate
- [ ] Verify navigates to cart page

### 1.2 Add to Cart Button
- [ ] Tab to "Add to Cart" button on product page
- [ ] Verify visible focus indicator
- [ ] Press Enter or Space to add item
- [ ] Verify toast notification is announced

### 1.3 Cart Page Navigation
- [ ] Tab through all interactive elements on cart page
- [ ] Verify logical tab order: items → quantity controls → remove buttons → checkout button
- [ ] Verify no keyboard traps
- [ ] Verify can navigate backwards with Shift+Tab

### 1.4 Quantity Controls
- [ ] Tab to quantity input field
- [ ] Verify can type number directly
- [ ] Tab to "+" button
- [ ] Press Enter or Space to increase quantity
- [ ] Tab to "-" button
- [ ] Press Enter or Space to decrease quantity
- [ ] Verify all changes announced

### 1.5 Remove Button
- [ ] Tab to "Remove" button
- [ ] Press Enter or Space to remove item
- [ ] Verify focus moves to appropriate element after removal

### 1.6 Checkout Button
- [ ] Tab to "Proceed to Checkout" button
- [ ] Press Enter or Space to navigate to checkout
- [ ] Verify navigation works

## 2. Screen Reader Compatibility

### 2.1 Cart Icon
- [ ] Navigate to cart icon with screen reader
- [ ] Verify announces: "Cart" or "Shopping cart"
- [ ] Verify announces item count: "3 items" or "Cart with 3 items"
- [ ] Verify announces as button or link

### 2.2 Add to Cart Button
- [ ] Navigate to button with screen reader
- [ ] Verify announces: "Add to cart" or "Add [Product Name] to cart"
- [ ] Verify announces button role
- [ ] After clicking, verify success message announced

### 2.3 Cart Page Heading
- [ ] Navigate to cart page
- [ ] Verify page heading announced: "Shopping Cart" or "Your Cart"
- [ ] Verify heading level is appropriate (h1)

### 2.4 Cart Items
- [ ] Navigate through cart items
- [ ] Verify each item announces:
  - Product name
  - Price
  - Quantity
  - Line total
- [ ] Verify product images have alt text

### 2.5 Quantity Controls
- [ ] Navigate to quantity input
- [ ] Verify announces: "Quantity" label
- [ ] Verify announces current value
- [ ] Verify announces min/max values if applicable
- [ ] Navigate to +/- buttons
- [ ] Verify announces: "Increase quantity" and "Decrease quantity"

### 2.6 Remove Button
- [ ] Navigate to remove button
- [ ] Verify announces: "Remove [Product Name]" or "Remove item"
- [ ] After removal, verify announces: "Item removed" or similar

### 2.7 Cart Summary
- [ ] Navigate to cart summary section
- [ ] Verify announces subtotal
- [ ] Verify announces total
- [ ] Verify announces item count

### 2.8 Empty Cart State
- [ ] Remove all items from cart
- [ ] Verify announces: "Your cart is empty" or similar
- [ ] Verify announces "Continue Shopping" link

## 3. ARIA Labels and Roles

### 3.1 Cart Icon
- [ ] Inspect cart icon element
- [ ] Verify has `aria-label="Cart"` or similar
- [ ] Verify badge has `aria-label="3 items in cart"` or similar
- [ ] Verify role is `button` or `link`

### 3.2 Quantity Controls
- [ ] Inspect quantity input
- [ ] Verify has `aria-label="Quantity"` or associated label
- [ ] Verify has `aria-valuemin`, `aria-valuemax`, `aria-valuenow` if using spinbutton
- [ ] Inspect +/- buttons
- [ ] Verify have `aria-label="Increase quantity"` and `aria-label="Decrease quantity"`

### 3.3 Remove Button
- [ ] Inspect remove button
- [ ] Verify has `aria-label="Remove [Product Name]"` or similar
- [ ] Verify role is `button`

### 3.4 Loading States
- [ ] Trigger cart operation (add/update/remove)
- [ ] Verify loading state has `aria-busy="true"` or `aria-live="polite"`
- [ ] Verify completion announced to screen readers

### 3.5 Error Messages
- [ ] Trigger validation error (invalid quantity)
- [ ] Verify error has `role="alert"` or `aria-live="assertive"`
- [ ] Verify error associated with input via `aria-describedby`

## 4. Color Contrast

### 4.1 Text Contrast
- [ ] Check cart icon color vs background (min 4.5:1)
- [ ] Check cart badge text vs background (min 4.5:1)
- [ ] Check product names vs background (min 4.5:1)
- [ ] Check prices vs background (min 4.5:1)
- [ ] Check button text vs button background (min 4.5:1)

### 4.2 Interactive Elements
- [ ] Check "Add to Cart" button (min 3:1 for UI components)
- [ ] Check quantity controls (min 3:1)
- [ ] Check "Remove" button (min 3:1)
- [ ] Check "Proceed to Checkout" button (min 3:1)

### 4.3 Focus Indicators
- [ ] Check focus outline color vs background (min 3:1)
- [ ] Verify focus indicator visible on all interactive elements

### 4.4 Disabled States
- [ ] Check disabled button contrast (min 3:1)
- [ ] Verify disabled state clearly distinguishable

## 5. Touch Targets (Mobile)

### 5.1 Minimum Size
- [ ] Measure cart icon touch target (min 44x44px)
- [ ] Measure "Add to Cart" button (min 44x44px)
- [ ] Measure quantity +/- buttons (min 44x44px)
- [ ] Measure "Remove" button (min 44x44px)
- [ ] Measure "Proceed to Checkout" button (min 44x44px)

### 5.2 Spacing
- [ ] Verify adequate spacing between touch targets (min 8px)
- [ ] Verify no overlapping touch areas

## 6. Forms and Inputs

### 6.1 Quantity Input
- [ ] Verify has visible label or aria-label
- [ ] Verify label associated with input (for attribute)
- [ ] Verify input type is appropriate (number)
- [ ] Verify has min/max attributes
- [ ] Verify validation errors clearly displayed
- [ ] Verify error messages associated with input

### 6.2 Error Handling
- [ ] Enter invalid quantity (negative, zero, text)
- [ ] Verify error message displayed
- [ ] Verify error announced to screen readers
- [ ] Verify focus moves to error or stays on input
- [ ] Verify error styling doesn't rely on color alone

## 7. Visual Focus Indicators

### 7.1 Focus Visibility
- [ ] Tab through all interactive elements
- [ ] Verify each has visible focus indicator
- [ ] Verify focus indicator has sufficient contrast (min 3:1)
- [ ] Verify focus indicator not obscured by other elements

### 7.2 Focus Order
- [ ] Verify focus order matches visual order
- [ ] Verify focus order is logical and predictable
- [ ] Verify no unexpected focus jumps

## 8. Semantic HTML

### 8.1 Headings
- [ ] Verify page has h1 heading
- [ ] Verify heading hierarchy is logical (h1 → h2 → h3)
- [ ] Verify no skipped heading levels

### 8.2 Lists
- [ ] Verify cart items use semantic list markup (ul/ol)
- [ ] Verify list items properly nested

### 8.3 Buttons vs Links
- [ ] Verify actions use `<button>` elements
- [ ] Verify navigation uses `<a>` elements
- [ ] Verify no divs/spans with click handlers (unless proper ARIA)

### 8.4 Images
- [ ] Verify all product images have alt text
- [ ] Verify alt text is descriptive
- [ ] Verify decorative images have empty alt (`alt=""`)

## 9. Responsive Design

### 9.1 Zoom
- [ ] Zoom to 200%
- [ ] Verify all content visible and usable
- [ ] Verify no horizontal scrolling (except data tables)
- [ ] Verify text doesn't overlap

### 9.2 Text Spacing
- [ ] Increase line height to 1.5
- [ ] Increase paragraph spacing to 2x font size
- [ ] Verify content still readable and usable

### 9.3 Orientation
- [ ] Test in portrait orientation
- [ ] Test in landscape orientation
- [ ] Verify both work correctly

## 10. Motion and Animation

### 10.1 Reduced Motion
- [ ] Enable "Reduce motion" in OS settings
- [ ] Verify animations respect preference
- [ ] Verify essential animations still work
- [ ] Verify no auto-playing animations

### 10.2 Timeouts
- [ ] Verify no time limits on cart operations
- [ ] Verify toast notifications stay visible long enough
- [ ] Verify user can extend timeouts if needed

## Automated Testing

### Run Automated Tools
- [ ] Run Lighthouse accessibility audit
- [ ] Run axe DevTools
- [ ] Run WAVE browser extension
- [ ] Address all critical and serious issues

### Lighthouse Scores
- [ ] Accessibility score: ___/100 (target: 90+)
- [ ] Best Practices score: ___/100 (target: 90+)

## Results Summary

### Compliance Level
- [ ] WCAG 2.1 Level A
- [ ] WCAG 2.1 Level AA
- [ ] WCAG 2.1 Level AAA (optional)

### Issues Found

#### Critical Issues (Must Fix)
1. 
2. 
3. 

#### Moderate Issues (Should Fix)
1. 
2. 
3. 

#### Minor Issues (Nice to Fix)
1. 
2. 
3. 

### Recommendations
1. 
2. 
3. 

---

**Audit Completed By:** _______________
**Date:** _______________
**Tools Used:** _______________
**Screen Reader:** _______________
