# Root Layout Implementation

This document describes the implementation of task 3.1: "Implement root layout with header and footer".

## Overview

The root layout provides a consistent structure across all pages of the Qavah-mart application, including:

- Header with logo, search bar, and location selector
- Category navigation
- Main content area
- Footer with links and information
- Global context providers for state management

## Requirements Addressed

- **Requirement 8.3**: Responsive design with brown and white color scheme
- **Requirement 9.1**: Header with Qavah-mart logo, search bar, and location selector
- **Requirement 9.5**: Consistent header and navigation across all pages

## Implementation Details

### 1. Root Layout (`app/layout.tsx`)

The root layout component:
- Wraps the entire application
- Provides consistent HTML structure
- Includes all context providers via the `Providers` component
- Renders Header, CategoryNav, and Footer components
- Applies global styles and fonts

**Key features:**
- Uses Next.js App Router layout pattern
- Implements flex layout with `min-h-screen` for sticky footer
- Applies brown/white color scheme via Tailwind CSS
- Includes SEO metadata

### 2. Context Providers

Three context providers manage global state:

#### UserContext (`contexts/UserContext.tsx`)
Manages user authentication and profile data:
- Login/logout functionality
- User registration
- Profile updates
- Persists user data to localStorage
- Provides `useUser()` hook

**State:**
- `user`: Current user object or null
- `isAuthenticated`: Boolean authentication status

**Methods:**
- `login(credentials)`: Authenticate user
- `logout()`: Clear user session
- `register(userData)`: Create new user account
- `updateProfile(updates)`: Update user information

#### LocationContext (`contexts/LocationContext.tsx`)
Manages location selection and filtering:
- Location selection
- Available locations list (8 Ethiopian cities)
- Persists location preference to localStorage
- Provides `useLocation()` hook

**State:**
- `currentLocation`: Selected location or null
- `availableLocations`: Array of Location objects

**Methods:**
- `setLocation(location)`: Set current location
- `clearLocation()`: Clear location filter

**Available Locations:**
1. Addis Ababa
2. Dire Dawa
3. Mekelle
4. Gondar
5. Bahir Dar
6. Hawassa
7. Adama
8. Jimma

#### AppContext (`contexts/AppContext.tsx`)
Manages general application state:
- Shopping cart
- Favorite products
- Theme preference
- Persists all state to localStorage
- Provides `useApp()` hook

**State:**
- `user`: User reference (synced with UserContext)
- `location`: Location reference (synced with LocationContext)
- `cart`: Array of CartItem objects
- `favorites`: Array of product IDs
- `theme`: 'light' or 'dark'

**Methods:**
- `addToCart(item)`: Add item to cart
- `removeFromCart(productId)`: Remove item from cart
- `clearCart()`: Empty cart
- `toggleFavorite(productId)`: Add/remove favorite
- `setTheme(theme)`: Change theme

### 3. Providers Component (`contexts/Providers.tsx`)

Wraps all context providers in a single component:
```tsx
<AppProvider>
  <UserProvider>
    <LocationProvider>
      {children}
    </LocationProvider>
  </UserProvider>
</AppProvider>
```

This component is marked with `'use client'` directive since contexts require client-side rendering.

### 4. Color Scheme

The brown/white color scheme is configured in `app/globals.css`:

**Primary Brown Scale:**
- 50-900: Light to dark brown shades
- Main brown: `#9c6644` (primary-700)
- Light brown: `#c9a997` (primary-500)
- Dark brown: `#7f5539` (primary-800)

**Neutral Scale:**
- 50-900: White to black shades
- Used for text, borders, and backgrounds

**Usage:**
- Primary colors for branding, buttons, and accents
- Neutral colors for text and UI elements
- White background for clean, professional look

## File Structure

```
app/
├── layout.tsx                 # Root layout component
├── globals.css                # Global styles with color scheme
└── __tests__/
    └── layout.integration.test.tsx

contexts/
├── Providers.tsx              # Combined providers wrapper
├── UserContext.tsx            # User authentication context
├── LocationContext.tsx        # Location selection context
├── AppContext.tsx             # General app state context
├── README.md                  # Context usage documentation
├── UserContext.test.tsx       # User context tests
├── LocationContext.test.tsx   # Location context tests
└── AppContext.test.tsx        # App context tests

components/
├── Header.tsx                 # Header component (existing)
├── CategoryNav.tsx            # Category navigation (existing)
├── Footer.tsx                 # Footer component (existing)
└── ContextExample.tsx         # Example context usage
```

## Usage Examples

### Accessing User Context

```tsx
'use client';

import { useUser } from '@/contexts/UserContext';

export default function MyComponent() {
  const { user, isAuthenticated, login, logout } = useUser();

  if (!isAuthenticated) {
    return <button onClick={() => login({ email, password })}>Login</button>;
  }

  return <div>Welcome, {user.firstName}!</div>;
}
```

### Accessing Location Context

```tsx
'use client';

import { useLocation } from '@/contexts/LocationContext';

export default function LocationSelector() {
  const { currentLocation, availableLocations, setLocation } = useLocation();

  return (
    <select onChange={(e) => setLocation(e.target.value)}>
      {availableLocations.map((loc) => (
        <option key={loc.city} value={loc.city}>{loc.city}</option>
      ))}
    </select>
  );
}
```

### Accessing App Context

```tsx
'use client';

import { useApp } from '@/contexts/AppContext';

export default function CartButton() {
  const { cart, addToCart } = useApp();

  return (
    <button>
      Cart ({cart.length})
    </button>
  );
}
```

## Testing

Unit tests are provided for:
- Root layout structure
- User context functionality
- Location context functionality
- App context functionality
- Integration between layout and contexts

Run tests with:
```bash
npm test
```

## Persistence

All context state is automatically persisted to localStorage:

| Context | Key | Data |
|---------|-----|------|
| UserContext | `qavah_user` | User object |
| LocationContext | `qavah_location` | Location string |
| AppContext | `qavah_cart` | Cart items array |
| AppContext | `qavah_favorites` | Product IDs array |
| AppContext | `qavah_theme` | Theme string |

State is loaded from localStorage on app initialization and saved whenever it changes.

## Responsive Design

The layout is fully responsive:
- **Mobile (<768px)**: Stacked layout, hamburger menu
- **Tablet (768-1023px)**: Adjusted spacing and grid
- **Desktop (≥1024px)**: Full layout with all elements

The brown/white color scheme is consistent across all screen sizes.

## Next Steps

With the root layout complete, the following components can now be enhanced:
1. Header component with functional search and location selector (Task 3.2)
2. Category navigation with dropdowns (Task 3.4)
3. Authentication modal using UserContext (Task 12.2)
4. Location-based filtering using LocationContext (Task 15.4)

## Notes

- All context providers are client components (`'use client'`)
- The root layout itself is a server component
- Context state is available to all child components
- localStorage is only accessed in the browser (useEffect)
- Error handling is included for localStorage parsing failures
