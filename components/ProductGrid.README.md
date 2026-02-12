# ProductGrid Component

## Overview

The `ProductGrid` component displays a collection of products in a responsive grid layout with support for loading states, empty states, and lazy image loading. It's designed to work seamlessly across mobile, tablet, and desktop devices.

## Features

- **Responsive Grid Layout**: Automatically adjusts columns based on screen size
  - Mobile: 2 columns
  - Tablet: 3 columns  
  - Desktop: 4 columns
- **Lazy Loading**: Images load on-demand using Next.js Image optimization
- **Loading Skeletons**: Animated placeholder cards while data is loading
- **Empty States**: Helpful messages and suggestions when no products are found
- **Click Handling**: Optional callback for product selection
- **Flexible Grid Columns**: Configurable column count (2, 3, or 4)

## Requirements

Implements the following requirements:
- **1.6**: Display products in a grid layout with product images, titles, prices, condition indicators, and location information
- **8.1**: Provide a responsive design that adapts to desktop, tablet, and mobile screen sizes
- **10.3**: Optimize images for web delivery while maintaining visual quality
- **10.4**: Implement lazy loading for product images in grid displays

## Props

```typescript
interface ProductGridProps {
  products: Product[];        // Array of products to display
  loading?: boolean;          // Show loading skeletons (default: false)
  onProductClick?: (productId: string) => void;  // Callback when product is clicked
  gridColumns?: 2 | 3 | 4;   // Number of columns on desktop (default: 4)
}
```

## Usage

### Basic Usage

```tsx
import ProductGrid from '@/components/ProductGrid';

function ProductsPage() {
  const products = [
    // ... your products
  ];

  return (
    <ProductGrid products={products} />
  );
}
```

### With Loading State

```tsx
import ProductGrid from '@/components/ProductGrid';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts().then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  return (
    <ProductGrid 
      products={products} 
      loading={loading}
    />
  );
}
```

### With Click Handler

```tsx
import ProductGrid from '@/components/ProductGrid';
import { useRouter } from 'next/navigation';

function ProductsPage() {
  const router = useRouter();
  const products = [/* ... */];

  const handleProductClick = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  return (
    <ProductGrid 
      products={products}
      onProductClick={handleProductClick}
    />
  );
}
```

### Custom Grid Columns

```tsx
import ProductGrid from '@/components/ProductGrid';

function FeaturedProducts() {
  const products = [/* ... */];

  return (
    <div>
      <h2>Featured Products</h2>
      {/* Show only 3 columns for featured section */}
      <ProductGrid 
        products={products}
        gridColumns={3}
      />
    </div>
  );
}
```

### Empty State Example

```tsx
import ProductGrid from '@/components/ProductGrid';

function SearchResults({ searchQuery }) {
  const [results, setResults] = useState([]);

  // When no results are found, ProductGrid automatically shows
  // a helpful empty state with suggestions
  return (
    <div>
      <h1>Search Results for "{searchQuery}"</h1>
      <ProductGrid products={results} />
    </div>
  );
}
```

## Responsive Behavior

### Mobile (< 640px)
- 2 columns for 4-column grid
- 1 column for 2-column grid
- 2 columns for 3-column grid
- 4px gap between items

### Tablet (640px - 1023px)
- 3 columns for 4-column grid
- 2 columns for 2-column grid
- 2 columns for 3-column grid
- 6px gap between items

### Desktop (≥ 1024px)
- 4 columns for 4-column grid
- 2 columns for 2-column grid
- 3 columns for 3-column grid
- 6px gap between items

## Loading States

When `loading={true}`, the component displays animated skeleton cards:
- Number of skeletons = `gridColumns * 2` (2 rows)
- Skeletons match the aspect ratio and layout of actual product cards
- Smooth pulse animation for visual feedback

## Empty States

When `products` is empty or undefined, the component shows:
- Large icon indicating no products
- Clear "No Products Found" heading
- Helpful description message
- Suggestions box with tips:
  - Check your spelling
  - Try more general keywords
  - Remove some filters
  - Browse our categories instead

## Styling

The component uses Tailwind CSS classes and follows the Qavah-mart design system:
- Brown and white color scheme
- Consistent spacing and typography
- Smooth transitions and hover effects
- Accessible color contrasts

## Performance Considerations

- **Lazy Loading**: Images use `loading="lazy"` via Next.js Image component
- **Optimized Images**: Automatic WebP/AVIF format conversion
- **Responsive Images**: Appropriate sizes for different screen widths
- **Skeleton Loading**: Prevents layout shift during data loading

## Accessibility

- Semantic HTML structure with proper grid layout
- Keyboard navigation support (via ProductCard)
- Screen reader friendly empty states
- Proper heading hierarchy
- Sufficient color contrast

## Testing

The component includes comprehensive unit tests covering:
- Product display and rendering
- Responsive grid layouts
- Loading states and skeletons
- Empty states and messages
- Click handling
- Edge cases (large datasets, odd numbers, missing fields)
- Accessibility features
- Requirements validation

Run tests with:
```bash
npm test ProductGrid.test.tsx
```

## Related Components

- **ProductCard**: Individual product card component used within the grid
- **CategoryNav**: Navigation component for browsing product categories
- **FilterSidebar**: Filter component often used alongside ProductGrid

## Examples

See `ProductGrid.example.tsx` for complete working examples.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Notes

- The component is a client component (`'use client'`) due to interactive features
- ProductCard handles the actual image lazy loading via Next.js Image
- Empty state suggestions can be customized by modifying the component
- Grid gap increases on larger screens for better visual spacing
