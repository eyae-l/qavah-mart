# ProductCard Component

A reusable product card component for displaying product information in the Qavah-mart e-commerce platform.

## Overview

The ProductCard component displays a product with its image, title, price, condition badge, and location information. It's designed to be used in grid layouts and supports various interactive features like click handling and favorites.

## Requirements Implemented

- **Requirement 1.6**: Display products in grid layout with product images, titles, prices, condition indicators, and location information
- **Requirement 3.2**: Display product condition clearly marked as New, Used, or Refurbished
- **Requirement 3.4**: Display brown placeholder boxes when images are missing
- **Requirement 6.3**: Display location information with icon
- **Requirement 10.3**: Use Next.js Image component with optimization and lazy loading

## Features

✅ **Image Optimization**: Uses Next.js Image component with automatic optimization and lazy loading  
✅ **Brown Placeholder**: Shows a brown-colored placeholder box when product image is missing  
✅ **Condition Badge**: Displays product condition (New/Used/Refurbished) with color-coded badges  
✅ **Location Display**: Shows product location with MapPin icon  
✅ **Price Formatting**: Formats price with ETB currency and thousands separator  
✅ **Hover Effects**: Smooth hover animations with shadow and scale effects  
✅ **Click Handling**: Supports onClick for navigation to product details  
✅ **Favorite Button**: Optional favorite functionality with heart icon  
✅ **Responsive Design**: Works seamlessly across mobile, tablet, and desktop  
✅ **Accessibility**: Proper alt text, ARIA labels, and keyboard navigation support

## Props

```typescript
interface ProductCardProps {
  product: Product;           // Required: Product data to display
  showLocation?: boolean;     // Optional: Show location info (default: true)
  showCondition?: boolean;    // Optional: Show condition badge (default: true)
  onFavorite?: (productId: string) => void;  // Optional: Favorite handler
  onClick?: (productId: string) => void;     // Optional: Click handler
}
```

## Usage Examples

### Basic Usage

```tsx
import ProductCard from '@/components/ProductCard';

function ProductList({ products }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### With Click Handler

```tsx
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';

function ProductList({ products }) {
  const router = useRouter();

  const handleProductClick = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  return (
    <div className="grid grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={handleProductClick}
        />
      ))}
    </div>
  );
}
```

### With Favorite Functionality

```tsx
import ProductCard from '@/components/ProductCard';
import { useFavorites } from '@/hooks/useFavorites';

function ProductList({ products }) {
  const { addToFavorites } = useFavorites();

  const handleFavorite = (productId: string) => {
    addToFavorites(productId);
  };

  return (
    <div className="grid grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onFavorite={handleFavorite}
        />
      ))}
    </div>
  );
}
```

### Without Location or Condition

```tsx
<ProductCard
  product={product}
  showLocation={false}
  showCondition={false}
/>
```

### Complete Example with All Features

```tsx
import ProductCard from '@/components/ProductCard';

function ProductList({ products }) {
  const handleClick = (productId: string) => {
    console.log('Navigate to:', productId);
  };

  const handleFavorite = (productId: string) => {
    console.log('Add to favorites:', productId);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          showLocation={true}
          showCondition={true}
          onClick={handleClick}
          onFavorite={handleFavorite}
        />
      ))}
    </div>
  );
}
```

## Responsive Grid Layouts

The ProductCard is designed to work with responsive grid layouts:

```tsx
// Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns, Large: 4 columns
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {products.map((product) => (
    <ProductCard key={product.id} product={product} />
  ))}
</div>

// Mobile: 2 columns, Tablet: 3 columns, Desktop: 4 columns
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {products.map((product) => (
    <ProductCard key={product.id} product={product} />
  ))}
</div>
```

## Styling

The component uses Tailwind CSS with the Qavah-mart brown/white color scheme:

- **Primary Brown**: `primary-*` classes (from `--color-primary-*`)
- **Brown Variants**: `brown`, `brown-light`, `brown-dark`
- **Neutral Colors**: `neutral-*` classes
- **White**: `white`

### Hover Effects

- Card lifts up slightly (`hover:-translate-y-1`)
- Shadow increases (`hover:shadow-lg`)
- Border changes to primary color (`hover:border-primary-500`)
- Title changes to primary color (`group-hover:text-primary-700`)
- Image scales up slightly (`group-hover:scale-105`)

## Condition Badge Colors

- **New**: Green background (`bg-green-100 text-green-800`)
- **Used**: Blue background (`bg-blue-100 text-blue-800`)
- **Refurbished**: Orange background (`bg-orange-100 text-orange-800`)

## Image Handling

### With Image
- Uses Next.js Image component with `fill` layout
- Lazy loading enabled for performance
- Responsive sizes: `(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw`
- Object-fit: cover to maintain aspect ratio

### Without Image
- Displays brown placeholder box (`bg-brown-light`)
- Shows camera icon and "No Image" text
- Maintains consistent aspect ratio (1:1)

## Accessibility

- ✅ Proper alt text for images
- ✅ ARIA labels for interactive elements
- ✅ Keyboard navigation support
- ✅ Semantic HTML structure
- ✅ Color contrast meets WCAG standards

## Performance

- ✅ Lazy loading for images
- ✅ Optimized image formats (WebP, AVIF)
- ✅ Responsive image sizes
- ✅ Minimal re-renders with proper memoization

## Testing

The component includes comprehensive unit tests covering:

- Basic rendering of all elements
- Image handling (with/without images)
- Condition badge display
- Location display
- Click handling
- Favorite functionality
- Price formatting
- Responsive design
- Accessibility
- Edge cases
- Requirements validation

Run tests with:
```bash
npm test -- ProductCard.test.tsx
```

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Related Components

- `ProductGrid` - Grid layout container for multiple ProductCards
- `ProductDetail` - Detailed product view page
- `ProductImageGallery` - Image gallery for product details

## Future Enhancements

- [ ] Add quick view modal on hover
- [ ] Support for product badges (Sale, Featured, etc.)
- [ ] Add to cart button
- [ ] Compare products functionality
- [ ] Share product functionality
- [ ] Product rating display
