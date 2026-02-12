/**
 * ProductCard Component Usage Examples
 * 
 * This file demonstrates various ways to use the ProductCard component
 * in the Qavah-mart application.
 */

import ProductCard from './ProductCard';
import { Product } from '@/types';

// Example product data
const exampleProduct: Product = {
  id: 'prod-001',
  title: 'Dell XPS 15 Gaming Laptop',
  description: 'High-performance gaming laptop with RTX 3060',
  price: 85000,
  condition: 'new',
  category: 'laptops',
  subcategory: 'Gaming',
  brand: 'Dell',
  specifications: {
    processor: 'Intel Core i7-12700H',
    memory: '16GB DDR5',
    storage: '512GB NVMe SSD',
    graphics: 'NVIDIA RTX 3060',
  },
  images: ['/images/dell-xps-15.jpg'],
  location: {
    city: 'Addis Ababa',
    region: 'Addis Ababa',
    country: 'Ethiopia',
  },
  sellerId: 'seller-1',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  status: 'active',
  views: 100,
  favorites: 10,
};

// Example 1: Basic usage with all default props
export function BasicProductCard() {
  return <ProductCard product={exampleProduct} />;
}

// Example 2: With click handler for navigation
export function ClickableProductCard() {
  const handleProductClick = (productId: string) => {
    console.log('Navigating to product:', productId);
    // In real app: router.push(`/products/${productId}`)
  };

  return <ProductCard product={exampleProduct} onClick={handleProductClick} />;
}

// Example 3: With favorite functionality
export function ProductCardWithFavorite() {
  const handleFavorite = (productId: string) => {
    console.log('Adding to favorites:', productId);
    // In real app: addToFavorites(productId)
  };

  return <ProductCard product={exampleProduct} onFavorite={handleFavorite} />;
}

// Example 4: Without location display
export function ProductCardNoLocation() {
  return <ProductCard product={exampleProduct} showLocation={false} />;
}

// Example 5: Without condition badge
export function ProductCardNoCondition() {
  return <ProductCard product={exampleProduct} showCondition={false} />;
}

// Example 6: Product with no image (shows brown placeholder)
export function ProductCardNoImage() {
  const productWithoutImage = {
    ...exampleProduct,
    images: [],
  };

  return <ProductCard product={productWithoutImage} />;
}

// Example 7: Used product
export function UsedProductCard() {
  const usedProduct = {
    ...exampleProduct,
    condition: 'used' as const,
    price: 45000,
  };

  return <ProductCard product={usedProduct} />;
}

// Example 8: Refurbished product
export function RefurbishedProductCard() {
  const refurbishedProduct = {
    ...exampleProduct,
    condition: 'refurbished' as const,
    price: 65000,
  };

  return <ProductCard product={refurbishedProduct} />;
}

// Example 9: Product grid layout (responsive)
export function ProductGrid() {
  const products = [
    exampleProduct,
    { ...exampleProduct, id: 'prod-002', title: 'HP Pavilion Gaming' },
    { ...exampleProduct, id: 'prod-003', title: 'Lenovo Legion 5' },
    { ...exampleProduct, id: 'prod-004', title: 'ASUS ROG Strix' },
  ];

  const handleProductClick = (productId: string) => {
    console.log('Product clicked:', productId);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

// Example 10: Complete product card with all features
export function CompleteProductCard() {
  const handleProductClick = (productId: string) => {
    console.log('Navigating to product:', productId);
  };

  const handleFavorite = (productId: string) => {
    console.log('Adding to favorites:', productId);
  };

  return (
    <ProductCard
      product={exampleProduct}
      showLocation={true}
      showCondition={true}
      onClick={handleProductClick}
      onFavorite={handleFavorite}
    />
  );
}
