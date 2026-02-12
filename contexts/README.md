# Context Providers

This directory contains React Context providers for global state management in the Qavah-mart application.

## Overview

The application uses three main context providers:

1. **UserContext** - Manages user authentication and profile data
2. **LocationContext** - Manages location selection and preferences
3. **AppContext** - Manages general app state (cart, favorites, theme)

All contexts are wrapped in the `Providers` component, which is used in the root layout.

## Usage

### UserContext

Provides user authentication and profile management:

```tsx
import { useUser } from '@/contexts/UserContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout, register, updateProfile } = useUser();

  // Check if user is logged in
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  // Access user data
  return <div>Welcome, {user.firstName}!</div>;
}
```

**Available methods:**
- `login(credentials)` - Log in a user
- `logout()` - Log out the current user
- `register(userData)` - Register a new user
- `updateProfile(updates)` - Update user profile

### LocationContext

Provides location selection and filtering:

```tsx
import { useLocation } from '@/contexts/LocationContext';

function MyComponent() {
  const { currentLocation, availableLocations, setLocation, clearLocation } = useLocation();

  return (
    <select onChange={(e) => setLocation(e.target.value)} value={currentLocation || ''}>
      <option value="">All Locations</option>
      {availableLocations.map((loc) => (
        <option key={loc.city} value={loc.city}>
          {loc.city}
        </option>
      ))}
    </select>
  );
}
```

**Available methods:**
- `setLocation(location)` - Set the current location
- `clearLocation()` - Clear location filter

**Available locations:**
- Addis Ababa
- Dire Dawa
- Mekelle
- Gondar
- Bahir Dar
- Hawassa
- Adama
- Jimma

### AppContext

Provides general app state management:

```tsx
import { useApp } from '@/contexts/AppContext';

function MyComponent() {
  const { cart, favorites, theme, addToCart, toggleFavorite, setTheme } = useApp();

  return (
    <div>
      <p>Cart items: {cart.length}</p>
      <p>Favorites: {favorites.length}</p>
      <p>Theme: {theme}</p>
    </div>
  );
}
```

**Available methods:**
- `addToCart(item)` - Add item to cart
- `removeFromCart(productId)` - Remove item from cart
- `clearCart()` - Clear all cart items
- `toggleFavorite(productId)` - Add/remove product from favorites
- `setTheme(theme)` - Set theme ('light' or 'dark')

## Persistence

All contexts automatically persist their state to localStorage:

- **UserContext**: Stores user data in `qavah_user`
- **LocationContext**: Stores location in `qavah_location`
- **AppContext**: Stores cart in `qavah_cart`, favorites in `qavah_favorites`, and theme in `qavah_theme`

State is automatically loaded from localStorage when the app initializes.

## Requirements

- **UserContext**: Requirements 4.1, 4.2, 4.4
- **LocationContext**: Requirements 6.1, 6.5
- **AppContext**: Future features
- **Root Layout**: Requirements 8.3, 9.1, 9.5
