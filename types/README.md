# Qavah-mart Type Definitions

This directory contains all TypeScript interfaces and types for the Qavah-mart computer e-commerce platform.

## Overview

The type definitions are organized into the following categories:

### Brand Configuration
- `SUPPORTED_BRANDS`: Constant array of all 16 supported brands
- `SupportedBrand`: Type for brand names

### Category Structure
- `CATEGORY_STRUCTURE`: Constant object defining all 7 main categories and their subcategories
- `CategorySlug`: Type for category slugs
- `CategoryName`: Type for category names

### Core Data Models
- `Product`: Main product interface with all fields
- `ProductSpecifications`: Computer-specific specifications
- `ProductCondition`: Type for product condition (new, used, refurbished)
- `ProductStatus`: Type for product status (active, sold, inactive)

### User Models
- `User`: Base user interface
- `Seller`: Seller interface extending User
- `BusinessType`: Type for business type (individual, business)
- `VerificationStatus`: Type for seller verification status

### Category Models
- `Category`: Category interface with subcategories
- `Subcategory`: Subcategory interface
- `SpecificationTemplate`: Template for category-specific fields

### Review and Rating Models
- `Review`: Individual review interface
- `ProductRating`: Product rating aggregate
- `SellerRating`: Seller rating aggregate
- `RatingDistribution`: Rating distribution for 5-star system

### Search and Filter Models
- `SearchFilters`: Search filters interface
- `SearchResult`: Search result interface
- `SearchFacets`: Search facets for filtering
- `SortOption`: Type for sort options

### Location Models
- `Location`: Location information interface

### Form Data Models
- `LoginCredentials`: Login credentials interface
- `RegisterData`: Registration data interface
- `ProductFormData`: Product form data for creating/editing listings
- `ReviewFormData`: Review form data interface

### State Management Models
- `AppContextState`: Global app context state
- `UserContextState`: User context state
- `LocationContextState`: Location context state

### Component Props Models
All component prop interfaces for consistent typing across the application.

## Usage Examples

### Creating a Product

```typescript
import { Product, Location, ProductSpecifications } from '@/types';

const location: Location = {
  city: 'Addis Ababa',
  region: 'Addis Ababa',
  country: 'Ethiopia'
};

const specifications: ProductSpecifications = {
  processor: 'Intel Core i7-12700H',
  memory: '16GB DDR5',
  storage: '512GB NVMe SSD',
  graphics: 'NVIDIA RTX 3060',
  screenSize: '15.6 inch',
  operatingSystem: 'Windows 11 Pro'
};

const product: Product = {
  id: 'prod-001',
  title: 'Dell XPS 15 Gaming Laptop',
  description: 'High-performance gaming laptop',
  price: 85000,
  condition: 'new',
  category: 'laptops',
  subcategory: 'Gaming',
  brand: 'Dell',
  specifications,
  images: ['/images/dell-xps-15.jpg'],
  location,
  sellerId: 'seller-001',
  createdAt: new Date(),
  updatedAt: new Date(),
  status: 'active',
  views: 0,
  favorites: 0
};
```

### Using Search Filters

```typescript
import { SearchFilters } from '@/types';

const filters: SearchFilters = {
  query: 'gaming laptop',
  category: 'laptops',
  subcategory: 'Gaming',
  priceMin: 50000,
  priceMax: 100000,
  condition: ['new', 'refurbished'],
  brands: ['Dell', 'ASUS', 'MSI'],
  location: 'Addis Ababa',
  sortBy: 'price-low'
};
```

### Creating a Review

```typescript
import { Review } from '@/types';

const review: Review = {
  id: 'review-001',
  productId: 'prod-001',
  userId: 'user-001',
  sellerId: 'seller-001',
  rating: 5,
  title: 'Excellent laptop!',
  comment: 'Very fast and reliable. Great for gaming.',
  createdAt: new Date(),
  helpful: 10,
  verified: true
};
```

### Using Category Structure

```typescript
import { CATEGORY_STRUCTURE } from '@/types';

// Get all categories
const categories = Object.keys(CATEGORY_STRUCTURE);

// Get subcategories for laptops
const laptopSubcategories = CATEGORY_STRUCTURE.laptops.subcategories;

// Iterate through all categories and subcategories
Object.entries(CATEGORY_STRUCTURE).forEach(([slug, category]) => {
  console.log(`Category: ${category.name}`);
  category.subcategories.forEach(subcategory => {
    console.log(`  - ${subcategory}`);
  });
});
```

### Using Supported Brands

```typescript
import { SUPPORTED_BRANDS, SupportedBrand } from '@/types';

// Check if a brand is supported
const isBrandSupported = (brand: string): brand is SupportedBrand => {
  return SUPPORTED_BRANDS.includes(brand as SupportedBrand);
};

// Get all computer manufacturers
const manufacturers = SUPPORTED_BRANDS.slice(0, 7);

// Get all component manufacturers
const componentMfrs = SUPPORTED_BRANDS.slice(7, 10);

// Get all peripheral brands
const peripheralBrands = SUPPORTED_BRANDS.slice(10);
```

## Testing

Run the unit tests for type definitions:

```bash
npm test types/index.test.ts
```

## Requirements Coverage

This type definition file covers the following requirements:

- **1.1, 1.2, 1.3, 1.4, 1.5**: Product catalog organization with 7 main categories
- **2.4**: Brand filtering with all 16 supported brands
- **3.1**: Product detail display with comprehensive specifications
- **4.1**: User authentication and registration
- **6.1**: Location-based services
- **7.1**: Review and rating system

## Notes

- All interfaces are exported for use throughout the application
- Constants (`SUPPORTED_BRANDS`, `CATEGORY_STRUCTURE`) are exported as `const` for type safety
- Type guards can be created for runtime validation
- All dates are represented as `Date` objects
- Optional fields are marked with `?`
- The `ProductSpecifications` interface uses an index signature to allow custom fields
